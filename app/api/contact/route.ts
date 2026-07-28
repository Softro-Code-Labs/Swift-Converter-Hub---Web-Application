import { Resend } from 'resend';
import { render } from '@react-email/components';
import ContactEmail from '@/features/contact/emails/ContactEmail';
import { SERVER_ENV } from '@/config/env.server';
import { SITE_EMAILS, SITE_NAME } from '@/config/site';

const resend = new Resend(SERVER_ENV.RESEND_API_KEY);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  topic: 60,
  message: 5000,
} as const;

// --- Rate limiting -------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;
// In-memory only - resets on redeploy and isn't shared across serverless
// instances. Good enough to blunt basic spam, not a hard guarantee.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);

  // Best-effort cleanup so the map doesn't grow unbounded over the
  // lifetime of a long-running instance.
  if (requestLog.size > 5000) {
    for (const [key, value] of requestLog) {
      if (value.every((t) => now - t > RATE_LIMIT_WINDOW_MS)) {
        requestLog.delete(key);
      }
    }
  }

  return false;
}

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return Response.json(
        { error: 'Too many messages sent. Please try again later.' },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, message, topic, website } = body as Record<
      string,
      unknown
    >;

    // Honeypot: a real visitor never fills this field. Reject silently
    // with a generic error rather than revealing the anti-spam mechanism.
    if (typeof website === 'string' && website.trim().length > 0) {
      return Response.json(
        { error: 'Failed to send message' },
        { status: 400 },
      );
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      return Response.json(
        { error: 'Please provide a valid email address' },
        { status: 400 },
      );
    }

    if (
      name.length > MAX_LENGTHS.name ||
      email.length > MAX_LENGTHS.email ||
      message.length > MAX_LENGTHS.message ||
      (typeof topic === 'string' && topic.length > MAX_LENGTHS.topic)
    ) {
      return Response.json(
        { error: 'One or more fields are too long' },
        {
          status: 400,
        },
      );
    }

    const safeTopic = typeof topic === 'string' && topic ? topic : 'General';

    const html = await render(
      ContactEmail({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        topic: safeTopic,
      }),
    );

    const data = await resend.emails.send({
      from: `${SITE_NAME} <${SITE_EMAILS.noreply}>`,
      to: SITE_EMAILS.support,
      subject: `📩 New Contact: ${safeTopic} - ${name.trim()}`,
      replyTo: email.trim(),
      html,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

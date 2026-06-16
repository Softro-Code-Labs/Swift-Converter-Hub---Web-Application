import { Resend } from 'resend';
import { render } from '@react-email/components';
import ContactEmail from '@/features/contact/emails/ContactEmail';
import { SERVER_ENV } from '@/config/env.server';

const resend = new Resend(SERVER_ENV.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message, topic } = await req.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const html = await render(
      ContactEmail({
        name,
        email,
        message,
        topic,
      }),
    );

    const data = await resend.emails.send({
      from: 'Swift Converter <noreply@swiftconverterhub.com>',
      to: 'support@swiftconverterhub.com',
      subject: `📩 New Contact: ${topic || 'General'} - ${name}`,
      replyTo: email,
      html,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

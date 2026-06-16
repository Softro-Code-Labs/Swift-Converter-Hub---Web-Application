import { Heading, Text, Section, Hr } from '@react-email/components';
import EmailLayout from './EmailLayout';

export default function ContactEmail({
  name,
  email,
  message,
  topic,
}: {
  name: string;
  email: string;
  message: string;
  topic: string;
}) {
  return (
    <EmailLayout>
      {/* Header */}
      <Heading style={title}>📩 New Contact Message</Heading>

      <Text style={subtitle}>
        You received a new message from your website contact form.
      </Text>

      {/* Meta Info Card */}
      <Section style={card}>
        <Text>
          <b>Name:</b> {name}
        </Text>
        <Text>
          <b>Email:</b> {email}
        </Text>
        <Text>
          <b>Topic:</b> {topic || 'General'}
        </Text>
      </Section>

      {/* Message Box */}
      <Section style={messageBox}>
        <Text style={{ marginBottom: 8, fontWeight: 600 }}>Message</Text>
        <Text style={messageText}>{message}</Text>
      </Section>

      <Hr style={{ borderColor: '#1f2937', margin: '20px 0' }} />

      {/* Footer */}
      <Text style={footer}>
        💡 Tip: Reply directly to this email to respond to the user instantly.
      </Text>
    </EmailLayout>
  );
}

const title = {
  color: '#60a5fa',
  fontSize: '20px',
  marginBottom: '8px',
};

const subtitle = {
  fontSize: '13px',
  color: '#94a3b8',
  marginBottom: '20px',
};

const card = {
  backgroundColor: '#111827',
  padding: '14px',
  borderRadius: '10px',
  border: '1px solid #1f2937',
  marginBottom: '16px',
};

const messageBox = {
  backgroundColor: '#0b1220',
  padding: '14px',
  borderRadius: '10px',
  border: '1px solid #1f2937',
};

const messageText = {
  color: '#cbd5e1',
  whiteSpace: 'pre-wrap' as const,
};

const footer = {
  fontSize: '11px',
  color: '#64748b',
};

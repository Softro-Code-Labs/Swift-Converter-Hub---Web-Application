import React from 'react';
import { Html, Body, Container } from '@react-email/components';

export default function EmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>{children}</Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#0b1220',
  fontFamily: 'Inter, Arial, sans-serif',
  padding: '24px',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#0f172a',
  borderRadius: '14px',
  padding: '24px',
  color: '#e5e7eb',
  border: '1px solid #1f2937',
};

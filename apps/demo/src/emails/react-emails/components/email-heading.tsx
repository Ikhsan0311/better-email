import { Heading } from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailHeadingProps {
  children: ReactNode;
}

export function EmailHeading({ children }: EmailHeadingProps) {
  return (
    <Heading style={heading} className="email-heading">
      {children}
    </Heading>
  );
}

const heading: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#09090b',
  margin: '0 0 8px 0',
  padding: '0',
  lineHeight: '32px',
};

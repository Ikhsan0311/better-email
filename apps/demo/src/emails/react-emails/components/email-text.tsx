import { Text } from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailTextProps {
  children: ReactNode;
  muted?: boolean;
}

export function EmailText({ children, muted = false }: EmailTextProps) {
  return (
    <Text
      style={muted ? mutedStyle : textStyle}
      className={muted ? 'email-text-muted' : 'email-text'}
    >
      {children}
    </Text>
  );
}

const textStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#3f3f46',
  margin: '0 0 12px 0',
};

const mutedStyle: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '20px',
  color: '#71717a',
  margin: '0 0 12px 0',
};

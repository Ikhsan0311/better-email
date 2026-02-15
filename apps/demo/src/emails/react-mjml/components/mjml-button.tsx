import { MjmlButton as MjmlBtn } from '@faire/mjml-react';
import type { ReactNode } from 'react';

interface MjmlEmailButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'destructive';
}

export function MjmlEmailButton({ href, children, variant = 'primary' }: MjmlEmailButtonProps) {
  const bgColor = variant === 'destructive' ? '#ef4444' : '#18181b';

  return (
    <MjmlBtn
      href={href}
      backgroundColor={bgColor}
      color="#fafafa"
      fontSize="14px"
      fontWeight="600"
      borderRadius="6px"
      innerPadding="14px 28px"
      padding="24px 32px"
    >
      {children}
    </MjmlBtn>
  );
}

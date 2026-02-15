import { Link, Section } from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'destructive';
}

export function EmailButton({ href, children, variant = 'primary' }: EmailButtonProps) {
  const bgColor = variant === 'destructive' ? '#ef4444' : '#18181b';

  return (
    <Section style={buttonWrapper}>
      {/* Outlook VML fallback for rounded corners */}
      <div
        dangerouslySetInnerHTML={{
          __html: `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="13%" stroke="f" fillcolor="${bgColor}">
  <w:anchorlock/>
  <center style="color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:bold;">${typeof children === 'string' ? children : ''}</center>
</v:roundrect>
<![endif]-->`,
        }}
      />
      {/* Standard button for all other clients */}
      <div
        dangerouslySetInnerHTML={{
          __html: `<!--[if !mso]><!-->`,
        }}
      />
      <Link href={href} style={{ ...button, backgroundColor: bgColor }}>
        {children}
      </Link>
      <div
        dangerouslySetInnerHTML={{
          __html: `<!--<![endif]-->`,
        }}
      />
    </Section>
  );
}

const buttonWrapper: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '24px',
  marginBottom: '24px',
};

const button: React.CSSProperties = {
  display: 'inline-block',
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
  textAlign: 'center',
  boxSizing: 'border-box',
};

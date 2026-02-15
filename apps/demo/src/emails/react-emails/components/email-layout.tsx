import { Body, Container, Head, Html, Preview, Section } from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media (prefers-color-scheme: dark) {
                .email-body { background-color: #09090b !important; }
                .email-container { background-color: #18181b !important; }
                .email-heading { color: #ffffff !important; }
                .email-text { color: #a1a1aa !important; }
                .email-text-muted { color: #71717a !important; }
                .email-code-box { background-color: #27272a !important; }
                .email-code-text { color: #ffffff !important; }
                .email-border { border-color: #27272a !important; }
                .email-footer-text { color: #71717a !important; }
              }
            `,
          }}
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={body} className="email-body">
        <Container style={container} className="email-container">
          <Section style={content}>{children}</Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: '#fafafa',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: '0',
  padding: '0',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '560px',
  borderRadius: '8px',
  overflow: 'hidden',
};

const content: React.CSSProperties = {
  padding: '48px 32px',
};

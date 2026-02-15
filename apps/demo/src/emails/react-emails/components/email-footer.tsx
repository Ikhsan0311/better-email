import { Section, Text } from '@react-email/components';

interface EmailFooterProps {
  appName?: string;
  securityNotice?: string;
}

export function EmailFooter({ appName = 'Better Email', securityNotice }: EmailFooterProps) {
  return (
    <Section style={wrapper}>
      <hr style={divider} className="email-border" />
      {securityNotice && (
        <Text style={securityText} className="email-text-muted">
          {securityNotice}
        </Text>
      )}
      <Text style={footerText} className="email-footer-text">
        Sent by {appName}
      </Text>
    </Section>
  );
}

const wrapper: React.CSSProperties = {
  marginTop: '32px',
};

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #e4e4e7',
  margin: '0 0 16px 0',
};

const securityText: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#71717a',
  margin: '0 0 8px 0',
};

const footerText: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#71717a',
  margin: '0',
};

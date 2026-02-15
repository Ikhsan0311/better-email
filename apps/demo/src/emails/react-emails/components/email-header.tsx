import { Section, Text } from '@react-email/components';

interface EmailHeaderProps {
  appName?: string;
}

export function EmailHeader({ appName = 'Better Email' }: EmailHeaderProps) {
  return (
    <Section style={wrapper}>
      <Text style={brand}>{appName}</Text>
      <hr style={divider} className="email-border" />
    </Section>
  );
}

const wrapper: React.CSSProperties = {
  marginBottom: '24px',
};

const brand: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#09090b',
  margin: '0 0 16px 0',
  padding: '0',
  letterSpacing: '-0.25px',
};

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #e4e4e7',
  margin: '0',
};

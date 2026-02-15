import { Section, Text } from '@react-email/components';

interface EmailCodeProps {
  code: string;
}

export function EmailCode({ code }: EmailCodeProps) {
  return (
    <Section style={wrapper}>
      <div style={codeBox} className="email-code-box" role="presentation">
        <Text style={codeText} className="email-code-text">
          {code}
        </Text>
      </div>
    </Section>
  );
}

const wrapper: React.CSSProperties = {
  textAlign: 'center',
  margin: '24px 0',
};

const codeBox: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  padding: '20px 16px',
  display: 'inline-block',
  width: '100%',
  boxSizing: 'border-box',
};

const codeText: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '6px',
  color: '#09090b',
  fontFamily: '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", "Courier New", monospace',
  margin: '0',
  padding: '0',
  textAlign: 'center',
};

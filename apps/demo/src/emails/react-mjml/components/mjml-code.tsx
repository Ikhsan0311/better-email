import { MjmlText } from '@faire/mjml-react';

interface MjmlCodeProps {
  code: string;
}

export function MjmlCode({ code }: MjmlCodeProps) {
  return (
    <MjmlText align="center" padding="24px 32px" cssClass="dark-code">
      <div
        style={{
          backgroundColor: '#f4f4f5',
          borderRadius: '8px',
          padding: '20px 16px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '6px',
            color: '#09090b',
            fontFamily:
              "'SF Mono', 'Fira Code', 'Roboto Mono', 'Courier New', monospace",
          }}
        >
          {code}
        </span>
      </div>
    </MjmlText>
  );
}

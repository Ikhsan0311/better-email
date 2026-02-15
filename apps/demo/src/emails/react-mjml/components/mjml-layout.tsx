import {
  Mjml,
  MjmlAttributes,
  MjmlAll,
  MjmlBody,
  MjmlHead,
  MjmlStyle,
  MjmlTitle,
  MjmlWrapper,
} from '@faire/mjml-react';
import type { ReactNode } from 'react';

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

interface MjmlLayoutProps {
  title: string;
  children: ReactNode;
}

export function MjmlLayout({ title, children }: MjmlLayoutProps) {
  return (
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{title}</MjmlTitle>
        <MjmlAttributes>
          <MjmlAll fontFamily={FONT_STACK} />
        </MjmlAttributes>
        <MjmlStyle>
          {`
            @media (prefers-color-scheme: dark) {
              .email-body { background-color: #09090b !important; }
              .email-container > table > tbody > tr > td { background-color: #18181b !important; }
              .dark-heading div { color: #ffffff !important; }
              .dark-text div { color: #a1a1aa !important; }
              .dark-muted div { color: #71717a !important; }
              .dark-code div { color: #ffffff !important; }
              .dark-code td { background-color: #27272a !important; }
              .dark-border td { border-color: #27272a !important; }
            }
          `}
        </MjmlStyle>
      </MjmlHead>
      <MjmlBody backgroundColor="#fafafa" cssClass="email-body">
        <MjmlWrapper
          backgroundColor="#ffffff"
          borderRadius="8px"
          padding="0"
          cssClass="email-container"
        >
          {children}
        </MjmlWrapper>
      </MjmlBody>
    </Mjml>
  );
}

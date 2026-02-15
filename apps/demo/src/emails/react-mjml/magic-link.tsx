import { MjmlColumn, MjmlSection, MjmlText } from '@faire/mjml-react';
import type { MagicLinkContext } from 'better-email';

import { MjmlEmailButton } from './components/mjml-button';
import { MjmlFooter } from './components/mjml-footer';
import { MjmlHeader } from './components/mjml-header';
import { MjmlLayout } from './components/mjml-layout';

export default function MagicLinkEmail({ email, url }: MagicLinkContext) {
  return (
    <MjmlLayout title="Your sign-in link">
      <MjmlHeader />
      <MjmlSection padding="24px 0 0 0" backgroundColor="#ffffff">
        <MjmlColumn padding="0">
          <MjmlText fontSize="24px" fontWeight="600" color="#09090b" lineHeight="32px" padding="0 32px 8px 32px" cssClass="dark-heading">
            Sign in to your account
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 12px 32px" cssClass="dark-text">
            Hi {email},
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 0 32px" cssClass="dark-text">
            Click the button below to sign in to your account. No password needed.
          </MjmlText>
          <MjmlEmailButton href={url}>Sign in</MjmlEmailButton>
          <MjmlText fontSize="13px" lineHeight="20px" color="#71717a" padding="0 32px 0 32px" cssClass="dark-muted">
            If you did not request this link, you can safely ignore this email.
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      <MjmlFooter securityNotice="This link will expire in 10 minutes and can only be used once." />
    </MjmlLayout>
  );
}

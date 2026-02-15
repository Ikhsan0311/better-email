import { MjmlColumn, MjmlSection, MjmlText } from '@faire/mjml-react';
import type { VerificationEmailContext } from 'better-email';

import { MjmlEmailButton } from './components/mjml-button';
import { MjmlFooter } from './components/mjml-footer';
import { MjmlHeader } from './components/mjml-header';
import { MjmlLayout } from './components/mjml-layout';

export default function VerificationEmail({ user, url }: VerificationEmailContext) {
  return (
    <MjmlLayout title="Verify your email">
      <MjmlHeader />
      <MjmlSection padding="24px 0 0 0" backgroundColor="#ffffff">
        <MjmlColumn padding="0">
          <MjmlText fontSize="24px" fontWeight="600" color="#09090b" lineHeight="32px" padding="0 32px 8px 32px" cssClass="dark-heading">
            Verify your email
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 12px 32px" cssClass="dark-text">
            Hi {user.name},
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 0 32px" cssClass="dark-text">
            Thanks for signing up. Please verify your email address by clicking the button below to activate your account.
          </MjmlText>
          <MjmlEmailButton href={url}>Verify email address</MjmlEmailButton>
          <MjmlText fontSize="13px" lineHeight="20px" color="#71717a" padding="0 32px 0 32px" cssClass="dark-muted">
            If you did not create an account, you can safely ignore this email.
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      <MjmlFooter securityNotice="This link will expire in 24 hours." />
    </MjmlLayout>
  );
}

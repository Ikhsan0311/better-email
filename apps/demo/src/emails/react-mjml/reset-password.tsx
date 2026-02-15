import { MjmlColumn, MjmlSection, MjmlText } from '@faire/mjml-react';
import type { ResetPasswordContext } from 'better-email';

import { MjmlEmailButton } from './components/mjml-button';
import { MjmlFooter } from './components/mjml-footer';
import { MjmlHeader } from './components/mjml-header';
import { MjmlLayout } from './components/mjml-layout';

export default function ResetPasswordEmail({ user, url }: ResetPasswordContext) {
  return (
    <MjmlLayout title="Reset your password">
      <MjmlHeader />
      <MjmlSection padding="24px 0 0 0" backgroundColor="#ffffff">
        <MjmlColumn padding="0">
          <MjmlText fontSize="24px" fontWeight="600" color="#09090b" lineHeight="32px" padding="0 32px 8px 32px" cssClass="dark-heading">
            Reset your password
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 12px 32px" cssClass="dark-text">
            Hi {user.name},
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 0 32px" cssClass="dark-text">
            We received a request to reset your password. Click the button below to choose a new password.
          </MjmlText>
          <MjmlEmailButton href={url}>Reset password</MjmlEmailButton>
          <MjmlText fontSize="13px" lineHeight="20px" color="#71717a" padding="0 32px 0 32px" cssClass="dark-muted">
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      <MjmlFooter securityNotice="This link will expire in 1 hour. For security, it can only be used once." />
    </MjmlLayout>
  );
}

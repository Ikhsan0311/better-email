import { MjmlColumn, MjmlSection, MjmlText } from '@faire/mjml-react';
import type { ChangeEmailVerificationContext } from 'better-email';

import { MjmlEmailButton } from './components/mjml-button';
import { MjmlFooter } from './components/mjml-footer';
import { MjmlHeader } from './components/mjml-header';
import { MjmlLayout } from './components/mjml-layout';

export default function ChangeEmailEmail({ user, newEmail, url }: ChangeEmailVerificationContext) {
  return (
    <MjmlLayout title="Confirm your email change">
      <MjmlHeader />
      <MjmlSection padding="24px 0 0 0" backgroundColor="#ffffff">
        <MjmlColumn padding="0">
          <MjmlText fontSize="24px" fontWeight="600" color="#09090b" lineHeight="32px" padding="0 32px 8px 32px" cssClass="dark-heading">
            Confirm email change
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 12px 32px" cssClass="dark-text">
            Hi {user.name},
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 0 32px" cssClass="dark-text">
            We received a request to change your email address to <strong>{newEmail}</strong>. Click the button below to confirm this change.
          </MjmlText>
          <MjmlEmailButton href={url}>Confirm email change</MjmlEmailButton>
          <MjmlText fontSize="13px" lineHeight="20px" color="#71717a" padding="0 32px 0 32px" cssClass="dark-muted">
            If you did not request this change, please ignore this email and your email address will remain unchanged.
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      <MjmlFooter securityNotice="This link will expire in 1 hour." />
    </MjmlLayout>
  );
}

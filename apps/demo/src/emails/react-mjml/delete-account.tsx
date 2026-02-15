import { MjmlColumn, MjmlSection, MjmlText } from '@faire/mjml-react';
import type { DeleteAccountVerificationContext } from 'better-email';

import { MjmlEmailButton } from './components/mjml-button';
import { MjmlFooter } from './components/mjml-footer';
import { MjmlHeader } from './components/mjml-header';
import { MjmlLayout } from './components/mjml-layout';

export default function DeleteAccountEmail({ user, url }: DeleteAccountVerificationContext) {
  return (
    <MjmlLayout title="Confirm account deletion">
      <MjmlHeader />
      <MjmlSection padding="24px 0 0 0" backgroundColor="#ffffff">
        <MjmlColumn padding="0">
          <MjmlText fontSize="24px" fontWeight="600" color="#09090b" lineHeight="32px" padding="0 32px 8px 32px" cssClass="dark-heading">
            Delete your account
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 12px 32px" cssClass="dark-text">
            Hi {user.name},
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 0 32px" cssClass="dark-text">
            We received a request to permanently delete your account. This action is irreversible.
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="16px 32px" cssClass="dark-text">
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '16px 20px',
              }}
            >
              <span style={{ fontSize: '13px', lineHeight: '20px', color: '#991b1b' }}>
                All your data, including your profile, settings, and associated content, will be permanently removed and cannot be recovered.
              </span>
            </div>
          </MjmlText>
          <MjmlEmailButton href={url} variant="destructive">
            Delete my account
          </MjmlEmailButton>
          <MjmlText fontSize="13px" lineHeight="20px" color="#71717a" padding="0 32px 0 32px" cssClass="dark-muted">
            If you did not request this, please ignore this email. Your account will remain active.
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      <MjmlFooter securityNotice="This link will expire in 1 hour. For security, it can only be used once." />
    </MjmlLayout>
  );
}

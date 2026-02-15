import { MjmlColumn, MjmlSection, MjmlText } from '@faire/mjml-react';
import type { TwoFactorOTPContext } from 'better-email';

import { MjmlCode } from './components/mjml-code';
import { MjmlFooter } from './components/mjml-footer';
import { MjmlHeader } from './components/mjml-header';
import { MjmlLayout } from './components/mjml-layout';

export default function TwoFactorOTPEmail({ user, otp }: TwoFactorOTPContext) {
  return (
    <MjmlLayout title="Two-factor authentication">
      <MjmlHeader />
      <MjmlSection padding="24px 0 0 0" backgroundColor="#ffffff">
        <MjmlColumn padding="0">
          <MjmlText fontSize="24px" fontWeight="600" color="#09090b" lineHeight="32px" padding="0 32px 8px 32px" cssClass="dark-heading">
            Two-factor authentication
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 12px 32px" cssClass="dark-text">
            Hi {user.name},
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 0 32px" cssClass="dark-text">
            Enter the code below to complete your sign-in. This code is required as part of your two-factor authentication.
          </MjmlText>
          <MjmlCode code={otp} />
          <MjmlText fontSize="13px" lineHeight="20px" color="#71717a" padding="0 32px 0 32px" cssClass="dark-muted">
            This code expires in 5 minutes. Do not share it with anyone.
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      <MjmlFooter securityNotice="If you did not attempt to sign in, someone may have your password. Please change it immediately." />
    </MjmlLayout>
  );
}

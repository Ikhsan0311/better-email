import { MjmlColumn, MjmlSection, MjmlText } from '@faire/mjml-react';
import type { VerificationOTPContext } from 'better-email';

import { MjmlCode } from './components/mjml-code';
import { MjmlFooter } from './components/mjml-footer';
import { MjmlHeader } from './components/mjml-header';
import { MjmlLayout } from './components/mjml-layout';

const otpTypeHeadings: Record<VerificationOTPContext['otpType'], string> = {
  'sign-in': 'Your sign-in code',
  'email-verification': 'Verify your email',
  'forget-password': 'Your password reset code',
};

const otpTypeDescriptions: Record<VerificationOTPContext['otpType'], string> = {
  'sign-in': 'Enter the code below to sign in to your account.',
  'email-verification': 'Enter the code below to verify your email address.',
  'forget-password': 'Enter the code below to reset your password.',
};

export default function OTPEmail({ email, otp, otpType }: VerificationOTPContext) {
  const heading = otpTypeHeadings[otpType] || 'Your verification code';
  const description = otpTypeDescriptions[otpType] || 'Use the code below to complete your request.';

  return (
    <MjmlLayout title="Your verification code">
      <MjmlHeader />
      <MjmlSection padding="24px 0 0 0" backgroundColor="#ffffff">
        <MjmlColumn padding="0">
          <MjmlText fontSize="24px" fontWeight="600" color="#09090b" lineHeight="32px" padding="0 32px 8px 32px" cssClass="dark-heading">
            {heading}
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 12px 32px" cssClass="dark-text">
            Hi {email},
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 0 32px" cssClass="dark-text">
            {description}
          </MjmlText>
          <MjmlCode code={otp} />
          <MjmlText fontSize="13px" lineHeight="20px" color="#71717a" padding="0 32px 0 32px" cssClass="dark-muted">
            This code expires in 10 minutes. Do not share it with anyone.
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      <MjmlFooter securityNotice="If you did not request this code, please secure your account." />
    </MjmlLayout>
  );
}

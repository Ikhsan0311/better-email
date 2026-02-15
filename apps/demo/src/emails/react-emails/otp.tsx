import type { VerificationOTPContext } from 'better-email';

import { EmailCode } from './components/email-code';
import { EmailFooter } from './components/email-footer';
import { EmailHeader } from './components/email-header';
import { EmailHeading } from './components/email-heading';
import { EmailLayout } from './components/email-layout';
import { EmailText } from './components/email-text';

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
    <EmailLayout preview={`Your verification code is ${otp}`}>
      <EmailHeader />
      <EmailHeading>{heading}</EmailHeading>
      <EmailText>Hi {email},</EmailText>
      <EmailText>{description}</EmailText>
      <EmailCode code={otp} />
      <EmailText muted>This code expires in 10 minutes. Do not share it with anyone.</EmailText>
      <EmailFooter securityNotice="If you did not request this code, please secure your account." />
    </EmailLayout>
  );
}

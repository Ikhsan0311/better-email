import type { TwoFactorOTPContext } from 'better-email';

import { EmailCode } from './components/email-code';
import { EmailFooter } from './components/email-footer';
import { EmailHeader } from './components/email-header';
import { EmailHeading } from './components/email-heading';
import { EmailLayout } from './components/email-layout';
import { EmailText } from './components/email-text';

export default function TwoFactorOTPEmail({ user, otp }: TwoFactorOTPContext) {
  return (
    <EmailLayout preview={`Your two-factor authentication code is ${otp}`}>
      <EmailHeader />
      <EmailHeading>Two-factor authentication</EmailHeading>
      <EmailText>Hi {user.name},</EmailText>
      <EmailText>Enter the code below to complete your sign-in. This code is required as part of your two-factor authentication.</EmailText>
      <EmailCode code={otp} />
      <EmailText muted>This code expires in 5 minutes. Do not share it with anyone.</EmailText>
      <EmailFooter securityNotice="If you did not attempt to sign in, someone may have your password. Please change it immediately." />
    </EmailLayout>
  );
}

import type { ResetPasswordContext } from 'better-email';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailHeader } from './components/email-header';
import { EmailHeading } from './components/email-heading';
import { EmailLayout } from './components/email-layout';
import { EmailText } from './components/email-text';

export default function ResetPasswordEmail({ user, url }: ResetPasswordContext) {
  return (
    <EmailLayout preview="Reset your password">
      <EmailHeader />
      <EmailHeading>Reset your password</EmailHeading>
      <EmailText>Hi {user.name},</EmailText>
      <EmailText>We received a request to reset your password. Click the button below to choose a new password.</EmailText>
      <EmailButton href={url}>Reset password</EmailButton>
      <EmailText muted>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</EmailText>
      <EmailFooter securityNotice="This link will expire in 1 hour. For security, it can only be used once." />
    </EmailLayout>
  );
}

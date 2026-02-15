import type { ChangeEmailVerificationContext } from 'better-email';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailHeader } from './components/email-header';
import { EmailHeading } from './components/email-heading';
import { EmailLayout } from './components/email-layout';
import { EmailText } from './components/email-text';

export default function ChangeEmailEmail({ user, newEmail, url }: ChangeEmailVerificationContext) {
  return (
    <EmailLayout preview="Confirm your email address change">
      <EmailHeader />
      <EmailHeading>Confirm email change</EmailHeading>
      <EmailText>Hi {user.name},</EmailText>
      <EmailText>
        We received a request to change your email address to <strong>{newEmail}</strong>. Click the button below to confirm this change.
      </EmailText>
      <EmailButton href={url}>Confirm email change</EmailButton>
      <EmailText muted>If you did not request this change, please ignore this email and your email address will remain unchanged.</EmailText>
      <EmailFooter securityNotice="This link will expire in 1 hour." />
    </EmailLayout>
  );
}

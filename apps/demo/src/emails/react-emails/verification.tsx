import type { VerificationEmailContext } from 'better-email';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailHeader } from './components/email-header';
import { EmailHeading } from './components/email-heading';
import { EmailLayout } from './components/email-layout';
import { EmailText } from './components/email-text';

export default function VerificationEmail({ user, url }: VerificationEmailContext) {
  return (
    <EmailLayout preview="Verify your email address to get started">
      <EmailHeader />
      <EmailHeading>Verify your email</EmailHeading>
      <EmailText>Hi {user.name},</EmailText>
      <EmailText>Thanks for signing up. Please verify your email address by clicking the button below to activate your account.</EmailText>
      <EmailButton href={url}>Verify email address</EmailButton>
      <EmailText muted>If you did not create an account, you can safely ignore this email.</EmailText>
      <EmailFooter securityNotice="This link will expire in 24 hours." />
    </EmailLayout>
  );
}

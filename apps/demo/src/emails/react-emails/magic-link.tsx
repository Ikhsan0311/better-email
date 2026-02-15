import type { MagicLinkContext } from 'better-email';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailHeader } from './components/email-header';
import { EmailHeading } from './components/email-heading';
import { EmailLayout } from './components/email-layout';
import { EmailText } from './components/email-text';

export default function MagicLinkEmail({ email, url }: MagicLinkContext) {
  return (
    <EmailLayout preview="Your sign-in link is ready">
      <EmailHeader />
      <EmailHeading>Sign in to your account</EmailHeading>
      <EmailText>Hi {email},</EmailText>
      <EmailText>Click the button below to sign in to your account. No password needed.</EmailText>
      <EmailButton href={url}>Sign in</EmailButton>
      <EmailText muted>If you did not request this link, you can safely ignore this email.</EmailText>
      <EmailFooter securityNotice="This link will expire in 10 minutes and can only be used once." />
    </EmailLayout>
  );
}

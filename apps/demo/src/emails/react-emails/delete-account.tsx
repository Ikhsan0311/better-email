import { Section, Text } from '@react-email/components';
import type { DeleteAccountVerificationContext } from 'better-email';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailHeader } from './components/email-header';
import { EmailHeading } from './components/email-heading';
import { EmailLayout } from './components/email-layout';
import { EmailText } from './components/email-text';

export default function DeleteAccountEmail({ user, url }: DeleteAccountVerificationContext) {
  return (
    <EmailLayout preview="Confirm your account deletion">
      <EmailHeader />
      <EmailHeading>Delete your account</EmailHeading>
      <EmailText>Hi {user.name},</EmailText>
      <EmailText>We received a request to permanently delete your account. This action is irreversible.</EmailText>

      <Section style={warningBox} role="presentation">
        <Text style={warningText}>
          All your data, including your profile, settings, and associated content, will be permanently removed and cannot be recovered.
        </Text>
      </Section>

      <EmailButton href={url} variant="destructive">
        Delete my account
      </EmailButton>

      <EmailText muted>If you did not request this, please ignore this email. Your account will remain active.</EmailText>
      <EmailFooter securityNotice="This link will expire in 1 hour. For security, it can only be used once." />
    </EmailLayout>
  );
}

const warningBox: React.CSSProperties = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '20px 0',
};

const warningText: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '20px',
  color: '#991b1b',
  margin: '0',
};

import { Section, Text } from '@react-email/components';
import type { OrganizationInvitationContext } from 'better-email';

import { EmailFooter } from './components/email-footer';
import { EmailHeader } from './components/email-header';
import { EmailHeading } from './components/email-heading';
import { EmailLayout } from './components/email-layout';
import { EmailText } from './components/email-text';

export default function InvitationEmail({ organization, inviter, role }: OrganizationInvitationContext) {
  return (
    <EmailLayout preview={`${inviter.user.name} invited you to join ${organization.name}`}>
      <EmailHeader />
      <EmailHeading>You have been invited</EmailHeading>
      <EmailText>
        <strong>{inviter.user.name}</strong> has invited you to join <strong>{organization.name}</strong>.
      </EmailText>

      <Section style={detailsCard} role="presentation">
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={detailLabel}>Organization</td>
              <td style={detailValue}>{organization.name}</td>
            </tr>
            <tr>
              <td style={detailLabel}>Role</td>
              <td style={detailValue}>
                <span style={roleBadge}>{role}</span>
              </td>
            </tr>
            <tr>
              <td style={detailLabel}>Invited by</td>
              <td style={detailValue}>{inviter.user.name}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Text style={instructionText} className="email-text">
        Sign in to your account to accept this invitation.
      </Text>

      <EmailFooter />
    </EmailLayout>
  );
}

const detailsCard: React.CSSProperties = {
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '24px 0',
};

const detailLabel: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#71717a',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: '6px 16px 6px 0',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
};

const detailValue: React.CSSProperties = {
  fontSize: '14px',
  color: '#09090b',
  fontWeight: '500',
  padding: '6px 0',
  verticalAlign: 'top',
};

const roleBadge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#18181b',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600',
  padding: '2px 10px',
  borderRadius: '12px',
  textTransform: 'capitalize',
};

const instructionText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#3f3f46',
  margin: '0 0 12px 0',
};

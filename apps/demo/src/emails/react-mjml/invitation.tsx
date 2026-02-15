import { MjmlColumn, MjmlSection, MjmlText } from '@faire/mjml-react';
import type { OrganizationInvitationContext } from 'better-email';

import { MjmlFooter } from './components/mjml-footer';
import { MjmlHeader } from './components/mjml-header';
import { MjmlLayout } from './components/mjml-layout';

export default function InvitationEmail({ organization, inviter, role }: OrganizationInvitationContext) {
  return (
    <MjmlLayout title="Organization invitation">
      <MjmlHeader />
      <MjmlSection padding="24px 0 0 0" backgroundColor="#ffffff">
        <MjmlColumn padding="0">
          <MjmlText fontSize="24px" fontWeight="600" color="#09090b" lineHeight="32px" padding="0 32px 8px 32px" cssClass="dark-heading">
            You have been invited
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 12px 32px" cssClass="dark-text">
            <strong>{inviter.user.name}</strong> has invited you to join <strong>{organization.name}</strong>.
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="0 32px 0 32px" cssClass="dark-text">
            <div
              style={{
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                padding: '20px 24px',
              }}
            >
              <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#71717a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '6px 16px 6px 0',
                        verticalAlign: 'top',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Organization
                    </td>
                    <td
                      style={{
                        fontSize: '14px',
                        color: '#09090b',
                        fontWeight: 500,
                        padding: '6px 0',
                        verticalAlign: 'top',
                      }}
                    >
                      {organization.name}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#71717a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '6px 16px 6px 0',
                        verticalAlign: 'top',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Role
                    </td>
                    <td
                      style={{
                        fontSize: '14px',
                        color: '#09090b',
                        fontWeight: 500,
                        padding: '6px 0',
                        verticalAlign: 'top',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#18181b',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '2px 10px',
                          borderRadius: '12px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {role}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#71717a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '6px 16px 6px 0',
                        verticalAlign: 'top',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Invited by
                    </td>
                    <td
                      style={{
                        fontSize: '14px',
                        color: '#09090b',
                        fontWeight: 500,
                        padding: '6px 0',
                        verticalAlign: 'top',
                      }}
                    >
                      {inviter.user.name}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </MjmlText>
          <MjmlText fontSize="14px" lineHeight="24px" color="#3f3f46" padding="16px 32px 0 32px" cssClass="dark-text">
            Sign in to your account to accept this invitation.
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
      <MjmlFooter />
    </MjmlLayout>
  );
}

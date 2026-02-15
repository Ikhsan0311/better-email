import type { EmailContextFor } from 'better-email';

const FONT_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

function mjmlHead(title: string) {
  return `
    <mj-head>
      <mj-title>${title}</mj-title>
      <mj-attributes>
        <mj-all font-family="${FONT_STACK}" />
        <mj-body background-color="#fafafa" />
        <mj-section background-color="#ffffff" padding="0" />
        <mj-column padding="0" />
        <mj-text font-size="14px" line-height="24px" color="#3f3f46" padding="0 32px" />
        <mj-button background-color="#18181b" color="#fafafa" font-size="14px" font-weight="600" border-radius="6px" inner-padding="14px 28px" padding="24px 32px" />
        <mj-divider border-color="#e4e4e7" border-width="1px" padding="0 32px" />
      </mj-attributes>
      <mj-style>
        @media (prefers-color-scheme: dark) {
          .email-body { background-color: #09090b !important; }
          .email-container > table > tbody > tr > td { background-color: #18181b !important; }
          .dark-heading div { color: #ffffff !important; }
          .dark-text div { color: #a1a1aa !important; }
          .dark-muted div { color: #71717a !important; }
          .dark-code div { color: #ffffff !important; }
          .dark-code td { background-color: #27272a !important; }
          .dark-border td { border-color: #27272a !important; }
        }
      </mj-style>
    </mj-head>`;
}

function mjmlHeader(appName = 'Better Email') {
  return `
      <mj-section padding="48px 0 0 0">
        <mj-column>
          <mj-text font-size="18px" font-weight="700" color="#09090b" padding="0 32px 16px 32px" mj-class="dark-heading">${appName}</mj-text>
          <mj-divider padding="0 32px" />
        </mj-column>
      </mj-section>`;
}

function mjmlFooter(securityNotice?: string) {
  const securityBlock = securityNotice
    ? `<mj-text font-size="12px" line-height="18px" color="#71717a" padding="0 32px 8px 32px" mj-class="dark-muted">${securityNotice}</mj-text>`
    : '';

  return `
      <mj-section padding="32px 0 48px 0">
        <mj-column>
          <mj-divider padding="0 32px 16px 32px" />
          ${securityBlock}
          <mj-text font-size="12px" line-height="18px" color="#71717a" padding="0 32px 0 32px" mj-class="dark-muted">Sent by Better Email</mj-text>
        </mj-column>
      </mj-section>`;
}

function mjmlButton(text: string, href: string, variant: 'primary' | 'destructive' = 'primary') {
  const bgColor = variant === 'destructive' ? '#ef4444' : '#18181b';
  return `<mj-button href="${href}" background-color="${bgColor}">${text}</mj-button>`;
}

function mjmlCodeBlock(code: string) {
  return `
          <mj-text align="center" padding="24px 32px" mj-class="dark-code">
            <div style="background-color:#f4f4f5;border-radius:8px;padding:20px 16px;text-align:center;">
              <span style="font-size:32px;font-weight:700;letter-spacing:6px;color:#09090b;font-family:'SF Mono','Fira Code','Roboto Mono','Courier New',monospace;">${code}</span>
            </div>
          </mj-text>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export const mjmlTemplates = {
  'verification-email': (ctx: EmailContextFor<'verification-email'>) => ({
    subject: 'Verify your email',
    mjml: `<mjml>
    ${mjmlHead('Verify your email')}
    <mj-body css-class="email-body">
      <mj-wrapper css-class="email-container" background-color="#ffffff" border-radius="8px" padding="0">
      ${mjmlHeader()}
      <mj-section padding="24px 0 0 0">
        <mj-column>
          <mj-text font-size="24px" font-weight="600" color="#09090b" line-height="32px" padding="0 32px 8px 32px" mj-class="dark-heading">Verify your email</mj-text>
          <mj-text padding="0 32px 12px 32px" mj-class="dark-text">Hi ${escapeHtml(ctx.user.name)},</mj-text>
          <mj-text padding="0 32px 0 32px" mj-class="dark-text">Thanks for signing up. Please verify your email address by clicking the button below to activate your account.</mj-text>
          ${mjmlButton('Verify email address', ctx.url)}
          <mj-text font-size="13px" line-height="20px" color="#71717a" padding="0 32px 0 32px" mj-class="dark-muted">If you did not create an account, you can safely ignore this email.</mj-text>
        </mj-column>
      </mj-section>
      ${mjmlFooter('This link will expire in 24 hours.')}
      </mj-wrapper>
    </mj-body>
    </mjml>`,
    text: `Hi ${ctx.user.name},\n\nThanks for signing up. Please verify your email address by clicking the link below.\n\n${ctx.url}\n\nThis link will expire in 24 hours.\n\nIf you did not create an account, you can safely ignore this email.`,
  }),

  'reset-password': (ctx: EmailContextFor<'reset-password'>) => ({
    subject: 'Reset your password',
    mjml: `<mjml>
    ${mjmlHead('Reset your password')}
    <mj-body css-class="email-body">
      <mj-wrapper css-class="email-container" background-color="#ffffff" border-radius="8px" padding="0">
      ${mjmlHeader()}
      <mj-section padding="24px 0 0 0">
        <mj-column>
          <mj-text font-size="24px" font-weight="600" color="#09090b" line-height="32px" padding="0 32px 8px 32px" mj-class="dark-heading">Reset your password</mj-text>
          <mj-text padding="0 32px 12px 32px" mj-class="dark-text">Hi ${escapeHtml(ctx.user.name)},</mj-text>
          <mj-text padding="0 32px 0 32px" mj-class="dark-text">We received a request to reset your password. Click the button below to choose a new password.</mj-text>
          ${mjmlButton('Reset password', ctx.url)}
          <mj-text font-size="13px" line-height="20px" color="#71717a" padding="0 32px 0 32px" mj-class="dark-muted">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</mj-text>
        </mj-column>
      </mj-section>
      ${mjmlFooter('This link will expire in 1 hour. For security, it can only be used once.')}
      </mj-wrapper>
    </mj-body>
    </mjml>`,
    text: `Hi ${ctx.user.name},\n\nWe received a request to reset your password. Click the link below to choose a new password.\n\n${ctx.url}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, you can safely ignore this email.`,
  }),

  'magic-link': (ctx: EmailContextFor<'magic-link'>) => ({
    subject: 'Your sign-in link',
    mjml: `<mjml>
    ${mjmlHead('Your sign-in link')}
    <mj-body css-class="email-body">
      <mj-wrapper css-class="email-container" background-color="#ffffff" border-radius="8px" padding="0">
      ${mjmlHeader()}
      <mj-section padding="24px 0 0 0">
        <mj-column>
          <mj-text font-size="24px" font-weight="600" color="#09090b" line-height="32px" padding="0 32px 8px 32px" mj-class="dark-heading">Sign in to your account</mj-text>
          <mj-text padding="0 32px 12px 32px" mj-class="dark-text">Hi ${escapeHtml(ctx.email)},</mj-text>
          <mj-text padding="0 32px 0 32px" mj-class="dark-text">Click the button below to sign in to your account. No password needed.</mj-text>
          ${mjmlButton('Sign in', ctx.url)}
          <mj-text font-size="13px" line-height="20px" color="#71717a" padding="0 32px 0 32px" mj-class="dark-muted">If you did not request this link, you can safely ignore this email.</mj-text>
        </mj-column>
      </mj-section>
      ${mjmlFooter('This link will expire in 10 minutes and can only be used once.')}
      </mj-wrapper>
    </mj-body>
    </mjml>`,
    text: `Hi ${ctx.email},\n\nClick the link below to sign in to your account.\n\n${ctx.url}\n\nThis link will expire in 10 minutes and can only be used once.\n\nIf you did not request this link, you can safely ignore this email.`,
  }),

  'verification-otp': (ctx: EmailContextFor<'verification-otp'>) => {
    const headings: Record<string, string> = {
      'sign-in': 'Your sign-in code',
      'email-verification': 'Verify your email',
      'forget-password': 'Your password reset code',
    };
    const descriptions: Record<string, string> = {
      'sign-in': 'Enter the code below to sign in to your account.',
      'email-verification': 'Enter the code below to verify your email address.',
      'forget-password': 'Enter the code below to reset your password.',
    };
    const heading = headings[ctx.otpType] || 'Your verification code';
    const description = descriptions[ctx.otpType] || 'Use the code below to complete your request.';

    return {
      subject: 'Your verification code',
      mjml: `<mjml>
      ${mjmlHead('Your verification code')}
      <mj-body css-class="email-body">
        <mj-wrapper css-class="email-container" background-color="#ffffff" border-radius="8px" padding="0">
        ${mjmlHeader()}
        <mj-section padding="24px 0 0 0">
          <mj-column>
            <mj-text font-size="24px" font-weight="600" color="#09090b" line-height="32px" padding="0 32px 8px 32px" mj-class="dark-heading">${heading}</mj-text>
            <mj-text padding="0 32px 12px 32px" mj-class="dark-text">Hi ${escapeHtml(ctx.email)},</mj-text>
            <mj-text padding="0 32px 0 32px" mj-class="dark-text">${description}</mj-text>
            ${mjmlCodeBlock(escapeHtml(ctx.otp))}
            <mj-text font-size="13px" line-height="20px" color="#71717a" padding="0 32px 0 32px" mj-class="dark-muted">This code expires in 10 minutes. Do not share it with anyone.</mj-text>
          </mj-column>
        </mj-section>
        ${mjmlFooter('If you did not request this code, please secure your account.')}
        </mj-wrapper>
      </mj-body>
      </mjml>`,
      text: `Hi ${ctx.email},\n\n${description}\n\nYour code: ${ctx.otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.\n\nIf you did not request this code, please secure your account.`,
    };
  },

  'organization-invitation': (ctx: EmailContextFor<'organization-invitation'>) => ({
    subject: `You have been invited to join ${ctx.organization.name}`,
    mjml: `<mjml>
    ${mjmlHead('Organization invitation')}
    <mj-body css-class="email-body">
      <mj-wrapper css-class="email-container" background-color="#ffffff" border-radius="8px" padding="0">
      ${mjmlHeader()}
      <mj-section padding="24px 0 0 0">
        <mj-column>
          <mj-text font-size="24px" font-weight="600" color="#09090b" line-height="32px" padding="0 32px 8px 32px" mj-class="dark-heading">You have been invited</mj-text>
          <mj-text padding="0 32px 12px 32px" mj-class="dark-text"><strong>${escapeHtml(ctx.inviter.user.name)}</strong> has invited you to join <strong>${escapeHtml(ctx.organization.name)}</strong>.</mj-text>
          <mj-text padding="0 32px 0 32px" mj-class="dark-text">
            <div style="background-color:#fafafa;border-radius:8px;padding:20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;padding:6px 16px 6px 0;vertical-align:top;white-space:nowrap;">Organization</td>
                  <td style="font-size:14px;color:#09090b;font-weight:500;padding:6px 0;vertical-align:top;">${escapeHtml(ctx.organization.name)}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;padding:6px 16px 6px 0;vertical-align:top;white-space:nowrap;">Role</td>
                  <td style="font-size:14px;color:#09090b;font-weight:500;padding:6px 0;vertical-align:top;"><span style="display:inline-block;background-color:#18181b;color:#ffffff;font-size:12px;font-weight:600;padding:2px 10px;border-radius:12px;text-transform:capitalize;">${escapeHtml(ctx.role)}</span></td>
                </tr>
                <tr>
                  <td style="font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;padding:6px 16px 6px 0;vertical-align:top;white-space:nowrap;">Invited by</td>
                  <td style="font-size:14px;color:#09090b;font-weight:500;padding:6px 0;vertical-align:top;">${escapeHtml(ctx.inviter.user.name)}</td>
                </tr>
              </table>
            </div>
          </mj-text>
          <mj-text padding="16px 32px 0 32px" mj-class="dark-text">Sign in to your account to accept this invitation.</mj-text>
        </mj-column>
      </mj-section>
      ${mjmlFooter()}
      </mj-wrapper>
    </mj-body>
    </mjml>`,
    text: `${ctx.inviter.user.name} has invited you to join ${ctx.organization.name} as a ${ctx.role}.\n\nOrganization: ${ctx.organization.name}\nRole: ${ctx.role}\nInvited by: ${ctx.inviter.user.name}\n\nSign in to your account to accept this invitation.`,
  }),

  'change-email-verification': (ctx: EmailContextFor<'change-email-verification'>) => ({
    subject: 'Confirm your email change',
    mjml: `<mjml>
    ${mjmlHead('Confirm your email change')}
    <mj-body css-class="email-body">
      <mj-wrapper css-class="email-container" background-color="#ffffff" border-radius="8px" padding="0">
      ${mjmlHeader()}
      <mj-section padding="24px 0 0 0">
        <mj-column>
          <mj-text font-size="24px" font-weight="600" color="#09090b" line-height="32px" padding="0 32px 8px 32px" mj-class="dark-heading">Confirm email change</mj-text>
          <mj-text padding="0 32px 12px 32px" mj-class="dark-text">Hi ${escapeHtml(ctx.user.name)},</mj-text>
          <mj-text padding="0 32px 0 32px" mj-class="dark-text">We received a request to change your email address to <strong>${escapeHtml(ctx.newEmail)}</strong>. Click the button below to confirm this change.</mj-text>
          ${mjmlButton('Confirm email change', ctx.url)}
          <mj-text font-size="13px" line-height="20px" color="#71717a" padding="0 32px 0 32px" mj-class="dark-muted">If you did not request this change, please ignore this email and your email address will remain unchanged.</mj-text>
        </mj-column>
      </mj-section>
      ${mjmlFooter('This link will expire in 1 hour.')}
      </mj-wrapper>
    </mj-body>
    </mjml>`,
    text: `Hi ${ctx.user.name},\n\nWe received a request to change your email address to ${ctx.newEmail}. Click the link below to confirm this change.\n\n${ctx.url}\n\nThis link will expire in 1 hour.\n\nIf you did not request this change, please ignore this email.`,
  }),

  'delete-account-verification': (ctx: EmailContextFor<'delete-account-verification'>) => ({
    subject: 'Confirm account deletion',
    mjml: `<mjml>
    ${mjmlHead('Confirm account deletion')}
    <mj-body css-class="email-body">
      <mj-wrapper css-class="email-container" background-color="#ffffff" border-radius="8px" padding="0">
      ${mjmlHeader()}
      <mj-section padding="24px 0 0 0">
        <mj-column>
          <mj-text font-size="24px" font-weight="600" color="#09090b" line-height="32px" padding="0 32px 8px 32px" mj-class="dark-heading">Delete your account</mj-text>
          <mj-text padding="0 32px 12px 32px" mj-class="dark-text">Hi ${escapeHtml(ctx.user.name)},</mj-text>
          <mj-text padding="0 32px 0 32px" mj-class="dark-text">We received a request to permanently delete your account. This action is irreversible.</mj-text>
          <mj-text padding="16px 32px" mj-class="dark-text">
            <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;">
              <span style="font-size:13px;line-height:20px;color:#991b1b;">All your data, including your profile, settings, and associated content, will be permanently removed and cannot be recovered.</span>
            </div>
          </mj-text>
          ${mjmlButton('Delete my account', ctx.url, 'destructive')}
          <mj-text font-size="13px" line-height="20px" color="#71717a" padding="0 32px 0 32px" mj-class="dark-muted">If you did not request this, please ignore this email. Your account will remain active.</mj-text>
        </mj-column>
      </mj-section>
      ${mjmlFooter('This link will expire in 1 hour. For security, it can only be used once.')}
      </mj-wrapper>
    </mj-body>
    </mjml>`,
    text: `Hi ${ctx.user.name},\n\nWe received a request to permanently delete your account. This action is irreversible.\n\nAll your data, including your profile, settings, and associated content, will be permanently removed and cannot be recovered.\n\nConfirm deletion: ${ctx.url}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email. Your account will remain active.`,
  }),

  'two-factor-otp': (ctx: EmailContextFor<'two-factor-otp'>) => ({
    subject: 'Your two-factor authentication code',
    mjml: `<mjml>
    ${mjmlHead('Two-factor authentication')}
    <mj-body css-class="email-body">
      <mj-wrapper css-class="email-container" background-color="#ffffff" border-radius="8px" padding="0">
      ${mjmlHeader()}
      <mj-section padding="24px 0 0 0">
        <mj-column>
          <mj-text font-size="24px" font-weight="600" color="#09090b" line-height="32px" padding="0 32px 8px 32px" mj-class="dark-heading">Two-factor authentication</mj-text>
          <mj-text padding="0 32px 12px 32px" mj-class="dark-text">Hi ${escapeHtml(ctx.user.name)},</mj-text>
          <mj-text padding="0 32px 0 32px" mj-class="dark-text">Enter the code below to complete your sign-in. This code is required as part of your two-factor authentication.</mj-text>
          ${mjmlCodeBlock(escapeHtml(ctx.otp))}
          <mj-text font-size="13px" line-height="20px" color="#71717a" padding="0 32px 0 32px" mj-class="dark-muted">This code expires in 5 minutes. Do not share it with anyone.</mj-text>
        </mj-column>
      </mj-section>
      ${mjmlFooter('If you did not attempt to sign in, someone may have your password. Please change it immediately.')}
      </mj-wrapper>
    </mj-body>
    </mjml>`,
    text: `Hi ${ctx.user.name},\n\nEnter the code below to complete your sign-in.\n\nYour code: ${ctx.otp}\n\nThis code expires in 5 minutes. Do not share it with anyone.\n\nIf you did not attempt to sign in, someone may have your password. Please change it immediately.`,
  }),
};

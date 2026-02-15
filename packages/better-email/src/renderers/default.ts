import type { EmailContext, EmailTemplateRenderer, RenderedEmail } from '../types';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class DefaultTemplateRenderer implements EmailTemplateRenderer {
  async render(context: EmailContext): Promise<RenderedEmail> {
    switch (context.type) {
      case 'verification-email':
        return {
          subject: 'Verify your email',
          html: `<p>Click the link to verify your email: <a href="${escapeHtml(context.url)}">${escapeHtml(context.url)}</a></p>`,
          text: `Click the link to verify your email: ${context.url}`,
        };

      case 'reset-password':
        return {
          subject: 'Reset your password',
          html: `<p>Click the link to reset your password: <a href="${escapeHtml(context.url)}">${escapeHtml(context.url)}</a></p>`,
          text: `Click the link to reset your password: ${context.url}`,
        };

      case 'change-email-verification':
        return {
          subject: 'Confirm your email change',
          html: `<p>Click the link to confirm changing your email to ${escapeHtml(context.newEmail)}: <a href="${escapeHtml(context.url)}">${escapeHtml(context.url)}</a></p>`,
          text: `Click the link to confirm changing your email to ${context.newEmail}: ${context.url}`,
        };

      case 'delete-account-verification':
        return {
          subject: 'Confirm account deletion',
          html: `<p>Click the link to confirm deleting your account: <a href="${escapeHtml(context.url)}">${escapeHtml(context.url)}</a></p>`,
          text: `Click the link to confirm deleting your account: ${context.url}`,
        };

      case 'magic-link':
        return {
          subject: 'Your sign-in link',
          html: `<p>Click the link to sign in: <a href="${escapeHtml(context.url)}">${escapeHtml(context.url)}</a></p>`,
          text: `Click the link to sign in: ${context.url}`,
        };

      case 'verification-otp':
        return {
          subject: 'Your verification code',
          html: `<p>Your verification code is: <strong>${escapeHtml(context.otp)}</strong></p>`,
          text: `Your verification code is: ${context.otp}`,
        };

      case 'organization-invitation':
        return {
          subject: `You've been invited to join ${context.organization.name}`,
          html: `<p>You've been invited to join <strong>${escapeHtml(context.organization.name)}</strong>.</p>`,
          text: `You've been invited to join ${context.organization.name}.`,
        };

      case 'two-factor-otp':
        return {
          subject: 'Your two-factor authentication code',
          html: `<p>Your two-factor code is: <strong>${escapeHtml(context.otp)}</strong></p>`,
          text: `Your two-factor code is: ${context.otp}`,
        };

      default: {
        const _exhaustive: never = context;
        throw new Error(`[DefaultTemplateRenderer] Unknown email type: ${(_exhaustive as EmailContext).type}`);
      }
    }
  }
}

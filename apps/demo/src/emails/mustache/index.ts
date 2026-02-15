import type { MustacheRendererOptions } from 'better-email';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadTemplate = (filename: string): string => {
  return readFileSync(join(__dirname, filename), 'utf-8');
};

export const mustacheTemplates: MustacheRendererOptions['templates'] = {
  'verification-email': () => ({
    subject: 'Verify your email',
    template: loadTemplate('verification.mustache'),
    text: `Hi {{user.name}},\n\nThanks for signing up. Please verify your email address by clicking the link below.\n\n{{url}}\n\nThis link will expire in 24 hours.\n\nIf you did not create an account, you can safely ignore this email.`,
  }),

  'reset-password': () => ({
    subject: 'Reset your password',
    template: loadTemplate('reset-password.mustache'),
    text: `Hi {{user.name}},\n\nWe received a request to reset your password. Click the link below to choose a new password.\n\n{{url}}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, you can safely ignore this email.`,
  }),

  'magic-link': () => ({
    subject: 'Your sign-in link',
    template: loadTemplate('magic-link.mustache'),
    text: `Hi {{email}},\n\nClick the link below to sign in to your account.\n\n{{url}}\n\nThis link will expire in 10 minutes and can only be used once.\n\nIf you did not request this link, you can safely ignore this email.`,
  }),

  'verification-otp': () => ({
    subject: 'Your verification code',
    template: loadTemplate('otp.mustache'),
    text: `Hi {{email}},\n\nUse the code below to complete your request.\n\nYour code: {{otp}}\n\nThis code expires in 10 minutes. Do not share it with anyone.\n\nIf you did not request this code, please secure your account.`,
  }),

  'organization-invitation': (ctx) => ({
    subject: `You have been invited to join ${ctx.organization.name}`,
    template: loadTemplate('invitation.mustache'),
    text: `{{inviter.user.name}} has invited you to join {{organization.name}} as a {{role}}.\n\nOrganization: {{organization.name}}\nRole: {{role}}\nInvited by: {{inviter.user.name}}\n\nSign in to your account to accept this invitation.`,
  }),

  'change-email-verification': () => ({
    subject: 'Confirm your email change',
    template: loadTemplate('change-email.mustache'),
    text: `Hi {{user.name}},\n\nWe received a request to change your email address to {{newEmail}}. Click the link below to confirm this change.\n\n{{url}}\n\nThis link will expire in 1 hour.\n\nIf you did not request this change, please ignore this email.`,
  }),

  'delete-account-verification': () => ({
    subject: 'Confirm account deletion',
    template: loadTemplate('delete-account.mustache'),
    text: `Hi {{user.name}},\n\nWe received a request to permanently delete your account. This action is irreversible.\n\nAll your data, including your profile, settings, and associated content, will be permanently removed and cannot be recovered.\n\nConfirm deletion: {{url}}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email. Your account will remain active.`,
  }),

  'two-factor-otp': () => ({
    subject: 'Your two-factor authentication code',
    template: loadTemplate('two-factor-otp.mustache'),
    text: `Hi {{user.name}},\n\nEnter the code below to complete your sign-in.\n\nYour code: {{otp}}\n\nThis code expires in 5 minutes. Do not share it with anyone.\n\nIf you did not attempt to sign in, someone may have your password. Please change it immediately.`,
  }),
};

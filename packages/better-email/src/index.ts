import { sendEmail } from './handlers';
import type { BetterEmailOptions, EmailProps, VerificationOTPContext } from './types';

export const betterEmail = (options: BetterEmailOptions) => {
  return {
    id: 'better-email' as const,
    helpers: {
      changeEmail: betterEmailChangeEmail(options),
      deleteAccount: betterEmailDeleteAccount(options),
      magicLink: betterEmailMagicLink(options),
      otp: betterEmailOTP(options),
      invitation: betterEmailInvitation(options),
      twoFactor: betterEmailTwoFactor(options),
    },
    init() {
      return {
        options: {
          emailVerification: {
            sendVerificationEmail: async (data: EmailProps<'verification-email'>) => {
              await sendEmail(options, { type: 'verification-email', ...data });
            },
          },
          emailAndPassword: {
            enabled: true as const,
            sendResetPassword: async (data: EmailProps<'reset-password'>) => {
              await sendEmail(options, { type: 'reset-password', ...data });
            },
          },
        },
      };
    },
  };
};

export function betterEmailChangeEmail(options: BetterEmailOptions) {
  return async (data: EmailProps<'change-email-verification'>) => {
    await sendEmail(options, { type: 'change-email-verification', ...data });
  };
}

export function betterEmailDeleteAccount(options: BetterEmailOptions) {
  return async (data: EmailProps<'delete-account-verification'>) => {
    await sendEmail(options, { type: 'delete-account-verification', ...data });
  };
}

export function betterEmailMagicLink(options: BetterEmailOptions) {
  return async (data: EmailProps<'magic-link'>) => {
    await sendEmail(options, { type: 'magic-link', ...data });
  };
}

export function betterEmailOTP(options: BetterEmailOptions) {
  return async (data: Omit<EmailProps<'verification-otp'>, 'otpType'> & { type: VerificationOTPContext['otpType'] }) => {
    await sendEmail(options, {
      type: 'verification-otp',
      email: data.email,
      otp: data.otp,
      otpType: data.type,
    });
  };
}

export function betterEmailInvitation(options: BetterEmailOptions) {
  return async (data: EmailProps<'organization-invitation'>) => {
    await sendEmail(options, { type: 'organization-invitation', ...data });
  };
}

export function betterEmailTwoFactor(options: BetterEmailOptions) {
  return async (data: EmailProps<'two-factor-otp'>) => {
    await sendEmail(options, { type: 'two-factor-otp', ...data });
  };
}

export { sendEmail } from './handlers';

// Providers
export {
  ConsoleProvider,
  MailgunProvider,
  NuntlyProvider,
  PostmarkProvider,
  ResendProvider,
  SESProvider,
  SMTPProvider,
} from './providers';
export type {
  MailgunProviderOptions,
  NuntlyProviderOptions,
  PostmarkProviderOptions,
  ResendProviderOptions,
  SESProviderOptions,
  SMTPProviderOptions,
} from './providers';

// Renderers
export { DefaultTemplateRenderer, MJMLRenderer, MustacheRenderer, ReactEmailRenderer, ReactMJMLRenderer } from './renderers';
export type { MJMLRenderedTemplate, MJMLRendererOptions, MustacheRenderedTemplate, MustacheRendererOptions, ReactEmailRendererOptions, ReactMJMLRendererOptions } from './renderers';

// Types
export type {
  BetterEmailOptions,
  ChangeEmailVerificationContext,
  DeleteAccountVerificationContext,
  EmailContext,
  EmailContextFor,
  EmailMessage,
  EmailProps,
  EmailSendResponse,
  EmailTag,
  EmailTemplateRenderer,
  EmailProvider,
  EmailType,
  MagicLinkContext,
  OrganizationInvitationContext,
  RenderedEmail,
  ResetPasswordContext,
  SendEmailResult,
  TwoFactorOTPContext,
  VerificationEmailContext,
  VerificationOTPContext,
} from './types';

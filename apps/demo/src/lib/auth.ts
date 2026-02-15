import { render } from '@react-email/render';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP, magicLink, organization, twoFactor } from 'better-auth/plugins';
import { betterEmail, DefaultTemplateRenderer, NuntlyProvider, ReactEmailRenderer } from 'better-email';
import { createElement } from 'react';
import { db } from './db';
import { env } from './env';

import ChangeEmailEmail from '@/emails/react-emails/change-email';
import DeleteAccountEmail from '@/emails/react-emails/delete-account';
import InvitationEmail from '@/emails/react-emails/invitation';
import MagicLinkEmail from '@/emails/react-emails/magic-link';
import OTPEmail from '@/emails/react-emails/otp';
import ResetPasswordEmail from '@/emails/react-emails/reset-password';
import TwoFactorOTPEmail from '@/emails/react-emails/two-factor-otp';
import VerificationEmail from '@/emails/react-emails/verification';

const email = betterEmail({
  provider: new NuntlyProvider({
    apiKey: env.NUNTLY_API_KEY,
    from: env.EMAIL_FROM,
  }),
  templateRenderer: new ReactEmailRenderer({
    render,
    // Optional: Use dedicated renderToPlainText for better plain text output
    // renderPlainText: (element) => render(element, { plainText: true }),
    createElement,
    templates: {
      'verification-email': VerificationEmail,
      'reset-password': ResetPasswordEmail,
      'magic-link': MagicLinkEmail,
      'verification-otp': OTPEmail,
      'organization-invitation': InvitationEmail,
      'change-email-verification': ChangeEmailEmail,
      'delete-account-verification': DeleteAccountEmail,
      'two-factor-otp': TwoFactorOTPEmail,
    },
    subjects: {
      'verification-email': 'Verify your email',
      'reset-password': 'Reset your password',
      'magic-link': 'Your sign-in link',
      'verification-otp': 'Your verification code',
      'organization-invitation': (ctx) => `You have been invited to join ${ctx.organization.name}`,
      'change-email-verification': 'Confirm your email change',
      'delete-account-verification': 'Confirm account deletion',
      'two-factor-otp': 'Your two-factor authentication code',
    },
    fallback: new DefaultTemplateRenderer(),
  }),
  // Alternative 1: use MustacheRenderer with .mustache templates
  // import Mustache from 'mustache';
  // import { MustacheRenderer } from 'better-email';
  // import { mustacheTemplates } from '@/emails/mustache';
  // templateRenderer: new MustacheRenderer({
  //   render: (template, data) => Mustache.render(template, data),
  //   templates: mustacheTemplates,
  //   fallback: new DefaultTemplateRenderer(),
  // }),

  // Alternative 2: use ReactMJMLRenderer with @faire/mjml-react templates
  // import { render } from '@faire/mjml-react/utils/render';
  // import { ReactMJMLRenderer } from 'better-email';
  // import VerificationMjml from '@/emails/react-mjml/verification';
  // import ResetPasswordMjml from '@/emails/react-mjml/reset-password';
  // import MagicLinkMjml from '@/emails/react-mjml/magic-link';
  // import OTPMjml from '@/emails/react-mjml/otp';
  // import InvitationMjml from '@/emails/react-mjml/invitation';
  // import ChangeEmailMjml from '@/emails/react-mjml/change-email';
  // import DeleteAccountMjml from '@/emails/react-mjml/delete-account';
  // import TwoFactorOTPMjml from '@/emails/react-mjml/two-factor-otp';
  //
  // templateRenderer: new ReactMJMLRenderer({
  //   render: (element) => render(element),
  //   createElement,
  //   templates: {
  //     'verification-email': VerificationMjml,
  //     'reset-password': ResetPasswordMjml,
  //     'magic-link': MagicLinkMjml,
  //     'verification-otp': OTPMjml,
  //     'organization-invitation': InvitationMjml,
  //     'change-email-verification': ChangeEmailMjml,
  //     'delete-account-verification': DeleteAccountMjml,
  //     'two-factor-otp': TwoFactorOTPMjml,
  //   },
  //   subjects: { ... },
  //   fallback: new DefaultTemplateRenderer(),
  // }),
  defaultTags: [{ name: 'app', value: 'better-email-demo' }],
  onAfterSend: async (ctx, msg) => {
    console.log(`[demo] Sent ${ctx.type} to ${msg.to}`);
  },
  onSendError: async (ctx, _msg, err) => {
    console.error(`[demo] Failed ${ctx.type}:`, err);
  },
});

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  plugins: [
    email,
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          await email.helpers.twoFactor({ user, otp });
        },
      },
    }),
    organization({ sendInvitationEmail: email.helpers.invitation }),
    ...(env.ENABLE_MAGIC_LINK ? [magicLink({ sendMagicLink: email.helpers.magicLink })] : []),
    ...(env.ENABLE_EMAIL_OTP ? [emailOTP({ sendVerificationOTP: email.helpers.otp })] : []),
  ],
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: email.helpers.changeEmail,
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: email.helpers.deleteAccount,
    },
  },
});

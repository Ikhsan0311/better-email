import type { User } from 'better-auth';

export type EmailType =
  | 'verification-email'
  | 'reset-password'
  | 'change-email-verification'
  | 'delete-account-verification'
  | 'magic-link'
  | 'verification-otp'
  | 'organization-invitation'
  | 'two-factor-otp';

export interface EmailTag {
  name: string;
  value: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  tags?: EmailTag[];
}

export interface EmailSendResponse {
  messageId?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<EmailSendResponse | void>;
}

// Discriminated union of all email contexts

export interface VerificationEmailContext {
  type: 'verification-email';
  user: User;
  url: string;
  token: string;
}

export interface ResetPasswordContext {
  type: 'reset-password';
  user: User;
  url: string;
  token: string;
}

export interface ChangeEmailVerificationContext {
  type: 'change-email-verification';
  user: User;
  newEmail: string;
  url: string;
  token: string;
}

export interface DeleteAccountVerificationContext {
  type: 'delete-account-verification';
  user: User;
  url: string;
  token: string;
}

export interface MagicLinkContext {
  type: 'magic-link';
  email: string;
  url: string;
  token: string;
}

export interface VerificationOTPContext {
  type: 'verification-otp';
  email: string;
  otp: string;
  otpType: 'sign-in' | 'email-verification' | 'forget-password';
}

export interface OrganizationInvitationContext {
  type: 'organization-invitation';
  id: string;
  role: string;
  email: string;
  organization: { id: string; name: string; slug?: string; logo?: string | null; metadata?: string | null; createdAt: Date };
  invitation: { id: string; email: string; status: string; organizationId: string; role: string; inviterId: string; expiresAt: Date };
  inviter: { id: string; organizationId: string; userId: string; role: string; createdAt: Date; user: User };
}

export interface TwoFactorOTPContext {
  type: 'two-factor-otp';
  user: User & { twoFactorEnabled?: boolean };
  otp: string;
}

export type EmailContext =
  | VerificationEmailContext
  | ResetPasswordContext
  | ChangeEmailVerificationContext
  | DeleteAccountVerificationContext
  | MagicLinkContext
  | VerificationOTPContext
  | OrganizationInvitationContext
  | TwoFactorOTPContext;

/** Extracts the context interface for a given email type from the `EmailContext` union. */
export type EmailContextFor<T extends EmailType> = Extract<EmailContext, { type: T }>;

/** Context fields for a given email type, without the `type` discriminator. Useful for typing callback data and template props. */
export type EmailProps<T extends EmailType> = Omit<EmailContextFor<T>, 'type'>;

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export interface EmailTemplateRenderer {
  render(context: EmailContext): Promise<RenderedEmail>;
}

export type SendEmailResult =
  | { success: true; skipped?: false; messageId?: string }
  | { success: true; skipped: true }
  | { success: false; error: Error };

export interface BetterEmailOptions {
  provider: EmailProvider;
  templateRenderer: EmailTemplateRenderer;
  defaultTags?: EmailTag[];
  tags?: Partial<Record<EmailType, EmailTag[]>>;
  onBeforeSend?: (context: EmailContext, message: EmailMessage) => Promise<boolean | void>;
  onAfterSend?: (context: EmailContext, message: EmailMessage) => Promise<void>;
  onSendError?: (context: EmailContext, message: EmailMessage, error: Error) => Promise<void>;
}

import type { EmailMessage, EmailProvider } from '../types';

export interface SMTPProviderOptions {
  /**
   * A nodemailer transporter instance.
   *
   * ```ts
   * import nodemailer from 'nodemailer';
   *
   * const transporter = nodemailer.createTransport({
   *   host: 'smtp.example.com',
   *   port: 587,
   *   auth: { user: 'user', pass: 'pass' },
   * });
   * ```
   */
  transporter: { sendMail(options: Record<string, unknown>): Promise<unknown> };

  /** Default sender address (e.g. `"Acme <noreply@acme.com>"`). */
  from: string;
}

/**
 * Sends emails via SMTP using a nodemailer transporter.
 *
 * Accepts a pre-configured transporter instance.
 * The provider handles message formatting internally.
 *
 * ```ts
 * import nodemailer from 'nodemailer';
 *
 * const provider = new SMTPProvider({
 *   transporter: nodemailer.createTransport({
 *     host: 'smtp.example.com',
 *     port: 587,
 *     auth: { user: 'user', pass: 'pass' },
 *   }),
 *   from: 'Acme <noreply@acme.com>',
 * });
 * ```
 */
export class SMTPProvider implements EmailProvider {
  private transporter: { sendMail(options: Record<string, unknown>): Promise<unknown> };
  private from: string;

  constructor(options: SMTPProviderOptions) {
    this.transporter = options.transporter;
    this.from = options.from;
  }

  async send(message: EmailMessage): Promise<{ messageId?: string }> {
    const result = await this.transporter.sendMail({
      from: this.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      headers: message.tags
        ? Object.fromEntries(message.tags.map((t) => [`X-Tag-${t.name}`, t.value]))
        : undefined,
    }) as Record<string, unknown> | undefined;
    return { messageId: typeof result?.messageId === 'string' ? result.messageId : undefined };
  }
}

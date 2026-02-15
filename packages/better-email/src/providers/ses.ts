import type { EmailMessage, EmailProvider } from '../types';

export interface SESProviderOptions {
  /**
   * An `SESv2Client` instance from `@aws-sdk/client-sesv2`.
   *
   * ```ts
   * import { SESv2Client } from '@aws-sdk/client-sesv2';
   * const client = new SESv2Client({ region: 'us-east-1' });
   * ```
   */
  client: { send(command: unknown): Promise<unknown> };

  /**
   * The `SendEmailCommand` class from `@aws-sdk/client-sesv2`.
   *
   * ```ts
   * import { SendEmailCommand } from '@aws-sdk/client-sesv2';
   * ```
   */
  SendEmailCommand: new (input: unknown) => unknown;

  /** Default sender address (e.g. `"Acme <noreply@acme.com>"`). */
  from: string;

  /** SES configuration set name for tracking. */
  configurationSetName?: string;
}

/**
 * Sends emails via AWS SES v2.
 *
 * Accepts an `SESv2Client` instance and the `SendEmailCommand` class.
 * The provider handles building the full SES payload internally.
 *
 * ```ts
 * import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
 *
 * const provider = new SESProvider({
 *   client: new SESv2Client({ region: 'us-east-1' }),
 *   SendEmailCommand,
 *   from: 'Acme <noreply@acme.com>',
 * });
 * ```
 */
export class SESProvider implements EmailProvider {
  private client: { send(command: unknown): Promise<unknown> };
  private SendEmailCommand: new (input: unknown) => unknown;
  private from: string;
  private configurationSetName: string | undefined;

  constructor(options: SESProviderOptions) {
    this.client = options.client;
    this.SendEmailCommand = options.SendEmailCommand;
    this.from = options.from;
    this.configurationSetName = options.configurationSetName;
  }

  async send(message: EmailMessage): Promise<{ messageId?: string }> {
    const input = {
      FromEmailAddress: this.from,
      Destination: { ToAddresses: [message.to] },
      Content: {
        Simple: {
          Subject: { Data: message.subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: message.html, Charset: 'UTF-8' },
            Text: { Data: message.text, Charset: 'UTF-8' },
          },
        },
      },
      ...(message.tags && {
        EmailTags: message.tags.map((t) => ({ Name: t.name, Value: t.value })),
      }),
      ...(this.configurationSetName && {
        ConfigurationSetName: this.configurationSetName,
      }),
    };

    const command = new this.SendEmailCommand(input);
    const result = await this.client.send(command) as Record<string, unknown> | undefined;
    return { messageId: typeof result?.MessageId === 'string' ? result.MessageId : undefined };
  }
}

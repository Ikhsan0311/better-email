import type { EmailMessage, EmailProvider } from '../types';

export interface PostmarkProviderOptions {
  /** Postmark server API token. */
  serverToken: string;
  /** Default sender address (e.g. `"Acme <noreply@acme.com>"`). */
  from: string;
  /** Postmark message stream ID (e.g. `"outbound"` or a custom transactional stream). */
  messageStream?: string;
  /** Override the Postmark API base URL. Defaults to `https://api.postmarkapp.com`. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to `30_000` (30 s). */
  timeout?: number;
}

/**
 * Sends emails via the Postmark REST API.
 *
 * ```ts
 * const provider = new PostmarkProvider({
 *   serverToken: process.env.POSTMARK_SERVER_TOKEN!,
 *   from: 'Acme <noreply@acme.com>',
 * });
 * ```
 */
export class PostmarkProvider implements EmailProvider {
  private serverToken: string;
  private from: string;
  private messageStream: string | undefined;
  private baseUrl: string;
  private timeout: number;

  constructor(options: PostmarkProviderOptions) {
    this.serverToken = options.serverToken;
    this.from = options.from;
    this.messageStream = options.messageStream;
    this.baseUrl = options.baseUrl ?? 'https://api.postmarkapp.com';
    this.timeout = options.timeout ?? 30_000;
  }

  async send(message: EmailMessage): Promise<{ messageId?: string }> {
    const body: Record<string, unknown> = {
      From: this.from,
      To: message.to,
      Subject: message.subject,
      HtmlBody: message.html,
      TextBody: message.text,
    };

    if (this.messageStream) {
      body.MessageStream = this.messageStream;
    }

    if (message.tags?.length) {
      body.Tag = message.tags[0].value;
      body.Headers = message.tags.map((t) => ({
        Name: `X-Tag-${t.name}`,
        Value: t.value,
      }));
    }

    const response = await fetch(`${this.baseUrl}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Postmark-Server-Token': this.serverToken,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      const responseBody = await response.text().catch(() => '');
      throw new Error(`Postmark API error (${response.status}): ${responseBody}`);
    }

    const data = await response.json().catch(() => ({})) as Record<string, unknown>;
    return { messageId: typeof data.MessageID === 'string' ? data.MessageID : undefined };
  }
}

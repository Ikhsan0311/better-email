import type { EmailMessage, EmailProvider } from '../types';

export interface ResendProviderOptions {
  /** Resend API key. */
  apiKey: string;
  /** Default sender address (e.g. `"Acme <noreply@acme.com>"`). */
  from: string;
  /** Override the Resend API base URL. Defaults to `https://api.resend.com`. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to `30_000` (30 s). */
  timeout?: number;
}

/**
 * Sends emails via the Resend REST API.
 *
 * ```ts
 * const provider = new ResendProvider({
 *   apiKey: process.env.RESEND_API_KEY!,
 *   from: 'Acme <noreply@acme.com>',
 * });
 * ```
 */
export class ResendProvider implements EmailProvider {
  private apiKey: string;
  private from: string;
  private baseUrl: string;
  private timeout: number;

  constructor(options: ResendProviderOptions) {
    this.apiKey = options.apiKey;
    this.from = options.from;
    this.baseUrl = options.baseUrl ?? 'https://api.resend.com';
    this.timeout = options.timeout ?? 30_000;
  }

  async send(message: EmailMessage): Promise<{ messageId?: string }> {
    const response = await fetch(`${this.baseUrl}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from: this.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        tags: message.tags?.map((t) => ({ name: t.name, value: t.value })),
      }),
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Resend API error (${response.status}): ${body}`);
    }

    const data = await response.json().catch(() => ({})) as Record<string, unknown>;
    return { messageId: typeof data.id === 'string' ? data.id : undefined };
  }
}

import type { EmailMessage, EmailProvider } from '../types';

export interface NuntlyProviderOptions {
  /** Nuntly API key. */
  apiKey: string;
  /** Default sender address (e.g. `"Acme <noreply@acme.com>"`). */
  from: string;
  /** Override the Nuntly API base URL. Defaults to `https://api.nuntly.com`. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to `30_000` (30 s). */
  timeout?: number;
}

/**
 * Sends emails via the Nuntly REST API.
 *
 * ```ts
 * const provider = new NuntlyProvider({
 *   apiKey: process.env.NUNTLY_API_KEY!,
 *   from: 'Acme <noreply@acme.com>',
 * });
 * ```
 */
export class NuntlyProvider implements EmailProvider {
  private apiKey: string;
  private from: string;
  private baseUrl: string;
  private timeout: number;

  constructor(options: NuntlyProviderOptions) {
    this.apiKey = options.apiKey;
    this.from = options.from;
    this.baseUrl = options.baseUrl ?? 'https://api.nuntly.com';
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
        tags: message.tags,
        headers: {
          'X-Entity-Ref-ID': crypto.randomUUID(),
        },
      }),
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Nuntly API error (${response.status}): ${body}`);
    }

    const data = await response.json().catch(() => ({})) as Record<string, unknown>;
    return { messageId: typeof data.id === 'string' ? data.id : undefined };
  }
}

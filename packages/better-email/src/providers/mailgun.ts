import type { EmailMessage, EmailProvider } from '../types';

export interface MailgunProviderOptions {
  /** Mailgun API key. */
  apiKey: string;
  /** Mailgun sending domain (e.g. `"mg.example.com"`). */
  domain: string;
  /** Default sender address (e.g. `"Acme <noreply@acme.com>"`). */
  from: string;
  /** Override the Mailgun API base URL. Defaults to `https://api.mailgun.net`. Use `https://api.eu.mailgun.net` for EU region. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to `30_000` (30 s). */
  timeout?: number;
}

/**
 * Sends emails via the Mailgun REST API.
 *
 * ```ts
 * const provider = new MailgunProvider({
 *   apiKey: process.env.MAILGUN_API_KEY!,
 *   domain: 'mg.example.com',
 *   from: 'Acme <noreply@acme.com>',
 * });
 * ```
 */
export class MailgunProvider implements EmailProvider {
  private apiKey: string;
  private domain: string;
  private from: string;
  private baseUrl: string;
  private timeout: number;

  constructor(options: MailgunProviderOptions) {
    this.apiKey = options.apiKey;
    this.domain = options.domain;
    this.from = options.from;
    this.baseUrl = options.baseUrl ?? 'https://api.mailgun.net';
    this.timeout = options.timeout ?? 30_000;
  }

  async send(message: EmailMessage): Promise<{ messageId?: string }> {
    const form = new FormData();
    form.append('from', this.from);
    form.append('to', message.to);
    form.append('subject', message.subject);
    form.append('html', message.html);
    form.append('text', message.text);

    if (message.tags) {
      for (const tag of message.tags) {
        form.append('o:tag', tag.value);
      }
    }

    const response = await fetch(`${this.baseUrl}/v3/${this.domain}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${this.apiKey}`)}`,
      },
      body: form,
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Mailgun API error (${response.status}): ${body}`);
    }

    const data = await response.json().catch(() => ({})) as Record<string, unknown>;
    return { messageId: typeof data.id === 'string' ? data.id : undefined };
  }
}

import type { EmailMessage, EmailProvider } from '../types';

/**
 * Logs emails to the console instead of sending them.
 * Useful for development and testing.
 *
 * ```ts
 * const provider = new ConsoleProvider();
 * ```
 */
export class ConsoleProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<void> {
    console.log('[ConsoleProvider] Sending email:', {
      to: message.to,
      subject: message.subject,
      tags: message.tags,
      htmlLength: message.html.length,
      textLength: message.text.length,
    });
  }
}

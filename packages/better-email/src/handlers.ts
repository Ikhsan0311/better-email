import type { BetterEmailOptions, EmailContext, EmailMessage, SendEmailResult } from './types';

function resolveRecipient(context: EmailContext): string {
  if ('user' in context && context.user?.email) return context.user.email;
  if ('email' in context && context.email) return context.email;
  throw new Error(`[better-email] Cannot resolve recipient from email type: ${context.type}`);
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

export async function sendEmail(options: BetterEmailOptions, context: EmailContext): Promise<SendEmailResult> {
  const { provider, templateRenderer, defaultTags, tags, onBeforeSend, onAfterSend, onSendError } = options;

  let message: EmailMessage | undefined;

  try {
    const rendered = await templateRenderer.render(context);

    const to = resolveRecipient(context);

    const mergedTags = [
      ...(defaultTags ?? []),
      ...(tags?.[context.type] ?? []),
      { name: 'type', value: context.type },
    ];

    message = {
      to,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      tags: mergedTags,
    };

    if (onBeforeSend) {
      const result = await onBeforeSend(context, message);
      if (result === false) {
        return { success: true, skipped: true };
      }
    }

    const sendResponse = await provider.send(message);

    try {
      if (onAfterSend) {
        await onAfterSend(context, message);
      }
    } catch {
      // onAfterSend failure is non-fatal: the email was already sent.
    }

    return { success: true, messageId: sendResponse?.messageId };
  } catch (error) {
    const emailError = toError(error);
    if (onSendError && message) {
      try {
        await onSendError(context, message, emailError);
      } catch {
        // onSendError failure is non-fatal.
      }
    }
    return { success: false, error: emailError };
  }
}

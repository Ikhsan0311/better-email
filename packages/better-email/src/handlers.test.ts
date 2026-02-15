import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendEmail } from './handlers';
import type { BetterEmailOptions, EmailContext, EmailMessage } from './types';

function makeContext(overrides?: Partial<EmailContext>): EmailContext {
  return {
    type: 'verification-email',
    user: { id: 'u1', name: 'Alice', email: 'alice@example.com', emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
    url: 'https://example.com/verify?token=abc',
    token: 'abc',
    ...overrides,
  } as EmailContext;
}

function makeOptions(overrides?: Partial<BetterEmailOptions>): BetterEmailOptions {
  return {
    provider: { send: vi.fn().mockResolvedValue({ messageId: 'msg-1' }) },
    templateRenderer: {
      render: vi.fn().mockResolvedValue({ subject: 'Subject', html: '<p>Hi</p>', text: 'Hi' }),
    },
    ...overrides,
  };
}

describe('sendEmail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('recipient resolution', () => {
    it('resolves recipient from user.email', async () => {
      const options = makeOptions();
      await sendEmail(options, makeContext());
      const sent = (options.provider.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as EmailMessage;
      expect(sent.to).toBe('alice@example.com');
    });

    it('resolves recipient from email field', async () => {
      const options = makeOptions();
      await sendEmail(options, {
        type: 'magic-link',
        email: 'bob@example.com',
        url: 'https://example.com/magic',
        token: 'tok',
      });
      const sent = (options.provider.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as EmailMessage;
      expect(sent.to).toBe('bob@example.com');
    });

    it('throws for context without email or user', async () => {
      const options = makeOptions();
      const ctx = { type: 'verification-email', url: 'https://example.com', token: 'x' } as unknown as EmailContext;
      const result = await sendEmail(options, ctx);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Cannot resolve recipient');
      }
    });
  });

  describe('tag merging', () => {
    it('merges defaultTags + perType + auto type tag', async () => {
      const options = makeOptions({
        defaultTags: [{ name: 'app', value: 'test' }],
        tags: { 'verification-email': [{ name: 'priority', value: 'high' }] },
      });
      await sendEmail(options, makeContext());
      const sent = (options.provider.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as EmailMessage;
      expect(sent.tags).toEqual([
        { name: 'app', value: 'test' },
        { name: 'priority', value: 'high' },
        { name: 'type', value: 'verification-email' },
      ]);
    });

    it('works with empty/undefined tags', async () => {
      const options = makeOptions();
      await sendEmail(options, makeContext());
      const sent = (options.provider.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as EmailMessage;
      expect(sent.tags).toEqual([{ name: 'type', value: 'verification-email' }]);
    });
  });

  describe('onBeforeSend', () => {
    it('skips sending when onBeforeSend returns false', async () => {
      const options = makeOptions({
        onBeforeSend: vi.fn().mockResolvedValue(false),
      });
      const result = await sendEmail(options, makeContext());
      expect(result).toEqual({ success: true, skipped: true });
      expect(options.provider.send).not.toHaveBeenCalled();
    });

    it('proceeds when onBeforeSend returns void', async () => {
      const options = makeOptions({
        onBeforeSend: vi.fn().mockResolvedValue(undefined),
      });
      const result = await sendEmail(options, makeContext());
      expect(result.success).toBe(true);
      expect(options.provider.send).toHaveBeenCalled();
    });
  });

  describe('provider errors', () => {
    it('returns error result when provider throws Error', async () => {
      const err = new Error('SMTP failed');
      const options = makeOptions({
        provider: { send: vi.fn().mockRejectedValue(err) },
      });
      const result = await sendEmail(options, makeContext());
      expect(result).toEqual({ success: false, error: err });
    });

    it('wraps non-Error via toError()', async () => {
      const options = makeOptions({
        provider: { send: vi.fn().mockRejectedValue('string error') },
      });
      const result = await sendEmail(options, makeContext());
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('string error');
      }
    });
  });

  describe('template render error', () => {
    it('returns error and does NOT call onSendError (message is undefined)', async () => {
      const renderErr = new Error('template broken');
      const onSendError = vi.fn();
      const options = makeOptions({
        templateRenderer: { render: vi.fn().mockRejectedValue(renderErr) },
        onSendError,
      });
      const result = await sendEmail(options, makeContext());
      expect(result).toEqual({ success: false, error: renderErr });
      expect(onSendError).not.toHaveBeenCalled();
    });
  });

  describe('onAfterSend', () => {
    it('called on success with context and message', async () => {
      const onAfterSend = vi.fn();
      const options = makeOptions({ onAfterSend });
      await sendEmail(options, makeContext());
      expect(onAfterSend).toHaveBeenCalledOnce();
      expect(onAfterSend.mock.calls[0][0]).toMatchObject({ type: 'verification-email' });
      expect(onAfterSend.mock.calls[0][1]).toMatchObject({ to: 'alice@example.com' });
    });

    it('is non-fatal when it throws', async () => {
      const onAfterSend = vi.fn().mockRejectedValue(new Error('log failed'));
      const options = makeOptions({ onAfterSend });
      const result = await sendEmail(options, makeContext());
      expect(result.success).toBe(true);
    });
  });

  describe('onSendError', () => {
    it('called on provider failure with context, message, and error', async () => {
      const providerErr = new Error('network');
      const onSendError = vi.fn();
      const options = makeOptions({
        provider: { send: vi.fn().mockRejectedValue(providerErr) },
        onSendError,
      });
      await sendEmail(options, makeContext());
      expect(onSendError).toHaveBeenCalledOnce();
      expect(onSendError.mock.calls[0][2]).toBe(providerErr);
    });

    it('is non-fatal when it throws', async () => {
      const options = makeOptions({
        provider: { send: vi.fn().mockRejectedValue(new Error('fail')) },
        onSendError: vi.fn().mockRejectedValue(new Error('handler fail')),
      });
      const result = await sendEmail(options, makeContext());
      expect(result.success).toBe(false);
    });
  });

  describe('messageId', () => {
    it('propagates messageId from provider', async () => {
      const options = makeOptions({
        provider: { send: vi.fn().mockResolvedValue({ messageId: 'mid-123' }) },
      });
      const result = await sendEmail(options, makeContext());
      expect(result).toEqual({ success: true, messageId: 'mid-123' });
    });

    it('returns undefined messageId when provider returns void', async () => {
      const options = makeOptions({
        provider: { send: vi.fn().mockResolvedValue(undefined) },
      });
      const result = await sendEmail(options, makeContext());
      expect(result).toEqual({ success: true, messageId: undefined });
    });
  });
});

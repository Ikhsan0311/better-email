import { describe, it, expect, vi } from 'vitest';
import { SMTPProvider } from './smtp';
import type { EmailMessage } from '../types';

describe('SMTPProvider', () => {
  it('calls sendMail with correct options', async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: 'smtp-123' });
    const provider = new SMTPProvider({ transporter: { sendMail }, from: 'Test <test@example.com>' });

    const message: EmailMessage = {
      to: 'alice@example.com',
      subject: 'Hello',
      html: '<p>Hello</p>',
      text: 'Hello',
      tags: [{ name: 'app', value: 'demo' }, { name: 'type', value: 'test' }],
    };

    await provider.send(message);

    expect(sendMail).toHaveBeenCalledWith({
      from: 'Test <test@example.com>',
      to: 'alice@example.com',
      subject: 'Hello',
      html: '<p>Hello</p>',
      text: 'Hello',
      headers: {
        'X-Tag-app': 'demo',
        'X-Tag-type': 'test',
      },
    });
  });

  it('maps tags to X-Tag-* headers', async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    const provider = new SMTPProvider({ transporter: { sendMail }, from: 'a@b.com' });

    await provider.send({
      to: 'bob@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
      tags: [{ name: 'priority', value: 'high' }],
    });

    const opts = sendMail.mock.calls[0][0];
    expect(opts.headers).toEqual({ 'X-Tag-priority': 'high' });
  });

  it('returns messageId from result', async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: '<abc@smtp.example.com>' });
    const provider = new SMTPProvider({ transporter: { sendMail }, from: 'a@b.com' });

    const result = await provider.send({
      to: 'bob@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
    });

    expect(result.messageId).toBe('<abc@smtp.example.com>');
  });

  it('omits headers when no tags', async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    const provider = new SMTPProvider({ transporter: { sendMail }, from: 'a@b.com' });

    await provider.send({
      to: 'bob@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
    });

    const opts = sendMail.mock.calls[0][0];
    expect(opts.headers).toBeUndefined();
  });
});

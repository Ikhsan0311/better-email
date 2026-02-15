import { describe, it, expect, vi } from 'vitest';
import { SESProvider } from './ses';
import type { EmailMessage } from '../types';

const message: EmailMessage = {
  to: 'alice@example.com',
  subject: 'Hello',
  html: '<p>Hello</p>',
  text: 'Hello',
  tags: [{ name: 'app', value: 'demo' }],
};

describe('SESProvider', () => {
  it('constructs SendEmailCommand with correct input', async () => {
    const mockSend = vi.fn().mockResolvedValue({ MessageId: 'ses-123' });
    const MockCommand = vi.fn();

    const provider = new SESProvider({
      client: { send: mockSend },
      SendEmailCommand: MockCommand,
      from: 'Test <test@example.com>',
    });

    await provider.send(message);

    expect(MockCommand).toHaveBeenCalledOnce();
    const input = MockCommand.mock.calls[0][0];
    expect(input.FromEmailAddress).toBe('Test <test@example.com>');
    expect(input.Destination.ToAddresses).toEqual(['alice@example.com']);
    expect(input.Content.Simple.Subject.Data).toBe('Hello');
    expect(input.Content.Simple.Body.Html.Data).toBe('<p>Hello</p>');
    expect(input.Content.Simple.Body.Text.Data).toBe('Hello');
    expect(input.EmailTags).toEqual([{ Name: 'app', Value: 'demo' }]);
  });

  it('extracts MessageId from response', async () => {
    const provider = new SESProvider({
      client: { send: vi.fn().mockResolvedValue({ MessageId: 'ses-abc' }) },
      SendEmailCommand: vi.fn(),
      from: 'a@b.com',
    });

    const result = await provider.send(message);
    expect(result.messageId).toBe('ses-abc');
  });

  it('includes ConfigurationSetName when configured', async () => {
    const MockCommand = vi.fn();
    const provider = new SESProvider({
      client: { send: vi.fn().mockResolvedValue({}) },
      SendEmailCommand: MockCommand,
      from: 'a@b.com',
      configurationSetName: 'my-config-set',
    });

    await provider.send(message);
    const input = MockCommand.mock.calls[0][0];
    expect(input.ConfigurationSetName).toBe('my-config-set');
  });

  it('omits EmailTags when tags is undefined', async () => {
    const MockCommand = vi.fn();
    const provider = new SESProvider({
      client: { send: vi.fn().mockResolvedValue({}) },
      SendEmailCommand: MockCommand,
      from: 'a@b.com',
    });

    await provider.send({ ...message, tags: undefined });
    const input = MockCommand.mock.calls[0][0];
    expect(input.EmailTags).toBeUndefined();
  });

  it('returns undefined messageId when response has no MessageId', async () => {
    const provider = new SESProvider({
      client: { send: vi.fn().mockResolvedValue({}) },
      SendEmailCommand: vi.fn(),
      from: 'a@b.com',
    });

    const result = await provider.send(message);
    expect(result.messageId).toBeUndefined();
  });
});

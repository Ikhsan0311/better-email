import { describe, it, expect, vi } from 'vitest';
import { ConsoleProvider } from './console';
import type { EmailMessage } from '../types';

describe('ConsoleProvider', () => {
  it('logs email details to console', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const provider = new ConsoleProvider();

    const message: EmailMessage = {
      to: 'alice@example.com',
      subject: 'Hello',
      html: '<p>Hello World</p>',
      text: 'Hello World',
      tags: [{ name: 'type', value: 'test' }],
    };

    await provider.send(message);

    expect(logSpy).toHaveBeenCalledWith('[ConsoleProvider] Sending email:', {
      to: 'alice@example.com',
      subject: 'Hello',
      tags: [{ name: 'type', value: 'test' }],
      htmlLength: 18,
      textLength: 11,
    });

    logSpy.mockRestore();
  });

  it('returns void', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const provider = new ConsoleProvider();
    const result = await provider.send({
      to: 'bob@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
    });
    expect(result).toBeUndefined();
    vi.restoreAllMocks();
  });
});

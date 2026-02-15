import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ResendProvider } from './resend';
import type { EmailMessage } from '../types';

const message: EmailMessage = {
  to: 'alice@example.com',
  subject: 'Hello',
  html: '<p>Hello</p>',
  text: 'Hello',
  tags: [{ name: 'app', value: 'demo' }, { name: 'type', value: 'test' }],
};

describe('ResendProvider', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends POST to /emails with Bearer auth and tag mapping', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 're_123' }),
    });

    const provider = new ResendProvider({ apiKey: 're_key', from: 'Test <test@example.com>' });
    await provider.send(message);

    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(opts.headers.Authorization).toBe('Bearer re_key');
    const body = JSON.parse(opts.body);
    expect(body.tags).toEqual([
      { name: 'app', value: 'demo' },
      { name: 'type', value: 'test' },
    ]);
  });

  it('returns messageId from response', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 're_abc' }),
    });

    const provider = new ResendProvider({ apiKey: 'key', from: 'a@b.com' });
    const result = await provider.send(message);
    expect(result.messageId).toBe('re_abc');
  });

  it('throws on non-ok response', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad request'),
    });

    const provider = new ResendProvider({ apiKey: 'key', from: 'a@b.com' });
    await expect(provider.send(message)).rejects.toThrow('Resend API error (400): Bad request');
  });

  it('handles undefined tags', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const provider = new ResendProvider({ apiKey: 'key', from: 'a@b.com' });
    await provider.send({ ...message, tags: undefined });
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.tags).toBeUndefined();
  });
});

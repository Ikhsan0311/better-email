import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NuntlyProvider } from './nuntly';
import type { EmailMessage } from '../types';

const message: EmailMessage = {
  to: 'alice@example.com',
  subject: 'Hello',
  html: '<p>Hello</p>',
  text: 'Hello',
  tags: [{ name: 'type', value: 'test' }],
};

describe('NuntlyProvider', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends POST to /emails with Bearer auth and correct body', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'msg-123' }),
    });

    const provider = new NuntlyProvider({ apiKey: 'ntly_key', from: 'Test <test@example.com>' });
    await provider.send(message);

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://api.nuntly.com/emails');
    expect(opts.method).toBe('POST');
    expect(opts.headers.Authorization).toBe('Bearer ntly_key');
    const body = JSON.parse(opts.body);
    expect(body.from).toBe('Test <test@example.com>');
    expect(body.to).toBe('alice@example.com');
    expect(body.subject).toBe('Hello');
    expect(body.html).toBe('<p>Hello</p>');
    expect(body.text).toBe('Hello');
    expect(body.tags).toEqual([{ name: 'type', value: 'test' }]);
    expect(body.headers['X-Entity-Ref-ID']).toBeDefined();
  });

  it('returns messageId from response id', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'nuntly-id-456' }),
    });

    const provider = new NuntlyProvider({ apiKey: 'key', from: 'a@b.com' });
    const result = await provider.send(message);
    expect(result.messageId).toBe('nuntly-id-456');
  });

  it('throws on non-ok response', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 422,
      text: () => Promise.resolve('Invalid payload'),
    });

    const provider = new NuntlyProvider({ apiKey: 'key', from: 'a@b.com' });
    await expect(provider.send(message)).rejects.toThrow('Nuntly API error (422): Invalid payload');
  });

  it('uses custom baseUrl', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const provider = new NuntlyProvider({ apiKey: 'key', from: 'a@b.com', baseUrl: 'https://custom.api.com' });
    await provider.send(message);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://custom.api.com/emails');
  });

  it('uses AbortSignal.timeout', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const provider = new NuntlyProvider({ apiKey: 'key', from: 'a@b.com', timeout: 5000 });
    await provider.send(message);
    const opts = fetchSpy.mock.calls[0][1];
    expect(opts.signal).toBeDefined();
  });
});

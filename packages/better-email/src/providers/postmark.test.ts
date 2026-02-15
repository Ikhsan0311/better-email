import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PostmarkProvider } from './postmark';
import type { EmailMessage } from '../types';

const message: EmailMessage = {
  to: 'alice@example.com',
  subject: 'Hello',
  html: '<p>Hello</p>',
  text: 'Hello',
  tags: [{ name: 'app', value: 'demo' }, { name: 'type', value: 'test' }],
};

describe('PostmarkProvider', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends POST with PascalCase fields and server token header', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ MessageID: 'pm-123' }),
    });

    const provider = new PostmarkProvider({ serverToken: 'pm-token', from: 'Test <test@example.com>' });
    await provider.send(message);

    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://api.postmarkapp.com/email');
    expect(opts.headers['X-Postmark-Server-Token']).toBe('pm-token');
    const body = JSON.parse(opts.body);
    expect(body.From).toBe('Test <test@example.com>');
    expect(body.To).toBe('alice@example.com');
    expect(body.Subject).toBe('Hello');
    expect(body.HtmlBody).toBe('<p>Hello</p>');
    expect(body.TextBody).toBe('Hello');
  });

  it('includes MessageStream when configured', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const provider = new PostmarkProvider({ serverToken: 'tok', from: 'a@b.com', messageStream: 'outbound' });
    await provider.send(message);
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.MessageStream).toBe('outbound');
  });

  it('maps tags to Tag + X-Tag-* headers', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const provider = new PostmarkProvider({ serverToken: 'tok', from: 'a@b.com' });
    await provider.send(message);
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.Tag).toBe('demo');
    expect(body.Headers).toEqual([
      { Name: 'X-Tag-app', Value: 'demo' },
      { Name: 'X-Tag-type', Value: 'test' },
    ]);
  });

  it('extracts MessageID from response', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ MessageID: 'pm-uuid' }),
    });

    const provider = new PostmarkProvider({ serverToken: 'tok', from: 'a@b.com' });
    const result = await provider.send(message);
    expect(result.messageId).toBe('pm-uuid');
  });

  it('throws on non-ok response', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Unauthorized'),
    });

    const provider = new PostmarkProvider({ serverToken: 'tok', from: 'a@b.com' });
    await expect(provider.send(message)).rejects.toThrow('Postmark API error (401): Unauthorized');
  });
});

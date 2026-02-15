import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MailgunProvider } from './mailgun';
import type { EmailMessage } from '../types';

const message: EmailMessage = {
  to: 'alice@example.com',
  subject: 'Hello',
  html: '<p>Hello</p>',
  text: 'Hello',
  tags: [{ name: 'app', value: 'demo' }, { name: 'type', value: 'test' }],
};

describe('MailgunProvider', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends FormData with Basic auth', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '<mg-123@mg.example.com>' }),
    });

    const provider = new MailgunProvider({ apiKey: 'mg-key', domain: 'mg.example.com', from: 'Test <test@example.com>' });
    await provider.send(message);

    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://api.mailgun.net/v3/mg.example.com/messages');
    expect(opts.headers.Authorization).toBe(`Basic ${btoa('api:mg-key')}`);
    expect(opts.body).toBeInstanceOf(FormData);
  });

  it('appends o:tag fields for tags', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const provider = new MailgunProvider({ apiKey: 'key', domain: 'mg.example.com', from: 'a@b.com' });
    await provider.send(message);

    const form = fetchSpy.mock.calls[0][1].body as FormData;
    const tagValues = form.getAll('o:tag');
    expect(tagValues).toEqual(['demo', 'test']);
  });

  it('uses EU baseUrl', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const provider = new MailgunProvider({
      apiKey: 'key',
      domain: 'mg.eu.example.com',
      from: 'a@b.com',
      baseUrl: 'https://api.eu.mailgun.net',
    });
    await provider.send(message);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://api.eu.mailgun.net/v3/mg.eu.example.com/messages');
  });

  it('throws on non-ok response', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 403,
      text: () => Promise.resolve('Forbidden'),
    });

    const provider = new MailgunProvider({ apiKey: 'key', domain: 'mg.example.com', from: 'a@b.com' });
    await expect(provider.send(message)).rejects.toThrow('Mailgun API error (403): Forbidden');
  });
});

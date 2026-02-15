import { describe, it, expect, vi } from 'vitest';
import { MustacheRenderer } from './mustache';
import type { EmailContext } from '../types';

const mockContext: EmailContext = {
  type: 'verification-email',
  user: { id: 'u1', name: 'Alice', email: 'alice@example.com', emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
  url: 'https://example.com/verify',
  token: 'tok',
};

describe('MustacheRenderer', () => {
  it('renders Mustache template to HTML', async () => {
    const templateFn = vi.fn().mockReturnValue({
      subject: 'Verify',
      template: '<p>Hello {{user.name}}, click {{url}}</p>',
      text: 'Verify your email',
    });
    const render = vi.fn().mockReturnValue('<p>Hello Alice, click https://example.com/verify</p>');

    const renderer = new MustacheRenderer({
      render,
      templates: { 'verification-email': templateFn },
    });

    const result = await renderer.render(mockContext);
    expect(templateFn).toHaveBeenCalledWith(mockContext);
    expect(render).toHaveBeenCalledWith('<p>Hello {{user.name}}, click {{url}}</p>', mockContext);
    expect(result).toEqual({
      subject: 'Verify',
      html: '<p>Hello Alice, click https://example.com/verify</p>',
      text: 'Verify your email',
    });
  });

  it('uses fallback when template is missing', async () => {
    const fallback = {
      render: vi.fn().mockResolvedValue({ subject: 'Fallback', html: '<p>fb</p>', text: 'fb' }),
    };
    const renderer = new MustacheRenderer({
      render: vi.fn(),
      templates: {},
      fallback,
    });

    const result = await renderer.render(mockContext);
    expect(fallback.render).toHaveBeenCalledWith(mockContext);
    expect(result.subject).toBe('Fallback');
  });

  it('throws when template missing and no fallback', async () => {
    const renderer = new MustacheRenderer({
      render: vi.fn(),
      templates: {},
    });

    await expect(renderer.render(mockContext)).rejects.toThrow('[MustacheRenderer] No template found for email type: verification-email');
  });

  it('passes different email types to their specific templates', async () => {
    const magicLinkCtx: EmailContext = {
      type: 'magic-link',
      email: 'bob@example.com',
      url: 'https://example.com/magic',
      token: 'tok',
    };
    const templateFn = vi.fn().mockReturnValue({
      subject: 'Magic Link',
      template: '<p>{{email}}</p>',
      text: 'Click here',
    });

    const renderer = new MustacheRenderer({
      render: vi.fn().mockReturnValue('<p>bob@example.com</p>'),
      templates: { 'magic-link': templateFn },
    });

    await renderer.render(magicLinkCtx);
    expect(templateFn).toHaveBeenCalledWith(magicLinkCtx);
  });
});

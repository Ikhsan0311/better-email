import { describe, it, expect, vi } from 'vitest';
import { MJMLRenderer } from './mjml';
import type { EmailContext } from '../types';

const mockContext: EmailContext = {
  type: 'verification-email',
  user: { id: 'u1', name: 'Alice', email: 'alice@example.com', emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
  url: 'https://example.com/verify',
  token: 'tok',
};

describe('MJMLRenderer', () => {
  it('compiles MJML template to HTML', async () => {
    const templateFn = vi.fn().mockReturnValue({
      subject: 'Verify',
      mjml: '<mjml><mj-body></mj-body></mjml>',
      text: 'Verify your email',
    });
    const compile = vi.fn().mockReturnValue('<html>compiled</html>');

    const renderer = new MJMLRenderer({
      compile,
      templates: { 'verification-email': templateFn },
    });

    const result = await renderer.render(mockContext);
    expect(templateFn).toHaveBeenCalledWith(mockContext);
    expect(compile).toHaveBeenCalledWith('<mjml><mj-body></mj-body></mjml>');
    expect(result).toEqual({
      subject: 'Verify',
      html: '<html>compiled</html>',
      text: 'Verify your email',
    });
  });

  it('uses fallback when template is missing', async () => {
    const fallback = {
      render: vi.fn().mockResolvedValue({ subject: 'Fallback', html: '<p>fb</p>', text: 'fb' }),
    };
    const renderer = new MJMLRenderer({
      compile: vi.fn(),
      templates: {},
      fallback,
    });

    const result = await renderer.render(mockContext);
    expect(fallback.render).toHaveBeenCalledWith(mockContext);
    expect(result.subject).toBe('Fallback');
  });

  it('throws when template missing and no fallback', async () => {
    const renderer = new MJMLRenderer({
      compile: vi.fn(),
      templates: {},
    });

    await expect(renderer.render(mockContext)).rejects.toThrow('[MJMLRenderer] No template found for email type: verification-email');
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
      mjml: '<mjml></mjml>',
      text: 'Click here',
    });

    const renderer = new MJMLRenderer({
      compile: vi.fn().mockReturnValue('<html/>'),
      templates: { 'magic-link': templateFn },
    });

    await renderer.render(magicLinkCtx);
    expect(templateFn).toHaveBeenCalledWith(magicLinkCtx);
  });
});

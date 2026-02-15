import { describe, it, expect, vi } from 'vitest';
import { ReactEmailRenderer } from './react-email';
import type { EmailContext } from '../types';

const mockContext: EmailContext = {
  type: 'verification-email',
  user: { id: 'u1', name: 'Alice', email: 'alice@example.com', emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
  url: 'https://example.com/verify',
  token: 'tok',
};

describe('ReactEmailRenderer', () => {
  it('renders template with createElement + render', async () => {
    const MockComponent = vi.fn();
    const element = { type: 'mock-element' };
    const createElement = vi.fn().mockReturnValue(element);
    const render = vi.fn().mockImplementation((_el: any, opts?: { plainText?: boolean }) =>
      Promise.resolve(opts?.plainText ? 'plain text' : '<html>rendered</html>'),
    );

    const renderer = new ReactEmailRenderer({
      render,
      createElement,
      templates: { 'verification-email': MockComponent },
      subjects: { 'verification-email': 'Verify' },
    });

    const result = await renderer.render(mockContext);
    expect(createElement).toHaveBeenCalledWith(MockComponent, mockContext);
    expect(render).toHaveBeenCalledTimes(2);
    expect(result.subject).toBe('Verify');
    expect(result.html).toBe('<html>rendered</html>');
    expect(result.text).toBe('plain text');
  });

  it('uses fallback when template is missing', async () => {
    const fallback = {
      render: vi.fn().mockResolvedValue({ subject: 'Fallback', html: '<p>fb</p>', text: 'fb' }),
    };
    const renderer = new ReactEmailRenderer({
      render: vi.fn(),
      createElement: vi.fn(),
      templates: {},
      subjects: {},
      fallback,
    });

    const result = await renderer.render(mockContext);
    expect(fallback.render).toHaveBeenCalledWith(mockContext);
    expect(result.subject).toBe('Fallback');
  });

  it('throws when template missing and no fallback', async () => {
    const renderer = new ReactEmailRenderer({
      render: vi.fn(),
      createElement: vi.fn(),
      templates: {},
      subjects: {},
    });

    await expect(renderer.render(mockContext)).rejects.toThrow('[ReactEmailRenderer] No template found for email type: verification-email');
  });

  it('resolves dynamic function subject', async () => {
    const MockComponent = vi.fn();
    const renderer = new ReactEmailRenderer({
      render: vi.fn().mockResolvedValue('html'),
      createElement: vi.fn().mockReturnValue({}),
      templates: { 'verification-email': MockComponent },
      subjects: { 'verification-email': (ctx: any) => `Hello ${ctx.user.name}` },
    });

    const result = await renderer.render(mockContext);
    expect(result.subject).toBe('Hello Alice');
  });
});

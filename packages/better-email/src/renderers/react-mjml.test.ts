import { describe, it, expect, vi } from 'vitest';
import { ReactMJMLRenderer } from './react-mjml';
import type { EmailContext } from '../types';

const mockContext: EmailContext = {
  type: 'verification-email',
  user: { id: 'u1', name: 'Alice', email: 'alice@example.com', emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
  url: 'https://example.com/verify',
  token: 'tok',
};

describe('ReactMJMLRenderer', () => {
  it('renders component and extracts html, strips for text', async () => {
    const MockComponent = vi.fn();
    const element = { type: 'mock' };
    const createElement = vi.fn().mockReturnValue(element);
    const render = vi.fn().mockReturnValue({ html: '<html><body><p>Hello World</p></body></html>', errors: [] });

    const renderer = new ReactMJMLRenderer({
      render,
      createElement,
      templates: { 'verification-email': MockComponent },
      subjects: { 'verification-email': 'Verify' },
    });

    const result = await renderer.render(mockContext);
    expect(createElement).toHaveBeenCalledWith(MockComponent, mockContext);
    expect(render).toHaveBeenCalledWith(element);
    expect(result.subject).toBe('Verify');
    expect(result.html).toBe('<html><body><p>Hello World</p></body></html>');
    expect(result.text).toBe('Hello World');
  });

  it('uses fallback when template is missing', async () => {
    const fallback = {
      render: vi.fn().mockResolvedValue({ subject: 'Fallback', html: '<p>fb</p>', text: 'fb' }),
    };
    const renderer = new ReactMJMLRenderer({
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
    const renderer = new ReactMJMLRenderer({
      render: vi.fn(),
      createElement: vi.fn(),
      templates: {},
      subjects: {},
    });

    await expect(renderer.render(mockContext)).rejects.toThrow('[ReactMJMLRenderer] No template found for email type: verification-email');
  });

  it('strips style tags and HTML from text output', async () => {
    const MockComponent = vi.fn();
    const renderer = new ReactMJMLRenderer({
      render: vi.fn().mockReturnValue({
        html: '<html><head><style>.cls{color:red}</style></head><body><p>Content here</p></body></html>',
        errors: [],
      }),
      createElement: vi.fn().mockReturnValue({}),
      templates: { 'verification-email': MockComponent },
      subjects: { 'verification-email': 'Test' },
    });

    const result = await renderer.render(mockContext);
    expect(result.text).not.toContain('<style>');
    expect(result.text).not.toContain('.cls');
    expect(result.text).toContain('Content here');
  });
});

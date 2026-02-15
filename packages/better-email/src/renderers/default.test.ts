import { describe, it, expect } from 'vitest';
import { DefaultTemplateRenderer } from './default';
import type { EmailContext } from '../types';

const renderer = new DefaultTemplateRenderer();

const mockUser = { id: 'u1', name: 'Alice', email: 'alice@example.com', emailVerified: false, createdAt: new Date(), updatedAt: new Date() };

describe('DefaultTemplateRenderer', () => {
  it('renders verification-email', async () => {
    const result = await renderer.render({ type: 'verification-email', user: mockUser, url: 'https://example.com/verify', token: 'tok' });
    expect(result.subject).toBe('Verify your email');
    expect(result.html).toContain('verify your email');
    expect(result.html).toContain('https://example.com/verify');
    expect(result.text).toContain('https://example.com/verify');
  });

  it('renders reset-password', async () => {
    const result = await renderer.render({ type: 'reset-password', user: mockUser, url: 'https://example.com/reset', token: 'tok' });
    expect(result.subject).toBe('Reset your password');
    expect(result.html).toContain('reset your password');
    expect(result.text).toContain('https://example.com/reset');
  });

  it('renders change-email-verification', async () => {
    const result = await renderer.render({ type: 'change-email-verification', user: mockUser, newEmail: 'new@example.com', url: 'https://example.com/change', token: 'tok' });
    expect(result.subject).toBe('Confirm your email change');
    expect(result.html).toContain('new@example.com');
    expect(result.text).toContain('new@example.com');
  });

  it('renders delete-account-verification', async () => {
    const result = await renderer.render({ type: 'delete-account-verification', user: mockUser, url: 'https://example.com/delete', token: 'tok' });
    expect(result.subject).toBe('Confirm account deletion');
    expect(result.html).toContain('deleting your account');
  });

  it('renders magic-link', async () => {
    const result = await renderer.render({ type: 'magic-link', email: 'alice@example.com', url: 'https://example.com/magic', token: 'tok' });
    expect(result.subject).toBe('Your sign-in link');
    expect(result.html).toContain('sign in');
  });

  it('renders verification-otp', async () => {
    const result = await renderer.render({ type: 'verification-otp', email: 'alice@example.com', otp: '123456', otpType: 'sign-in' });
    expect(result.subject).toBe('Your verification code');
    expect(result.html).toContain('123456');
    expect(result.text).toContain('123456');
  });

  it('renders organization-invitation', async () => {
    const result = await renderer.render({
      type: 'organization-invitation',
      id: 'inv-1',
      role: 'member',
      email: 'bob@example.com',
      organization: { id: 'org-1', name: 'Acme Inc', createdAt: new Date() },
      invitation: { id: 'inv-1', email: 'bob@example.com', status: 'pending', organizationId: 'org-1', role: 'member', inviterId: 'u1', expiresAt: new Date() },
      inviter: { id: 'm1', organizationId: 'org-1', userId: 'u1', role: 'admin', createdAt: new Date(), user: mockUser },
    });
    expect(result.subject).toContain('Acme Inc');
    expect(result.html).toContain('Acme Inc');
  });

  it('renders two-factor-otp', async () => {
    const result = await renderer.render({ type: 'two-factor-otp', user: mockUser, otp: '654321' });
    expect(result.subject).toBe('Your two-factor authentication code');
    expect(result.html).toContain('654321');
    expect(result.text).toContain('654321');
  });

  it('escapes HTML in url (XSS prevention)', async () => {
    const result = await renderer.render({
      type: 'verification-email',
      user: mockUser,
      url: 'https://example.com/<script>alert("xss")</script>',
      token: 'tok',
    });
    expect(result.html).toContain('&lt;script&gt;');
    expect(result.html).not.toContain('<script>');
  });

  it('escapes HTML in organization name', async () => {
    const result = await renderer.render({
      type: 'organization-invitation',
      id: 'inv-1',
      role: 'member',
      email: 'bob@example.com',
      organization: { id: 'org-1', name: '<img onerror=alert(1)>', createdAt: new Date() },
      invitation: { id: 'inv-1', email: 'bob@example.com', status: 'pending', organizationId: 'org-1', role: 'member', inviterId: 'u1', expiresAt: new Date() },
      inviter: { id: 'm1', organizationId: 'org-1', userId: 'u1', role: 'admin', createdAt: new Date(), user: mockUser },
    });
    expect(result.html).toContain('&lt;img onerror=alert(1)&gt;');
    expect(result.html).not.toContain('<img onerror');
  });

  it('throws for unknown email type', async () => {
    const ctx = { type: 'unknown-type' } as unknown as EmailContext;
    await expect(renderer.render(ctx)).rejects.toThrow('Unknown email type');
  });
});

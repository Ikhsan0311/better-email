import { describe, it, expect, vi, beforeEach } from 'vitest';
import { betterEmail } from './index';
import type { BetterEmailOptions } from './types';

vi.mock('./handlers', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

import { sendEmail } from './handlers';

const mockSendEmail = sendEmail as ReturnType<typeof vi.fn>;

function makeOptions(): BetterEmailOptions {
  return {
    provider: { send: vi.fn() },
    templateRenderer: { render: vi.fn() },
  };
}

describe('betterEmail', () => {
  beforeEach(() => {
    mockSendEmail.mockClear();
  });

  it('returns object with id, helpers, and init', () => {
    const result = betterEmail(makeOptions());
    expect(result.id).toBe('better-email');
    expect(result.helpers).toBeDefined();
    expect(result.helpers.changeEmail).toBeTypeOf('function');
    expect(result.helpers.deleteAccount).toBeTypeOf('function');
    expect(result.helpers.magicLink).toBeTypeOf('function');
    expect(result.helpers.otp).toBeTypeOf('function');
    expect(result.helpers.invitation).toBeTypeOf('function');
    expect(result.helpers.twoFactor).toBeTypeOf('function');
    expect(result.init).toBeTypeOf('function');
  });

  it('changeEmail helper calls sendEmail with correct type', async () => {
    const plugin = betterEmail(makeOptions());
    await plugin.helpers.changeEmail({ user: { id: 'u1' } as any, newEmail: 'new@test.com', url: 'https://x.com', token: 't' });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'change-email-verification', newEmail: 'new@test.com' }),
    );
  });

  it('deleteAccount helper calls sendEmail with correct type', async () => {
    const plugin = betterEmail(makeOptions());
    await plugin.helpers.deleteAccount({ user: { id: 'u1' } as any, url: 'https://x.com', token: 't' });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'delete-account-verification' }),
    );
  });

  it('magicLink helper calls sendEmail with correct type', async () => {
    const plugin = betterEmail(makeOptions());
    await plugin.helpers.magicLink({ email: 'a@b.com', url: 'https://x.com', token: 't' });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'magic-link', email: 'a@b.com' }),
    );
  });

  it('otp helper remaps data.type to context.otpType', async () => {
    const plugin = betterEmail(makeOptions());
    await plugin.helpers.otp({ email: 'a@b.com', otp: '123456', type: 'sign-in' });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'verification-otp', otpType: 'sign-in', otp: '123456' }),
    );
  });

  it('invitation helper calls sendEmail with correct type', async () => {
    const plugin = betterEmail(makeOptions());
    await plugin.helpers.invitation({
      id: 'inv-1',
      role: 'member',
      email: 'bob@test.com',
      organization: { id: 'org-1', name: 'Acme', createdAt: new Date() },
      invitation: { id: 'inv-1', email: 'bob@test.com', status: 'pending', organizationId: 'org-1', role: 'member', inviterId: 'u1', expiresAt: new Date() },
      inviter: { id: 'm1', organizationId: 'org-1', userId: 'u1', role: 'admin', createdAt: new Date(), user: { id: 'u1' } as any },
    });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'organization-invitation', email: 'bob@test.com' }),
    );
  });

  it('twoFactor helper calls sendEmail with correct type', async () => {
    const plugin = betterEmail(makeOptions());
    await plugin.helpers.twoFactor({ user: { id: 'u1' } as any, otp: '654321' });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'two-factor-otp', otp: '654321' }),
    );
  });

  it('init returns emailVerification and emailAndPassword options', () => {
    const plugin = betterEmail(makeOptions());
    const initResult = plugin.init();
    expect(initResult.options.emailVerification.sendVerificationEmail).toBeTypeOf('function');
    expect(initResult.options.emailAndPassword.enabled).toBe(true);
    expect(initResult.options.emailAndPassword.sendResetPassword).toBeTypeOf('function');
  });

  it('init sendVerificationEmail calls sendEmail with verification-email type', async () => {
    const plugin = betterEmail(makeOptions());
    const initResult = plugin.init();
    await initResult.options.emailVerification.sendVerificationEmail({
      user: { id: 'u1' } as any,
      url: 'https://x.com',
      token: 't',
    });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'verification-email' }),
    );
  });

  it('init sendResetPassword calls sendEmail with reset-password type', async () => {
    const plugin = betterEmail(makeOptions());
    const initResult = plugin.init();
    await initResult.options.emailAndPassword.sendResetPassword({
      user: { id: 'u1' } as any,
      url: 'https://x.com',
      token: 't',
    });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'reset-password' }),
    );
  });
});

import { describe, it, expect } from 'vitest';
import { resolveSubject } from './resolve-subject';
import type { EmailContext } from '../types';

const mockContext: EmailContext = {
  type: 'verification-email',
  user: { id: 'u1', name: 'Alice', email: 'alice@example.com', emailVerified: false, createdAt: new Date(), updatedAt: new Date() },
  url: 'https://example.com/verify',
  token: 'tok',
};

describe('resolveSubject', () => {
  it('returns string subject directly', () => {
    const result = resolveSubject('TestRenderer', { 'verification-email': 'Verify it' }, mockContext);
    expect(result).toBe('Verify it');
  });

  it('calls function subject with context', () => {
    const fn = (ctx: any) => `Verify ${ctx.user.name}`;
    const result = resolveSubject('TestRenderer', { 'verification-email': fn }, mockContext);
    expect(result).toBe('Verify Alice');
  });

  it('throws when subject is missing for the email type', () => {
    expect(() => resolveSubject('TestRenderer', {}, mockContext)).toThrow('[TestRenderer] No subject found for email type: verification-email');
  });

  it('includes renderer name in error message', () => {
    expect(() => resolveSubject('MyCustomRenderer', {}, mockContext)).toThrow('[MyCustomRenderer]');
  });
});

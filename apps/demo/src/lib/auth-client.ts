import { createAuthClient } from 'better-auth/react';
import { organizationClient, magicLinkClient, emailOTPClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3100',
  plugins: [organizationClient(), magicLinkClient(), emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession, useActiveOrganization, emailOtp } = authClient;

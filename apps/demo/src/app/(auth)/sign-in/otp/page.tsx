'use client';

import { useState, useTransition } from 'react';
import { emailOtp } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NAVIGATION_LINKS = (
  <div className="flex flex-col gap-1 text-center text-sm text-muted-foreground">
    <Link href="/" className="inline-flex items-center justify-center gap-1 text-primary underline-offset-4 hover:underline">
      <Home className="h-3 w-3" />
      Back to home
    </Link>
    <Link href="/sign-in" className="inline-flex items-center justify-center gap-1 text-primary underline-offset-4 hover:underline">
      <ArrowLeft className="h-3 w-3" />
      Back to sign in
    </Link>
  </div>
);

export default function EmailOTPPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await emailOtp.sendVerificationOtp({ email, type: 'sign-in' });
        if (result.error) {
          toast.error(result.error.message ?? 'Failed to send verification code');
        } else {
          toast.success('Verification code sent! Check your email.');
          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        }
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in with email code</CardTitle>
        <CardDescription>Enter your email to receive a verification code</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="otp-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="otp-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Sending...' : 'Send verification code'}
        </Button>
        {NAVIGATION_LINKS}
      </CardFooter>
    </Card>
  );
}

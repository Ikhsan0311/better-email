'use client';

import { useState, useTransition, Suspense } from 'react';
import { signIn, emailOtp } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NAVIGATION_LINKS = (
  <>
    <Link href="/" className="inline-flex items-center justify-center gap-1 text-primary underline-offset-4 hover:underline">
      <Home className="h-3 w-3" />
      Back to home
    </Link>
    <Link href="/sign-in/otp" className="inline-flex items-center justify-center gap-1 text-primary underline-offset-4 hover:underline">
      <ArrowLeft className="h-3 w-3" />
      Back
    </Link>
  </>
);

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState('');
  const [isVerifying, startVerifyTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startVerifyTransition(async () => {
      try {
        const result = await signIn.emailOtp({ email, otp });
        if (result.error) {
          toast.error(result.error.message ?? 'Invalid verification code');
        } else {
          toast.success('Signed in successfully!');
          router.push('/dashboard');
        }
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  }

  async function handleResend() {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    startResendTransition(async () => {
      try {
        const result = await emailOtp.sendVerificationOtp({ email, type: 'sign-in' });
        if (result.error) {
          toast.error(result.error.message ?? 'Failed to resend code');
        } else {
          toast.success('New verification code sent!');
          setOtp('');
        }
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {email || 'your email'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="verify-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              pattern="\d{6}"
              required
              autoFocus
              className="text-center text-2xl tracking-widest"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="verify-form"
          className="w-full"
          disabled={isVerifying || otp.length !== 6}
        >
          {isVerifying ? 'Verifying...' : 'Verify code'}
        </Button>
        <div className="flex flex-col gap-2 text-center text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {isResending ? 'Sending...' : "Didn't receive a code? Resend"}
          </button>
          {NAVIGATION_LINKS}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Mail, Home } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const SUCCESS_LINKS = (
  <>
    <Link href="/" className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline">
      <Home className="h-3 w-3" />
      Back to home
    </Link>
    <Link href="/sign-in" className="text-sm text-primary underline-offset-4 hover:underline">
      Back to sign in
    </Link>
  </>
);

const FOOTER_LINKS = (
  <div className="space-y-1 text-center text-sm text-muted-foreground">
    <p>
      <Link href="/" className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
        <Home className="h-3 w-3" />
        Back to home
      </Link>
    </p>
    <p>
      <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
        Back to sign in
      </Link>
    </p>
  </div>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await authClient.requestPasswordReset({ email, redirectTo: '/sign-in' });
        setSent(true);
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  }

  if (sent) {
    return (
      <Card>
        <CardHeader className="items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>If an account exists for {email}, we sent a password reset link.</CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2 text-center">
          {SUCCESS_LINKS}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>Enter your email to receive a reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="forgot-password-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" form="forgot-password-form" className="w-full" disabled={isPending}>
          {isPending ? 'Sending...' : 'Send reset link'}
        </Button>
        {FOOTER_LINKS}
      </CardFooter>
    </Card>
  );
}

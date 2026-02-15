'use client';

import { useState, useTransition } from 'react';
import { signIn } from '@/lib/auth-client';
import Link from 'next/link';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Home } from 'lucide-react';

const NAVIGATION_LINKS = (
  <div className="flex flex-col gap-1 text-center text-sm text-muted-foreground">
    <Link href="/" className="inline-flex items-center justify-center gap-1 hover:text-foreground">
      <Home className="h-3 w-3" />
      Back to home
    </Link>
    <Link href="/sign-in" className="inline-flex items-center justify-center gap-1 hover:text-foreground">
      <ArrowLeft className="h-3 w-3" />
      Back to sign in
    </Link>
  </div>
);

const FOOTER_NAVIGATION_LINKS = (
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

export default function MagicLinkPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await signIn.magicLink({ email, callbackURL: '/dashboard' });
        if (result.error) {
          toast.error(result.error.message ?? 'Failed to send magic link');
        } else {
          setSent(true);
          toast.success('Magic link sent! Check your email.');
        }
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  }

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We sent a magic link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Click the link in the email to sign in to your account. The link will expire in 5 minutes.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setSent(false)}
          >
            Send another link
          </Button>
          {NAVIGATION_LINKS}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in with magic link</CardTitle>
        <CardDescription>Enter your email to receive a magic link</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="magic-link-form" onSubmit={handleSubmit} className="space-y-4">
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
          form="magic-link-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Sending...' : 'Send magic link'}
        </Button>
        {FOOTER_NAVIGATION_LINKS}
      </CardFooter>
    </Card>
  );
}

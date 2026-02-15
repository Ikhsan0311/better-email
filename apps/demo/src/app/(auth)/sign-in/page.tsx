'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { signIn } from '@/lib/auth-client';
import { KeyRound, Mail, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const ENABLE_MAGIC_LINK = process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK === 'true';
const ENABLE_EMAIL_OTP = process.env.NEXT_PUBLIC_ENABLE_EMAIL_OTP === 'true';

const ALTERNATIVE_SIGN_IN_OPTIONS = (
  <>
    <div className="my-6">
      <Separator className="my-4" />
      <p className="text-center text-sm text-muted-foreground">Or continue with</p>
    </div>
    <div className="flex flex-col gap-2">
      {ENABLE_MAGIC_LINK && (
        <Link href="/sign-in/magic-link">
          <Button variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Magic link
          </Button>
        </Link>
      )}
      {ENABLE_EMAIL_OTP && (
        <Link href="/sign-in/otp">
          <Button variant="outline" className="w-full">
            <KeyRound className="mr-2 h-4 w-4" />
            Email code
          </Button>
        </Link>
      )}
    </div>
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
      No account?{' '}
      <Link href="/sign-up" className="text-primary underline-offset-4 hover:underline">
        Sign up
      </Link>
    </p>
    <p>
      <Link href="/forgot-password" className="text-primary underline-offset-4 hover:underline">
        Forgot password?
      </Link>
    </p>
  </div>
);

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await signIn.email({ email, password });
        if (result.error) {
          toast.error(result.error.message ?? 'Sign in failed');
        } else {
          router.push('/dashboard');
        }
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-in-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </form>
        {(ENABLE_MAGIC_LINK || ENABLE_EMAIL_OTP) && ALTERNATIVE_SIGN_IN_OPTIONS}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" form="sign-in-form" className="w-full" disabled={isPending}>
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
        {FOOTER_LINKS}
      </CardFooter>
    </Card>
  );
}

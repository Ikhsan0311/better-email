'use client';

import { useState, useTransition } from 'react';
import { signUp } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const FOOTER_LINKS = (
  <div className="space-y-1 text-center text-sm text-muted-foreground">
    <p>
      <Link href="/" className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
        <Home className="h-3 w-3" />
        Back to home
      </Link>
    </p>
    <p>
      Already have an account?{' '}
      <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
        Sign in
      </Link>
    </p>
  </div>
);

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await signUp.email({ name, email, password });
        if (result.error) {
          toast.error(result.error.message ?? 'Sign up failed');
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
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-up-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="sign-up-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Creating account...' : 'Sign up'}
        </Button>
        {FOOTER_LINKS}
      </CardFooter>
    </Card>
  );
}

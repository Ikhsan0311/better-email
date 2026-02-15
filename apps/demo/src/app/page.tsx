import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, KeySquare, Lock, Mail, UserPlus } from 'lucide-react';
import Link from 'next/link';

const ENABLE_MAGIC_LINK = process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK === 'true';
const ENABLE_EMAIL_OTP = process.env.NEXT_PUBLIC_ENABLE_EMAIL_OTP === 'true';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Better Email Showcase</h1>
          <p className="text-sm text-muted-foreground">Multiple authentication flows with email templates</p>
        </div>

        <div className="mb-4 text-center">
          <h2 className="mb-1 text-lg font-semibold">Choose your authentication method</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {/* Classic Email/Password */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">Email & Password</CardTitle>
              <CardDescription className="text-xs">Traditional authentication</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/sign-in" className={buttonVariants({ size: 'sm', className: 'w-full' })}>
                Sign in
              </Link>
            </CardContent>
          </Card>

          {/* Magic Link */}
          {ENABLE_MAGIC_LINK && (
            <Card className="transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">Magic Link</CardTitle>
                <CardDescription className="text-xs">Passwordless via email</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href="/sign-in/magic-link" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}>
                  Get link
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Email OTP */}
          {ENABLE_EMAIL_OTP && (
            <Card className="transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <KeyRound className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">Email Code</CardTitle>
                <CardDescription className="text-xs">One-time verification code</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href="/sign-in/otp" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}>
                  Get code
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Forgot Password */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <KeySquare className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">Forgot Password</CardTitle>
              <CardDescription className="text-xs">Reset via email link</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/forgot-password" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}>
                Reset
              </Link>
            </CardContent>
          </Card>

          {/* Sign Up */}
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <UserPlus className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">Create Account</CardTitle>
              <CardDescription className="text-xs">Sign up with verification</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/sign-up" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}>
                Sign up
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>All flows use Better Email with customizable templates</p>
        </div>
      </div>
    </div>
  );
}

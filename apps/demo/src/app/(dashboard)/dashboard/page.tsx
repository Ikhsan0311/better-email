'use client';

import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, KeyRound, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) return null;

  const emailFlows = [
    { label: 'Email verification', description: 'On sign up', always: true },
    { label: 'Password reset', description: 'Forgot password page', always: true },
    { label: 'Organization invitation', description: 'Organization page', always: true },
    { label: 'Two-factor OTP', description: 'If 2FA enabled', always: false },
    { label: 'Change email verification', description: 'User settings', always: false },
    { label: 'Delete account verification', description: 'User settings', always: false },
    { label: 'Magic link', description: 'If ENABLE_MAGIC_LINK=true', always: false },
    { label: 'Email OTP', description: 'If ENABLE_EMAIL_OTP=true', always: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your account overview and available email flows.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>User info</CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm">{session.user.name}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{session.user.email}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Email verified</dt>
                <dd>
                  {session.user.emailVerified ? (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Not verified
                    </Badge>
                  )}
                </dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">User ID</dt>
                <dd className="font-mono text-xs text-muted-foreground">{session.user.id}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>Session</CardTitle>
              <CardDescription>Current session details</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Session ID</dt>
                <dd className="font-mono text-xs text-muted-foreground">{session.session.id}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Expires</dt>
                <dd className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {new Date(session.session.expiresAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Email flows available</CardTitle>
            <CardDescription>
              All email flows handled by Better Email in this demo
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {emailFlows.map((flow) => (
              <div
                key={flow.label}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{flow.label}</p>
                  <p className="text-xs text-muted-foreground">{flow.description}</p>
                </div>
                {flow.always ? (
                  <Badge variant="secondary">Active</Badge>
                ) : (
                  <Badge variant="outline">Optional</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

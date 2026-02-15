'use client';

import { useState } from 'react';
import { authClient, useActiveOrganization } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Building2, UserPlus, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function OrganizationPage() {
  const { data: activeOrg, isPending } = useActiveOrganization();

  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'admin'>('member');

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await authClient.organization.create({
        name: orgName,
        slug: orgSlug || orgName.toLowerCase().replace(/\s+/g, '-'),
      });
      if (result.error) {
        toast.error(result.error.message ?? 'Failed to create organization');
      } else {
        toast.success(`Organization "${orgName}" created`);
        setOrgName('');
        setOrgSlug('');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!activeOrg) {
      toast.error('No active organization. Create or select one first.');
      return;
    }
    try {
      const result = await authClient.organization.inviteMember({
        email: inviteEmail,
        role: inviteRole,
        organizationId: activeOrg.id,
      });
      if (result.error) {
        toast.error(result.error.message ?? 'Failed to send invitation');
      } else {
        toast.success(`Invitation sent to ${inviteEmail}`);
        setInviteEmail('');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organization</h1>
        <p className="text-muted-foreground">
          Manage your organization and invite members.
        </p>
      </div>

      {isPending && (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}

      {activeOrg && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle>Active organization</CardTitle>
              <CardDescription>Currently selected organization</CardDescription>
            </div>
            <Badge variant="secondary">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{activeOrg.name}</span>
              <span className="font-mono text-xs text-muted-foreground">
                ({activeOrg.id})
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>Create organization</CardTitle>
            <CardDescription>Set up a new organization</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOrg} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Name</Label>
              <Input
                id="orgName"
                type="text"
                placeholder="My Organization"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgSlug">Slug (optional)</Label>
              <Input
                id="orgSlug"
                type="text"
                placeholder="my-organization"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
              />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>Invite member</CardTitle>
            <CardDescription>
              Send an organization invitation email using Better Email
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select
                id="inviteRole"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'member' | 'admin')}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
            <Button type="submit">Send invitation</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

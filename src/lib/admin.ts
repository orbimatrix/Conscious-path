import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  publicMetadata: {
    role?: string;
    isAdmin?: boolean;
  };
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    return null;
  }

  // Check if user has admin role in Clerk metadata
  const isAdmin = user.publicMetadata?.role === 'admin' || user.publicMetadata?.isAdmin === true;
  
  if (!isAdmin) {
    return null;
  }

  return {
    id: userId,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    imageUrl: user.imageUrl,
    publicMetadata: user.publicMetadata as any
  };
}

export async function requireAdmin() {
  const adminUser = await getAdminUser();
  
  if (!adminUser) {
    redirect('/');
  }
  
  return adminUser;
}

export function isAdminRole(role: string): boolean {
  return role === 'admin';
}

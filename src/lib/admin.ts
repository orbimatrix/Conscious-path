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
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    console.log('Auth check - userId:', userId, 'user:', user ? 'Found' : 'Not found');
    
    if (!userId || !user) {
      console.log('No userId or user found');
      return null;
    }

    console.log('User publicMetadata:', user.publicMetadata);
    
    // Check if user has admin role in Clerk metadata
    const isAdmin = user.publicMetadata?.role === 'admin' || user.publicMetadata?.isAdmin === true;
    
    console.log('Admin check - role:', user.publicMetadata?.role, 'isAdmin:', isAdmin);
    
    if (!isAdmin) {
      console.log('User does not have admin privileges');
      return null;
    }

    console.log('Admin user authenticated successfully');

    return {
      id: userId,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      imageUrl: user.imageUrl,
      publicMetadata: user.publicMetadata as { role?: string; isAdmin?: boolean }
    };
  } catch (error) {
    console.error('Error in getAdminUser:', error);
    return null;
  }
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

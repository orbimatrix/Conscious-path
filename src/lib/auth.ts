'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Redirect to registration if profile is not loaded
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/registration');
    }
  }, [isLoaded, user, router]);

  const requireAuth = () => {
    if (!user) {
      setShowSignupModal(true);
      return false;
    }
    return true;
  };

  const closeSignupModal = () => {
    setShowSignupModal(false);
  };

  return {
    user,
    isLoaded,
    isAuthenticated: !!user,
    showSignupModal,
    requireAuth,
    closeSignupModal
  };
}

export function useAuthRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/registration');
    }
  }, [isLoaded, user, router]);

  return {
    user,
    isLoaded,
    isAuthenticated: !!user
  };
}

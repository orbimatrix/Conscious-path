'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { DateTime } from 'luxon';

export default function TimezoneDetector() {
  const { user } = useUser();
  const lastCheckRef = useRef<number>(0);

  useEffect(() => {
    if (user) {
      // Initial detection
      detectTimezone();
      
      // Set up periodic checking (every 10 minutes)
      const interval = setInterval(() => {
        detectTimezone();
      }, 10 * 60 * 1000);

      // Check on page focus/visibility change
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          detectTimezone();
        }
      };

      const handleFocus = () => {
        detectTimezone();
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleFocus);

      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [user]);

  const detectTimezone = async () => {
    try {
      const now = Date.now();
      
      // Don't check too frequently (minimum 5 minutes between checks)
      if (now - lastCheckRef.current < 5 * 60 * 1000) {
        return;
      }

      const userTimezone = DateTime.local().zoneName;
      const currentMetadata = user?.publicMetadata || {};
      
      // Only update if timezone has changed
      if (userTimezone && userTimezone !== currentMetadata.timezone) {
        const userTime = DateTime.now().setZone(userTimezone);
        
        // Fix: Use the correct method to update metadata
        await user?.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            timezone: userTimezone,
            timezoneOffset: userTime.offset,
            timezoneUpdatedAt: new Date().toISOString(),
            previousTimezone: currentMetadata.timezone || null,
            timezoneHistory: [
              {
                timezone: userTimezone,
                timestamp: new Date().toISOString(),
                previousTimezone: currentMetadata.timezone || null
              },
              ...(Array.isArray(currentMetadata.timezoneHistory) ? currentMetadata.timezoneHistory : []).slice(0, 9)
            ]
          }
        });

        console.log('Timezone updated:', currentMetadata.timezone, '→', userTimezone);
        lastCheckRef.current = now;
      }
    } catch (error) {
      console.error('Error detecting timezone:', error);
    }
  };

  return null;
}

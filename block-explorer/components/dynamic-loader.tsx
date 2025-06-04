'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import Lottie from 'lottie-react';
import { useTheme } from 'next-themes';

export default function Loader() {
  const { resolvedTheme } = useTheme();
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        // Load the appropriate animation based on theme
        const animationPath =
          resolvedTheme === 'dark' ? '/animations/loader-dark.json' : '/animations/loader-light.json';

        const response = await fetch(animationPath);
        if (response.ok) {
          const data = await response.json();
          setAnimationData(data);
        }
      } catch (error) {
        // Fallback: animation files don't exist yet
        console.log('Animation files not found, using fallback');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimation();
  }, [resolvedTheme]);

  return (
    <Card>
      <CardContent className="grid h-[33vh] select-none place-items-center py-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center">
            {isLoading ? (
              // Show nothing while loading to prevent flash
              <div className="size-10" />
            ) : animationData ? (
              <Lottie animationData={animationData} loop={true} style={{ width: '100%', height: '100%' }} />
            ) : (
              // Fallback: Simple CSS spinner when Lottie animations aren't available
              <div className="size-10 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            )}
          </div>
          <span className="text-sm font-medium text-foreground">Retrieving data</span>
        </div>
      </CardContent>
    </Card>
  );
}

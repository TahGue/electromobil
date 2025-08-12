'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" className="relative h-9 w-9 p-0">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Växla tema</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'dark') {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    } else if (theme === 'system') {
      return <span className="text-lg">💻</span>;
    } else {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  const getTitle = () => {
    if (theme === 'dark') {
      return 'Mörkt tema - klicka för system';
    } else if (theme === 'system') {
      return 'System tema - klicka för ljust';
    } else {
      return 'Ljust tema - klicka för mörkt';
    }
  };

  return (
    <Button 
      variant="outline" 
      className="relative h-9 w-9 p-0 transition-all duration-200" 
      onClick={toggleTheme}
      title={getTitle()}
    >
      {getIcon()}
      <span className="sr-only">Växla tema</span>
    </Button>
  );
}

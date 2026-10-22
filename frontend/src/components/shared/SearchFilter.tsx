'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

interface SearchFilterProps {
  placeholder?: string;
  paramName?: string;
  className?: string;
}

export default function SearchFilter({
  placeholder = 'Search...',
  paramName = 'searchTerm',
  className = '',
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) || '');
  const [isPending, startTransition] = useTransition();
  const debouncedValue = useDebounce(value, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const initialValue = searchParams.get(paramName) || '';

    if (debouncedValue === initialValue) return;

    if (debouncedValue.trim()) {
      params.set(paramName, debouncedValue.trim());
      params.set('page', '1');
    } else {
      params.delete(paramName);
      params.delete('page');
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [debouncedValue, paramName, router, searchParams]);

  return (
    <div className={`relative flex-1 min-w-[200px] max-w-sm ${className}`}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        className="pl-9 h-9 bg-background/80"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
      />
    </div>
  );
}


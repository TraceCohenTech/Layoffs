import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  delay?: number;
  enabled?: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  delay = 0,
  enabled = true,
}: UseCountUpOptions) {
  const [value, setValue] = useState(start);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(start);
      return;
    }

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = start + (end - start) * easeOut;
        setValue(Number(currentValue.toFixed(decimals)));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      startTimeRef.current = null;
    };
  }, [start, end, duration, decimals, delay, enabled]);

  return value;
}

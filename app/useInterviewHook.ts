import NativeInterviewModule, {
  InterviewEventsEmitter,
  FeatureFlagMap,
  FEATUREFLAG_DATA_CHANGED_EVENT,
} from '../specs/NativeInterviewModule';
import { useCallback, useEffect, useRef, useState } from 'react';

// TODO: Implement the native module interface
// 1. Create a Turbo Module for price list fetching
// 2. Implement event emitter for feature flag changes
// 3. Add proper TypeScript types

export const useIsEURSupportedFlagChange = () => {
  const [isEURSupported, setIsEURSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const listener = InterviewEventsEmitter.addListener(
      FEATUREFLAG_DATA_CHANGED_EVENT,
      (flags: FeatureFlagMap) => {
        if (typeof flags.supportEUR === 'boolean') {
          setIsEURSupported(flags.supportEUR);
        }
      }
    );
    setIsEURSupported(false);
    return () => listener.remove();
  }, []);

  return {
    isEURSupported,
  };
};

export const useFetchPriceList = () => {
  const isEURSupported = useIsEURSupportedFlagChange();
  const [priceList, setPriceList] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchPrices = useCallback(async () => {
    if (!NativeInterviewModule) {
      setError('Native module not available');
      return;
    }
    setLoading(true);
    setError(null);

    console.log('use fetch price list isEURSupported', isEURSupported);

    try {
      const result = await NativeInterviewModule?.fetchPriceList(Boolean(isEURSupported));

      if (!isMountedRef.current) return;

      const transformedData: CryptoCurrency[] = result.map(item => {
        console.log({ item });
        return {
          id: item.id,
          name: item.name,
          usd: item.usd,
          eur: item.eur,
          tags: item.tags,
        };
      });

      setPriceList(transformedData);
      setLoading(false);
    } catch (err) {
      if (!isMountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch price list';
      setError(errorMessage);
      console.error('Error fetching price list:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [isEURSupported]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  console.log({ loading });

  return {
    priceList,
    loading,
    error,
    refetch: fetchPrices,
  };
};

export interface CryptoCurrency {
  id: number;
  name: string;
  usd: number;
  eur?: number;
  tags: string[];
}

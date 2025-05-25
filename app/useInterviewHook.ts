import NativeInterviewModule, {
  InterviewEventsEmitter,
  FeatureFlagMap,
  FEATUREFLAG_DATA_CHANGED_EVENT,
} from '../specs/NativeInterviewModule';
import { useCallback, useEffect, useState } from 'react';

// TODO: Implement the native module interface
// 1. Create a Turbo Module for price list fetching
// 2. Implement event emitter for feature flag changes
// 3. Add proper TypeScript types

export const useisEURSupportedFlagChange = () => {
  const [isEURSupported, setIsEURSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // TODO: Implement feature flag subscription
    // 1. Subscribe to feature flag changes
    // 2. Update state when flag changes
    // 3. Clean up subscription on unmount
  }, []);

  return {
    isEURSupported,
  };
};

export const useFetchPriceList = () => {
  const { isEURSupported } = useisEURSupportedFlagChange();
  const [priceList, setPriceList] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement price list fetching
  // 1. Create a memoized fetch function
  // 2. Handle both USD and EUR price formats
  // 3. Implement proper error handling
  // 4. Add loading state
  // 5. Optimize re-renders using proper hooks

  return {
    priceList,
    loading,
    error,
  };
};

export interface CryptoCurrency {
  id: number;
  name: string;
  usd: number;
  eur?: number;
  tags: string[];
}

// TODO: Implement price list normalization
// 1. Handle both price formats (USD-only and USD/EUR)
// 2. Add proper type checking
// 3. Implement error handling for malformed data

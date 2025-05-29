import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NativeModules } from 'react-native';
import PriceList from '../PriceList';
import { useFetchPriceList, useIsEURSupportedFlagChange } from '../useInterviewHook';

const mockFetchPriceList = jest.fn();
const mockNavigateToDetail = jest.fn();

NativeModules.NativeInterviewModule = {
  fetchPriceList: mockFetchPriceList,
};

NativeModules.NavigationModule = {
  navigateToDetail: mockNavigateToDetail,
};

jest.mock('../useInterviewHook', () => ({
  useFetchPriceList: jest.fn(),
  useIsEURSupportedFlagChange: jest.fn(),
  CryptoCurrency: {},
}));

const mockUseFetchPriceList = useFetchPriceList as jest.MockedFunction<typeof useFetchPriceList>;
const mockUseIsEURSupportedFlagChange = useIsEURSupportedFlagChange as jest.MockedFunction<
  typeof useIsEURSupportedFlagChange
>;

describe('PriceList Component', () => {
  const mockPriceList = [
    {
      id: 1,
      name: 'Bitcoin',
      usd: 45000.12,
      eur: 38000.45,
      tags: ['crypto', 'popular'],
    },
    {
      id: 2,
      name: 'Ethereum',
      usd: 3200.56,
      eur: 2700.89,
      tags: ['crypto', 'smart-contracts'],
    },
    {
      id: 3,
      name: 'Dogecoin',
      usd: 0.08,
      eur: 0.067,
      tags: ['meme', 'crypto'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsEURSupportedFlagChange.mockReturnValue({ isEURSupported: false });
    mockUseFetchPriceList.mockReturnValue({
      priceList: mockPriceList,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render cryptocurrency list correctly', () => {
      const { getByText } = render(<PriceList />);

      expect(getByText('Bitcoin')).toBeTruthy();
      expect(getByText('Ethereum')).toBeTruthy();
      expect(getByText('Dogecoin')).toBeTruthy();
    });
  });

  describe('EUR Support Feature Flag', () => {
    it('should handle missing EUR data gracefully', () => {
      const priceListWithoutEUR = [
        {
          id: 1,
          name: 'Bitcoin',
          usd: 45000.12,
          eur: undefined,
          tags: ['crypto'],
        },
      ];

      mockUseIsEURSupportedFlagChange.mockReturnValue({ isEURSupported: true });
      mockUseFetchPriceList.mockReturnValue({
        priceList: priceListWithoutEUR,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      const { getByText, queryByText } = render(<PriceList />);

      expect(getByText('USD: $45000.12')).toBeTruthy();
      expect(queryByText(/EUR:/)).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('should display loading indicator when loading', () => {
      mockUseFetchPriceList.mockReturnValue({
        priceList: [],
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      const { getByText } = render(<PriceList />);

      expect(getByText('Loading prices...')).toBeTruthy();
    });

    it('should not display loading when data is available', () => {
      const { queryByText } = render(<PriceList />);

      expect(queryByText('Loading prices...')).toBeNull();
    });
  });

  describe('Error State', () => {
    it('should display error message when there is an error', () => {
      const mockRefetch = jest.fn();
      mockUseFetchPriceList.mockReturnValue({
        priceList: [],
        loading: false,
        error: 'Network error',
        refetch: mockRefetch,
      });

      const { getByText } = render(<PriceList />);

      expect(getByText('Error: Network error')).toBeTruthy();
      expect(getByText('Retry')).toBeTruthy();
    });

    it('should call refetch when retry button is pressed', () => {
      const mockRefetch = jest.fn();
      mockUseFetchPriceList.mockReturnValue({
        priceList: [],
        loading: false,
        error: 'Network error',
        refetch: mockRefetch,
      });

      const { getByText } = render(<PriceList />);

      fireEvent.press(getByText('Retry'));
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty State', () => {
    it('should display empty message when no data is available', () => {
      mockUseFetchPriceList.mockReturnValue({
        priceList: [],
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      const { getByText } = render(<PriceList />);

      expect(getByText('No cryptocurrencies available')).toBeTruthy();
    });
  });
});

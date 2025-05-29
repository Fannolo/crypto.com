/* eslint-disable comma-dangle */
import type { ReactElement } from 'react';
import React from 'react';
import type { RenderOptions } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };

export const createMockCryptoCurrency = (overrides = {}) => ({
  id: 1,
  name: 'Bitcoin',
  usd: 45000.12,
  eur: 38000.45,
  tags: ['crypto', 'popular'],
  ...overrides,
});

export const createMockPriceList = (count = 3) =>
  Array.from({ length: count }, (_, index) =>
    createMockCryptoCurrency({
      id: index + 1,
      name: `Crypto ${index + 1}`,
      usd: Math.random() * 10000,
      eur: Math.random() * 8500,
      tags: [`tag${index}`, 'crypto'],
    })
  );

export const mockFeatureFlags = {
  supportEUR: (enabled: boolean) => ({
    supportEUR: enabled,
  }),
};

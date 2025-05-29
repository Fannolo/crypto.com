// Mock React Native modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock Native Modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.NativeModules = {
    ...RN.NativeModules,
    NativeInterviewModule: {
      fetchPriceList: jest.fn(),
    },
    NativeInterviewEventsEmitterModule: {},
    NavigationModule: {
      navigateToDetail: jest.fn(),
    },
  };

  return RN;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Setup fetch mock
global.fetch = jest.fn();

// Add custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

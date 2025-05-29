import type { TurboModule } from 'react-native';
import { NativeModules, NativeEventEmitter, TurboModuleRegistry } from 'react-native';
import { CryptoCurrency } from '../app/useInterviewHook';

export interface Spec extends TurboModule {
  fetchPriceList(supportEUR: boolean): Promise<Array<CryptoCurrency>>;
}

// - Turbo Module
const NativeInterviewModule = TurboModuleRegistry.get<Spec>('NativeInterviewModule');

export default NativeInterviewModule;

// - Event Emitter
export const FEATUREFLAG_DATA_CHANGED_EVENT = 'onFeatureFlagDataChanged';

export interface FeatureFlagMap {
  supportEUR: boolean;
}

export const InterviewEventsEmitter = new NativeEventEmitter(
  NativeModules.NativeInterviewEventsEmitterModule
);

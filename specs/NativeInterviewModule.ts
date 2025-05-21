import type {TurboModule} from 'react-native'
import {
  NativeModules,
  NativeEventEmitter,
  TurboModuleRegistry,
} from 'react-native'

type Result<T, E = Error> =
  | {type: 'success'; data: T}
  | {type: 'error'; error: E}

export interface Spec extends TurboModule {
  // Example: fetch Data, Feel free to change the function name and parameters
  fetchPriceList(
  ): Promise<Result<Object, Error>>
}

// - Turbo Module
const NativeInterviewModule = TurboModuleRegistry.get<Spec>(
  'NativeInterviewModule',
)

export default NativeInterviewModule

// - Event Emitter
export const FEATUREFLAG_DATA_CHANGED_EVENT = 'onFeatureFlagDataChanged'

export interface FeatureFlagMap {
  supportEUR: boolean
}

export const InterviewEventsEmitter = new NativeEventEmitter(
  NativeModules.NativeInterviewEventsEmitterModule
)
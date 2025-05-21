
#import "RNNativeInterviewModule.h"
#import "CDC_Interview-Swift.h"

@interface RNNativeInterviewModule()
@end

@implementation RNNativeInterviewModule

RCT_EXPORT_MODULE(NativeInterviewModule);

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params { 
    return std::make_shared<facebook::react::NativeInterviewModuleSpecJSI>(params);
}

- (instancetype)init {
    self = [super init];
    if (self) {
    }
    
    return self;
}

- (void)fetchPriceList:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
    // TODO: Implement price list fetching
    // 1. use allPriceUsecase or usdPriceUseCase to fetch data
    // 2. if feature flag .supportEUR is true, use fetchAllPriceList else use fetchUSDPriceList
    // 3. success: return response of allPriceList or usdPriceList
    // 4. failure: Implement proper error handling

    reject(@"NOT_IMPLEMENTED", @"Price list fetching not implemented", nil);
}

@end



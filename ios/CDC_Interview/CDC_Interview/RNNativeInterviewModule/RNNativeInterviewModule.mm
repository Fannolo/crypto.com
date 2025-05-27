
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

- (void)fetchPriceList:(BOOL)supportEUR
                        resolve:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject
{
    [[RNNativeInterviewModuleImpl shared]
        fetchPriceList:supportEUR
               resolver:resolve
               rejecter:reject];
}

@end



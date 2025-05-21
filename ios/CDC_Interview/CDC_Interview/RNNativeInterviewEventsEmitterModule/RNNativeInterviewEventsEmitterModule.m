
#import "RNNativeInterviewEventsEmitterModule.h"
#import "CDC_Interview-Swift.h"

@interface RNNativeInterviewEventsEmitterModule()
@property (nonatomic, strong) RNNativeInterviewEventsEmitterModuleImpl *impl;
@end

@implementation RNNativeInterviewEventsEmitterModule

RCT_EXPORT_MODULE(NativeInterviewEventsEmitterModule);

- (instancetype)init {
    self = [super init];
    if (self) {
        _impl = [[RNNativeInterviewEventsEmitterModuleImpl alloc] init];
    }
    
    return self;
}

- (void)startObserving {
    __weak RNNativeInterviewEventsEmitterModule *weakSelf = self;
    [_impl subscribeFeatureFlagChangeWithHandler:^(NSDictionary<NSString *,NSNumber *> * data) {
            [weakSelf sendEventWithName:@"onFeatureFlagDataChanged" body:data];
    }];
}

- (void)stopObserving {
    [_impl unsubscribeChange];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onFeatureFlagDataChanged"];
}

@end


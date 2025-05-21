
import Foundation
import RxSwift

public class RNNativeInterviewEventsEmitterModuleImpl: NSObject {
    let featureFlagProvider: FeatureFlagProvider
    private var subscription: Disposable?
    public override init() {
        let dependency = Dependency.shared
        self.featureFlagProvider = dependency.resolve(FeatureFlagProvider.self)!
        super.init()
    }
    
    @objc
    public func subscribeFeatureFlagChange(handler: @escaping ([String: Bool]) -> Void) {
        let featureFlagProvider = self.featureFlagProvider
        self.subscription = featureFlagProvider.flagsRelay
            .compactMap { value in
                value.toStringDictionary()
            }
            .subscribe(onNext: { config in
                handler(config)
            })
    }
    
    @objc
    public func unsubscribeChange() {
        subscription?.dispose()
    }
}

extension Dictionary where Key == FeatureFlagType, Value == Bool {
    func toStringDictionary() -> [String: Bool] {
        var result: [String: Bool] = [:]
        for (key, value) in self {
            result[key.rawValue] = value
        }
        return result
    }
    
    func toNSDictionary() -> NSDictionary {
        return self.toStringDictionary() as NSDictionary
    }
}

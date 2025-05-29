@objcMembers
final class RNNativeInterviewModuleImpl: NSObject {
    static let shared = RNNativeInterviewModuleImpl()
    private let usdUseCase = USDPriceUseCase()
    private let allUseCase = AllPriceUseCase()
    private let featureFlagProvider: FeatureFlagProvider
    
    override init() {
        self.featureFlagProvider = Dependency.shared.resolve(FeatureFlagProvider.self)!
    }
    
    func fetchPriceList(supportEUR,
                            resolver: @escaping RCTPromiseResolveBlock,
                            rejecter: @escaping RCTPromiseRejectBlock
        ) {
            let supportEUR1 = featureFlagProvider.getValue(falg: .supportEUR)
        Task {
            do {
                if supportEUR1 {
                    let prices = try await allUseCase.fetchItemsAsync()
                    resolver(prices.map(Self.dictFromAllPrice))
                } else {
                    let prices = try await usdUseCase.fetchItemsAsync()
                    resolver(prices.map(Self.dictFromUSDPrice))
                }
            } catch {
                rejecter("E_FETCH_FAILED", error.localizedDescription, error)
            }
        }
    }
    
    private static func dictFromUSDPrice(_ p: USDPrice.Price) -> [String: Any] {
        [
          "id":   p.id,
          "name": p.name,
          "usd":  NSDecimalNumber(decimal: p.usd),
          "tags": p.tags.map(\.rawValue)
        ]
      }
    
    private static func dictFromAllPrice(_ p: AllPrice.Price) -> [String: Any] {
        [
          "id":   p.id,
          "name": p.name,
          "usd":  NSDecimalNumber(decimal: p.price.usd),
          "eur":  NSDecimalNumber(decimal: p.price.eur),
          "tags": p.tags.map(\.rawValue)
        ]
      }
}




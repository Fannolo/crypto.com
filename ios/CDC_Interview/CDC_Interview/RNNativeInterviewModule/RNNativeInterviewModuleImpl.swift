@objcMembers
final class RNNativeInterviewModuleImpl: NSObject {
  static let shared = RNNativeInterviewModuleImpl()
  private let usdUseCase = USDPriceUseCase()
  private let allUseCase = AllPriceUseCase()

  func fetchPriceList(_ supportEUR: Bool,
                      resolver: @escaping RCTPromiseResolveBlock,
                      rejecter: @escaping RCTPromiseRejectBlock
  ) {
      Task{
          do{
              if supportEUR {
                  let prices = try await allUseCase.fetchItemsAsync()
                  resolver(prices.map(Self.dictFromAllPrice))
              } else {
                  let prices = try await usdUseCase.fetchItemsAsync()
                  resolver(prices.map(Self.dictFromUSDPrice))
              }
          }catch{
              rejecter("E_FETCH_FAILED", error.localizedDescription, error)
          }
      }

    
  }
    private static func dictFromUSDPrice(_ p: USDPrice.Price) -> [String: Any] {
        ["symbol": p.tags, "usd": p.usd]
   }

 private static func dictFromAllPrice(_ p: AllPrice.Price) -> [String: Any] {
     let d: [String: Any] = ["symbol": p.tags, "usd": p.price.usd, "eur": p.price.eur]
     return d
   }
}




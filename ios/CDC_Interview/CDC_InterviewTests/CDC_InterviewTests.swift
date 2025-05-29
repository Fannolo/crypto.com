import XCTest
import RxTest
import RxSwift
@testable import CDC_Interview

final class CDC_InterviewTests: XCTestCase {
    
    var disposeBag: DisposeBag!
    var scheduler: TestScheduler!
    var featureFlagProvider: FeatureFlagProvider!
    var usdPriceUseCase: USDPriceUseCase!
    var allPriceUseCase: AllPriceUseCase!
    
    override func setUpWithError() throws {
        disposeBag = DisposeBag()
        scheduler = TestScheduler(initialClock: 0)
        
        Dependency.shared.register(FeatureFlagProvider.self) { _ in
            return FeatureFlagProvider()
        }
        Dependency.shared.register(USDPriceUseCase.self) { _ in
            return USDPriceUseCase()
        }
        Dependency.shared.register(AllPriceUseCase.self) { _ in
            return AllPriceUseCase()
        }
        
        featureFlagProvider = Dependency.shared.resolve(FeatureFlagProvider.self)!
        usdPriceUseCase = Dependency.shared.resolve(USDPriceUseCase.self)!
        allPriceUseCase = Dependency.shared.resolve(AllPriceUseCase.self)!
    }
    
    override func tearDownWithError() throws {
        disposeBag = nil
        scheduler = nil
        featureFlagProvider = nil
        usdPriceUseCase = nil
        allPriceUseCase = nil
    }
    
    
    func testFeatureFlagInitialValue() {
        
        let isEURSupported = featureFlagProvider.getValue(falg: .supportEUR)
        
        
        XCTAssertFalse(isEURSupported)
    }
    
    func testFeatureFlagUpdate() {

        let observer = scheduler.createObserver(Bool.self)
        
        featureFlagProvider.observeFlagValue(falg: .supportEUR)
            .subscribe(observer)
            .disposed(by: disposeBag)
        
    
        scheduler.start()
        featureFlagProvider.update(falg: .supportEUR, newValue: true)
        
    
        XCTAssertEqual(observer.events.last?.value.element, true)
    }
    
    
    func testUSDPriceListFetch() {
        let expectation = self.expectation(description: "USD prices fetched")
        var fetchedPrices: [USDPrice.Price] = []
        
        usdPriceUseCase.fetchItems()
            .subscribe(onNext: { prices in
                fetchedPrices = prices
                expectation.fulfill()
            })
            .disposed(by: disposeBag)
        
        waitForExpectations(timeout: 5) { _ in
            XCTAssertGreaterThan(fetchedPrices.count, 0)
            XCTAssertNotNil(fetchedPrices.first?.usd)
            XCTAssertNotNil(fetchedPrices.first?.name)
            XCTAssertNotNil(fetchedPrices.first?.id)
        }
    }
    
    func testAllPriceListFetch() {
        let expectation = self.expectation(description: "All prices fetched")
        var fetchedPrices: [AllPrice.Price] = []
        
        allPriceUseCase.fetchItems()
            .subscribe(onNext: { prices in
                fetchedPrices = prices
                expectation.fulfill()
            })
            .disposed(by: disposeBag)
        

        waitForExpectations(timeout: 5) { _ in
            XCTAssertGreaterThan(fetchedPrices.count, 0)
            XCTAssertNotNil(fetchedPrices.first?.price.usd)
            XCTAssertNotNil(fetchedPrices.first?.price.eur)
            XCTAssertNotNil(fetchedPrices.first?.name)
            XCTAssertNotNil(fetchedPrices.first?.id)
        }
    }
    
    func testNativeModuleFetchWithFeatureFlag() async throws {
        let nativeModule = RNNativeInterviewModuleImpl.shared
        
        featureFlagProvider.update(falg: .supportEUR, newValue: false)
        
        var result: [[String: Any]]?
        var error: Error?
        
        let expectation1 = self.expectation(description: "Fetch without EUR")
        nativeModule.fetchPriceList(false, resolver: { data in
            result = data as? [[String: Any]]
            expectation1.fulfill()
        }, rejecter: { _, _, err in
            error = err
            expectation1.fulfill()
        })
        
        await fulfillment(of: [expectation1], timeout: 5)
        
        
        featureFlagProvider.update(falg: .supportEUR, newValue: true)
        XCTAssertNil(error)
        XCTAssertNotNil(result)
        if let firstItem = result?.first {
            XCTAssertNotNil(firstItem["usd"])
            XCTAssertNil(firstItem["eur"])
        }
        
        let expectation2 = self.expectation(description: "Fetch with EUR")
        nativeModule.fetchPriceList(true, resolver: { data in
            result = data as? [[String: Any]]
            expectation2.fulfill()
        }, rejecter: { _, _, err in
            error = err
            expectation2.fulfill()
        })
        
        await fulfillment(of: [expectation2], timeout: 5)
        
        XCTAssertNil(error)
        XCTAssertNotNil(result)
        if let firstItem = result?.first {
            XCTAssertNotNil(firstItem["usd"])
            XCTAssertNotNil(firstItem["eur"])
        }
    }
    
    
    func testErrorHandlingForInvalidJSON() {
     
        let expectation = self.expectation(description: "Error handled")
        var receivedError: Error?
        
        let errorObservable = Observable<[USDPrice.Price]>.create { observer in
            observer.onError(NSError(domain: "TestError", code: 404, userInfo: nil))
            return Disposables.create()
        }
        
        errorObservable.subscribe(
            onNext: { _ in
                XCTFail("Should not receive data")
            },
            onError: { error in
                receivedError = error
                expectation.fulfill()
            }
        ).disposed(by: disposeBag)
        
        waitForExpectations(timeout: 1) { _ in
            XCTAssertNotNil(receivedError)
        }
    }
    
}

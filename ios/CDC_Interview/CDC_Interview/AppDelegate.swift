import UIKit

import React
import React_RCTAppDelegate

@main
class AppDelegate: RCTAppDelegate {
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        super.automaticallyLoadReactNativeWindow = false
        super.application(application, didFinishLaunchingWithOptions: launchOptions)

        Dependency.shared.register(USDPriceUseCase.self) { resolver in
            return USDPriceUseCase()
        }
        
        Dependency.shared.register(AllPriceUseCase.self) { resolver in
            return AllPriceUseCase()
        }
        
        Dependency.shared.register(FeatureFlagProvider.self) { resolver in
            return FeatureFlagProvider()
        }
        
        return true
    }

    override func bundleURL() -> URL? {
    #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
    }

    // MARK: UISceneSession Lifecycle

    override func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    override func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }
}


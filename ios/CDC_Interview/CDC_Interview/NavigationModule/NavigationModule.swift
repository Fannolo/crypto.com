import Foundation
import React

@objc(NavigationModule)
class NavigationModule: NSObject {
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    func navigateToDetail(_ priceId: NSNumber) {
        DispatchQueue.main.async {
            guard let currentViewController = self.getCurrentViewController(),
                  let navigationController = currentViewController.navigationController else {
                return
            }
            
            let detailViewController = USDItemDetailsViewController(priceId: priceId.intValue)
            navigationController.pushViewController(detailViewController, animated: true)
        }
    }
    
    private func getCurrentViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first,
              let rootViewController = window.rootViewController else {
            return nil
        }
        
        return findTopViewController(from: rootViewController)
    }
    
    private func findTopViewController(from viewController: UIViewController) -> UIViewController? {
        if let navigationController = viewController as? UINavigationController {
            return findTopViewController(from: navigationController.visibleViewController ?? navigationController)
        } else if let tabBarController = viewController as? UITabBarController {
            return findTopViewController(from: tabBarController.selectedViewController ?? tabBarController)
        } else if let presentedViewController = viewController.presentedViewController {
            return findTopViewController(from: presentedViewController)
        }
        
        return viewController
    }
}

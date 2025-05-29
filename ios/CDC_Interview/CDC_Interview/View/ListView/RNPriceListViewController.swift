import UIKit
import React


class RNPriceListViewController: UIViewController {
    
    var reactView: RCTRootView?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let appDel = UIApplication.shared.delegate as! RCTAppDelegate
        
        let rctRootViewFactory = appDel.rootViewFactory
        print("description: \(rctRootViewFactory.description)")
        let newArchOn    = appDel.newArchEnabled()
        print("new-arch: \(newArchOn)") // this is true which means we are using the new architecture to render UI components in the view controller
        self.view = rctRootViewFactory.view(withModuleName: "CDC_Interview", initialProperties: nil)
        
        
    }
    
}

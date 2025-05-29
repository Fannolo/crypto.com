import UIKit
import React


class RNPriceListViewController: UIViewController {
    
    var reactView: RCTRootView?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let appDel = UIApplication.shared.delegate as! RCTAppDelegate
        
        let rctRootViewFactory = appDel.rootViewFactory
        let newArchOn    = appDel.newArchEnabled()
        self.view = rctRootViewFactory.view(withModuleName: "CDC_Interview", initialProperties: nil)   
    }
    
}

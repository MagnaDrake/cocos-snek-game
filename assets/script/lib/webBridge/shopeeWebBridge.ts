import { getAppPath, isOnMobileApp } from './utils';

import * as WB from './IShopeeWebBridge';

export type { WB as WebBridgeInterfaces };

declare global {
    var WebViewJavascriptBridge: any;
}

/* eslint-disable @typescript-eslint/no-unused-vars, prefer-destructuring */
const WebBridge = window.WebViewJavascriptBridge;
const callHandler = WebBridge?.callHandler;
const registerHandler = WebBridge?.registerHandler;
const unregisterHandler = WebBridge?.unregisterHandler;
/* eslint-ensable @typescript-eslint/no-unused-vars, prefer-destructuring */

const WILL_REAPPEAR_ID = 'WILL_REAPPEAR_ID';
const DID_DISAPPEAR_ID = 'DID_DISAPPEAR_ID';

const WILL_RESIGN_ACTIVE_ID = 'WILL_RESIGN_ACTIVE_ID';
const DID_ACTIVE_ID = 'DID_ACTIVE_ID';

class ShopeeWebBridgeClass {
    /**
     * Initialize web bridge;
     * @returns Returns boolean indicating the successful initialization
     */
    init = () => {
        if (isOnMobileApp()) {
            WebBridge.init();
            return true;
        }
        return false;
    };
    
    login: WB.LoginT = (options, callback) => {
        const o: WB.ILoginOptions = {
            ...options,
            redirectPath: getAppPath(options.redirectPath),
        };
        
        const cb: WB.LoginCallback = ({ status }) => {
            if (status === WB.LoginRespStatus.SUCCESS) {
                window.location.reload();
            }
        };
        
        callHandler('login', o, callback || cb);
    };
    
    configurePage: WB.TConfigurePage = ({ title = '', showNavbar }) => {
        if (!isOnMobileApp()) return;

        const config = {
            /** Disable pull to reload */
            disableReload: 1,
            /** Disable bounce effect in iOS */
            disableBounce: 1,
        };

        const navbarInvisibleConfig = {
            isTransparent: showNavbar ? 0 : 1,
            hideBackButton: showNavbar ? 0 : 1,
        }
        
        const navbar = {
            title,
            ...navbarInvisibleConfig,
        };
        
        callHandler('configurePage', {
            config,
            navbar,
        });
    };
    
    navigateTo = (url: string) => {
        callHandler('navigate', {
            target: '_blank',
            url,
        });
    };
    
    setScreenAutolock = (isEnabled: boolean) => {
        callHandler('deviceScreenAutoLock', {
            isEnabled,
        });
    };
    
    regApplicationWillResignActive = (callback: () => void) => {
        registerHandler('applicationWillResignActive', callback, WILL_RESIGN_ACTIVE_ID);
    };
    
    unregApplicationWillResignActive = () => {
        unregisterHandler('applicationWillResignActive', WILL_RESIGN_ACTIVE_ID);
    };
    
    regApplicationDidBecomeActive = (callback: () => void) => {
        registerHandler('applicationDidBecomeActive', callback, DID_ACTIVE_ID);
    };
    
    unregApplicationDidBecomeActive = () => {
        unregisterHandler('applicationDidBecomeActive', DID_ACTIVE_ID);
    };
    
    registerWillReappear = (callback: () => void) => {
        registerHandler('viewWillReappear', callback, WILL_REAPPEAR_ID);
    };
    
    registerDidDisappear = (callback: () => void) => {
        registerHandler('viewDidDisappear', callback, DID_DISAPPEAR_ID);
    };
    
    unregisterWillReappear = () => {
        unregisterHandler('viewWillReappear', WILL_REAPPEAR_ID);
    };
    
    unregisterDidDisappear = () => {
        unregisterHandler('viewDidDisappear', DID_DISAPPEAR_ID);
    };
}

const ShopeeWebBridge = new ShopeeWebBridgeClass();
export default ShopeeWebBridge;

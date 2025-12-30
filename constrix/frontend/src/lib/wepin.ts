class WepinService {
  private wepin: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Check environment variables
      const appId = process.env.NEXT_PUBLIC_WEPIN_APP_ID;
      const appKey = process.env.NEXT_PUBLIC_WEPIN_APP_KEY;
      
      console.log('Wepin env check:', { 
        hasAppId: !!appId, 
        hasAppKey: !!appKey,
        appId: appId?.substring(0, 8) + '...' // Log partial for debugging
      });
      
      if (!appId || !appKey) {
        throw new Error('Wepin App ID and App Key must be set in environment variables');
      }

      // Dynamic import for SSR compatibility
      const { WepinSDK } = await import('@wepin/sdk-js');
      
      this.wepin = new WepinSDK({
        appId,
        appKey,
      });

      await this.wepin.init({
        defaultLanguage: 'en',
      });
      
      this.initialized = true;
      console.log('Wepin initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Wepin:', error);
      throw error;
    }
  }

  async login() {
    try {
      await this.initialize();
      
      if (!this.wepin) throw new Error('Wepin not initialized');
      
      console.log('Attempting Wepin login...');
      const loginResult = await this.wepin.loginWithUI();
      console.log('Wepin login result:', loginResult);
      
      if (loginResult.status !== 'success') {
        console.error('Wepin login failed with status:', loginResult.status);
        throw new Error(`Login failed with status: ${loginResult.status}`);
      }
      
      return loginResult;
    } catch (error) {
      console.error('Wepin login failed:', error);
      throw error;
    }
  }

  async getAccounts() {
    if (!this.wepin) throw new Error('Wepin not initialized');
    
    const accounts = await this.wepin.getAccounts();
    return accounts;
  }

  async signMessage(message: string) {
    if (!this.wepin) throw new Error('Wepin not initialized');
    
    const signature = await this.wepin.signMessage(message);
    return signature;
  }

  async logout() {
    if (!this.wepin) return;
    
    try {
      await this.wepin.logout();
    } catch (error) {
      console.log('Wepin logout error:', error);
    }
    
    // Clear all Wepin related data
    this.initialized = false;
    this.wepin = null;
    
    // Clear browser storage
    localStorage.clear();
    sessionStorage.clear();
  }

  isLoggedIn() {
    return this.wepin?.isLoggedIn() || false;
  }
}

export const wepinService = new WepinService();
import { wepinService } from './wepin';
import { metaMaskService } from './metamask';

export type WalletType = 'wepin' | 'metamask';

export const connectWallet = async (walletType: WalletType) => {
  if (walletType === 'wepin') {
    try {
      await wepinService.initialize();
      const loginResult = await wepinService.login();
      
      if (loginResult.status !== 'success') {
        throw new Error('Login failed');
      }
      
      const address = loginResult.userInfo.walletAddress || loginResult.userInfo.address;
      
      if (!address) {
        throw new Error('No wallet address found');
      }
      
      return { address, walletType: 'wepin' as const };
    } catch (error) {
      throw new Error('Failed to connect Wepin wallet');
    }
  } else {
    try {
      const { address } = await metaMaskService.connectWallet();
      return { address, walletType: 'metamask' as const };
    } catch (error) {
      throw new Error('Failed to connect MetaMask wallet');
    }
  }
};

export const signMessage = async (message: string, walletType: WalletType) => {
  if (walletType === 'wepin') {
    return await wepinService.signMessage(message);
  } else {
    return await metaMaskService.signMessage(message);
  }
};

export const generateAuthMessage = (address: string) => {
  const timestamp = Date.now();
  return `Sign this message to authenticate with Constrix.\n\nAddress: ${address}\nTimestamp: ${timestamp}`;
};

export const disconnectWallet = async () => {
  try {
    await wepinService.logout();
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
  }
};

export const isWalletConnected = () => {
  return wepinService.isLoggedIn();
};
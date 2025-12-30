// Mock authentication for demo purposes
export const mockAuth = {
  login: async (walletType: 'metamask' | 'wepin') => {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: 'demo-user-123',
      walletAddress: '0x742d35Cc6634C0532925a3b8D0C9e3e0C8b4c8d8',
      username: 'demo_user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('constrix_user', JSON.stringify(mockUser));
    localStorage.setItem('constrix_token', 'demo-token-123');
    
    return { user: mockUser, token: 'demo-token-123' };
  },
  
  logout: () => {
    localStorage.removeItem('constrix_user');
    localStorage.removeItem('constrix_token');
  }
};
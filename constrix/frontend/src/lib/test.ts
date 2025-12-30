// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    console.log('Testing backend connection to:', apiUrl);
    
    const response = await fetch(`${apiUrl}/health`);
    const data = await response.json();
    
    console.log('Backend health check:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Backend connection failed:', error);
    return { success: false, error };
  }
};
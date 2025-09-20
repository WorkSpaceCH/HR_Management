/**
 * NetworkSecurity - Utility class for secure communication
 * 
 * Contains static methods for network security operations
 */
export class NetworkSecurity {
  /**
   * Generate a secure nonce for CSRF protection
   */
  static generateNonce(length = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const values = new Uint32Array(length);
    
    // Use crypto secure random number generator if available
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(values);
      
      for (let i = 0; i < length; i++) {
        result += charset[values[i] % charset.length];
      }
    } else {
      // Fallback to Math.random (less secure)
      for (let i = 0; i < length; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    
    return result;
  }
  
  /**
   * Sanitize outgoing data to prevent injection attacks
   */
  static sanitizeOutgoingData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    
    const sanitized = Array.isArray(data) ? [...data] : {...data};
    
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        // Basic sanitization for strings
        sanitized[key] = NetworkSecurity.sanitizeString(sanitized[key]);
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        // Recursively sanitize nested objects
        sanitized[key] = NetworkSecurity.sanitizeOutgoingData(sanitized[key]);
      }
    });
    
    return sanitized;
  }
  
  /**
   * Basic string sanitization to prevent XSS
   */
  static sanitizeString(str: string): string {
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  /**
   * Hash sensitive data for transmission
   */
  static hashData(data: string): string {
    // In a real app, use a proper hashing library
    // This is a simplified example
    let hash = 0;
    
    if (data.length === 0) {
      return hash.toString(16);
    }
    
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(16);
  }
  
  /**
   * Check if communication is on a secure channel (HTTPS)
   */
  static isSecureChannel(): boolean {
    return window.location.protocol === 'https:';
  }
  
  /**
   * Warn if insecure channel is being used
   */
  static checkSecureChannel(): void {
    // Check if we're in production by looking at the environment
    const isProduction = location.hostname !== 'localhost' && 
                         location.hostname !== '127.0.0.1' &&
                         !location.hostname.includes('ngrok');
    
    if (!NetworkSecurity.isSecureChannel() && isProduction) {
      console.warn('Warning: Communication is not on a secure channel (HTTPS)');
    }
  }
}

import { describe, it, expect } from 'vitest';
import { createCompanySchema, kycVerifySchema } from '../types/schemas';

describe('API Tests', () => {
  it('should validate company data schema', () => {
    
    const validData = {
      name: 'Test Company',
      sector: 'Technology',
      targetRaise: 1000000,
      revenue: 50000,
    };
    
    const result = createCompanySchema.safeParse(validData);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.name).toBe('Test Company');
      expect(result.data.sector).toBe('Technology');
      expect(result.data.targetRaise).toBe(1000000);
      expect(result.data.revenue).toBe(50000);
    }
  });
  
  it('should reject invalid company data', () => {
    
    const invalidData = {
      name: '', // Empty name should fail
      sector: 'Technology',
      targetRaise: -1000, // Negative target raise should fail
      revenue: 50000,
    };
    
    const result = createCompanySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
  
  it('should validate KYC data schema', () => {
    
    const validData = {
      email: 'test@example.com',
    };
    
    const result = kycVerifySchema.safeParse(validData);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });
  
  it('should reject invalid email in KYC data', () => {
    
    const invalidData = {
      email: 'invalid-email', // Invalid email format
    };
    
    const result = kycVerifySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
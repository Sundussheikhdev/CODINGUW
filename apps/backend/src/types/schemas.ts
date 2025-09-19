import { z } from 'zod';

// Company schemas
export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  sector: z.string().min(1, 'Sector is required'),
  targetRaise: z.number().min(0, 'Target raise must be positive'),
  revenue: z.number().min(0, 'Revenue must be positive'),
});

export const updateCompanySchema = createCompanySchema.partial();

// KYC schemas
export const kycVerifySchema = z.object({
  email: z.string().email('Valid email is required'),
});

// Financials schemas
export const linkFinancialsSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

// File upload schemas
export const fileUploadSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
});

// Score response schema
export const scoreResponseSchema = z.object({
  score: z.number().min(0).max(100),
  reasons: z.array(z.string()),
});

// Notification schemas
export const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.string().min(1, 'Type is required'),
  message: z.string().min(1, 'Message is required'),
});

// Message schemas (for chat)
export const createMessageSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  sender: z.string().min(1, 'Sender is required'),
  text: z.string().min(1, 'Message text is required'),
});

// Type exports
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type KycVerifyInput = z.infer<typeof kycVerifySchema>;
export type LinkFinancialsInput = z.infer<typeof linkFinancialsSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type ScoreResponse = z.infer<typeof scoreResponseSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
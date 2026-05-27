import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  location: z.string().optional(),
  space: z.string().min(1, 'Please select a space type'),
  message: z.string().min(10, 'Please tell us a bit more about what you are imagining'),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

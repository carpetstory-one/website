import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  location: z.string().optional(),
  space: z.string().optional(),
  collection: z.string().optional(),
  message: z
    .string()
    .min(10, 'Please tell us a bit more about what you are imagining'),
  productName: z.string().optional(),
  productSlug: z.string().optional(),
  pageUrl: z.string().optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

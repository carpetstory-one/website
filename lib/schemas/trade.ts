/**
 * lib/schemas/trade.ts — Validation for the B2B trade inquiry form (/trade).
 *
 * The option lists live here (not in the component) so the client form and
 * the server action validate against the same source of truth.
 */

import { z } from 'zod';

export const PARTNER_TYPES = [
  'designer',
  'importer',
  'retailer',
  'brand',
  'other',
] as const;

export const INTERESTS = [
  'ready',
  'custom',
  'whiteLabel',
  'account',
  'kit',
  'general',
] as const;

export const tradeInquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  company: z.string().trim().min(2, 'Please enter your company.').max(160),
  designation: z
    .string()
    .trim()
    .min(2, 'Please enter your designation.')
    .max(120),
  country: z.string().trim().min(2, 'Please enter your country.').max(90),
  email: z.string().trim().email('Please enter a valid email.'),
  phone: z.string().trim().min(6, 'Please enter a valid phone number.').max(40),
  partnerType: z.enum(PARTNER_TYPES),
  interests: z.array(z.enum(INTERESTS)).max(INTERESTS.length).default([]),
  requirement: z.string().trim().max(3000).optional().default(''),
});

export type TradeInquiry = z.infer<typeof tradeInquirySchema>;

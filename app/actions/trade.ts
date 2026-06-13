'use server';

import { Resend } from 'resend';
import { tradeInquirySchema } from '@/lib/schemas/trade';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function submitTradeInquiry(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    company: formData.get('company'),
    designation: formData.get('designation'),
    country: formData.get('country'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    partnerType: formData.get('partnerType'),
    interests: formData.getAll('interests'),
    requirement: formData.get('requirement') ?? '',
  };

  const validated = tradeInquirySchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false as const,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const data = validated.data;
  const body = `
Name: ${data.name}
Company: ${data.company}
Designation: ${data.designation}
Country: ${data.country}
Email: ${data.email}
Phone: ${data.phone}
Partner type: ${data.partnerType}
Interested in: ${data.interests.length ? data.interests.join(', ') : '—'}

Requirement:
${data.requirement || '—'}
  `;

  // Graceful degradation: without an API key, log instead of sending.
  if (!process.env.RESEND_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('--- SIMULATED TRADE INQUIRY SUBMISSION ---');
    console.log(body);
    console.log('------------------------------------------');
    return { success: true as const };
  }

  try {
    await resend.emails.send({
      from: 'Carpetstory <hello@carpetstory.com>', // Replace with verified domain
      to: ['hello@carpetstory.com'],
      replyTo: data.email,
      subject: `Trade inquiry — ${data.company} (${data.partnerType}, ${data.country})`,
      text: body,
    });
    return { success: true as const };
  } catch (error) {
    console.error('Failed to send trade inquiry email:', error);
    return {
      success: false as const,
      error: 'Failed to send message. Please try again later.',
    };
  }
}

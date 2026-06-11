'use server';

import { Resend } from 'resend';
import { inquirySchema } from '@/lib/schemas/inquiry';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function submitInquiry(formData: FormData) {
  // 1. Extract data
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    location: formData.get('location'),
    space: formData.get('space'),
    message: formData.get('message'),
  };

  // 2. Validate
  const validatedFields = inquirySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, location, space, message } = validatedFields.data;

  // 3. Graceful degradation: Check if we have a real API key
  if (!process.env.RESEND_API_KEY) {
    // Simulate network delay for UI testing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('--- SIMULATED INQUIRY SUBMISSION ---');
    console.log(`From: ${name} <${email}>`);
    console.log(`Location: ${location}`);
    console.log(`Space: ${space}`);
    console.log(`Message: ${message}`);
    console.log('------------------------------------');

    return { success: true };
  }

  // 4. Send actual email
  try {
    await resend.emails.send({
      from: 'Carpetstory <hello@carpetstory.one>', // Replace with verified domain
      to: ['hello@carpetstory.one'],
      replyTo: email,
      subject: `New Inquiry from ${name} - ${space}`,
      text: `
Name: ${name}
Email: ${email}
Location: ${location || 'Not provided'}
Space: ${space}

Message:
${message}
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send inquiry email:', error);
    return {
      success: false,
      error: 'Failed to send message. Please try again later.',
    };
  }
}

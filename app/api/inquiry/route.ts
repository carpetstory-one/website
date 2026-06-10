import { NextResponse } from 'next/server';
import { inquirySchema } from '@/lib/schemas/inquiry';
import { hubspotClient } from '@/lib/hubspot';
import { AssociationSpecAssociationCategoryEnum } from '@hubspot/api-client/lib/codegen/crm/associations/v4/models/AssociationSpec';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = inquirySchema.parse(body);

    const {
      name,
      email,
      location,
      space,
      collection,
      message,
      productName,
      productSlug,
      pageUrl,
    } = validatedData;

    if (!hubspotClient.config.accessToken) {
      console.warn('HubSpot is not configured. Simulating success.');
      return NextResponse.json({ success: true, simulated: true });
    }

    const contactProperties: Record<string, string> = {
      email,
      firstname: name.split(' ')[0],
      lastname: name.split(' ').slice(1).join(' '),
      city: location || '',
      message: message || '',
    };

    if (space) contactProperties.space_type = space;
    if (collection) contactProperties.interested_collection = collection;

    let contactId: string;
    try {
      const contactResponse = await hubspotClient.crm.contacts.basicApi.create({
        properties: contactProperties,
        associations: [],
      });
      contactId = contactResponse.id;
    } catch (error: any) {
      if (
        error.code === 409 &&
        error.body?.message?.includes('Contact already exists')
      ) {
        const match = error.body.message.match(/Existing ID: (\d+)/);
        if (match && match[1]) {
          contactId = match[1];
          // Update the existing contact with the latest inquiry info
          await hubspotClient.crm.contacts.basicApi.update(contactId, {
            properties: contactProperties,
          });
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    const dealName = productName
      ? `${name} - ${productName}`
      : `${name} - Website Inquiry`;

    const dealProperties: Record<string, string> = {
      dealname: dealName,
      pipeline: 'default',
      dealstage: 'appointmentscheduled', // adjust based on actual HubSpot pipeline stage IDs if needed
      hs_lead_status: 'NEW',
      inquiry_message: message || '',
    };

    if (pageUrl) dealProperties.source_page_url = pageUrl;
    if (productName) dealProperties.product_name = productName;
    if (productSlug) dealProperties.product_slug = productSlug;
    if (collection) dealProperties.collection_name = collection;

    const dealResponse = await hubspotClient.crm.deals.basicApi.create({
      properties: dealProperties,
      associations: [],
    });

    const dealId = dealResponse.id;

    await hubspotClient.crm.associations.v4.basicApi.create(
      'contacts',
      contactId,
      'deals',
      dealId,
      [
        {
          associationCategory: AssociationSpecAssociationCategoryEnum.HubspotDefined,
          associationTypeId: 4,
        },
      ]
    );

    return NextResponse.json({ success: true, contactId, dealId });
  } catch (error: any) {
    console.error('HubSpot Integration Error:', error);
    
    // Zod validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // HubSpot API error
    if (error.code >= 400 && error.code < 500) {
      return NextResponse.json(
        { success: false, error: 'CRM submission rejected', details: error.message },
        { status: error.code }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

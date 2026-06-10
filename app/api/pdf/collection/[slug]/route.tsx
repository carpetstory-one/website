import { NextResponse } from 'next/server';
import { getSanityCollections } from '@/lib/sanity';
import { getAllRugs } from '@/lib/rugs';
import { CollectionPDF } from '@/components/pdf/CollectionPDF';
import { renderToBuffer } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const collections = await getSanityCollections();
    const col = collections.find((c) => c.slug === slug);

    if (!col) {
      return new NextResponse('Collection not found', { status: 404 });
    }

    const allRugs = getAllRugs(collections);
    const collectionRugs = allRugs.filter((r) => r.collectionSlug === col.slug);

    // Read the logo into a base64 data URI
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
    let logoBase64 = '';
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }

    // Map rugs to what CollectionPDF expects
    const rugsForPdf = collectionRugs.map((r) => {
      // Ensure image is JPG for react-pdf/renderer using Sanity's fm parameter
      let imageUrl = r.image;
      if (imageUrl) {
        imageUrl = imageUrl.includes('?') ? `${imageUrl}&fm=jpg` : `${imageUrl}?fm=jpg`;
      }
      
      return {
        name: r.name,
        image: imageUrl,
        origin: col.meta?.origin,
        materials: r.material,
      };
    });

    const pdfBuffer = await renderToBuffer(
      <CollectionPDF
        collectionName={col.name}
        collectionDescription={col.description}
        rugs={rugsForPdf}
        logoBuffer={logoBase64}
      />
    );

    // Return the generated PDF
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${col.slug}-collection.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}

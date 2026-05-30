import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Carpetstory';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // We can load a font from an external URL for the OG image
  // However, since we are constrained to what's available without external fetches in this setup,
  // we'll use a system font fallback that looks elegant (serif) for the OG image generation.

  return new ImageResponse(
    <div
      style={{
        background: '#F5F1EA',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          right: 40,
          bottom: 40,
          border: '1px solid rgba(26,24,23,0.1)',
          display: 'flex',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Small medallion mark */}
        <div
          style={{
            width: 48,
            height: 48,
            background: '#6E1F23',
            borderRadius: '50%',
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 100,
            fontStyle: 'italic',
            color: '#1A1817',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textAlign: 'center',
          }}
        >
          Carpetstory
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#3A3735',
            marginTop: 20,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
          }}
        >
          Jaipur, India
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}

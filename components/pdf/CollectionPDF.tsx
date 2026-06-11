import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 0,
  },
  // --- Page 1 & Final Page ---
  brandPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogo: {
    width: 150,
  },
  brandName: {
    fontFamily: 'Times-Roman',
    fontSize: 28,
    color: '#423330',
    marginTop: 20,
    letterSpacing: 4,
  },

  // --- Page 2: Handcrafted / Heritage / Heirloom ---
  splitPageLeft: {
    flex: 1,
    padding: 60,
    justifyContent: 'center',
  },
  splitPageRight: {
    flex: 1,
    backgroundColor: '#1E1614',
    padding: 50,
    justifyContent: 'center',
  },
  splitTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 28,
    color: '#1a1817',
    marginBottom: 15,
    letterSpacing: 1,
  },
  darkColumnBlock: {
    marginBottom: 40,
  },
  darkColumnHeader: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 10,
  },
  darkColumnText: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#A09D9C',
    lineHeight: 1.6,
  },

  // --- Page 3 & Post-Product: Dark Quote Pages ---
  darkQuotePage: {
    backgroundColor: '#1A1110',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    fontFamily: 'Times-Roman',
    fontSize: 32,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  quoteSymbol: {
    fontFamily: 'Times-Roman',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 40,
  },

  // --- Collection Intro Page ---
  collectionPageContainer: {
    padding: 60,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 46,
    fontWeight: 'normal',
    color: '#1a1817',
    textAlign: 'center',
    marginBottom: 40,
    textTransform: 'capitalize',
  },
  bodyText: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 2,
    color: '#555555',
    textAlign: 'center',
    maxWidth: '70%',
  },

  // --- Product Pages ---
  rugsPageContainer: {
    paddingTop: 10,
    paddingBottom: 25,
    paddingLeft: 40,
    paddingRight: 40,
    flex: 1,
    justifyContent: 'center',
  },
  rugsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rugCard: {
    width: '48%',
    marginBottom: 8,
    alignItems: 'center',
  },
  rugImageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  rugImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  rugTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 18,
    color: '#1a1817',
    marginBottom: 2,
    textAlign: 'center',
  },
  rugMeta: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },

  // --- Contact Page ---
  contactPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
    backgroundColor: '#1E1614',
  },
  contactTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 40,
    letterSpacing: 2,
  },
  contactHighlight: {
    fontFamily: 'Times-Roman',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  contactText: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#D0CDCC',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: '#aaaaaa',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // --- Watermark ---
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    opacity: 0.12,
  },
  watermarkLogo: {
    width: 300,
  },
});

type Rug = {
  name: string;
  image: string;
  origin?: string;
  materials?: string;
};

type Props = {
  collectionName: string;
  collectionDescription: string;
  rugs: Rug[];
  logoBuffer: string;
};

export function CollectionPDF({
  collectionName,
  collectionDescription,
  rugs,
  logoBuffer,
}: Props) {
  // Chunk rugs into arrays of 4 for each page (landscape)
  const chunkedRugs = [];
  for (let i = 0; i < rugs.length; i += 4) {
    chunkedRugs.push(rugs.slice(i, i + 4));
  }

  const Watermark = () => logoBuffer ? (
    <View style={styles.watermarkContainer}>
      <Image src={logoBuffer} style={styles.watermarkLogo} />
    </View>
  ) : null;

  return (
    <Document>
      {/* Page 1: Brand / Logo */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.brandPageContainer}>
          {logoBuffer ? (
            <Image src={logoBuffer} style={styles.brandLogo} />
          ) : null}
          <Text style={styles.brandName}>carpetstory</Text>
        </View>
      </Page>

      {/* Page 2: Handcrafted. Heritage. Heirloom. */}
      <Page size="A4" orientation="landscape" style={[styles.page, { flexDirection: 'row' }]}>
        <Watermark />
        <View style={styles.splitPageLeft}>
          <Text style={styles.splitTitle}>Handcrafted.</Text>
          <Text style={styles.splitTitle}>Heritage.</Text>
          <Text style={styles.splitTitle}>Heirloom.</Text>
        </View>
        <View style={styles.splitPageRight}>
          <View style={styles.darkColumnBlock}>
            <Text style={styles.darkColumnHeader}>HANDCRAFTED</Text>
            <Text style={styles.darkColumnText}>
              Each piece woven with generations of artisan expertise and unmatched attention to detail
            </Text>
          </View>
          <View style={styles.darkColumnBlock}>
            <Text style={styles.darkColumnHeader}>HERITAGE</Text>
            <Text style={styles.darkColumnText}>
              Rooted in centuries of tradition — a vibrant mosaic of timeless ancestral artistry
            </Text>
          </View>
          <View style={styles.darkColumnBlock}>
            <Text style={styles.darkColumnHeader}>HEIRLOOM</Text>
            <Text style={styles.darkColumnText}>
              Created to be treasured and passed through generations — more than an object, a legacy
            </Text>
          </View>
        </View>
      </Page>

      {/* Page 3: Walk the path of richness */}
      <Page size="A4" orientation="landscape" style={styles.darkQuotePage}>
        <Watermark />
        <Text style={styles.quoteSymbol}>§</Text>
        <Text style={styles.quoteText}>walk the path of richness</Text>
      </Page>

      {/* Page 4: Collection Name & Description */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Watermark />
        <View style={styles.collectionPageContainer}>
          <Text style={styles.collectionTitle}>{collectionName}</Text>
          <Text style={styles.bodyText}>{collectionDescription}</Text>
          <Text style={styles.footerText}>Carpetstory</Text>
        </View>
      </Page>

      {/* Collection Photos (4 per page, landscape, no origin, no collection name) */}
      {chunkedRugs.map((chunk, index) => (
        <Page key={`rug-page-${index}`} size="A4" orientation="landscape" style={styles.page}>
          <Watermark />
          <View style={styles.rugsPageContainer}>
            <View style={styles.rugsGrid}>
              {chunk.map((rug, idx) => (
                <View key={`rug-${idx}`} style={styles.rugCard}>
                  <View style={styles.rugImageContainer}>
                    {rug.image ? (
                      <Image src={rug.image} style={styles.rugImage} />
                    ) : null}
                  </View>
                  <Text style={styles.rugTitle}>{rug.name}</Text>
                  {rug.materials && (
                    <Text style={styles.rugMeta}>{rug.materials}</Text>
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.footerText}>
              {index + 1} / {chunkedRugs.length}
            </Text>
          </View>
        </Page>
      ))}

      {/* Post-Product Image: Timeless Elegance */}
      <Page size="A4" orientation="landscape" style={styles.darkQuotePage}>
        <Watermark />
        <Text style={styles.quoteSymbol}>§</Text>
        <Text style={styles.quoteText}>Timeless Elegance</Text>
      </Page>

      {/* Contact Details */}
      <Page size="A4" orientation="landscape" style={styles.contactPage}>
        <Watermark />
        <View style={styles.contactPage}>
          <Text style={styles.contactTitle}>Get in Touch</Text>
          <Text style={styles.contactHighlight}>Aashrit Garg</Text>
          <Text style={styles.contactText}>Founder, Carpetstory</Text>
          <Text style={styles.contactText}>+91 96024 92022</Text>
          <Text style={styles.contactText}>contact@carpetstory.one</Text>
          <Text style={styles.contactText}>Jaipur, Rajasthan, India</Text>
        </View>
      </Page>

      {/* Final Page: Brand/Logo name again */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.brandPageContainer}>
          {logoBuffer ? (
            <Image src={logoBuffer} style={styles.brandLogo} />
          ) : null}
          <Text style={styles.brandName}>carpetstory</Text>
        </View>
      </Page>
    </Document>
  );
}

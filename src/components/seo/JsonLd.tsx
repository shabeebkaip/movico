import { CMSSeo } from '@/lib/cms/types';

interface JsonLdProps {
  seo: CMSSeo;
  page?: keyof CMSSeo['pages'];
  faqItems?: Array<{ question: string; answer: string }>;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function JsonLd({ seo, page, faqItems, breadcrumbs }: JsonLdProps) {
  const schemas: object[] = [];

  // Organization schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seo.schema.organization.name,
    url: seo.schema.organization.url,
    logo: seo.schema.organization.logo,
    description: seo.schema.organization.description,
    sameAs: seo.schema.organization.sameAs.filter(Boolean),
  });

  // LocalBusiness schema
  if (seo.schema.localBusiness.enabled) {
    const lb = seo.schema.localBusiness;
    schemas.push({
      '@context': 'https://schema.org',
      '@type': lb.type || 'LocalBusiness',
      name: lb.name,
      telephone: lb.phone,
      email: lb.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: lb.streetAddress,
        addressLocality: lb.city,
        addressRegion: lb.region,
        postalCode: lb.postalCode,
        addressCountry: lb.country,
      },
    });
  }

  // FAQ schema
  if (faqItems && faqItems.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  // Breadcrumb schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  void page;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

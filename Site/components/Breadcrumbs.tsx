import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://ouvalargent.com',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href ? { item: `https://ouvalargent.com${item.href}` } : {}),
      })),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Fil d'Ariane" className="max-w-[1800px] mx-auto px-[16px] lg:px-[48px] pt-[90px] pb-0">
        <ol className="flex items-center gap-2 text-sm text-text-muted">
          <li>
            <Link href="/" className="hover:text-accent-electric transition-colors">
              Accueil
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-text-muted/50">/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-accent-electric transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-primary">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

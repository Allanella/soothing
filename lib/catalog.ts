export type CatalogProduct = {
  id: string
  title: string
  category: string
  price: number
  currency: 'UGX' | 'USD'
  description: string
  image: string
}

export const PRODUCT_CATEGORIES = [
  'Seating',
  'Tables',
  'Lighting',
  'Storage',
  'Screens',
  'Display',
  'Workspace',
  'Outdoor',
  'Accessories',
  'Residential',
  'Commercial',
  'Hospitality',
  'Healthcare',
  'Retail',
] as const

/** Gallery / services images available to assign to products. */
export const galleryImageOptions = [
  'DSC00777_HDR.jpg',
  'DSC00798_HDR.jpg',
  'DSC00789_HDR.jpg',
  'DSC00810_HDR.jpg',
  'DSC00813_HDR.jpg',
  'DSC00807_HDR_HDR.jpg',
  'DSC00819_HDR.jpg',
  'DSC00831_HDR.jpg',
  'DSC00816_HDR.jpg',
  'DSC00843_HDR.jpg',
  'DSC00840_HDR 1.jpg',
  'DSC00834_HDR.jpg',
  'DSC00858_HDR.jpg',
  'DSC00852_HDR.jpg',
  'DSC00846_HDR.jpg',
  'DSC00882_HDR.jpg',
  'DSC00903_HDR 1.jpg',
  'DSC00894_HDR.jpg',
  'DSC00969_HDR.jpg',
  'DSC00981_HDR.jpg',
  'DSC01008_HDR.jpg',
  'DSC01011_HDR.jpg',
  'DSC01017_HDR.jpg',
  'DSC01032_HDR.jpg',
  'DSC01035_HDR.jpg',
  'DSC01191_HDR.jpg',
  'DSC00771_HDR.jpg',
  'DSC00963_HDR.jpg',
  ...Array.from({ length: 23 }, (_, i) => `room${i + 1}.jpeg`),
]

export function normalizeProductRow(row: Record<string, unknown>): CatalogProduct {
  const image =
    String(row.imageUrl ?? row.image_url ?? row.image ?? '').replace(/^\//, '') ||
    galleryImageOptions[0]

  return {
    id: String(row.id ?? `row-${String(row.title ?? 'item')}-${String(row.price ?? 0)}`),
    title: String(row.title ?? 'Untitled'),
    category: String(row.category ?? 'Accessories'),
    price: Number(row.price) || 0,
    currency: (row.currency as CatalogProduct['currency']) || 'UGX',
    description: String(row.description ?? ''),
    image,
  }
}

/** Curated shop pieces using gallery / services imagery with placeholder prices. */
export const catalogProducts: CatalogProduct[] = [
  {
    id: 'p01',
    title: 'Lakeside Lounge Chair',
    category: 'Seating',
    price: 1850000,
    currency: 'UGX',
    description: 'Hand-finished timber frame with woven rattan and soft ivory upholstery.',
    image: 'DSC00777_HDR.jpg',
  },
  {
    id: 'p02',
    title: 'Champaign Console Table',
    category: 'Tables',
    price: 2400000,
    currency: 'UGX',
    description: 'Slim brass-accent console for entry halls and living galleries.',
    image: 'DSC00798_HDR.jpg',
  },
  {
    id: 'p03',
    title: 'Kololo Pendant Cluster',
    category: 'Lighting',
    price: 980000,
    currency: 'UGX',
    description: 'Three-globe pendant set in brushed champaign metal.',
    image: 'DSC00789_HDR.jpg',
  },
  {
    id: 'p04',
    title: 'Stone Plinth Side Table',
    category: 'Tables',
    price: 1250000,
    currency: 'UGX',
    description: 'Sculptural natural stone top on a discreet timber pedestal.',
    image: 'DSC00810_HDR.jpg',
  },
  {
    id: 'p05',
    title: 'Archive Daybed',
    category: 'Seating',
    price: 3200000,
    currency: 'UGX',
    description: 'Wide daybed with linen cushions for quiet reading corners.',
    image: 'DSC00813_HDR.jpg',
  },
  {
    id: 'p06',
    title: 'Hospitality Bar Cart',
    category: 'Storage',
    price: 1450000,
    currency: 'UGX',
    description: 'Mobile brass and glass cart for entertaining suites.',
    image: 'DSC00819_HDR.jpg',
  },
  {
    id: 'p07',
    title: 'Woven Wall Screen',
    category: 'Screens',
    price: 2100000,
    currency: 'UGX',
    description: 'Floor-standing timber screen with handwoven panels.',
    image: 'DSC00831_HDR.jpg',
  },
  {
    id: 'p08',
    title: 'Healing Suite Bench',
    category: 'Seating',
    price: 890000,
    currency: 'UGX',
    description: 'Calm oak bench with soft cushioning for waiting spaces.',
    image: 'DSC00843_HDR.jpg',
  },
  {
    id: 'p09',
    title: 'Retail Display Plinth',
    category: 'Display',
    price: 760000,
    currency: 'UGX',
    description: 'Matte plaster plinth for curated product storytelling.',
    image: 'DSC00858_HDR.jpg',
  },
  {
    id: 'p10',
    title: 'Kigo Dining Table',
    category: 'Tables',
    price: 4500000,
    currency: 'UGX',
    description: 'Eight-seat solid timber dining table with quiet joinery detail.',
    image: 'DSC00882_HDR.jpg',
  },
  {
    id: 'p11',
    title: 'Penthouse Floor Lamp',
    category: 'Lighting',
    price: 1120000,
    currency: 'UGX',
    description: 'Tall linen shade with brushed metal stem for panoramic rooms.',
    image: 'DSC00969_HDR.jpg',
  },
  {
    id: 'p12',
    title: 'Executive Desk Set',
    category: 'Workspace',
    price: 3800000,
    currency: 'UGX',
    description: 'Bespoke desk with leather writing surface and drawer unit.',
    image: 'DSC01011_HDR.jpg',
  },
  {
    id: 'p13',
    title: 'Villa Outdoor Lounge Set',
    category: 'Outdoor',
    price: 5200000,
    currency: 'UGX',
    description: 'Weathered teak sofa and chairs for lakeside terraces.',
    image: 'DSC01035_HDR.jpg',
  },
  {
    id: 'p14',
    title: 'Studio Accent Armchair',
    category: 'Seating',
    price: 1650000,
    currency: 'UGX',
    description: 'Compact lounge chair in warm ivory bouclé.',
    image: 'room3.jpeg',
  },
  {
    id: 'p15',
    title: 'Material Sample Tray',
    category: 'Accessories',
    price: 320000,
    currency: 'UGX',
    description: 'Curated finish board for client presentations.',
    image: 'room7.jpeg',
  },
  {
    id: 'p16',
    title: 'Ceramic Vessel Pair',
    category: 'Accessories',
    price: 480000,
    currency: 'UGX',
    description: 'Hand-thrown vessels in soft clay tones.',
    image: 'room12.jpeg',
  },
]

export function formatPrice(price: number, currency: CatalogProduct['currency'] = 'UGX') {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

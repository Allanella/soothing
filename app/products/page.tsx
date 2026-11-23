'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Menu, User, X } from 'lucide-react'
import {
  catalogProducts,
  formatPrice,
  getDiscountPercent,
  getSalePrice,
  normalizeProductRow,
  type CatalogProduct,
} from '@/lib/catalog'

const LOGO_SRC = '/Soothing_Interiors-02.png'

const DISCOUNT_OFFERS = [
  {
    id: 'd1',
    badge: '15% OFF',
    title: 'Seating Edit',
    detail: 'Lounge chairs, daybeds, and accent seating for residential projects this season.',
    code: 'SEAT15',
    tone: 'ivory' as const,
  },
  {
    id: 'd2',
    badge: '20% OFF',
    title: 'Lighting Collection',
    detail: 'Pendants, floor lamps, and fixtures curated from our studio archive.',
    code: 'LIGHT20',
    tone: 'charcoal' as const,
  },
  {
    id: 'd3',
    badge: 'BUNDLE',
    title: 'Dining Pairing',
    detail: 'Save when you enquire on a dining table with matching seating for one room.',
    code: 'DINING',
    tone: 'gold' as const,
  },
]

const NAV_ITEMS = [
  { label: 'Home', id: 'home', path: '/' },
  { label: 'About', id: 'about', path: '/#about' },
  { label: 'Team', id: 'team', path: '/#team' },
  { label: 'Services', id: 'services', path: '/services' },
  { label: 'Products', id: 'products', path: '/products' },
  { label: 'Portfolio', id: 'portfolio', path: '/#portfolio' },
  { label: 'Philosophy', id: 'philosophy', path: '/#philosophy' },
  { label: 'Process', id: 'process', path: '/#process' },
  { label: 'Contact', id: 'contact', path: '/#contact' },
]

function BrandLogo({ onClick }: { onClick?: () => void }) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  return (
    <Link href="/" className="nb-brand" aria-label="Soothing Interiors, home" onClick={onClick}>
      <span className="nb-logo">
        {failed ? (
          <span className="nb-logo-fallback" aria-hidden="true">SI</span>
        ) : (
          <img ref={imgRef} src={LOGO_SRC} alt="Soothing Interiors" width={44} height={44} onError={() => setFailed(true)} />
        )}
      </span>
      <span className="nb-wordmark">
        <strong>SOOTHING</strong>
        <small>INTERIORS</small>
      </span>
    </Link>
  )
}

function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      setScrolled(y > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      headerRef.current?.style.setProperty('--nb-progress', max > 0 ? String(Math.min(y / max, 1)) : '0')
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <header ref={headerRef} className={`nb${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}>
      <div className="nb-bar">
        <BrandLogo onClick={closeMenu} />
        <nav className="nb-links" aria-label="Primary navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link href={item.path} className={item.id === 'products' ? 'is-active' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nb-actions">
          <Link href="/#contact" className="nb-cta">Enquire <ArrowUpRight aria-hidden="true" /></Link>
          <Link href="/login" className="nb-admin" aria-label="Admin login"><User aria-hidden="true" /></Link>
          <button type="button" className="nb-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <span className="nb-progress" aria-hidden="true" />
      </div>

      <div id="mobile-menu" className="nb-panel" aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <ol>
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id}>
                <Link href={item.path} onClick={closeMenu} className={item.id === 'products' ? 'is-active' : undefined}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="nb-panel-foot">
          <Link href="/#contact" className="nb-cta nb-cta-block" onClick={closeMenu}>Enquire <ArrowUpRight aria-hidden="true" /></Link>
          <a href="mailto:info@soothinginteriorsltd.com">info@soothinginteriorsltd.com</a>
          <a href="tel:+256775818496">+256 775 818 496</a>
        </div>
      </div>
    </header>
  )
}

export default function ProductsPage() {
  const [filter, setFilter] = useState('All')
  const [items, setItems] = useState<CatalogProduct[]>(catalogProducts)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (!cancelled && res.ok && Array.isArray(data) && data.length > 0) {
          setItems(data.map((row: Record<string, unknown>) => normalizeProductRow(row)))
        }
      } catch {
        // Keep built-in dummy catalog when the API/DB is unavailable
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filters = ['All', ...Array.from(new Set(items.map((p) => p.category)))]
  const products = filter === 'All' ? items : items.filter((p) => p.category === filter)

  return (
    <main className="site-shell bg-[#f2ede2] text-[#181b1e]" style={{ paddingTop: '120px' }}>
      <SiteHeader />

      <section className="page-width products-hero">
        <p className="eyebrow dark">STUDIO COLLECTION</p>
        <h1>
          Pieces curated<br /><em>for living.</em>
        </h1>
        <p>
          Selected furnishings, lighting, and accessories drawn from our project galleries—each with a guide price for planning your next space.
        </p>
      </section>

      <section className="page-width discount-section" aria-label="Current offers">
        <div className="discount-grid">
          {DISCOUNT_OFFERS.map((offer) => (
            <article className={`discount-card discount-card--${offer.tone}`} key={offer.id}>
              <span className="discount-badge">{offer.badge}</span>
              <h2>{offer.title}</h2>
              <p>{offer.detail}</p>
              <div className="discount-foot">
                <span className="discount-code">Code {offer.code}</span>
                <a
                  href={`mailto:info@soothinginteriorsltd.com?subject=${encodeURIComponent(`Offer enquiry: ${offer.title} (${offer.code})`)}`}
                  className="discount-cta"
                >
                  Claim offer <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-width products-toolbar" aria-label="Filter products">
        {filters.map((name) => (
          <button
            key={name}
            type="button"
            className={`products-filter${filter === name ? ' is-active' : ''}`}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </section>

      <section className="page-width products-section">
        <div className="products-grid">
          {products.map((product) => {
            const discount = getDiscountPercent(product)
            const salePrice = getSalePrice(product)
            return (
              <article className="product-card" key={product.id}>
                <div className="product-media">
                  <img
                    src={`/${product.image}`}
                    alt={product.title}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={1000}
                  />
                  <span className="product-sale-badge">{discount}% OFF</span>
                </div>
                <div className="product-body">
                  <span className="product-category">{product.category}</span>
                  <h2>{product.title}</h2>
                  <p>{product.description}</p>
                  <div className="product-meta">
                    <div className="product-pricing">
                      <strong className="product-price">{formatPrice(salePrice, product.currency)}</strong>
                      <span className="product-price-was">{formatPrice(product.price, product.currency)}</span>
                    </div>
                    <a
                      href={`mailto:info@soothinginteriorsltd.com?subject=${encodeURIComponent(`Enquiry about ${product.title} (${discount}% off)`)}`}
                      className="product-enquire"
                    >
                      Enquire <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <p className="products-note">
          All pieces currently include a seasonal discount. Sale prices are indicative and may vary with materials, finishes, and project scope. Contact the studio for a tailored quotation.
        </p>
      </section>

      <footer className="footer" id="contact">
        <div className="page-width footer-grid">
          <div>
            <BrandLogo />
            <p className="footer-note">Curated for life.<br />Crafted for legacy.</p>
          </div>
          <div>
            <p className="eyebrow">LOCATION & STUDIO</p>
            <p className="footer-address">L2 04, Aston Mall<br />Ntinda-Kiwatule Rd, Kampala<br />Uganda</p>
          </div>
          <div>
            <p className="eyebrow">START A CONVERSATION</p>
            <a href="mailto:info@soothinginteriorsltd.com" className="footer-email">info@soothinginteriorsltd.com</a>
            <a href="tel:+256775818496" className="footer-phone">+256 775 818 496</a>
          </div>
          <div>
            <p className="eyebrow">FOLLOW ALONG</p>
            <p className="socials">INSTAGRAM &nbsp; / &nbsp; PINTEREST &nbsp; / &nbsp; LINKEDIN</p>
          </div>
        </div>
        <div className="page-width footer-bottom">
          <span>© 2026 SOOTHING INTERIORS. ALL RIGHTS RESERVED.</span>
          <span className="footer-credit">
            DEVELOPED BY BALIDDAWA ALLAN
            <a href="tel:+256700966715">0700966715</a>
            <span className="footer-credit-sep">/</span>
            <a href="tel:+256785639406">0785639406</a>
          </span>
        </div>
      </footer>
    </main>
  )
}

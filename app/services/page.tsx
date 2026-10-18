'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Menu, User, X } from 'lucide-react'

const LOGO_SRC = '/Soothing_Interiors-02.png'

const NAV_ITEMS = [
  { label: 'Home', id: 'home', path: '/' },
  { label: 'About', id: 'about', path: '/#about' },
  { label: 'Team', id: 'team', path: '/#team' },
  { label: 'Services', id: 'services', path: '/services' },
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
                <Link href={item.path} className={item.id === 'services' ? 'is-active' : undefined}>
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
                <Link href={item.path} onClick={closeMenu} className={item.id === 'services' ? 'is-active' : undefined}>
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

export default function ServicesPage() {
  return (
    <main className="site-shell" style={{ paddingTop: '120px' }}>
      <SiteHeader />
      
      <section className="page-width" style={{ padding: '40px 0 20px', textAlign: 'center' }}>
        <p className="eyebrow dark">OUR WORK</p>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: '24px' }}>
          Spaces with<br /><em>purpose.</em>
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', color: '#667065', fontSize: '15px', lineHeight: 1.8 }}>
          We serve residential, commercial, hospitality, healthcare, retail, institutional, and corporate clients through an integrated design approach.
        </p>
      </section>

      <section className="page-width" style={{ padding: '20px 0 120px' }}>
        <div className="services-grid">
          {Array.from({ length: 23 }).map((_, index) => (
            <div key={index} className="service-image-card">
              <img 
                src={`/room${index + 1}.jpeg`} 
                alt={`Interior project detail ${index + 1}`} 
                loading="lazy"
              />
              <div className="service-image-overlay">
                <span>{String(index + 1).padStart(2, '0')} / PROJECT</span>
                <div className="service-image-icon"><ArrowUpRight size={18} /></div>
              </div>
            </div>
          ))}
        </div>
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
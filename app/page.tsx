'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Menu,
  User,
  X,
} from 'lucide-react'

// Updated to your new logo
const LOGO_SRC = '/Soothing_Interiors-04.png'

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Team', id: 'team' },
  { label: 'Services', id: 'services' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'Philosophy', id: 'philosophy' },
  { label: 'Process', id: 'process' },
  { label: 'Contact', id: 'contact' },
]

const specialisations = [
  ['01', 'RESIDENTIAL', 'Homes designed for generations.', 'hero-interior.png'],
  ['02', 'COMMERCIAL & CORPORATE', 'Spaces that elevate business performance.', 'kigo-residence.png'],
  ['03', 'HOSPITALITY', 'Experiences people remember.', 'hero-interior.png'],
  ['04', 'HEALTHCARE & INSTITUTIONAL', 'Environments designed for healing and learning.', 'kigo-residence.png'],
  ['05', 'RETAIL & LANDSCAPES', 'Immersive spatial experiences in harmony with nature.', 'hero-interior.png'],
]

const processSteps = [
  { number: '01', title: 'Discover', description: 'We listen carefully and observe thoughtfully to understand your lifestyle, goals, preferences, and the atmosphere you want your space to hold.' },
  { number: '02', title: 'Curate', description: 'We shape an intentional design direction with thoughtful palettes, honest materials, finishes, furnishings, and seamless spatial flow.' },
  { number: '03', title: 'Refine', description: 'Every drawing, specification, and detail is rigorously reviewed and elevated to balance creativity with discipline and elegance with functionality.' },
  { number: '04', title: 'Deliver', description: 'We guide the project through disciplined execution and meticulous craftsmanship so your space is brought to life with total confidence and care.' },
]

const teamMembers = [
  { name: 'Lead Architect', role: 'Senior Spatial Designer' },
  { name: 'Project Director', role: 'Head of Execution & Procurement' },
  { name: 'Interior Stylist', role: 'FF&E Specialist' },
]

function BrandLogo({ onClick }: { onClick?: () => void }) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!LOGO_SRC.endsWith('.svg') && img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  return (
    <Link href="#home" className="nb-brand" aria-label="Soothing Interiors, home" onClick={onClick}>
      <span className="nb-logo">
        {failed ? (
          <span className="nb-logo-fallback" aria-hidden="true">SI</span>
        ) : (
          <img ref={imgRef} src={LOGO_SRC} alt="" width={44} height={44} onError={() => setFailed(true)} />
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
  const [active, setActive] = useState('home')
  const headerRef = useRef<HTMLElement>(null)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > 24)
      headerRef.current?.style.setProperty('--nb-progress', max > 0 ? String(Math.min(y / max, 1)) : '0')
      if (max > 0 && max - y < 8) setActive('contact')
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
    if (!('IntersectionObserver' in window)) return
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => el !== null)
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id) }) },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
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

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1180px)')
    const onChange = () => { if (mq.matches) setMenuOpen(false) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header ref={headerRef} className={`nb${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}>
      <div className="nb-bar">
        <BrandLogo onClick={closeMenu} />
        <nav className="nb-links" aria-label="Primary navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link href={item.id === 'services' ? '/services' : `#${item.id}`} className={active === item.id ? 'is-active' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nb-actions">
          <Link href="#contact" className="nb-cta">Enquire <ArrowUpRight aria-hidden="true" /></Link>
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
              <li key={item.id} style={{ '--i': i } as CSSProperties}>
                <Link href={item.id === 'services' ? '/services' : `#${item.id}`} onClick={closeMenu} className={active === item.id ? 'is-active' : undefined}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="nb-panel-foot">
          <Link href="#contact" className="nb-cta nb-cta-block" onClick={closeMenu}>Enquire <ArrowUpRight aria-hidden="true" /></Link>
          <a href="mailto:info@soothinginteriorsltd.com">info@soothinginteriorsltd.com</a>
          <a href="tel:+256775818496">+256 775 818 496</a>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" id="home">
        <SiteHeader />
        <div className="hero-inner page-width">
          <div className="hero-index"><span className="active">01</span><span>02</span><span>03</span></div>
          <div className="hero-copy">
            <p className="eyebrow">EXCEPTIONAL INTERIORS</p>
            <h1>Curated for Life.<br /><em>Crafted for Legacy.</em></h1>
            <p className="hero-lede">Bespoke interior design and complete spatial experiences for distinguished residential, commercial, hospitality, healthcare, retail, and corporate environments across Africa and beyond.</p>
            <Link href="#portfolio" className="text-link">EXPLORE OUR WORK <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="hero-location">KIGO RESIDENCE <span>|</span> RESIDENTIAL <span>|</span> UGANDA <ArrowUpRight aria-hidden="true" /></div>
        </div>
        <div className="hero-scroll">SCROLL TO DISCOVER <ArrowDownRight aria-hidden="true" /></div>
      </section>

      <section className="manifesto page-width" id="about">
        <p className="eyebrow dark">OUR STORY & APPROACH</p>
        <h2>Design that begins with <em>people, not spaces.</em></h2>
        <p className="manifesto-copy">
          Soothing Interiors was established on the conviction that thoughtfully designed spaces have the power to shape how people live, work, think, connect, and flourish. We reject short-lived trends in favor of timeless principles, believing that true luxury is defined by purpose, intention, comfort, and extraordinary craftsmanship rather than excess.
        </p>
        <div className="motto-grid">
          <div className="motto-card">
            <h3>Curated for Life</h3>
            <p>Every environment is designed around the people who live, work, gather, heal, learn, create, and celebrate within it. Every material selection, proportion, and finish is carefully considered to enrich everyday life.</p>
          </div>
          <div className="motto-card">
            <h3>Crafted for Legacy</h3>
            <p>Our responsibility extends far beyond project completion. We create spaces that remain relevant, valuable, and inspiring for generations—spaces families inherit and businesses grow within.</p>
          </div>
        </div>
      </section>

      <section className="team-section page-width" id="team">
        <div className="section-intro">
          <p className="eyebrow dark">LEADERSHIP & STUDIO TEAM</p>
          <h2>The Minds Behind<br /><em>The Legacy.</em></h2>
          <p>Our studio brings together creative vision, technical discipline, and precise execution.</p>
        </div>

        <div className="founder-profile-card">
          <div className="founder-image-container">
            <div className="image-placeholder founder-placeholder">
              <span>FOUNDER PORTRAIT</span>
            </div>
          </div>
          <div className="founder-details">
            <p className="eyebrow">FOUNDER & PRINCIPAL DESIGNER</p>
            <h3>Founder Name</h3>
            <p className="founder-bio">
              Driven by a profound belief in spatial transformation, the Founder established Soothing Interiors to redefine luxury across East Africa. With a background spanning spatial architecture, procurement, and art direction, they guide every project through careful listening, disciplined planning, and an unwavering commitment to craftsmanship.
            </p>
            <blockquote className="founder-quote">
              “Luxury is defined by purpose, comfort, and timeless beauty—not excess.”
            </blockquote>
            <div className="founder-links">
              <a href="mailto:info@soothinginteriorsltd.com" aria-label="Email Founder"><Mail size={18} /> Contact Direct</a>
            </div>
          </div>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="image-placeholder member-placeholder">
                <span>TEAM MEMBER</span>
              </div>
              <div className="member-info">
                <h4>{member.name}</h4>
                <p className="member-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vision-mission-section" id="philosophy">
        <div className="page-width vision-mission-grid">
          <div className="vm-card">
            <p className="eyebrow">OUR VISION</p>
            <h3>To become Africa's most respected luxury interior design studio.</h3>
            <p>Recognised globally for creating timeless spaces through exceptional design, innovative thinking, meticulous craftsmanship, and an uncompromising commitment to excellence.</p>
          </div>
          <div className="vm-card">
            <p className="eyebrow">OUR MISSION</p>
            <h3>Delivering complete spatial experiences with precision.</h3>
            <p>To design, curate, and deliver extraordinary environments through technical precision, disciplined project management, and seamless execution—providing an experience defined by trust, transparency, and lasting value.</p>
          </div>
        </div>
      </section>

      <section className="specialisations page-width" id="services">
        <div className="section-intro">
          <p className="eyebrow dark">OUR SPECIALISATIONS</p>
          <h2>Spaces<br /><em>with purpose.</em></h2>
          <p>We serve residential, commercial, hospitality, healthcare, retail, institutional, and corporate clients through an integrated design approach.</p>
          <Link href="/services" className="text-link dark-link">VIEW ALL SERVICES <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="spec-grid">
          {specialisations.map(([number, title, body, image]) => (
            <Link href="/services" className="spec-card" key={number}>
              <img src={`/${image}`} alt="Luxury interior detail" />
              <div className="spec-overlay" />
              <div className="spec-content">
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body} <ArrowUpRight aria-hidden="true" /></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured" id="portfolio">
        <div className="featured-grid page-width">
          <div className="featured-copy">
            <p className="eyebrow">FEATURED PROJECT</p>
            <h2>Kigo<br /><em>Residence</em></h2>
            <p>A quiet dialogue between architecture, landscape and the lives lived within. A lakeside retreat shaped by light, texture and the enduring beauty of place.</p>
            <Link href="/services" className="text-link">VIEW PROJECT <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="project-image">
            <img src="/kigo-residence.png" alt="Kigo Residence living room at night" />
            <div className="image-caption">KIGO RESIDENCE <span>01 / 04</span></div>
          </div>
          <div className="project-meta">
            <div><span>LOCATION</span><strong>KIGO, UGANDA</strong></div>
            <div><span>TYPE</span><strong>RESIDENTIAL</strong></div>
            <div><span>YEAR</span><strong>2025</strong></div>
            <div className="slider-arrows">
              <button aria-label="Previous project"><ArrowLeft /></button>
              <button aria-label="Next project"><ArrowRight /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section page-width" id="process">
        <div className="section-intro">
          <p className="eyebrow dark">HOW WE WORK</p>
          <h2>Our Studio<br /><em>Process.</em></h2>
          <p>A clear, considered process designed to protect the quality of the outcome and make the experience feel composed from beginning to end.</p>
        </div>

        <div className="process-grid">
          {processSteps.map((step) => (
            <article className="process-card" key={step.number}>
              <span className="process-step">{step.number}</span>
              <div className="process-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-promise-banner">
        <div className="page-width">
          <p className="eyebrow light">OUR BRAND PROMISE</p>
          <h2>We listen before we design. We understand before we create. We plan before we build. We refine before we deliver.</h2>
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
            <p className="footer-address">
              L2 04, Aston Mall<br />
              Ntinda-Kiwatule Rd, Kampala<br />
              Uganda
            </p>
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
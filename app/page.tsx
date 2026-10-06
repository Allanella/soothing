'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Menu, Search, X } from 'lucide-react'

const specialisations = [
  ['01', 'RESIDENTIAL', 'Homes designed for generations.', 'hero-interior.png'],
  ['02', 'COMMERCIAL', 'Spaces that elevate business performance.', 'kigo-residence.png'],
  ['03', 'HOSPITALITY', 'Experiences people remember.', 'hero-interior.png'],
  ['04', 'LANDSCAPES', 'Outdoor spaces in harmony with nature.', 'kigo-residence.png'],
]

const processSteps = [
  {
    number: '01',
    title: 'Discover',
    description: 'We begin by understanding your lifestyle, goals, preferences, and the atmosphere you want your home to hold.',
  },
  {
    number: '02',
    title: 'Curate',
    description: 'We shape a design direction with thoughtful palettes, finishes, furnishings, and spatial flow.',
  },
  {
    number: '03',
    title: 'Refine',
    description: 'Every detail is reviewed and elevated to ensure the final result feels seamless and complete.',
  },
  {
    number: '04',
    title: 'Deliver',
    description: 'We guide the project through implementation so your space is brought to life with confidence and care.',
  },
]

const journalPosts = [
  {
    category: 'RESIDENTIAL',
    title: 'Designing with Light: Lessons from the Lake',
    date: 'September 18, 2026',
    readTime: '4 min read',
    image: 'kigo-residence.png',
    alt: 'Kigo Residence living room at night',
    excerpt: 'How the changing light of a lakeside home shaped every material, finish and window we chose.',
    body: [
      'Every project begins with a walk around the site at different hours. At Kigo, the lake taught us the most. In the early morning the light is cool and silver; by late afternoon it turns warm and amber, spilling deep into the rooms.',
      'We let that rhythm guide our decisions. Soft, matte plaster walls hold the morning glow without glare. Natural stone and oiled timber warm up as the sun lowers. Linen and wool soften the edges, so the evening feels like an exhale rather than a performance.',
      'The lesson is simple: a room should never fight its light. Choose finishes that listen to it, and the space will feel calm at any hour. That is the quiet we try to build into every home.',
    ],
  },
  {
    category: 'PHILOSOPHY',
    title: 'The Quiet Luxury of Restraint',
    date: 'August 27, 2026',
    readTime: '3 min read',
    image: 'hero-interior.png',
    alt: 'Luxury interior detail',
    excerpt: 'Why the most memorable rooms are often the ones that say the least.',
    body: [
      'Luxury is often mistaken for abundance. In our experience, it is the opposite: the confidence to leave things out. A single well-made chair, a wall left generously empty, a palette of three colours held with discipline.',
      'Restraint asks more of a designer, not less. Every object has to earn its place, every proportion has to be right, because there is nothing to hide behind. The reward is a room that feels composed, and one that does not tire you over the years.',
      'When we begin a project, we ask clients what they want to feel before we ask what they want to own. The answer to the first question usually removes half of the answers to the second.',
    ],
  },
  {
    category: 'MATERIALS',
    title: 'Materials That Age Gracefully in East Africa',
    date: 'July 9, 2026',
    readTime: '5 min read',
    image: 'hero-interior.png',
    alt: 'Luxury interior detail',
    excerpt: 'Warm climates, strong sun and humid seasons: choosing finishes that improve with time.',
    body: [
      'A beautiful room has to survive real life, and in East Africa real life includes intense sun, seasonal humidity and fine dust. We choose materials with that in mind, favouring those that develop character rather than simply wear out.',
      'Solid hardwoods, honed stone, lime-based plasters and natural fibres all share one quality: they patina. A scratch on oiled timber becomes part of its story. By contrast, glossy laminates and thin veneers tend to show every flaw and rarely recover.',
      'Craft matters as much as the material. Working with skilled local artisans gives us joinery, weaving and metalwork that are made for the place they live in, and that can be repaired for generations rather than replaced.',
    ],
  },
]

const navItems = ['HOME', 'ABOUT', 'SERVICES', 'PORTFOLIO', 'PROCESS', 'JOURNAL', 'CONTACT']

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activePost, setActivePost] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [ready, setReady] = useState(false)

  // Header background once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Gentle reveal-on-scroll (content stays visible if JS or observer is unavailable)
  useEffect(() => {
    setReady(true)
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in-view'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Lock page scroll while the mobile menu or modal is open
  useEffect(() => {
    document.body.style.overflow = menuOpen || enquiryOpen || activePost !== null ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, enquiryOpen, activePost])

  // Close overlays with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setActivePost(null)
        closeEnquiry()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeEnquiry = () => {
    setEnquiryOpen(false)
    setTimeout(() => setSubmitted(false), 300)
  }

  return (
    <main className={ready ? 'site-shell is-ready' : 'site-shell'}>
      {/* HERO SECTION */}
      <section className="hero" id="home">
        <header className={`site-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
          <Link href="#home" className="brand" aria-label="Soothing Interiors home" onClick={() => setMenuOpen(false)}>
            <span className="crest">SI</span>
            <span><strong>SOOTHING</strong><small>INTERIORS</small></span>
          </Link>

          <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === 'HOME' ? '#home' : `#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Link href="/login" className="nav-admin" onClick={() => setMenuOpen(false)}>ADMIN LOGIN</Link>
          </nav>

          <div className="header-actions">
            <button className="outline-btn" onClick={() => { setMenuOpen(false); setEnquiryOpen(true) }}>
              ENQUIRE <ArrowUpRight aria-hidden="true" />
            </button>
            <button className="icon-btn" aria-label="Search"><Search aria-hidden="true" /></button>
            <Link href="/login" className="admin-link">ADMIN LOGIN</Link>
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        <div className="hero-inner page-width">
          <div className="hero-index" aria-hidden="true"><span className="active">01</span><span>02</span><span>03</span></div>
          <div className="hero-copy">
            <p className="eyebrow hero-anim" style={{ animationDelay: '.1s' }}>EXCEPTIONAL INTERIORS</p>
            <h1 className="hero-anim" style={{ animationDelay: '.25s' }}>Curated for Life.<br /><em>Crafted for Legacy.</em></h1>
            <p className="hero-lede hero-anim" style={{ animationDelay: '.4s' }}>Bespoke interior design for distinguished residential, commercial and hospitality spaces across East Africa and beyond.</p>
            <Link href="#portfolio" className="text-link hero-anim" style={{ animationDelay: '.55s' }}>EXPLORE OUR WORK <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="hero-location">KIGO RESIDENCE <span>|</span> RESIDENTIAL <span>|</span> UGANDA <ArrowUpRight aria-hidden="true" /></div>
        </div>

        <div className="hero-scroll">SCROLL TO DISCOVER <ArrowDownRight aria-hidden="true" /></div>
      </section>

      {/* SPECIALISATIONS SECTION */}
      <section className="specialisations page-width" id="services">
        <div className="section-intro" data-reveal>
          <p className="eyebrow dark">OUR SPECIALISATIONS</p>
          <h2>Spaces<br /><em>with purpose.</em></h2>
          <p>We create considered environments that feel deeply personal, beautifully resolved, and made to endure.</p>
          <Link href="#contact" className="text-link dark-link">VIEW ALL SERVICES <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="spec-grid">
          {specialisations.map(([number, title, body, image], i) => (
            <Link
              href="#contact"
              className="spec-card"
              key={number}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <img src={`/${image}`} alt="Luxury interior detail" loading="lazy" />
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

      {/* FEATURED PORTFOLIO */}
      <section className="featured" id="portfolio">
        <div className="featured-grid page-width">
          <div className="featured-copy" data-reveal>
            <p className="eyebrow">FEATURED PROJECT</p>
            <h2>Kigo<br /><em>Residence</em></h2>
            <p>A quiet dialogue between architecture, landscape and the lives lived within. A lakeside retreat shaped by light, texture and the enduring beauty of place.</p>
            <Link href="#contact" className="text-link">VIEW PROJECT <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="project-image" data-reveal style={{ transitionDelay: '120ms' }}>
            <img src="/kigo-residence.png" alt="Kigo Residence living room at night" loading="lazy" />
            <div className="image-caption">KIGO RESIDENCE <span>01 / 04</span></div>
          </div>
          <div className="project-meta" data-reveal>
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

      {/* PROCESS SECTION */}
      <section className="process-section page-width" id="process">
        <div className="section-intro" data-reveal>
          <p className="eyebrow dark">PROCESS</p>
          <h2>How We<br /><em>Work.</em></h2>
          <p>A clear, considered process designed to protect the quality of the outcome and make the experience feel composed from beginning to end.</p>
        </div>

        <div className="process-grid">
          {processSteps.map((step, i) => (
            <article
              className="process-card"
              key={step.number}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className="process-step">{step.number}</span>
              <div className="process-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MANIFESTO / ABOUT */}
      <section className="manifesto page-width" id="about">
        <div data-reveal>
          <p className="eyebrow dark">THE SOOTHING APPROACH</p>
          <h2>Design that gives<br /><em>life room to unfold.</em></h2>
          <p className="manifesto-copy">Our work is grounded in restraint, shaped by context, and always in service of how people want to feel. From first sketch to final detail, we make spaces with a sense of quiet confidence.</p>
          <Link href="#contact" className="text-link dark-link">DISCOVER OUR STORY <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="journal page-width" id="journal">
        <div className="journal-head" data-reveal>
          <div>
            <p className="eyebrow dark">JOURNAL</p>
            <h2>Notes on<br /><em>quiet living.</em></h2>
          </div>
          <p>Thoughts on light, materials and the craft of making spaces that feel like home. Tap a story to read it.</p>
        </div>

        <div className="journal-grid">
          {journalPosts.map((post, i) => (
            <button
              type="button"
              className="journal-card"
              key={post.title}
              onClick={() => setActivePost(i)}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              aria-label={`Read: ${post.title}`}
            >
              <div className="journal-thumb">
                <img src={`/${post.image}`} alt={post.alt} loading="lazy" />
                <span className="journal-tag">{post.category}</span>
              </div>
              <div className="journal-body">
                <span className="journal-meta">{post.date} <i>·</i> {post.readTime}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="journal-read">READ STORY <ArrowRight aria-hidden="true" /></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER & CONTACT */}
      <footer className="footer" id="contact">
        <div className="page-width footer-cta">
          <div>
            <p className="eyebrow">BEGIN YOUR PROJECT</p>
            <h2>Let&apos;s make<br /><em>something enduring.</em></h2>
          </div>
          <button className="cta-btn" onClick={() => setEnquiryOpen(true)}>
            START AN ENQUIRY <ArrowUpRight aria-hidden="true" />
          </button>
        </div>

        <div className="page-width footer-grid">
          <div className="footer-brand">
            <Link href="#home" className="brand">
              <span className="crest">SI</span>
              <span><strong>SOOTHING</strong><small>INTERIORS</small></span>
            </Link>
            <p className="footer-note">Curated for life.<br />Crafted for legacy.</p>
          </div>

          <div>
            <p className="eyebrow">EXPLORE</p>
            <ul className="footer-links">
              {navItems.filter((n) => n !== 'CONTACT').map((item) => (
                <li key={item}>
                  <Link href={item === 'HOME' ? '#home' : `#${item.toLowerCase()}`}>{item}</Link>
                </li>
              ))}
            </ul>
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
            <div className="socials">
              <a href="#" aria-label="Instagram">INSTAGRAM</a>
              <a href="#" aria-label="Pinterest">PINTEREST</a>
              <a href="#" aria-label="LinkedIn">LINKEDIN</a>
            </div>
          </div>
        </div>

        <div className="page-width footer-bottom">
          <span>© 2026 SOOTHING INTERIORS. ALL RIGHTS RESERVED.</span>
          <span className="footer-tagline">DESIGNED FOR THE EXTRAORDINARY</span>
          <Link href="#home" className="to-top" aria-label="Back to top">
            BACK TO TOP <ArrowUp aria-hidden="true" />
          </Link>
        </div>
      </footer>

      {/* JOURNAL READER */}
      {activePost !== null && (
        <div className="enquiry-overlay" onClick={() => setActivePost(null)} role="dialog" aria-modal="true" aria-label={journalPosts[activePost].title}>
          <article className="enquiry-modal journal-modal" onClick={(e) => e.stopPropagation()}>
            <button className="enquiry-close" onClick={() => setActivePost(null)} aria-label="Close story">
              <X />
            </button>
            <div className="journal-modal-image">
              <img src={`/${journalPosts[activePost].image}`} alt={journalPosts[activePost].alt} />
            </div>
            <div className="journal-modal-content">
              <p className="eyebrow dark">{journalPosts[activePost].category}</p>
              <h2>{journalPosts[activePost].title}</h2>
              <p className="journal-meta">{journalPosts[activePost].date} <i>·</i> {journalPosts[activePost].readTime}</p>
              {journalPosts[activePost].body.map((para, idx) => (
                <p className="journal-para" key={idx}>{para}</p>
              ))}
              <div className="journal-modal-actions">
                <button
                  type="button"
                  className="journal-nav-btn"
                  onClick={() => setActivePost((activePost + journalPosts.length - 1) % journalPosts.length)}
                >
                  <ArrowLeft aria-hidden="true" /> PREVIOUS
                </button>
                <button
                  type="button"
                  className="journal-nav-btn"
                  onClick={() => setActivePost((activePost + 1) % journalPosts.length)}
                >
                  NEXT <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        </div>
      )}

      {/* ENQUIRY MODAL */}
      {enquiryOpen && (
        <div className="enquiry-overlay" onClick={closeEnquiry} role="dialog" aria-modal="true" aria-label="Project enquiry">
          <div className="enquiry-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="enquiry-close"
              onClick={closeEnquiry}
              aria-label="Close enquiry form"
            >
              <X />
            </button>

            {submitted ? (
              <div className="enquiry-header enquiry-thanks">
                <p className="eyebrow dark">THANK YOU</p>
                <h2>Your enquiry<br /><em>is with us.</em></h2>
                <p className="enquiry-lede">
                  We review every inquiry carefully and will be in touch within 2 to 3 business days.
                </p>
                <p className="enquiry-tagline">Curated for life. Crafted for legacy.</p>
              </div>
            ) : (
              <>
                <div className="enquiry-header">
                  <p className="eyebrow dark">ENQUIRY</p>
                  <h2>Tell us about<br /><em>your project.</em></h2>
                  <p className="enquiry-lede">
                    We review every inquiry carefully and aim to respond within 2 to 3 business days.
                  </p>
                  <p className="enquiry-tagline">Curated for life. Crafted for legacy.</p>
                </div>

                <form
                  className="enquiry-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    // Hook up to /api/contact here
                    setSubmitted(true)
                  }}
                >
                  <div className="form-row">
                    <label className="form-field">
                      <span>Full name</span>
                      <input type="text" name="fullName" placeholder="Your name" required />
                    </label>
                  </div>

                  <div className="form-row form-row-2">
                    <label className="form-field">
                      <span>Email address</span>
                      <input type="email" name="email" placeholder="you@example.com" required />
                    </label>
                    <label className="form-field">
                      <span>Phone number</span>
                      <input type="tel" name="phone" placeholder="+256 ..." />
                    </label>
                  </div>

                  <div className="form-row form-row-2">
                    <label className="form-field">
                      <span>Project type</span>
                      <select name="projectType" defaultValue="">
                        <option value="" disabled>Select a type</option>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Hospitality</option>
                        <option>Landscape</option>
                      </select>
                    </label>
                    <label className="form-field">
                      <span>Location</span>
                      <input type="text" name="location" placeholder="City, country" />
                    </label>
                  </div>

                  <div className="form-row form-row-2">
                    <label className="form-field">
                      <span>Budget range</span>
                      <select name="budget" defaultValue="">
                        <option value="" disabled>Select a range</option>
                        <option>Under $25,000</option>
                        <option>$25,000 – $75,000</option>
                        <option>$75,000 – $150,000</option>
                        <option>$150,000+</option>
                      </select>
                    </label>
                    <label className="form-field">
                      <span>Timeline</span>
                      <select name="timeline" defaultValue="">
                        <option value="" disabled>Select a timeline</option>
                        <option>ASAP</option>
                        <option>1 – 3 months</option>
                        <option>3 – 6 months</option>
                        <option>6 – 12 months</option>
                        <option>Flexible</option>
                      </select>
                    </label>
                  </div>

                  <label className="form-field">
                    <span>Tell us more about your project</span>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="A short paragraph about your space, scope and vision."
                    />
                  </label>

                  <button type="submit" className="enquiry-submit">
                    SUBMIT ENQUIRY <ArrowUpRight aria-hidden="true" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
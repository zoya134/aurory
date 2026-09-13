import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const vendorContact = {
  name: 'Sample Vendor: Aurory Talent Desk',
  whatsapp:
    'https://wa.me/919876543210?text=Hello%20Aurory%20Talent%20Desk%2C%20I%20would%20like%20to%20know%20more%20about%20a%20professional%20bikini%20model.',
  telegram: 'https://t.me/aurorytalentdesk',
}

const featuredModels = [
  {
    id: 1,
    name: 'Mira Kaul',
    city: 'Mumbai',
    category: 'Editorial Bikini',
    detail:
      'Professional bikini model with refined editorial, resortwear, and controlled studio portfolio work.',
    biography:
      'Mira is a professional bikini model focused on refined editorial swimwear, resortwear, and studio-led fashion campaigns. Her portfolio is built around composed posing, clean movement, and polished visual direction for premium brands.',
    details: ['Editorial swimwear', 'Studio campaigns', 'Resortwear lookbooks'],
    image:
      'https://images.unsplash.com/photo-1599470609787-113eac30917d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Anaya Rao',
    city: 'Bengaluru',
    category: 'Commercial Swimwear',
    detail:
      'Experienced in premium swimwear campaigns, lifestyle shoots, and polished brand content.',
    biography:
      'Anaya works across commercial swimwear and lifestyle productions, bringing a calm, brand-ready presence to e-commerce, social campaigns, and seasonal resort collections.',
    details: ['Commercial swimwear', 'Lifestyle campaigns', 'Brand content'],
    image:
      'https://images.unsplash.com/photo-1592390140955-b250e159744a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Sia Mehta',
    city: 'Delhi',
    category: 'Runway Swimwear',
    detail:
      'Confident runway presence for resort collections, designer swimwear, and fashion presentations.',
    biography:
      'Sia specializes in runway swimwear and fashion presentations, with a confident walk and strong understanding of designer-led resort collections, movement, and live showcase pacing.',
    details: ['Runway swimwear', 'Fashion presentations', 'Designer resort collections'],
    image:
      'https://images.unsplash.com/photo-1625023489823-c9c1e36d6f2b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Ira Sen',
    city: 'Goa',
    category: 'Resort Lifestyle',
    detail:
      'Natural-light specialist for beachwear, resort, travel, and contemporary lifestyle productions.',
    biography:
      'Ira is suited to natural-light resort and travel productions, with experience in beachwear, contemporary lifestyle imagery, and destination-led editorial shoots.',
    details: ['Resort lifestyle', 'Travel campaigns', 'Natural-light shoots'],
    image:
      'https://images.unsplash.com/photo-1612367939117-84bc4cd00c48?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 21,
    name: 'Anaya Rao',
    city: 'Bengaluru',
    category: 'Commercial Swimwear',
    detail:
      'Experienced in premium swimwear campaigns, lifestyle shoots, and polished brand content.',
    biography:
      'Anaya works across commercial swimwear and lifestyle productions, bringing a calm, brand-ready presence to e-commerce, social campaigns, and seasonal resort collections.',
    details: ['Commercial swimwear', 'Lifestyle campaigns', 'Brand content'],
    image:
      'https://images.unsplash.com/photo-1724606854879-9321f9340a89?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 22,
    name: 'Anaya Rao',
    city: 'Bengaluru',
    category: 'Commercial Swimwear',
    detail:
      'Experienced in premium swimwear campaigns, lifestyle shoots, and polished brand content.',
    biography:
      'Anaya works across commercial swimwear and lifestyle productions, bringing a calm, brand-ready presence to e-commerce, social campaigns, and seasonal resort collections.',
    details: ['Commercial swimwear', 'Lifestyle campaigns', 'Brand content'],
    image:
      'https://images.unsplash.com/photo-1611699082439-a8de44ba565f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 23,
    name: 'Anaya Rao',
    city: 'Bengaluru',
    category: 'Commercial Swimwear',
    detail:
      'Experienced in premium swimwear campaigns, lifestyle shoots, and polished brand content.',
    biography:
      'Anaya works across commercial swimwear and lifestyle productions, bringing a calm, brand-ready presence to e-commerce, social campaigns, and seasonal resort collections.',
    details: ['Commercial swimwear', 'Lifestyle campaigns', 'Brand content'],
    image:
      'https://images.unsplash.com/photo-1605248259586-a64eb06b6970?auto=format&fit=crop&w=900&q=80',
  }
]

const moreModels = [
  {
    id: 19,
    name: 'Mira Kaul',
    city: 'Mumbai',
    category: 'Editorial Bikini',
    detail:
      'Professional bikini model with refined editorial, resortwear, and controlled studio portfolio work.',
    biography:
      'Mira is a professional bikini model focused on refined editorial swimwear, resortwear, and studio-led fashion campaigns. Her portfolio is built around composed posing, clean movement, and polished visual direction for premium brands.',
    details: ['Editorial swimwear', 'Studio campaigns', 'Resortwear lookbooks'],
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 20,
    name: 'Anaya Rao',
    city: 'Bengaluru',
    category: 'Commercial Swimwear',
    detail:
      'Experienced in premium swimwear campaigns, lifestyle shoots, and polished brand content.',
    biography:
      'Anaya works across commercial swimwear and lifestyle productions, bringing a calm, brand-ready presence to e-commerce, social campaigns, and seasonal resort collections.',
    details: ['Commercial swimwear', 'Lifestyle campaigns', 'Brand content'],
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 30,
    name: 'Sia Mehta',
    city: 'Delhi',
    category: 'Runway Swimwear',
    detail:
      'Confident runway presence for resort collections, designer swimwear, and fashion presentations.',
    biography:
      'Sia specializes in runway swimwear and fashion presentations, with a confident walk and strong understanding of designer-led resort collections, movement, and live showcase pacing.',
    details: ['Runway swimwear', 'Fashion presentations', 'Designer resort collections'],
    image:
      'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 40,
    name: 'Ira Sen',
    city: 'Goa',
    category: 'Resort Lifestyle',
    detail:
      'Natural-light specialist for beachwear, resort, travel, and contemporary lifestyle productions.',
    biography:
      'Ira is suited to natural-light resort and travel productions, with experience in beachwear, contemporary lifestyle imagery, and destination-led editorial shoots.',
    details: ['Resort lifestyle', 'Travel campaigns', 'Natural-light shoots'],
    image:
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Naina Shah',
    city: 'Hyderabad',
    category: 'Fitness Swimwear',
    detail:
      'Athletic bikini model suited for wellness, active swimwear, and resort fitness campaigns.',
    biography:
      'Naina brings an athletic, composed presence to wellness swimwear, active resort campaigns, and clean fitness-oriented productions for premium visual brands.',
    details: ['Fitness swimwear', 'Wellness campaigns', 'Active resort shoots'],
    image:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Leah Dsouza',
    city: 'Pune',
    category: 'Beauty Swimwear',
    detail:
      'Polished camera presence for beauty-led swimwear editorials and clean commercial shoots.',
    biography:
      'Leah focuses on beauty-led swimwear and polished commercial imagery, pairing expressive camera work with a refined approach to close-up and campaign direction.',
    details: ['Beauty swimwear', 'Commercial editorials', 'Close-up campaign work'],
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Tara Kapoor',
    city: 'Mumbai',
    category: 'Resort Lifestyle',
    detail:
      'Experienced in destination resort, beachwear, and high-end hospitality campaign imagery.',
    biography:
      'Tara works well for destination resortwear, premium hospitality visuals, and beachwear campaigns that need relaxed, confident, editorial-quality imagery.',
    details: ['Destination resortwear', 'Hospitality campaigns', 'Beachwear editorials'],
    image:
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Rhea Nair',
    city: 'Goa',
    category: 'Commercial Swimwear',
    detail:
      'Reliable commercial model for swimwear catalogues, social campaigns, and lookbook shoots.',
    biography:
      'Rhea is a reliable commercial swimwear model for catalogues, lookbooks, and social-first productions where consistency, clarity, and brand fit matter.',
    details: ['Swimwear catalogues', 'Lookbook shoots', 'Social campaigns'],
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
]

const allModels = [...featuredModels, ...moreModels]

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Goa', 'Hyderabad', 'Pune']

const categories = [
  'Editorial Bikini',
  'Commercial Swimwear',
  'Runway Swimwear',
  'Resort Lifestyle',
  'Beauty Swimwear',
  'Fitness Swimwear',
]

function modelsUrl(filterType, value) {
  if (!filterType || !value) {
    return '/models'
  }

  return `/models?${filterType}=${encodeURIComponent(value)}`
}

function getInitialFilter(key, fallback) {
  const params = new URLSearchParams(window.location.search)
  return params.get(key) || fallback
}

function getProfileUrl(model) {
  return `/models/${model.id}`
}

function getGalleryImages(model) {
  return [
    model.image,
    ...allModels.filter((item) => item.id !== model.id).map((item) => item.image),
  ].slice(0, 4)
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function updateHeaderState() {
      setIsScrolled(window.scrollY > 24)
    }

    updateHeaderState()

    window.addEventListener('scroll', updateHeaderState, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateHeaderState)
    }
  }, [])

  return (
    <header className={`site-header${isScrolled ? ' site-header-scrolled' : ''}`}>
      <a className="brand" href="/" aria-label="Aurory home">
        Aurory
      </a>

      <nav className="header-nav" aria-label="Primary navigation">
        <a href="/models">Models</a>
        <a href="/#cities">Cities</a>
        <a href="/#categories">Categories</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <img
        className="hero-image"
        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80"
        alt="Professional model photographed in a refined editorial setting"
      />

      <div className="hero-copy">
        <p className="eyebrow">Curated bikini model discovery</p>

        <h1 id="hero-title">Discover professional bikini models.</h1>

        <p className="hero-description">
          Explore professional bikini model profiles across cities and categories.
          Find the right talent and contact their vendor, agency, or talent
          representative directly.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="/models">
            View all models
          </a>
        </div>
      </div>
    </section>
  )
}

function ModelCard({ model }) {
  function openProfile() {
    window.location.href = getProfileUrl(model)
  }

  function handleCardKeyDown(event) {
    if (event.target !== event.currentTarget) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProfile()
    }
  }

  function keepCardOpen(event) {
    event.stopPropagation()
  }

  return (
    <article
      className="model-card"
      role="link"
      tabIndex="0"
      aria-label={`View ${model.name} profile`}
      onClick={openProfile}
      onKeyDown={handleCardKeyDown}
    >
      <img
        className="model-image"
        src={model.image}
        alt={`${model.name} portfolio portrait`}
      />

      <div className="model-card-body">
        <div>
          <h3>{model.name}</h3>

          <p>{model.detail}</p>
        </div>

        <div className="model-card-actions" aria-label={`${model.name} contact actions`}>
          <a
            className="button button-light"
            href={vendorContact.whatsapp}
            target="_blank"
            rel="noreferrer"
            onClick={keepCardOpen}
            onKeyDown={keepCardOpen}
          >
            WhatsApp
          </a>

          <a
            className="button button-light"
            href={vendorContact.telegram}
            target="_blank"
            rel="noreferrer"
            onClick={keepCardOpen}
            onKeyDown={keepCardOpen}
          >
            Telegram
          </a>
        </div>
      </div>
    </article>
  )
}

function ModelRow({ id, eyebrow, title, description, models }) {
  const rowRef = useRef(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)

  function updateScrollState() {
    const row = rowRef.current

    if (!row) {
      return
    }

    const maxScrollLeft = row.scrollWidth - row.clientWidth

    setCanScrollBack(row.scrollLeft > 2)
    setCanScrollForward(row.scrollLeft < maxScrollLeft - 2)
  }

  function scrollModels(direction) {
    const row = rowRef.current

    if (!row) {
      return
    }

    row.scrollBy({
      left: direction * row.clientWidth * 0.82,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    updateScrollState()

    window.addEventListener('resize', updateScrollState)

    return () => {
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  return (
    <section id={id} className="model-row-section" aria-labelledby={`${id}-title`}>
      <div className="row-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>{description}</p>
        </div>

        <a className="button button-secondary" href="/models">
          View all models
        </a>
      </div>

      <div className="model-row-shell">
        <button
          className="row-arrow row-arrow-prev"
          type="button"
          aria-label={`Scroll ${title} left`}
          disabled={!canScrollBack}
          onClick={() => scrollModels(-1)}
        >
          &lt;
        </button>

        <div
          className="model-row"
          aria-label={title}
          onScroll={updateScrollState}
          ref={rowRef}
        >
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>

        <button
          className="row-arrow row-arrow-next"
          type="button"
          aria-label={`Scroll ${title} right`}
          disabled={!canScrollForward}
          onClick={() => scrollModels(1)}
        >
          &gt;
        </button>
      </div>
    </section>
  )
}

function AllModelsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(
    getInitialFilter('city', 'All cities'),
  )
  const [selectedCategory, setSelectedCategory] = useState(
    getInitialFilter('category', 'All categories'),
  )

  const filteredModels = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return allModels.filter((model) => {
      const content = [model.name, model.city, model.category, model.detail]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        normalizedSearch === '' || content.includes(normalizedSearch)

      const matchesCity =
        selectedCity === 'All cities' || model.city === selectedCity

      const matchesCategory =
        selectedCategory === 'All categories' ||
        model.category === selectedCategory

      return matchesSearch && matchesCity && matchesCategory
    })
  }, [searchTerm, selectedCity, selectedCategory])

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCity !== 'All cities' ||
    selectedCategory !== 'All categories'

  function clearFilters() {
    setSearchTerm('')
    setSelectedCity('All cities')
    setSelectedCategory('All categories')
  }

  return (
    <>
      <Header />

      <main>
        <section
          className="models-page section-block"
          aria-labelledby="all-models-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Directory</p>

            <h1 id="all-models-title">All Models</h1>

            <p>
              Search professional bikini model profiles by name, city, category,
              or description. Contact is routed only through the listed sample
              representative.
            </p>
          </div>

          <div className="filter-panel" aria-label="Model search and filters">
            <label>
              <span>Search models</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, city, category, or description"
              />
            </label>

            <label>
              <span>City</span>

              <select
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
              >
                <option>All cities</option>

                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Category</span>

              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option>All categories</option>

                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <button
              className="button button-secondary filter-clear"
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>

          {filteredModels.length > 0 ? (
            <div className="model-grid">
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No models found</h3>

              <p>Try a different search term, city, or category.</p>

              {hasActiveFilters && (
                <button
                  className="button button-dark"
                  type="button"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}

function ModelProfilePage({ model }) {
  if (!model) {
    return (
      <>
        <Header />

        <main>
          <section className="profile-page section-block">
            <div className="empty-state">
              <h1>Model profile not found</h1>

              <p>
                The profile you are looking for is not available in the sample
                directory.
              </p>

              <a className="button button-dark" href="/models">
                Back to models
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </>
    )
  }

  const galleryImages = getGalleryImages(model)

  return (
    <>
      <Header />

      <main>
        <section className="profile-hero" aria-labelledby="profile-title">
          <div className="profile-image-panel">
            <img
              className="profile-primary-image"
              src={model.image}
              alt={`${model.name} primary portfolio portrait`}
            />
          </div>

          <div className="profile-summary">
            <a className="profile-back-link" href="/models">
              Back to models
            </a>

            <div className="profile-title-block">
              <p className="eyebrow">Model profile</p>

              <h1 id="profile-title">{model.name}</h1>

              <p className="profile-meta">
                {model.city} / {model.category}
              </p>
            </div>

            <p className="profile-bio">{model.biography}</p>

            <div
              className="profile-facts"
              aria-label="Basic professional details"
            >
              <div>
                <span>Base</span>
                <strong>{model.city}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{model.category}</strong>
              </div>
            </div>

            <div
              className="profile-detail-list"
              aria-label="Professional strengths"
            >
              {model.details.map((detail) => (
                <span key={detail}>{detail}</span>
              ))}
            </div>

            <div className="representative-card">
              <div>
                <p className="eyebrow">Assigned representative</p>

                <h2>{vendorContact.name}</h2>

                <p>
                  Contact the representative, not the model. Aurory does not
                  handle enquiries, bookings, payments, or internal messages.
                </p>
              </div>

              <div className="contact-actions profile-contact-actions">
                <a
                  className="button button-primary"
                  href={vendorContact.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>

                <a
                  className="button button-secondary"
                  href={vendorContact.telegram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className="profile-gallery-section"
          aria-labelledby="gallery-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Gallery</p>

            <h2 id="gallery-title">Additional portfolio images</h2>

            <p>
              Sample gallery imagery reused from the current local model
              directory.
            </p>
          </div>

          <div className="profile-gallery">
            {galleryImages.map((image, index) => (
              <figure key={image}>
                <img
                  src={image}
                  alt={`${model.name} sample portfolio gallery ${index + 1}`}
                />
              </figure>
            ))}
          </div>
        </section>
      </main>

      <div className="mobile-contact-bar" aria-label="Representative contact">
        <a
          className="button button-primary"
          href={vendorContact.whatsapp}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

        <a
          className="button button-secondary"
          href={vendorContact.telegram}
          target="_blank"
          rel="noreferrer"
        >
          Telegram
        </a>
      </div>

      <Footer />
    </>
  )
}

function BrowseSection({ id, title, items, filterType }) {
  return (
    <section id={id} className="browse-section" aria-labelledby={`${id}-title`}>
      <div>
        <p className="eyebrow">Browse</p>

        <h2 id={`${id}-title`}>{title}</h2>
      </div>

      <div className="browse-list">
        {items.map((item) => (
          <a href={modelsUrl(filterType, item)} key={item}>
            {item}
          </a>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-brand">Aurory</p>

      <p>
        Premium bikini model discovery. Contact is handled only through listed
        vendors, agencies, or talent representatives.
      </p>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <ModelRow
          id="featured"
          eyebrow="Featured profiles"
          title="Featured Models"
          description="A curated row of professional bikini model profiles represented through sample vendor details."
          models={featuredModels}
        />

        <ModelRow
          id="recently-added"
          eyebrow="Recently added"
          title="Discover More"
          description="Additional sample profiles for resortwear, swimwear, beauty, and lifestyle campaigns."
          models={moreModels}
        />

        <BrowseSection
          id="cities"
          title="Browse by city"
          items={cities}
          filterType="city"
        />

        <BrowseSection
          id="categories"
          title="Browse by category"
          items={categories}
          filterType="category"
        />
      </main>

      <Footer />
    </>
  )
}

function App() {
  const profileMatch = window.location.pathname.match(/^\/models\/(\d+)$/)

  const profileModel = profileMatch
    ? allModels.find((model) => model.id === Number(profileMatch[1]))
    : null

  const isModelsPage = window.location.pathname === '/models'

  if (profileMatch) {
    return <ModelProfilePage model={profileModel} />
  }

  return isModelsPage ? <AllModelsPage /> : <HomePage />
}

export default App
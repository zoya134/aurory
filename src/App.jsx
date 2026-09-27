import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

import { getActiveModels } from './lib/models'

import Admin from './Admin'

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
  return `/models/${encodeURIComponent(model.slug)}`
}

function getGalleryImages(model, models) {
  const gallery = Array.isArray(model.gallery) ? model.gallery : []

  return [
    model.image,
    ...gallery,
    ...models
      .filter((item) => item.id !== model.id)
      .map((item) => item.image),
  ]
    .filter(Boolean)
    .filter((image, index, items) => items.indexOf(image) === index)
    .slice(0, 4)
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
            href={model.vendorContact?.whatsapp || '#'}
            target="_blank"
            rel="noreferrer"
            onClick={keepCardOpen}
            onKeyDown={keepCardOpen}
          >
            WhatsApp
          </a>

          <a
            className="button button-light"
            href={model.vendorContact?.telegram || '#'}
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

function AllModelsPage({ models }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(
    getInitialFilter('city', 'All cities'),
  )
  const [selectedCategory, setSelectedCategory] = useState(
    getInitialFilter('category', 'All categories'),
  )

  const filteredModels = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return models.filter((model) => {
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

function ModelProfilePage({ model, models }) {
  const galleryImages = model ? getGalleryImages(model, models) : []
  const [activeImage, setActiveImage] = useState(galleryImages[0] || '')

  const moveGallery = (direction) => {
    const panel = document.querySelector('.profile-image-panel')
    if (!panel) return

    const nextIndex = Math.max(0, Math.min(galleryImages.length - 1, Math.round(panel.scrollLeft / panel.clientWidth) + direction))
    panel.scrollTo({ left: nextIndex * panel.clientWidth, behavior: 'smooth' })
    setActiveImage(galleryImages[nextIndex] || galleryImages[0])
  }

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

  return (
    <>
      <Header />

      <main>
        <section className="profile-hero" aria-labelledby="profile-title">
          <a className="profile-back-link profile-back-link-top" href="/models">
            Back to models
          </a>

          <div className="profile-gallery" aria-label={`${model.name} portfolio gallery`}>
            <div className="profile-gallery-frame">
              <button
                className="profile-gallery-arrow profile-gallery-arrow-prev"
                type="button"
                onClick={() => moveGallery(-1)}
                aria-label="Previous portfolio image"
              >
                &#8592;
              </button>

              <div
                className="profile-image-panel"
                onScroll={(event) => {
                  const panel = event.currentTarget
                  const nextIndex = Math.round(panel.scrollLeft / panel.clientWidth)
                  setActiveImage(galleryImages[nextIndex] || galleryImages[0])
                }}
              >
                <div className="profile-image-track">
                  {galleryImages.map((image, index) => (
                    <figure className="profile-image-slide" key={image}>
                      <img
                        className="profile-primary-image"
                        src={image}
                        alt={`${model.name} portfolio image ${index + 1}`}
                      />
                    </figure>
                  ))}
                </div>
              </div>

              <button
                className="profile-gallery-arrow profile-gallery-arrow-next"
                type="button"
                onClick={() => moveGallery(1)}
                aria-label="Next portfolio image"
              >
                &#8594;
              </button>
            </div>

            <div className="profile-gallery-controls" aria-label="Gallery position">
              {galleryImages.map((image, index) => (
                <button
                  className={activeImage === image ? 'is-active' : ''}
                  type="button"
                  key={image}
                  onClick={() => {
                    setActiveImage(image)
                    document
                      .querySelector('.profile-image-panel')
                      ?.scrollTo({ left: index * document.querySelector('.profile-image-panel').clientWidth, behavior: 'smooth' })
                  }}
                  aria-label={`Show portfolio image ${index + 1}`}
                  aria-pressed={activeImage === image}
                />
              ))}
            </div>
          </div>

          <div className="profile-summary">
            <div className="profile-contact-panel">
              <div>
                <p className="eyebrow">Start a conversation</p>
                <h2>Interested in working with {model.name}?</h2>
                <p>Reach out through the representative to discuss availability, collaborations, and professional enquiries.</p>
              </div>

              <div className="contact-actions profile-contact-actions">
                <a className="button button-primary" href={model.vendorContact?.whatsapp || '#'} target="_blank" rel="noreferrer">WhatsApp</a>
                <a className="button button-secondary" href={model.vendorContact?.telegram || '#'} target="_blank" rel="noreferrer">Telegram</a>
              </div>
            </div>

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


          </div>
        </section>


      </main>

      <div className="mobile-contact-bar" aria-label="Representative contact">
        <a
          className="button button-primary"
          href={model.vendorContact?.whatsapp || '#'}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

        <a
          className="button button-secondary"
          href={model.vendorContact?.telegram || '#'}
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

function HomePage({ models }) {
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
          models={models.filter((model) => model.featured)}
        />

        <ModelRow
          id="recently-added"
          eyebrow="Recently added"
          title="Discover More"
          description="Additional sample profiles for resortwear, swimwear, beauty, and lifestyle campaigns."
          models={models.filter((model) => !model.featured)}
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
  const [models, setModels] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadModels() {
      try {
        const data = await getActiveModels()

        if (!isMounted) {
          return
        }

        setModels(data)
        setLoadState('ready')
      } catch (error) {
        console.error('Aurory model loading failed:', error)

        if (!isMounted) {
          return
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load models from Supabase.',
        )
        setLoadState('error')
      }
    }

    loadModels()

    return () => {
      isMounted = false
    }
  }, [])

  if (loadState === 'loading') {
    return (
      <>
        <Header />
        <main>
          <section className="section-block">
            <div className="empty-state">
              <h1>Loading models...</h1>
              <p>Connecting to the Aurory model directory.</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  if (loadState === 'error') {
    return (
      <>
        <Header />
        <main>
          <section className="section-block">
            <div className="empty-state">
              <h1>Unable to load models</h1>
              <p>{errorMessage}</p>
              <button
                className="button button-dark"
                type="button"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'

  if (pathname === '/admin') {
    return <Admin />
  }

  const profileMatch = pathname.match(/^\/models\/([^/]+)$/)
  const profileModel = profileMatch
    ? models.find(
        (model) => model.slug === decodeURIComponent(profileMatch[1]),
      )
    : null

  if (profileMatch) {
    return <ModelProfilePage model={profileModel} models={models} />
  }

  if (pathname === '/models') {
    return <AllModelsPage models={models} />
  }

  return <HomePage models={models} />
}

export default App

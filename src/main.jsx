import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

const products = [
  { id: 1, name: 'Azure Set', price: 'R$ 429,00', category: 'Conjuntos', image: '/products/01-azure-set.webp' },
  { id: 2, name: 'Suite Set', price: 'R$ 389,00', category: 'Conjuntos', image: '/products/02-suite-set.webp' },
  { id: 3, name: 'Capri Top', price: 'R$ 289,00', category: 'Blusas', image: '/products/03-capri-top.webp' },
  { id: 4, name: 'Rouge Dress', price: 'R$ 499,00', category: 'Vestidos', image: '/products/04-rouge-dress.webp' },
  { id: 5, name: 'Louvre Jumpsuit', price: 'R$ 479,00', category: 'Macacões', image: '/products/05-louvre-jumpsuit.webp' },
  { id: 6, name: 'Riviera Set', price: 'R$ 529,00', category: 'Conjuntos', image: '/products/06-riviera-set.webp' },
  { id: 7, name: 'Monaco Set', price: 'R$ 449,00', category: 'Conjuntos', image: '/products/07-monaco-set.webp' },
  { id: 8, name: 'Milano Vest', price: 'R$ 329,00', category: 'Blusas', image: '/products/08-milano-vest.webp' },
  { id: 9, name: 'Paris Dots Set', price: 'R$ 429,00', category: 'Conjuntos', image: '/products/09-paris-dots-set.webp' },
  { id: 10, name: 'Palais Dress', price: 'R$ 459,00', category: 'Vestidos', image: '/products/10-palais-dress.webp' }
]

const navItems = [
  { label: 'New in', href: '#new' },
  { label: 'Shop', href: '#shop' },
  { label: 'Editorial', href: '#editorial' },
  { label: 'About', href: '#about' }
]

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <a className="product-image" href="#shop" aria-label={`Ver ${product.name}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.classList.add('image-missing')
          }}
        />
        <span className="product-category">{product.category}</span>
      </a>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    </article>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site">
      <div className="announcement">FREE SHIPPING ON ORDERS OVER R$ 499</div>

      <header className="header">
        <button
          className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(value => !value)}
        >
          <span />
          <span />
        </button>

        <nav className="nav left" aria-label="Navegação principal">
          {navItems.slice(0, 3).map(item => <a key={item.label} href={item.href}>{item.label}</a>)}
        </nav>

        <a className="logo" href="#" aria-label="KEY — início">KEY</a>

        <nav className="nav right" aria-label="Navegação secundária">
          <a href="#about">About</a>
          <a href="#newsletter">Newsletter</a>
          <a className="bag-link" href="#bag" aria-label="Sacola">Bag <span>0</span></a>
        </nav>
      </header>

      <div className={`mobile-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Menu mobile">
          {navItems.map(item => <a key={item.label} href={item.href} onClick={closeMenu}>{item.label}</a>)}
          <a href="#newsletter" onClick={closeMenu}>Newsletter</a>
          <a href="#bag" onClick={closeMenu}>Bag (0)</a>
        </nav>
        <p>KEY — Unlock your style.</p>
      </div>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">KEY / WOMEN'S WEAR</p>
            <h1>Wear your<br /><em>key</em> piece.</h1>
            <p className="hero-text">Uma seleção feminina pensada para marcar presença.</p>
            <a className="button" href="#new">Ver coleção</a>
          </div>
          <div className="hero-mark" aria-hidden="true">K</div>
        </section>

        <div className="ticker" aria-label="Mensagem da coleção">
          <span>NEW COLLECTION</span>
          <span>KEY WOMEN'S WEAR</span>
          <span>NEW COLLECTION</span>
          <span>KEY WOMEN'S WEAR</span>
        </div>

        <section className="products-section" id="new">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE EDIT</p>
              <h2>New in</h2>
            </div>
            <a href="#shop">Ver tudo <span aria-hidden="true">→</span></a>
          </div>
          <div className="product-grid">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        <section className="category-section" id="shop">
          <div className="category-intro">
            <p className="eyebrow">EXPLORE KEY</p>
            <h2>Find your<br /><em>key</em>.</h2>
            <a className="text-link" href="#new">Ver coleção completa <span aria-hidden="true">→</span></a>
          </div>
          <a className="category-card category-dresses" href="#new"><span>Vestidos</span></a>
          <a className="category-card category-sets" href="#new"><span>Conjuntos</span></a>
          <a className="category-card category-tops" href="#new"><span>Blusas</span></a>
        </section>

        <section className="editorial" id="editorial">
          <div className="editorial-image" aria-hidden="true"><span>KEY / 01</span></div>
          <div className="editorial-copy">
            <p className="eyebrow">KEY / 01</p>
            <h2>More than<br /><em>clothes.</em></h2>
            <p>Peças que entram no guarda-roupa e permanecem na memória.</p>
            <a className="button light" href="#new">Descobrir</a>
          </div>
        </section>

        <section className="newsletter" id="newsletter">
          <p className="eyebrow">STAY CLOSE</p>
          <h2>Enter the KEY.</h2>
          <p>Receba novidades, lançamentos e editoriais diretamente no seu e-mail.</p>
          <form onSubmit={e => e.preventDefault()}>
            <label className="sr-only" htmlFor="email">Seu melhor e-mail</label>
            <input id="email" type="email" placeholder="Seu melhor e-mail" required />
            <button type="submit">Inscrever</button>
          </form>
        </section>
      </main>

      <footer id="about">
        <div className="footer-brand">
          <a className="logo" href="#">KEY</a>
          <p>Unlock your style.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <a href="#new">New in</a>
          <a href="#shop">Vestidos</a>
          <a href="#shop">Conjuntos</a>
          <a href="#shop">Blusas</a>
        </div>
        <div>
          <h4>Help</h4>
          <a href="#">Contato</a>
          <a href="#">Envios</a>
          <a href="#">Trocas</a>
          <a href="#">Privacidade</a>
        </div>
        <div>
          <h4>Follow</h4>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
        </div>
      </footer>
      <div className="copyright">© 2026 KEY. Todos os direitos reservados.</div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

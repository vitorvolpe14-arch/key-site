import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

const products = [
  { id: 1, name: 'Em breve', price: null, category: 'New in', image: null },
  { id: 2, name: 'Em breve', price: null, category: 'New in', image: null },
  { id: 3, name: 'Em breve', price: null, category: 'New in', image: null },
  { id: 4, name: 'Em breve', price: null, category: 'New in', image: null }
]

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.image ? <img src={product.image} alt={product.name} /> : <span>KEY</span>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.price ? product.price : 'Preço em breve'}</p>
      </div>
    </article>
  )
}

function App() {
  return (
    <div className="site">
      <header className="header">
        <button className="mobile-menu" aria-label="Menu">☰</button>
        <nav className="nav left">
          <a href="#new">New in</a>
          <a href="#shop">Shop</a>
          <a href="#editorial">Editorial</a>
        </nav>
        <a className="logo" href="#">KEY</a>
        <nav className="nav right">
          <a href="#about">About</a>
          <a href="#newsletter">Newsletter</a>
          <button className="icon-button" aria-label="Sacola">Bag (0)</button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">KEY WOMEN'S WEAR</p>
            <h1>Wear your<br /><em>key</em> piece.</h1>
            <p className="hero-text">Uma seleção feminina pensada para marcar presença.</p>
            <a className="button" href="#new">Ver coleção</a>
          </div>
        </section>

        <div className="ticker">
          <span>NEW COLLECTION</span><span>KEY WOMEN'S WEAR</span><span>NEW COLLECTION</span><span>KEY WOMEN'S WEAR</span>
        </div>

        <section className="products-section" id="new">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE EDIT</p>
              <h2>New in</h2>
            </div>
            <a href="#shop">Ver tudo →</a>
          </div>
          <div className="product-grid">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        <section className="category-section" id="shop">
          <div className="category-intro">
            <p className="eyebrow">EXPLORE</p>
            <h2>Find your<br /><em>key</em>.</h2>
            <a className="text-link" href="#new">Ver coleção completa →</a>
          </div>
          <div className="category-card"><span>Vestidos</span></div>
          <div className="category-card"><span>Conjuntos</span></div>
          <div className="category-card"><span>Blusas</span></div>
        </section>

        <section className="editorial" id="editorial">
          <div className="editorial-image"></div>
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
            <input type="email" placeholder="Seu melhor e-mail" aria-label="E-mail" />
            <button type="submit">Inscrever</button>
          </form>
        </section>
      </main>

      <footer id="about">
        <div className="footer-brand">
          <a className="logo" href="#">KEY</a>
          <p>Women's wear.</p>
        </div>
        <div><h4>Shop</h4><a href="#new">New in</a><a href="#shop">Vestidos</a><a href="#shop">Conjuntos</a><a href="#shop">Blusas</a></div>
        <div><h4>Help</h4><a href="#">Contato</a><a href="#">Envios</a><a href="#">Trocas</a><a href="#">Privacidade</a></div>
        <div><h4>Follow</h4><a href="#">Instagram</a><a href="#">TikTok</a></div>
      </footer>
      <div className="copyright">© 2026 KEY. Todos os direitos reservados.</div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

const products = [
  { id: 1, name: 'Azure Set', price: 429, category: 'Conjuntos', image: '/key/jeans.jpeg', description: 'Conjunto estruturado em textura azul, pensado para uma silhueta marcada e contemporânea.' },
  { id: 2, name: 'Suite Set', price: 389, category: 'Conjuntos', image: null, description: 'Conjunto de tricot com desenho listrado e proporção delicada.' },
  { id: 3, name: 'Capri Top', price: 289, category: 'Blusas', image: '/leonor.jpeg', description: 'Top acetinado de alças finas com detalhe de franjas para um toque marcante.' },
  { id: 4, name: 'Rouge Dress', price: 499, category: 'Vestidos', image: '/key/blusa%20vermelha.jpeg', description: 'Vestido em tom intenso com construção fluida e detalhes de volume.' },
  { id: 5, name: 'Louvre Jumpsuit', price: 479, category: 'Macacões', image: '/key/marrom.jpeg', description: 'Macacão de denim em marrom profundo, com cintura marcada e modelagem alongada.' },
  { id: 6, name: 'Riviera Set', price: 529, category: 'Conjuntos', image: '/key/blazer.jpeg', description: 'Conjunto de alfaiataria rosa com blazer e shorts, finalizado com faixa acetinada.' },
  { id: 7, name: 'Monaco Set', price: 449, category: 'Conjuntos', image: '/key/conjunto.jpeg', description: 'Conjunto vermelho com camisa estruturada e calça de listras verticais.' },
  { id: 8, name: 'Milano Vest', price: 329, category: 'Blusas', image: '/key/top%20vermelho.jpeg', description: 'Colete estruturado vermelho com cintura marcada e acabamento arquitetônico.' },
  { id: 9, name: 'Paris Dots Set', price: 429, category: 'Conjuntos', image: '/black.jpeg', description: 'Conjunto de poás com camisa cropped e shorts de cintura alta.' },
  { id: 10, name: 'Palais Dress', price: 459, category: 'Vestidos', image: '/poair.jpeg', description: 'Vestido longo rosa com recorte frontal e movimento fluido.' }
]

const navItems = [
  { label: 'New in', href: '#new' },
  { label: 'Shop', href: '#shop' },
  { label: 'Editorial', href: '#editorial' },
  { label: 'About', href: '#about' }
]

const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function ProductImage({ product, className = '' }) {
  return (
    <div className={`product-image ${className}`}>
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={e => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.classList.add('image-missing')
          }}
        />
      ) : (
        <span className="image-placeholder">Foto em breve</span>
      )}
    </div>
  )
}

function ProductCard({ product, onOpen }) {
  return (
    <article className="product-card">
      <button className="product-card-button" type="button" onClick={() => onOpen(product)}>
        <ProductImage product={product} />
        <span className="product-category">{product.category}</span>
      </button>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{money(product.price)}</p>
      </div>
    </article>
  )
}

function ProductPage({ product, onBack, onAdd }) {
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [product.id])

  return (
    <main className="product-page">
      <div className="product-page-top">
        <button className="back-link" onClick={onBack}>← Voltar para a coleção</button>
      </div>
      <div className="product-detail">
        <div className="product-detail-media">
          <ProductImage product={product} />
        </div>
        <div className="product-detail-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-price">{money(product.price)}</p>
          <p className="product-description">{product.description}</p>

          <div className="size-block">
            <div className="size-heading">
              <span>Tamanho</span>
              <button type="button">Guia de medidas</button>
            </div>
            <div className="size-grid">
              {['PP', 'P', 'M', 'G'].map(item => (
                <button
                  key={item}
                  type="button"
                  className={size === item ? 'selected' : ''}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-block">
            <span>Quantidade</span>
            <div className="quantity-control">
              <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          <button
            className="add-to-bag"
            type="button"
            onClick={() => onAdd(product, size, quantity)}
          >
            {size ? 'Adicionar à sacola' : 'Selecione um tamanho'}
          </button>
          <p className="product-note">Envio calculado no checkout.</p>
        </div>
      </div>
    </main>
  )
}

function CheckoutPage({ items, onBack }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const [shipping, setShipping] = useState({ name: '', email: '', phone: '', cep: '', address: '', number: '', city: '', state: '' })
  const [payment, setPayment] = useState('pix')

  const update = e => setShipping(current => ({ ...current, [e.target.name]: e.target.value }))

  if (items.length === 0) {
    return (
      <main className="checkout-page checkout-empty">
        <p className="eyebrow">KEY / CHECKOUT</p>
        <h1>Sua sacola está vazia.</h1>
        <button className="button" onClick={onBack}>Voltar à loja</button>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <div className="checkout-top">
        <button className="back-link" onClick={onBack}>← Voltar à sacola</button>
        <span>KEY / CHECKOUT</span>
      </div>

      <div className="checkout-layout">
        <section className="checkout-form">
          <p className="eyebrow">SEUS DADOS</p>
          <h1>Finalizar pedido</h1>

          <div className="checkout-fields">
            <label>Nome<input name="name" value={shipping.name} onChange={update} placeholder="Seu nome" /></label>
            <label>E-mail<input name="email" type="email" value={shipping.email} onChange={update} placeholder="seu@email.com" /></label>
            <label>Telefone<input name="phone" value={shipping.phone} onChange={update} placeholder="(00) 00000-0000" /></label>
          </div>

          <div className="checkout-section">
            <p className="eyebrow">ENTREGA</p>
            <div className="checkout-fields address-grid">
              <label>CEP<input name="cep" value={shipping.cep} onChange={update} placeholder="00000-000" /></label>
              <label>Endereço<input name="address" value={shipping.address} onChange={update} placeholder="Rua, avenida..." /></label>
              <label>Número<input name="number" value={shipping.number} onChange={update} placeholder="000" /></label>
              <label>Cidade<input name="city" value={shipping.city} onChange={update} placeholder="Sua cidade" /></label>
              <label>UF<input name="state" value={shipping.state} onChange={update} placeholder="CE" maxLength="2" /></label>
            </div>
          </div>

          <div className="checkout-section">
            <p className="eyebrow">PAGAMENTO</p>
            <div className="payment-options">
              <button type="button" className={payment === 'pix' ? 'active' : ''} onClick={() => setPayment('pix')}>
                <span>Pix</span><small>Pagamento instantâneo</small>
              </button>
              <button type="button" className={payment === 'card' ? 'active' : ''} onClick={() => setPayment('card')}>
                <span>Cartão</span><small>Crédito ou débito</small>
              </button>
            </div>
            <p className="checkout-hint">O pagamento será configurado em uma próxima etapa.</p>
          </div>
        </section>

        <aside className="checkout-summary">
          <p className="eyebrow">SEU PEDIDO</p>
          <div className="checkout-items">
            {items.map(item => (
              <div className="checkout-item" key={item.key}>
                <div className="checkout-thumb"><ProductImage product={item} /></div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.size} · {item.quantity}x</p>
                </div>
                <strong>{money(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <div className="checkout-total muted"><span>Frete</span><span>A calcular</span></div>
          <div className="checkout-total grand"><span>Total</span><strong>{money(subtotal)}</strong></div>
          <button className="button checkout-final" type="button">Continuar</button>
          <p className="checkout-secure">Seus dados ficam nesta etapa até o pagamento ser conectado.</p>
        </aside>
      </div>
    </main>
  )
}

function BagDrawer({ items, onClose, onRemove, onQuantity }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="bag-overlay" role="dialog" aria-modal="true" aria-label="Sua sacola">
      <button className="bag-backdrop" aria-label="Fechar sacola" onClick={onClose} />
      <aside className="bag-drawer">
        <div className="bag-head">
          <div>
            <p className="eyebrow">KEY / SHOPPING BAG</p>
            <h2>Sua sacola</h2>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        {items.length === 0 ? (
          <div className="empty-bag">
            <p>Sua sacola está vazia.</p>
            <button className="button" onClick={onClose}>Continuar comprando</button>
          </div>
        ) : (
          <>
            <div className="bag-items">
              {items.map(item => (
                <div className="bag-item" key={item.key}>
                  <div className="bag-item-image"><ProductImage product={item} /></div>
                  <div className="bag-item-info">
                    <div className="bag-item-title">
                      <div>
                        <h3>{item.name}</h3>
                        <p>Tamanho: {item.size}</p>
                      </div>
                      <button onClick={() => onRemove(item.key)} aria-label={`Remover ${item.name}`}>×</button>
                    </div>
                    <div className="bag-item-bottom">
                      <div className="mini-quantity">
                        <button onClick={() => onQuantity(item.key, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onQuantity(item.key, item.quantity + 1)}>+</button>
                      </div>
                      <strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bag-summary">
              <div><span>Subtotal</span><strong>{money(total)}</strong></div>
              <p>Frete e pagamento serão calculados na próxima etapa.</p>
              <button className="button checkout-button" type="button" onClick={openCheckout}>Ir para checkout</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [bagOpen, setBagOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [bag, setBag] = useState([])

  const closeMenu = () => setMenuOpen(false)
  const openCheckout = () => {
    setBagOpen(false)
    setCheckoutOpen(true)
    setSelectedProduct(null)
    closeMenu()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const bagCount = bag.reduce((sum, item) => sum + item.quantity, 0)

  const openProduct = product => {
    setSelectedProduct(product)
    closeMenu()
  }

  const addToBag = (product, size, quantity) => {
    if (!size) return
    setBag(current => {
      const key = `${product.id}-${size}`
      const found = current.find(item => item.key === key)
      if (found) return current.map(item => item.key === key ? { ...item, quantity: item.quantity + quantity } : item)
      return [...current, { ...product, size, quantity, key }]
    })
    setSelectedProduct(null)
    setBagOpen(true)
  }

  const removeFromBag = key => setBag(current => current.filter(item => item.key !== key))
  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeFromBag(key)
    setBag(current => current.map(item => item.key === key ? { ...item, quantity } : item))
  }

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
          <span /><span />
        </button>

        <nav className="nav left" aria-label="Navegação principal">
          {navItems.slice(0, 3).map(item => <a key={item.label} href={item.href}>{item.label}</a>)}
        </nav>

        <button className="logo logo-button" onClick={() => { setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>KEY</button>

        <nav className="nav right" aria-label="Navegação secundária">
          <a href="#about">About</a>
          <a href="#newsletter">Newsletter</a>
          <button className="bag-link" onClick={() => setBagOpen(true)}>Bag <span>{bagCount}</span></button>
        </nav>
      </header>

      <div className={`mobile-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Menu mobile">
          {navItems.map(item => <a key={item.label} href={item.href} onClick={closeMenu}>{item.label}</a>)}
          <button onClick={() => { closeMenu(); setBagOpen(true) }}>Bag ({bagCount})</button>
          <a href="#newsletter" onClick={closeMenu}>Newsletter</a>
        </nav>
        <p>KEY — Unlock your style.</p>
      </div>

      {checkoutOpen ? (
        <CheckoutPage items={bag} onBack={() => setCheckoutOpen(false)} />
      ) : selectedProduct ? (
        <ProductPage product={selectedProduct} onBack={() => setSelectedProduct(null)} onAdd={addToBag} />
      ) : (
        <>
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
              <span>NEW COLLECTION</span><span>KEY WOMEN'S WEAR</span><span>NEW COLLECTION</span><span>KEY WOMEN'S WEAR</span>
            </div>

            <section className="products-section" id="new">
              <div className="section-heading">
                <div><p className="eyebrow">THE EDIT</p><h2>New in</h2></div>
                <a href="#shop">Ver tudo <span aria-hidden="true">→</span></a>
              </div>
              <div className="product-grid">
                {products.map(product => <ProductCard key={product.id} product={product} onOpen={openProduct} />)}
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
            <div className="footer-brand"><a className="logo" href="#">KEY</a><p>Unlock your style.</p></div>
            <div><h4>Shop</h4><a href="#new">New in</a><a href="#shop">Vestidos</a><a href="#shop">Conjuntos</a><a href="#shop">Blusas</a></div>
            <div><h4>Help</h4><a href="#">Contato</a><a href="#">Envios</a><a href="#">Trocas</a><a href="#">Privacidade</a></div>
            <div><h4>Follow</h4><a href="#">Instagram</a><a href="#">TikTok</a></div>
          </footer>
          <div className="copyright">© 2026 KEY. Todos os direitos reservados.</div>
        </>
      )}

      {bagOpen && (
        <BagDrawer
          items={bag}
          onClose={() => setBagOpen(false)}
          onRemove={removeFromBag}
          onQuantity={updateQuantity}
        />
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

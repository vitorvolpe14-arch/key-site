import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { supabase } from './lib/supabase'

const products = [
  { id: 1, name: 'Azure Set', price: 429, category: 'Conjuntos', image: '/key/jeans.jpeg', sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Conjunto estruturado em textura azul, pensado para uma silhueta marcada e contemporânea.' },
  { id: 2, name: 'Suite Set', price: 389, category: 'Conjuntos', image: '/key/conjunto.jpeg', sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Conjunto de tricot com desenho listrado e proporção delicada.' },
  { id: 3, name: 'Capri Top', price: 289, category: 'Blusas', image: '/leonor.jpeg', sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Top acetinado de alças finas com detalhe de franjas para um toque marcante.' },
  { id: 4, name: 'Rouge Dress', price: 499, category: 'Vestidos', image: null, sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Vestido em tom intenso com construção fluida e detalhes de volume.' },
  { id: 5, name: 'Louvre Jumpsuit', price: 479, category: 'Macacões', image: '/key/marrom.jpeg', sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Macacão de denim em marrom profundo, com cintura marcada e modelagem alongada.' },
  { id: 6, name: 'Riviera Set', price: 529, category: 'Conjuntos', image: '/key/blazer.jpeg', sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Conjunto de alfaiataria rosa com blazer e shorts, finalizado com faixa acetinada.' },
  { id: 7, name: 'Monaco Set', price: 449, category: 'Conjuntos', image: '/key/blusa%20vermelha.jpeg', sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Conjunto vermelho com camisa estruturada e calça de listras verticais.' },
  { id: 8, name: 'Milano Vest', price: 329, category: 'Blusas', image: '/key/top%20vermelho.jpeg', sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Colete estruturado vermelho com cintura marcada e acabamento arquitetônico.' },
  { id: 9, name: 'Paris Dots Set', price: 429, category: 'Conjuntos', image: '/black.jpeg', sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Conjunto de poás com camisa cropped e shorts de cintura alta.' },
  { id: 10, name: 'Palais Dress', price: 459, category: 'Vestidos', image: '/poair.jpeg', sizes: { PP: 2, P: 4, M: 4, G: 2 }, description: 'Vestido longo rosa com recorte frontal e movimento fluido.' }
]


const demoVariants = {
  1: [{ name: 'Azul', hex: '#2B4A78', sizes: { PP: 1, P: 3, M: 4, G: 2 } }, { name: 'Marfim', hex: '#E6DDCF', sizes: { PP: 2, P: 2, M: 3, G: 1 } }, { name: 'Bordô', hex: '#5A1F32', sizes: { PP: 1, P: 2, M: 2, G: 1 } }],
  2: [{ name: 'Areia', hex: '#C9B59C', sizes: { PP: 2, P: 3, M: 3, G: 1 } }, { name: 'Preto', hex: '#181717', sizes: { PP: 1, P: 3, M: 4, G: 2 } }, { name: 'Vinho', hex: '#6A273B', sizes: { PP: 1, P: 2, M: 2, G: 1 } }],
  3: [{ name: 'Marfim', hex: '#E9E1D5', sizes: { PP: 2, P: 3, M: 2, G: 1 } }, { name: 'Preto', hex: '#171516', sizes: { PP: 1, P: 2, M: 3, G: 1 } }, { name: 'Rosa Antigo', hex: '#B77F83', sizes: { PP: 1, P: 2, M: 2, G: 1 } }],
  4: [{ name: 'Rouge', hex: '#8B2436', sizes: { PP: 1, P: 3, M: 3, G: 2 } }, { name: 'Preto', hex: '#171314', sizes: { PP: 1, P: 2, M: 2, G: 1 } }, { name: 'Champagne', hex: '#D8C2A5', sizes: { PP: 1, P: 2, M: 2, G: 1 } }],
  5: [{ name: 'Chocolate', hex: '#6A4938', sizes: { PP: 1, P: 3, M: 4, G: 2 } }, { name: 'Denim', hex: '#3D5875', sizes: { PP: 1, P: 2, M: 3, G: 1 } }, { name: 'Preto', hex: '#191717', sizes: { PP: 1, P: 2, M: 2, G: 1 } }],
  6: [{ name: 'Rosa', hex: '#D6A4A7', sizes: { PP: 1, P: 3, M: 3, G: 2 } }, { name: 'Marfim', hex: '#E7DED0', sizes: { PP: 1, P: 2, M: 3, G: 1 } }, { name: 'Preto', hex: '#1A1718', sizes: { PP: 1, P: 2, M: 2, G: 1 } }],
  7: [{ name: 'Vermelho', hex: '#A32632', sizes: { PP: 1, P: 3, M: 4, G: 2 } }, { name: 'Marfim', hex: '#E8E0D5', sizes: { PP: 1, P: 2, M: 2, G: 1 } }, { name: 'Preto', hex: '#181617', sizes: { PP: 1, P: 2, M: 2, G: 1 } }],
  8: [{ name: 'Vermelho', hex: '#A32632', sizes: { PP: 1, P: 3, M: 3, G: 2 } }, { name: 'Off White', hex: '#E9E3D9', sizes: { PP: 1, P: 2, M: 2, G: 1 } }, { name: 'Chocolate', hex: '#5A4032', sizes: { PP: 1, P: 2, M: 2, G: 1 } }],
  9: [{ name: 'Preto', hex: '#171617', sizes: { PP: 1, P: 3, M: 4, G: 2 } }, { name: 'Creme', hex: '#E4DCCF', sizes: { PP: 1, P: 2, M: 3, G: 1 } }, { name: 'Bordô', hex: '#642238', sizes: { PP: 1, P: 2, M: 2, G: 1 } }],
  10: [{ name: 'Rosa Pétala', hex: '#D8A1A7', sizes: { PP: 1, P: 3, M: 3, G: 2 } }, { name: 'Vinho', hex: '#6C293D', sizes: { PP: 1, P: 2, M: 2, G: 1 } }, { name: 'Preto', hex: '#191719', sizes: { PP: 1, P: 2, M: 2, G: 1 } }]
}

const getVariants = product => Array.isArray(product?.variants) && product.variants.length ? product.variants : (demoVariants[product?.id] || [])
const buildInventory = list => Object.fromEntries(list.map(product => [
  product.id,
  Object.fromEntries(getVariants(product).map(variant => [variant.name, { ...(variant.sizes || {}) }]))
]))

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
  const variants = getVariants(product)
  const totalStock = variants.reduce((sum, variant) => sum + Object.values(variant.sizes || {}).reduce((s, value) => s + Number(value || 0), 0), 0)
  return (
    <article className="product-card">
      <button className="product-card-button" type="button" onClick={() => onOpen(product)}>
        <ProductImage product={product} />
        <span className="product-category">{product.category}</span>
        {totalStock === 0 ? <span className="stock-badge sold">Esgotado</span> : totalStock <= 3 ? <span className="stock-badge">Últimas unidades</span> : null}
      </button>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{money(product.price)}</p>
      </div>
    </article>
  )
}

function ProductPage({ product, onBack, onAdd, inventory }) {
  const variants = getVariants(product)
  const [color, setColor] = useState(variants[0]?.name || '')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const selectedVariant = variants.find(item => item.name === color) || variants[0]
  const stock = inventory[product.id] || Object.fromEntries(variants.map(item => [item.name, item.sizes || {}]))
  const colorStock = selectedVariant ? (stock[selectedVariant.name] || selectedVariant.sizes || {}) : {}
  const available = size ? Number(colorStock[size] || 0) : 0

  useEffect(() => {
    const first = variants[0]?.name || ''
    setColor(first)
    setSize('')
    setQuantity(1)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [product.id])

  const selectColor = value => {
    setColor(value)
    setSize('')
    setQuantity(1)
  }

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

          <div className="color-block">
            <div className="color-heading"><span>Cor</span><strong>{selectedVariant?.name || 'Selecione'}</strong></div>
            <div className="color-options" role="radiogroup" aria-label="Cores disponíveis">
              {variants.map(item => {
                const itemTotal = Object.values(stock[item.name] || item.sizes || {}).reduce((sum, value) => sum + Number(value || 0), 0)
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={color === item.name ? 'color-swatch selected' : 'color-swatch'}
                    style={{ '--swatch': item.hex }}
                    onClick={() => selectColor(item.name)}
                    aria-label={itemTotal > 0 ? item.name : item.name + ' esgotada'}
                    title={item.name}
                    disabled={itemTotal <= 0}
                  />
                )
              })}
            </div>
            <p className="color-name">{selectedVariant?.name || 'Escolha uma cor'}</p>
          </div>

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
                  disabled={(colorStock[item] || 0) <= 0}
                  onClick={() => { setSize(item); setQuantity(1) }}
                >
                  {item}{(colorStock[item] || 0) <= 0 ? ' — indisponível' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-block">
            <span>Quantidade</span>
            <div className="quantity-control">
              <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button type="button" disabled={!available || quantity >= available} onClick={() => setQuantity(q => Math.min(available, q + 1))}>+</button>
            </div>
          </div>

          <button
            className="add-to-bag"
            type="button"
            disabled={!color || !size || available === 0}
            onClick={() => onAdd(product, color, size, quantity)}
          >
            {!color ? 'Selecione uma cor' : !size ? 'Selecione um tamanho' : available === 0 ? 'Tamanho indisponível' : 'Adicionar à sacola'}
          </button>
          <p className="product-note">{color && size && available > 0 && available <= 3 ? `Restam ${available} unidade${available > 1 ? 's' : ''} nesta cor e tamanho.` : 'Envio calculado no checkout.'}</p>
        </div>
      </div>
    </main>
  )
}

function CheckoutPage({ items, onBack, onComplete }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const [shipping, setShipping] = useState({ name: '', email: '', phone: '', cep: '', address: '', number: '', city: '', state: '' })
  const [payment, setPayment] = useState('pix')
  const [shippingCost, setShippingCost] = useState(null)
  const [shippingLabel, setShippingLabel] = useState('Informe o CEP')
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  const update = e => {
    const { name, value } = e.target
    setShipping(current => ({ ...current, [name]: name === 'state' ? value.toUpperCase() : value }))
  }

  const calculateShipping = ({ city, state }) => {
    const normalizedCity = city.trim().toLowerCase()
    const normalizedState = state.trim().toUpperCase()

    if (normalizedState !== 'CE') {
      setShippingCost(null)
      setShippingLabel('Frete a calcular')
      return
    }

    if (normalizedCity === 'fortaleza') {
      setShippingCost(15)
      setShippingLabel('Fortaleza')
      return
    }

    const metroCities = [
      'caucaia', 'eusebio', 'eusébio', 'aquiraz', 'maracanau', 'maracanaú',
      'maranguape', 'pacatuba', 'horizonte', 'itaitinga', 'guaiuba', 'guaiúba',
      'chorozinho', 'pindoretama', 'sao goncalo do amarante', 'são gonçalo do amarante'
    ]

    if (metroCities.includes(normalizedCity)) {
      setShippingCost(20)
      setShippingLabel('Região Metropolitana de Fortaleza')
      return
    }

    setShippingCost(null)
    setShippingLabel('Frete a calcular')
  }

  const lookupCep = async () => {
    const cep = shipping.cep.replace(/\\D/g, '')
    if (cep.length !== 8) {
      setCepError('Digite um CEP válido.')
      return
    }

    setCepLoading(true)
    setCepError('')

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      if (!response.ok) throw new Error('CEP')
      const data = await response.json()
      if (data.erro) throw new Error('CEP')

      setShipping(current => ({
        ...current,
        address: data.logradouro || current.address,
        city: data.localidade || current.city,
        state: data.uf || current.state
      }))
      calculateShipping({ city: data.localidade || '', state: data.uf || '' })
    } catch {
      setShippingCost(null)
      setShippingLabel('Frete a calcular')
      setCepError('Não foi possível localizar este CEP.')
    } finally {
      setCepLoading(false)
    }
  }

  const discount = appliedCoupon?.type === 'percent' ? subtotal * appliedCoupon.value : 0
  const couponShippingFree = appliedCoupon?.type === 'freeShipping'
  const freeShipping = subtotal >= 499
  const effectiveShipping = freeShipping || couponShippingFree ? 0 : (shippingCost || 0)
  const total = Math.max(0, subtotal - discount + effectiveShipping)

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    const coupons = {
      KEY10: { code: 'KEY10', type: 'percent', value: 0.10, label: '10% de desconto' },
      KEYFRETE: { code: 'KEYFRETE', type: 'freeShipping', value: 0, label: 'Frete grátis' }
    }
    const found = coupons[code]
    if (!found) {
      setAppliedCoupon(null)
      setCouponError('Cupom inválido.')
      return
    }
    setAppliedCoupon(found)
    setCouponError('')
  }

  const complete = e => {
    e.preventDefault()
    const required = ['name', 'email', 'phone', 'cep', 'address', 'number', 'city', 'state']
    if (required.some(field => !shipping[field].trim())) return

    onComplete({
      shipping,
      payment,
      subtotal,
      shippingCost: effectiveShipping,
      shippingLabel: effectiveShipping === 0 ? 'Grátis' : shippingLabel,
      discount,
      coupon: appliedCoupon?.code || null,
      total
    })
  }

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

      <form className="checkout-layout" onSubmit={complete}>
        <section className="checkout-form">
          <p className="eyebrow">SEUS DADOS</p>
          <h1>Finalizar pedido</h1>

          <div className="checkout-fields">
            <label>Nome<input required name="name" value={shipping.name} onChange={update} placeholder="Seu nome" /></label>
            <label>E-mail<input required name="email" type="email" value={shipping.email} onChange={update} placeholder="seu@email.com" /></label>
            <label>Telefone<input required name="phone" value={shipping.phone} onChange={update} placeholder="(00) 00000-0000" /></label>
          </div>

          <div className="checkout-section">
            <p className="eyebrow">ENTREGA</p>
            <div className="checkout-fields address-grid">
              <label>
                CEP
                <div className="cep-field">
                  <input required name="cep" value={shipping.cep} onChange={update} onBlur={lookupCep} placeholder="00000-000" inputMode="numeric" maxLength="9" />
                  <button type="button" onClick={lookupCep}>{cepLoading ? '...' : 'Buscar'}</button>
                </div>
                {cepError && <small className="field-error">{cepError}</small>}
              </label>
              <label>Endereço<input required name="address" value={shipping.address} onChange={update} placeholder="Rua, avenida..." /></label>
              <label>Número<input required name="number" value={shipping.number} onChange={update} placeholder="000" /></label>
              <label>Cidade<input required name="city" value={shipping.city} onChange={update} onBlur={() => calculateShipping(shipping)} placeholder="Sua cidade" /></label>
              <label>UF<input required name="state" value={shipping.state} onChange={update} onBlur={() => calculateShipping(shipping)} placeholder="CE" maxLength="2" /></label>
            </div>
            <p className="shipping-note">Fortaleza: R$ 15,00 · Região Metropolitana: R$ 20,00 · Demais localidades: frete será integrado posteriormente.</p>
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
            <p className="checkout-hint">Pagamento real será conectado posteriormente.</p>
          </div>
        </section>

        <aside className="checkout-summary">
          <p className="eyebrow">SEU PEDIDO</p>
          <div className="checkout-items">
            {items.map(item => (
              <div className="checkout-item" key={item.key}>
                <div className="checkout-thumb"><ProductImage product={item} /></div>
                <div><h3>{item.name}</h3><p>{item.color} · {item.size} · {item.quantity}x</p></div>
                <strong>{money(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="coupon-box">
            <label htmlFor="coupon">Cupom de desconto</label>
            <div className="coupon-field">
              <input id="coupon" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Digite seu cupom" />
              <button type="button" onClick={applyCoupon}>Aplicar</button>
            </div>
            {couponError && <small className="field-error">{couponError}</small>}
            {appliedCoupon && <small className="coupon-success">{appliedCoupon.code} aplicado — {appliedCoupon.label}</small>}
          </div>
          <div className="checkout-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          {discount > 0 && <div className="checkout-total muted"><span>Desconto</span><strong>− {money(discount)}</strong></div>}
          <div className="checkout-total muted"><span>Frete</span><strong>{freeShipping || couponShippingFree ? 'Grátis' : shippingCost === null ? shippingLabel : money(shippingCost)}</strong></div>
          <div className="checkout-total grand"><span>Total</span><strong>{money(total)}</strong></div>
          <button className="button checkout-final" type="submit">Revisar pedido</button>
          <p className="checkout-secure">Nenhum pagamento será realizado nesta etapa.</p>
        </aside>
      </form>
    </main>
  )
}

function OrderTracking({ onBack }) {
  const [number, setNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const statusLabels = {
    pending: 'Pedido recebido',
    paid: 'Pagamento confirmado',
    processing: 'Em preparação',
    shipped: 'Enviado',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  }

  const statusSteps = ['pending', 'paid', 'processing', 'shipped', 'completed']
  const statusIndex = order ? statusSteps.indexOf(order.status) : -1

  const search = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    const { data, error: queryError } = await supabase.rpc('track_key_order', {
      p_order_number: number.trim(),
      p_customer_email: email.trim()
    })

    setLoading(false)

    if (queryError || !data?.length) {
      setError('Não encontramos um pedido com esses dados.')
      return
    }

    setOrder(data[0])
  }

  return (
    <main className="tracking-page">
      <div className="tracking-top">
        <button className="back-link" onClick={onBack}>← Voltar para a loja</button>
        <span>KEY / PEDIDO</span>
      </div>

      {!order ? (
        <section className="tracking-card">
          <p className="eyebrow">ACOMPANHE SEU PEDIDO</p>
          <h1>Onde está sua KEY?</h1>
          <p>Informe o número do pedido e o e-mail usado na compra.</p>
          <form onSubmit={search} className="tracking-form">
            <label>Número do pedido<input value={number} onChange={e => setNumber(e.target.value.toUpperCase())} placeholder="KEY-123456" required /></label>
            <label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required /></label>
            {error && <p className="field-error">{error}</p>}
            <button className="button" type="submit" disabled={loading}>{loading ? 'Consultando...' : 'Consultar pedido'}</button>
          </form>
        </section>
      ) : (
        <section className="tracking-result">
          <div className="tracking-result-head">
            <div><p className="eyebrow">PEDIDO {order.order_number}</p><h1>{statusLabels[order.status] || order.status}</h1><p>Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')}</p></div>
            <button className="back-link" onClick={() => setOrder(null)}>Consultar outro</button>
          </div>
          {order.status === 'cancelled' ? (
            <div className="tracking-cancelled">Este pedido foi cancelado.</div>
          ) : (
            <div className="tracking-steps">
              {statusSteps.map((step, index) => (
                <div className={index <= statusIndex ? 'tracking-step active' : 'tracking-step'} key={step}>
                  <span>{index + 1}</span><strong>{statusLabels[step]}</strong>
                </div>
              ))}
            </div>
          )}
          <div className="tracking-summary">
            <div><span>Cliente</span><strong>{order.customer_name}</strong></div>
            <div><span>Entrega</span><strong>{order.city} — {order.state}</strong></div>
            <div><span>Total</span><strong>{money(Number(order.total))}</strong></div>
          </div>
          <button className="button" onClick={onBack}>Continuar na KEY</button>
        </section>
      )}
    </main>
  )
}

function OrderConfirmation({ order, onContinue }) {
  return (
    <main className="confirmation-page">
      <div className="confirmation-card">
        <p className="eyebrow">KEY / PEDIDO</p>
        <div className="confirmation-mark">✓</div>
        <h1>Pedido recebido.</h1>
        <p className="confirmation-text">Sua seleção foi registrada. O pagamento ainda não foi processado.</p>
        <div className="confirmation-number">
          <span>Número do pedido</span>
          <strong>{order.number}</strong>
        </div>
        <div className="confirmation-summary">
          <div><span>Cliente</span><strong>{order.shipping.name}</strong></div>
          <div><span>Pagamento</span><strong>{order.payment === 'pix' ? 'Pix' : 'Cartão'}</strong></div>
          <div><span>Total</span><strong>{money(order.total)}</strong></div>
          {order.discount > 0 && <div><span>Desconto</span><strong>− {money(order.discount)}</strong></div>}
        </div>
        <div className="confirmation-delivery">
          <div><span>Entrega</span><strong>{order.shipping.address}, {order.shipping.number}</strong></div>
          <div><span>Cidade / UF</span><strong>{order.shipping.city} — {order.shipping.state}</strong></div>
          <div><span>Frete</span><strong>{order.shippingCost === null ? order.shippingLabel : money(order.shippingCost)}</strong></div>
        </div>
        <div className="confirmation-products">
          <span>Itens</span>
          {order.items.map(item => (
            <div key={item.key}><span>{item.quantity}x {item.name} · {item.color} · {item.size}</span><strong>{money(item.price * item.quantity)}</strong></div>
          ))}
        </div>
        <button className="button" onClick={onContinue}>Continuar na KEY</button>
      </div>
    </main>
  )
}
function BagDrawer({ items, onClose, onRemove, onQuantity, onCheckout, inventory }) {
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
                        <p>{item.color} · Tamanho: {item.size}</p>
                      </div>
                      <button onClick={() => onRemove(item.key)} aria-label={`Remover ${item.name}`}>×</button>
                    </div>
                    <div className="bag-item-bottom">
                      <div className="mini-quantity">
                        <button onClick={() => onQuantity(item.key, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button disabled={item.quantity >= Number((inventory[item.id] || {})[item.color]?.[item.size] || 0)} onClick={() => onQuantity(item.key, item.quantity + 1)}>+</button>
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
              <button className="button checkout-button" type="button" onClick={onCheckout}>Ir para checkout</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}



const ADMIN_DB = 'key-admin-assets'
const ADMIN_STORE = 'files'
const ADMIN_CONFIG = 'key-site-config'

const defaultAdminConfig = {
  announcement: 'FREE SHIPPING ON ORDERS OVER R$ 499',
  freeShippingThreshold: 499,
  banners: [
    { id: 1, title: 'Wear your key piece.', subtitle: 'Uma seleção feminina pensada para marcar presença.', cta: 'Ver coleção', fileId: '', image: '/key/banner-01.jpg', enabled: true },
    { id: 2, title: 'New collection.', subtitle: 'Descubra a nova seleção KEY.', cta: 'Descobrir', fileId: '', image: '', enabled: true },
    { id: 3, title: 'Find your key.', subtitle: 'Peças para construir seu guarda-roupa.', cta: 'Ver coleção', fileId: '', image: '', enabled: true }
  ],
  products: Object.fromEntries(products.map(product => [product.id, {
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description,
    image: product.image || '',
    fileId: '',
    visible: true
  }]))
}

function readAdminConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(ADMIN_CONFIG) || 'null')
    return {
      ...defaultAdminConfig,
      ...(saved || {}),
      banners: Array.isArray(saved?.banners) ? saved.banners : defaultAdminConfig.banners,
      products: { ...defaultAdminConfig.products, ...(saved?.products || {}) }
    }
  } catch {
    return defaultAdminConfig
  }
}

function adminOpenDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(ADMIN_DB, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(ADMIN_STORE)) db.createObjectStore(ADMIN_STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function adminListFiles() {
  const db = await adminOpenDB()
  return new Promise((resolve, reject) => {
    const request = db.transaction(ADMIN_STORE, 'readonly').objectStore(ADMIN_STORE).getAll()
    request.onsuccess = () => resolve(request.result.sort((a, b) => b.createdAt - a.createdAt))
    request.onerror = () => reject(request.error)
  })
}

async function adminSaveFiles(files) {
  const db = await adminOpenDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ADMIN_STORE, 'readwrite')
    files.forEach(file => tx.objectStore(ADMIN_STORE).put(file))
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}

async function adminDeleteFile(id) {
  const db = await adminOpenDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ADMIN_STORE, 'readwrite')
    tx.objectStore(ADMIN_STORE).delete(id)
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}


const ADMIN_SESSION = 'key-admin-session'

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setBusy(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    setBusy(false)

    if (authError || !data.session) {
      setError('E-mail ou senha inválidos.')
      return
    }

    onLogin(data.session)
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">KEY</div>
        <p className="eyebrow">KEY / MANAGEMENT</p>
        <h1>Acesso restrito.</h1>
        <p className="admin-login-copy">Entre com seu e-mail administrativo e senha.</p>
        <form onSubmit={submit} className="admin-login-form">
          <label>E-mail<input autoComplete="username" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu e-mail" required /></label>
          <label>Senha<input autoComplete="current-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" required /></label>
          {error && <p className="admin-login-error">{error}</p>}
          <button className="admin-primary full" type="submit" disabled={busy}>{busy ? 'Entrando...' : 'Entrar no painel'}</button>
        </form>
        <button className="admin-login-store" type="button" onClick={() => { window.location.href = '/' }}>Voltar para a loja</button>
      </div>
    </main>
  )
}

function AdminPage() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [files, setFiles] = useState([])
  const [config, setConfig] = useState(readAdminConfig)
  const [category, setCategory] = useState('banner')
  const [dragging, setDragging] = useState(false)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedProductId, setSelectedProductId] = useState(1)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session || null)
        setAuthLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession || null)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session) return
    adminListFiles().then(setFiles).catch(() => setNotice('Não foi possível carregar a biblioteca.')).finally(() => setLoading(false))
  }, [session])

  const loadOrders = async () => {
    setOrdersLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('id,order_number,customer_name,customer_email,customer_phone,cep,address,address_number,city,state,payment_method,subtotal,shipping,discount,total,coupon,status,created_at,order_items(id,product_name,color,size,quantity,unit_price)')
      .order('created_at', { ascending: false })
    setOrdersLoading(false)
    if (error) {
      setNotice('Não foi possível carregar os pedidos.')
      return
    }
    setOrders(data || [])
  }

  useEffect(() => {
    if (!session || tab !== 'orders') return
    loadOrders()
  }, [session, tab])

  const updateOrderStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) {
      setNotice('Não foi possível atualizar o pedido.')
      return
    }
    setOrders(current => current.map(order => order.id === id ? { ...order, status } : order))
    setNotice('Status do pedido atualizado.')
  }

  const saveConfig = async next => {
    setConfig(next)
    localStorage.setItem(ADMIN_CONFIG, JSON.stringify(next))

    try {
      // Publica cada banner e garante que o registro exista no servidor.
      for (let index = 0; index < (next.banners || []).length; index += 1) {
        const banner = next.banners[index]
        const selectedFile = (files || []).find(file => file.id === banner.fileId)
        const imagePath = banner.image || selectedFile?.storageUrl || ''
        const payload = {
          id: banner.id,
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          cta: banner.cta || '',
          image_path: imagePath,
          enabled: banner.enabled !== false,
          sort_order: index + 1
        }

        const { data, error } = await supabase
          .from('banners')
          .update(payload)
          .eq('id', banner.id)
          .select('id')

        if (error) throw error

        if (!data?.length) {
          const { error: insertError } = await supabase.from('banners').insert(payload)
          if (insertError && insertError.code !== '23505') throw insertError
        }
      }

      const settings = [
        { key: 'announcement', value: next.announcement || '' },
        { key: 'free_shipping_threshold', value: Number(next.freeShippingThreshold || 0) }
      ]

      for (const setting of settings) {
        const { data, error } = await supabase
          .from('site_settings')
          .update({ value: setting.value })
          .eq('key', setting.key)
          .select('key')

        if (error) throw error

        if (!data?.length) {
          const { error: insertError } = await supabase.from('site_settings').insert(setting)
          if (insertError && insertError.code !== '23505') throw insertError
        }
      }

      setNotice('Alterações publicadas no servidor.')
    } catch (error) {
      console.error('KEY CMS publish error', error)
      setNotice(`Erro ao publicar: ${error?.message || 'verifique a conexão com o servidor.'}`)
    }
  }

  const addFiles = async selected => {
    const accepted = Array.from(selected).filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))
    if (!accepted.length) {
      setNotice('Selecione imagens ou vídeos.')
      return
    }

    const newFiles = []

    try {
      for (const file of accepted) {
        const id = crypto.randomUUID()
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')
        const storagePath = `admin/${id}-${safeName}`
        const { error: uploadError } = await supabase.storage
          .from('key-assets')
          .upload(storagePath, file, { upsert: true, contentType: file.type })

        if (uploadError) throw uploadError

        const { data: publicData } = supabase.storage.from('key-assets').getPublicUrl(storagePath)

        newFiles.push({
          id,
          name: file.name,
          type: file.type,
          size: file.size,
          category,
          createdAt: Date.now(),
          blob: file,
          storagePath,
          storageUrl: publicData.publicUrl
        })
      }

      await adminSaveFiles(newFiles)
      setFiles(current => [...newFiles, ...current])
      setNotice(`${newFiles.length} arquivo${newFiles.length > 1 ? 's' : ''} adicionado${newFiles.length > 1 ? 's' : ''} à biblioteca.`)
      setTab('media')
    } catch {
      setNotice('Não foi possível salvar os arquivos.')
    }
  }

  const remove = async id => {
    await adminDeleteFile(id)
    const next = { ...config }
    next.banners = next.banners.map(b => b.fileId === id ? { ...b, fileId: '', image: '' } : b)
    next.products = Object.fromEntries(Object.entries(next.products).map(([key, value]) => [key, value.fileId === id ? { ...value, fileId: '', image: '' } : value]))
    localStorage.setItem(ADMIN_CONFIG, JSON.stringify(next))
    setConfig(next)
    setFiles(current => current.filter(file => file.id !== id))
    setNotice('Arquivo removido.')
  }

  const fileUrl = file => {
    if (file.storageUrl) return file.storageUrl
    try { return URL.createObjectURL(file.blob) } catch { return '' }
  }

  const chooseBannerImage = (bannerId, file) => {
    const next = {
      ...config,
      banners: config.banners.map(b => b.id === bannerId
        ? { ...b, fileId: file.id, image: file.storageUrl || file.image || '' }
        : b)
    }
    saveConfig(next)
  }

  const updateBanner = (id, field, value) => {
    setConfig(current => ({
      ...current,
      banners: current.banners.map(b => b.id === id ? { ...b, [field]: value } : b)
    }))
  }

  const updateProduct = (id, field, value) => {
    setConfig(current => ({
      ...current,
      products: { ...current.products, [id]: { ...current.products[id], [field]: value } }
    }))
  }

  const selectProductImage = file => {
    const next = {
      ...config,
      products: { ...config.products, [selectedProductId]: { ...config.products[selectedProductId], fileId: file.id, image: '' } }
    }
    saveConfig(next)
  }

  const leave = () => { window.location.href = '/' }

  const nav = [
    ['overview', 'Visão geral'],
    ['orders', 'Pedidos'],
    ['banners', 'Banners'],
    ['products', 'Produtos'],
    ['media', 'Arquivos'],
    ['settings', 'Configurações']
  ]

  const renderMediaPicker = (onChoose, label = 'Escolher arquivo') => (
    <div className="admin-picker">
      <div className="admin-picker-head"><span>{label}</span><small>{files.length} disponíveis</small></div>
      {files.length === 0 ? (
        <div className="admin-picker-empty">Envie arquivos na aba Arquivos.</div>
      ) : (
        <div className="admin-picker-grid">
          {files.map(file => (
            <button type="button" key={file.id} className="admin-picker-item" onClick={() => onChoose(file)}>
              {file.type.startsWith('video/') ? <video src={fileUrl(file)} muted /> : <img src={fileUrl(file)} alt="" />}
              <span>{file.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )

  if (authLoading) return <main className="admin-login-page"><div className="admin-login-card"><div className="admin-login-brand">KEY</div><p className="eyebrow">KEY / MANAGEMENT</p><h1>Verificando acesso.</h1></div></main>
  if (!session) return <AdminLogin onLogin={setSession} />

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>KEY</span><small>Management</small></div>
        <nav>
          {nav.map(([id, label]) => (
            <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
              <span className="admin-nav-dot" />{label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-actions">
          <button className="admin-sidebar-store" onClick={leave}>Ver loja <span>↗</span></button>
          <button className="admin-logout" onClick={async () => { await supabase.auth.signOut(); setSession(null) }}>Sair</button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">KEY / MANAGEMENT</p>
            <h1>{nav.find(item => item[0] === tab)?.[1]}</h1>
          </div>
          <button className="admin-publish" onClick={() => saveConfig(config)}>Publicar alterações <span>→</span></button>
        </header>

        {tab === 'overview' && (
          <div className="admin-dashboard">
            <section className="admin-welcome">
              <div><p className="eyebrow">PAINEL DA KEY</p><h2>Seu site, em um só lugar.</h2><p>Gerencie banners, produtos e arquivos sem precisar mexer no código.</p></div>
              <button className="admin-primary" onClick={() => setTab('banners')}>Editar página inicial →</button>
            </section>
            <div className="admin-stats">
              <div><span>Produtos</span><strong>{products.length}</strong><small>cadastrados</small></div>
              <div><span>Banners</span><strong>{config.banners.filter(b => b.enabled).length}</strong><small>ativos</small></div>
              <div><span>Arquivos</span><strong>{files.length}</strong><small>na biblioteca</small></div>
              <div><span>Frete grátis</span><strong>R$ {Number(config.freeShippingThreshold || 0).toLocaleString('pt-BR')}</strong><small>acima desse valor</small></div>
            </div>
            <section className="admin-card admin-quick">
              <div><div><p className="eyebrow">ACESSO RÁPIDO</p><h3>O que você quer alterar?</h3></div></div>
              <div className="admin-quick-grid">
                <button onClick={() => setTab('banners')}><strong>Banners</strong><span>Trocar imagens e textos da home →</span></button>
                <button onClick={() => setTab('products')}><strong>Produtos</strong><span>Preço, descrição e fotos →</span></button>
                <button onClick={() => setTab('media')}><strong>Arquivos</strong><span>Enviar novas imagens →</span></button>
                <button onClick={() => setTab('settings')}><strong>Configurações</strong><span>Frete e comunicação →</span></button>
              </div>
            </section>
          </div>
        )}

        {tab === 'orders' && (
          <div className="admin-page-section">
            <div className="admin-section-intro">
              <div><p className="eyebrow">VENDAS</p><h2>Pedidos.</h2><p>Acompanhe pedidos, clientes, itens e atualize o andamento diretamente pelo painel.</p></div>
              <button className="admin-primary" onClick={loadOrders}>{ordersLoading ? 'Atualizando...' : 'Atualizar pedidos'}</button>
            </div>
            {ordersLoading && orders.length === 0 ? <div className="admin-empty">Carregando pedidos…</div> : orders.length === 0 ? (
              <div className="admin-empty">Nenhum pedido registrado ainda.</div>
            ) : (
              <div className="admin-orders-list">
                {orders.map(order => (
                  <article className="admin-order-card" key={order.id}>
                    <div className="admin-order-head">
                      <div><span className="admin-label">{order.order_number}</span><h3>{order.customer_name}</h3><small>{new Date(order.created_at).toLocaleString('pt-BR')}</small></div>
                      <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}>
                        <option value="pending">Pendente</option>
                        <option value="paid">Pago</option>
                        <option value="processing">Em preparação</option>
                        <option value="shipped">Enviado</option>
                        <option value="completed">Concluído</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                    <div className="admin-order-grid">
                      <div><span>Cliente</span><strong>{order.customer_email}</strong><small>{order.customer_phone || '—'}</small></div>
                      <div><span>Entrega</span><strong>{order.address}, {order.address_number}</strong><small>{order.city} / {order.state} · CEP {order.cep || '—'}</small></div>
                      <div><span>Pagamento</span><strong>{order.payment_method === 'pix' ? 'Pix' : 'Cartão'}</strong><small>{order.coupon ? `Cupom: ${order.coupon}` : 'Sem cupom'}</small></div>
                      <div><span>Total</span><strong>{money(Number(order.total))}</strong><small>Subtotal {money(Number(order.subtotal))} · Frete {Number(order.shipping) === 0 ? 'Grátis' : money(Number(order.shipping))}</small></div>
                    </div>
                    <div className="admin-order-items">
                      {(order.order_items || []).map(item => <div key={item.id}><span>{item.quantity}×</span><strong>{item.product_name}</strong><small>{item.color} · {item.size}</small><b>{money(Number(item.unit_price) * item.quantity)}</b></div>)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'banners' && (
          <div className="admin-page-section">
            <div className="admin-section-intro"><div><p className="eyebrow">HOME / HERO</p><h2>Controle os banners.</h2><p>Escolha a imagem e edite o conteúdo de cada posição da página inicial.</p></div></div>
            <div className="admin-banner-list">
              {config.banners.map((banner, index) => {
                const selected = files.find(file => file.id === banner.fileId)
                const image = selected ? fileUrl(selected) : banner.image
                return (
                  <article className="admin-banner-card" key={banner.id}>
                    <div className="admin-banner-preview" style={image ? { backgroundImage: `url("${image}")` } : undefined}>
                      {!image && <span>Banner {index + 1}<br />sem imagem</span>}
                      <div className="admin-banner-number">0{index + 1}</div>
                    </div>
                    <div className="admin-banner-fields">
                      <div className="admin-inline-head"><div><span className="admin-label">BANNER 0{index + 1}</span><h3>{banner.enabled ? 'Ativo' : 'Oculto'}</h3></div><label className="admin-switch"><input type="checkbox" checked={banner.enabled} onChange={e => updateBanner(banner.id, 'enabled', e.target.checked)} /><span /></label></div>
                      <label>Título<input value={banner.title} onChange={e => updateBanner(banner.id, 'title', e.target.value)} /></label>
                      <label>Texto<input value={banner.subtitle} onChange={e => updateBanner(banner.id, 'subtitle', e.target.value)} /></label>
                      <label>Botão<input value={banner.cta} onChange={e => updateBanner(banner.id, 'cta', e.target.value)} /></label>
                      <div className="admin-image-actions">
                        <button type="button" onClick={() => setTab('media')}>Enviar nova imagem</button>
                        {files.length > 0 && <select value={banner.fileId} onChange={e => {
                          const file = files.find(item => item.id === e.target.value)
                          if (file) chooseBannerImage(banner.id, file)
                        }}><option value="">Selecionar da biblioteca</option>{files.map(file => <option key={file.id} value={file.id}>{file.name}</option>)}</select>}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="admin-page-section">
            <div className="admin-section-intro"><div><p className="eyebrow">CATÁLOGO</p><h2>Seus produtos.</h2><p>Edite as informações principais e escolha a foto de cada peça.</p></div></div>
            <div className="admin-product-manager">
              <div className="admin-product-list">
                {products.map(product => {
                  const data = config.products[product.id]
                  const selected = files.find(file => file.id === data.fileId)
                  const image = selected ? fileUrl(selected) : data.image
                  return <button key={product.id} className={selectedProductId === product.id ? 'active' : ''} onClick={() => setSelectedProductId(product.id)}>
                    <span className="admin-product-mini">{image ? <img src={image} alt="" /> : <span>—</span>}</span><span><strong>{data.name}</strong><small>{money(Number(data.price) || 0)}</small></span>
                  </button>
                })}
              </div>
              <div className="admin-product-editor">
                {(() => {
                  const data = config.products[selectedProductId]
                  const selected = files.find(file => file.id === data.fileId)
                  const image = selected ? fileUrl(selected) : data.image
                  return <>
                    <div className="admin-editor-image">{image ? <img src={image} alt={data.name} /> : <span>Sem foto</span>}</div>
                    <div className="admin-editor-fields">
                      <div className="admin-editor-title"><p className="eyebrow">PRODUTO {String(selectedProductId).padStart(2, '0')}</p><h3>{data.name}</h3></div>
                      <label>Nome<input value={data.name} onChange={e => updateProduct(selectedProductId, 'name', e.target.value)} /></label>
                      <div className="admin-two-fields"><label>Preço<input type="number" value={data.price} onChange={e => updateProduct(selectedProductId, 'price', Number(e.target.value))} /></label><label>Categoria<input value={data.category} onChange={e => updateProduct(selectedProductId, 'category', e.target.value)} /></label></div>
                      <label>Descrição<textarea rows="4" value={data.description} onChange={e => updateProduct(selectedProductId, 'description', e.target.value)} /></label>
                      {renderMediaPicker(selectProductImage, 'Foto do produto')}
                      <button className="admin-primary full" onClick={() => saveConfig(config)}>Salvar produto</button>
                    </div>
                  </>
                })()}
              </div>
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="admin-page-section">
            <div className="admin-section-intro"><div><p className="eyebrow">BIBLIOTECA</p><h2>Arquivos da KEY.</h2><p>Arraste imagens ou vídeos para dentro da área abaixo. Eles ficam disponíveis para banners e produtos.</p></div></div>
            <div className="admin-media-upload">
              <div className="admin-upload-options"><label>Destino<select value={category} onChange={e => setCategory(e.target.value)}><option value="banner">Banner</option><option value="produto">Produto</option><option value="editorial">Editorial</option><option value="outro">Outro</option></select></label></div>
              <label className={`admin-dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}>
                <input type="file" multiple accept="image/*,video/*" onChange={e => { addFiles(e.target.files); e.target.value = '' }} />
                <span className="admin-drop-icon">＋</span><strong>Arraste seus arquivos aqui</strong><span>ou clique para selecionar</span><small>JPG · PNG · WEBP · MP4 · múltiplos arquivos</small>
              </label>
            </div>
            <div className="admin-media-head"><div><p className="eyebrow">ARQUIVOS</p><h3>{files.length} itens</h3></div></div>
            {loading ? <div className="admin-empty">Carregando…</div> : files.length === 0 ? <div className="admin-empty">Sua biblioteca está vazia.</div> : <div className="admin-file-grid">{files.map(file => <article className="admin-file-card" key={file.id}><div className="admin-file-preview">{file.type.startsWith('video/') ? <video src={fileUrl(file)} muted controls /> : <img src={fileUrl(file)} alt={file.name} />}</div><div className="admin-file-info"><span className="admin-file-tag">{file.category}</span><strong title={file.name}>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></div><button type="button" className="admin-delete" onClick={() => remove(file.id)}>Excluir</button></article>)}</div>}
          </div>
        )}

        {tab === 'settings' && (
          <div className="admin-page-section">
            <div className="admin-section-intro"><div><p className="eyebrow">CONFIGURAÇÕES</p><h2>Detalhes da loja.</h2><p>Controle pequenas informações comerciais sem tocar no código.</p></div></div>
            <div className="admin-settings-grid">
              <section className="admin-card"><p className="eyebrow">COMUNICAÇÃO</p><h3>Barra superior</h3><label>Mensagem<input value={config.announcement} onChange={e => setConfig(current => ({ ...current, announcement: e.target.value }))} /></label><p className="admin-help">A mensagem exibida no topo da loja.</p></section>
              <section className="admin-card"><p className="eyebrow">FRETE</p><h3>Frete grátis</h3><label>Pedido mínimo<input type="number" value={config.freeShippingThreshold} onChange={e => setConfig(current => ({ ...current, freeShippingThreshold: Number(e.target.value) }))} /></label><p className="admin-help">Acima deste valor o site mostra frete grátis.</p></section>
            </div>
            <button className="admin-primary" onClick={() => saveConfig(config)}>Salvar configurações</button>
          </div>
        )}
      </main>

      {notice && <div className="admin-toast">{notice}</div>}
    </div>
  )
}


const categoryPages = {
  vestidos: {
    label: 'Vestidos',
    eyebrow: 'KEY / VESTIDOS',
    title: 'Vestidos',
    intro: 'Silhuetas pensadas para marcar presença, do primeiro olhar ao último detalhe.'
  },
  conjuntos: {
    label: 'Conjuntos',
    eyebrow: 'KEY / CONJUNTOS',
    title: 'Conjuntos',
    intro: 'Proporções coordenadas para criar looks completos com personalidade.'
  },
  blusas: {
    label: 'Blusas',
    eyebrow: 'KEY / BLUSAS',
    title: 'Blusas',
    intro: 'Peças que transformam a composição e dão o tom ao seu guarda-roupa.'
  }
}

function CategoryPage({ category, products: catalog, inventory, onOpen, onBack }) {
  const page = categoryPages[category] || categoryPages.conjuntos
  const items = catalog.filter(product => product.category.toLowerCase() === page.label.toLowerCase())

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [category])

  return (
    <main className="category-page">
      <div className="category-page-top">
        <button className="back-link" type="button" onClick={onBack}>← Voltar para a loja</button>
      </div>

      <section className="category-page-hero">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
        <span className="category-page-count">{items.length} {items.length === 1 ? 'peça' : 'peças'}</span>
      </section>

      <section className="category-page-products">
        {items.length > 0 ? (
          <div className="product-grid">
            {items.map(product => <ProductCard key={product.id} product={product} inventory={inventory} onOpen={onOpen} />)}
          </div>
        ) : (
          <div className="category-empty">Nenhuma peça disponível nesta categoria.</div>
        )}
      </section>
    </main>
  )
}

function LegalPage({ type, onBack }) {
  const content = {
    privacy: {
      eyebrow: 'KEY / PRIVACIDADE',
      title: 'Política de Privacidade',
      sections: [
        ['Dados coletados', 'A KEY coleta os dados informados pelo cliente durante o pedido, como nome, e-mail, telefone e endereço, para processar, entregar e acompanhar a compra.'],
        ['Uso das informações', 'As informações são utilizadas para atendimento, processamento de pedidos, entrega, comunicação relacionada à compra e cumprimento de obrigações legais.'],
        ['Compartilhamento', 'Os dados podem ser compartilhados apenas com prestadores necessários à operação do pedido, como serviços de entrega e infraestrutura tecnológica, quando aplicável.'],
        ['Segurança', 'A KEY adota medidas técnicas e administrativas para proteger os dados tratados em sua operação.']
      ]
    },
    terms: {
      eyebrow: 'KEY / TERMOS',
      title: 'Termos de Uso',
      sections: [
        ['Pedidos', 'O pedido é registrado após o preenchimento das informações solicitadas e está sujeito à disponibilidade das peças e validação dos dados.'],
        ['Produtos', 'Cores, medidas, disponibilidade e imagens podem apresentar pequenas variações em relação à visualização em diferentes telas.'],
        ['Preços', 'Os preços exibidos no site são os valores vigentes no momento da compra e podem ser alterados para novos pedidos.'],
        ['Atendimento', 'Em caso de dúvidas sobre um pedido, o cliente deve utilizar os canais de contato disponibilizados pela KEY.']
      ]
    },
    returns: {
      eyebrow: 'KEY / TROCAS',
      title: 'Trocas e Devoluções',
      sections: [
        ['Solicitação', 'Solicitações de troca ou devolução devem ser feitas pelos canais de atendimento da KEY, informando o número do pedido e os dados necessários para identificação da compra.'],
        ['Condições', 'A peça deve ser devolvida nas condições informadas pela KEY no atendimento, preservando etiquetas e demais elementos originais quando aplicável.'],
        ['Análise', 'Após o recebimento, a solicitação será analisada de acordo com as condições da compra e com a legislação aplicável.'],
        ['Prazo e reembolso', 'Prazos, forma de envio e eventual reembolso serão informados ao cliente conforme o caso e a legislação aplicável.']
      ]
    }
  }[type]

  return (
    <main className="legal-page" id="main-content">
      <div className="legal-top"><button className="back-link" type="button" onClick={onBack}>← Voltar para a loja</button></div>
      <section className="legal-content">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        {content.sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}
      </section>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="not-found-page" id="main-content">
      <p className="eyebrow">KEY / 404</p>
      <h1>Página não encontrada.</h1>
      <p>O endereço que você acessou não existe ou foi movido.</p>
      <a className="button" href="/">Voltar para a KEY</a>
    </main>
  )
}

function App() {
  if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') return <AdminPage />
  if (window.location.pathname === '/privacidade') return <LegalPage type="privacy" onBack={() => { window.location.href = '/' }} />
  if (window.location.pathname === '/termos') return <LegalPage type="terms" onBack={() => { window.location.href = '/' }} />
  if (window.location.pathname === '/trocas') return <LegalPage type="returns" onBack={() => { window.location.href = '/' }} />
  if (window.location.pathname !== '/' && !window.location.search) return <NotFoundPage />

  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = event => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [categoryView, setCategoryView] = useState(() => {
    const value = new URLSearchParams(window.location.search).get('categoria')
    return categoryPages[value] ? value : ''
  })
  const [bagOpen, setBagOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [trackingOpen, setTrackingOpen] = useState(false)
  const [confirmation, setConfirmation] = useState(() => {
    try { return JSON.parse(localStorage.getItem('key-last-order') || 'null') } catch { return null }
  })
  const [bag, setBag] = useState(() => {
    try { return JSON.parse(localStorage.getItem('key-bag') || '[]') } catch { return [] }
  })
  const [inventory, setInventory] = useState(() => {
    const base = buildInventory(products)
    try {
      const saved = JSON.parse(localStorage.getItem('key-inventory') || 'null')
      return saved && typeof saved === 'object' && Object.values(saved).some(value => value && typeof value === 'object' && Object.values(value).some(inner => inner && typeof inner === 'object')) ? { ...base, ...saved } : base
    } catch { return base }
  })
  const [notice, setNotice] = useState('')
  const [siteConfig, setSiteConfig] = useState(readAdminConfig)
  const [siteAssets, setSiteAssets] = useState({})
  const [catalogProducts, setCatalogProducts] = useState(products)

  useEffect(() => {
    let cancelled = false

    const loadStoreData = async () => {
      try {
        const [{ data: dbProducts }, { data: settings }, { data: banners }] = await Promise.all([
          supabase.from('products').select('legacy_id,name,price,description,image_url,colors,sizes,variants,stock,active').eq('active', true).order('legacy_id'),
          supabase.from('site_settings').select('key,value'),
          supabase.from('banners').select('id,title,subtitle,cta,image_path,enabled,sort_order').order('sort_order')
        ])

        if (cancelled) return

        if (Array.isArray(dbProducts) && dbProducts.length) {
          const merged = dbProducts.map(row => {
            const fallback = products.find(product => product.id === row.legacy_id) || {}
            return {
              ...fallback,
              id: row.legacy_id,
              dbId: row.id,
              name: row.name || fallback.name,
              price: Number(row.price ?? fallback.price ?? 0),
              description: row.description || fallback.description || '',
              image: row.image_url || fallback.image || null,
              colors: row.colors || fallback.colors || getVariants(fallback).map(item => ({ name: item.name, hex: item.hex })),
              variants: row.variants || fallback.variants || demoVariants[row.legacy_id] || [],
              sizes: row.sizes || fallback.sizes || {},
              stock: Number(row.stock ?? fallback.stock ?? 0),
              category: fallback.category || row.category || 'Outros'
            }
          })
          setCatalogProducts(merged)
          setInventory(buildInventory(merged))
        }

        if (Array.isArray(settings) && settings.length) {
          const remoteSettings = Object.fromEntries(settings.map(item => [item.key, item.value]))
          setSiteConfig(current => ({
            ...current,
            announcement: typeof remoteSettings.announcement === 'string' ? remoteSettings.announcement : current.announcement,
            freeShippingThreshold: Number(remoteSettings.free_shipping_threshold ?? current.freeShippingThreshold)
          }))
        }

        if (Array.isArray(banners) && banners.length) {
          setSiteConfig(current => ({
            ...current,
            banners: banners.map(banner => ({
              id: banner.id,
              title: banner.title,
              subtitle: banner.subtitle,
              cta: banner.cta,
              image: banner.image_path || '',
              fileId: '',
              enabled: banner.enabled
            }))
          }))
        }
      } catch (error) {
        console.warn('KEY backend unavailable; using local fallback.', error)
      }
    }

    loadStoreData()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    let urls = []
    adminListFiles().then(files => {
      const map = {}
      files.forEach(file => {
        try {
          const url = URL.createObjectURL(file.blob)
          urls.push(url)
          map[file.id] = url
        } catch {}
      })
      if (!cancelled) setSiteAssets(map)
    }).catch(() => {})
    return () => {
      cancelled = true
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem('key-bag', JSON.stringify(bag)) } catch {}
  }, [bag])

  useEffect(() => {
    try { localStorage.setItem('key-inventory', JSON.stringify(inventory)) } catch {}
  }, [inventory])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 2600)
    return () => clearTimeout(timer)
  }, [notice])

  const closeMenu = () => setMenuOpen(false)
  const openCheckout = () => {
    setBagOpen(false)
    setCheckoutOpen(true)
    setSelectedProduct(null)
    closeMenu()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const bagCount = bag.reduce((sum, item) => sum + item.quantity, 0)
  const publicProducts = catalogProducts.map(product => {
    const config = siteConfig.products?.[product.id]
    return { ...product, ...(config || {}), variants: getVariants(product), colors: product.colors || getVariants(product).map(item => ({ name: item.name, hex: item.hex })), image: config?.fileId ? (siteAssets[config.fileId] || config.image || product.image) : (config?.image || product.image) }
  })
  const heroBanner = siteConfig.banners?.find(banner => banner.enabled) || siteConfig.banners?.[0] || {}
  const heroImage = heroBanner.fileId ? (siteAssets[heroBanner.fileId] || heroBanner.image || '/key/banner-01.jpg') : (heroBanner.image || '/key/banner-01.jpg')

  const finishOrder = async details => {
    const number = `KEY-${Date.now().toString().slice(-6)}`
    const dbItems = bag.map(item => ({
      product_id: item.dbId,
      color: item.color || '',
      size: item.size,
      quantity: item.quantity
    }))

    if (dbItems.some(item => !item.product_id)) {
      setNotice('Não foi possível validar os produtos no servidor. Atualize a página e tente novamente.')
      return
    }

    try {
      const { data, error } = await supabase.rpc('create_key_order', {
        p_order_number: number,
        p_customer_name: details.shipping?.name || '',
        p_customer_email: details.shipping?.email || '',
        p_customer_phone: details.shipping?.phone || '',
        p_cep: details.shipping?.cep || '',
        p_address: details.shipping?.address || '',
        p_address_number: details.shipping?.number || '',
        p_city: details.shipping?.city || '',
        p_state: details.shipping?.state || '',
        p_payment_method: details.payment || 'pix',
        p_coupon: details.coupon || '',
        p_items: dbItems
      })

      if (error) throw error

      const serverOrder = Array.isArray(data) ? data[0] : data
      if (!serverOrder?.order_id) throw new Error('O servidor não retornou o pedido.')

      const order = {
        ...details,
        number: serverOrder.order_number,
        subtotal: Number(serverOrder.subtotal),
        shippingCost: Number(serverOrder.shipping),
        discount: Number(serverOrder.discount),
        total: Number(serverOrder.total),
        shippingLabel: Number(serverOrder.shipping) === 0 ? 'Grátis' : details.shippingLabel,
        items: bag
      }

      setConfirmation(order)

      setInventory(current => {
        const next = structuredClone(current)
        bag.forEach(item => {
          const colors = { ...(next[item.id] || {}) }
          const sizes = { ...(colors[item.color] || {}) }
          sizes[item.size] = Math.max(0, Number(sizes[item.size] || 0) - item.quantity)
          colors[item.color] = sizes
          next[item.id] = colors
        })
        return next
      })

      try {
        const orders = JSON.parse(localStorage.getItem('key-orders') || '[]')
        localStorage.setItem('key-orders', JSON.stringify([order, ...orders].slice(0, 20)))
      } catch {}

      setBag([])
      setCheckoutOpen(false)
      setNotice('Pedido registrado com sucesso.')
      window.scrollTo({ top: 0, behavior: 'instant' })
    } catch (error) {
      console.error('KEY order creation error', error)
      setNotice(error?.message || 'Não foi possível concluir o pedido. Verifique os dados e tente novamente.')
    }
  }

  const openProduct = product => {
    setSelectedProduct(product)
    setCategoryView('')
    closeMenu()
  }

  const openCategory = category => {
    if (!categoryPages[category]) return
    setSelectedProduct(null)
    setCheckoutOpen(false)
    setCategoryView(category)
    closeMenu()
    window.history.pushState({}, '', `/?categoria=${category}`)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const backToHome = () => {
    setSelectedProduct(null)
    setCategoryView('')
    window.history.pushState({}, '', '/')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  useEffect(() => {
    const handlePopState = () => {
      const value = new URLSearchParams(window.location.search).get('categoria')
      setCategoryView(categoryPages[value] ? value : '')
      setSelectedProduct(null)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const addToBag = (product, color, size, quantity) => {
    if (!color || !size) return
    const available = Number((inventory[product.id] || {})[color]?.[size] || 0)
    if (available <= 0) return
    setBag(current => {
      const key = `${product.id}-${color}-${size}`
      const found = current.find(item => item.key === key)
      const nextQuantity = Math.min(available, (found?.quantity || 0) + quantity)
      if (found) return current.map(item => item.key === key ? { ...item, quantity: nextQuantity } : item)
      return [...current, { ...product, color, size, quantity: Math.min(quantity, available), key }]
    })
    setSelectedProduct(null)
    setBagOpen(true)
    setNotice('Produto adicionado à sacola.')
  }

  const removeFromBag = key => setBag(current => current.filter(item => item.key !== key))
  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeFromBag(key)
    setBag(current => current.map(item => {
      if (item.key !== key) return item
      const max = Number((inventory[item.id] || {})[item.color]?.[item.size] || 0)
      return { ...item, quantity: Math.min(quantity, max) }
    }))
  }

  return (
    <div className="site">
      <div className="announcement">{siteConfig.announcement}</div>

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

      {trackingOpen ? (
        <OrderTracking onBack={() => setTrackingOpen(false)} />
      ) : confirmation ? (
        <OrderConfirmation order={confirmation} onContinue={() => { setConfirmation(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
      ) : checkoutOpen ? (
        <CheckoutPage items={bag} onBack={() => { setCheckoutOpen(false); setBagOpen(true) }} onComplete={finishOrder} />
      ) : selectedProduct ? (
        <ProductPage product={selectedProduct} inventory={inventory} onBack={() => categoryView ? setSelectedProduct(null) : backToHome()} onAdd={addToBag} />
      ) : categoryView ? (
        <CategoryPage category={categoryView} products={publicProducts} inventory={inventory} onOpen={openProduct} onBack={backToHome} />
      ) : (
        <>
          <main id="main-content">
            <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.96) 0%, rgba(255,255,255,.82) 22%, rgba(255,255,255,.24) 48%, rgba(255,255,255,0) 72%), url("${heroImage}")` }}>
              <div className="hero-copy">
                <p className="eyebrow">KEY / WOMEN'S WEAR</p>
                <h1>{heroBanner.title || 'Wear your key piece.'}</h1>
                <p className="hero-text">{heroBanner.subtitle || 'Uma seleção feminina pensada para marcar presença.'}</p>
                <a className="button" href="#new">{heroBanner.cta || 'Ver coleção'}</a>
              </div>
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
                {publicProducts.map(product => <ProductCard key={product.id} product={product} onOpen={openProduct} />)}
              </div>
            </section>

            <section className="category-section" id="shop">
              <div className="category-intro">
                <p className="eyebrow">EXPLORE KEY</p>
                <h2>Find your<br /><em>key</em>.</h2>
                <a className="text-link" href="#new">Ver coleção completa <span aria-hidden="true">→</span></a>
              </div>
              <button className="category-card category-dresses" type="button" onClick={() => openCategory('vestidos')}><span>Vestidos</span><small>Ver categoria →</small></button>
              <button className="category-card category-sets" type="button" onClick={() => openCategory('conjuntos')}><span>Conjuntos</span><small>Ver categoria →</small></button>
              <button className="category-card category-tops" type="button" onClick={() => openCategory('blusas')}><span>Blusas</span><small>Ver categoria →</small></button>
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
            <div><h4>Help</h4><button className="footer-action" onClick={() => setTrackingOpen(true)}>Acompanhar pedido</button><a href="#about">Contato</a><a href="#about">Envios</a><a href="/trocas">Trocas</a><a href="/privacidade">Privacidade</a><a href="/termos">Termos</a></div>
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
          onCheckout={openCheckout}
          inventory={inventory}
        />
      )}

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

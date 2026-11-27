import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowUpRight, ArrowRight, Search, ShoppingBag, Menu, X, Minus, Plus, ChevronDown} from 'lucide-react';
import {collections, products, catalog, brandPhotos, setCatalog} from './data';
import './styles.css';
import {shopifyConfigured, fetchShopifyProducts, normalizeProduct, createCheckout} from './services/shopify';
import LiveProduct from './LiveProduct';
let currency='USD';
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency}).format(n);
const cartStorage=shopifyConfigured?'lha-shopify-cart-v1':'lha-cart';
function readCart(){try { const items=JSON.parse(localStorage.getItem(cartStorage)); return Array.isArray(items)?items.flatMap(item=>{const p=catalog.get(item.id);if(!p||!Number.isInteger(item.qty)||item.qty<1)return [];if(!p.live)return [item];const v=p.variants.find(v=>v.id===item.variantId&&v.availableForSale);return v?[{...item,unitPrice:Number(v.price.amount)}]:[]}):[];} catch{return []}}
function Garment({product:p,large=false}){if(p.live){const image=p.images?.[0];return image?<img className="real-product-image" src={image.url} alt={image.altText||p.name} loading={large?'eager':'lazy'}/>:<div className="no-product-photo">Photo coming soon</div>}return <div className={`garment ${p.type} ${large?'large':''}`} style={{'--cloth':p.hex}} role="img" aria-label={`${p.name} in ${p.color}, concept product illustration`}><div className="garment-shape"><div className="neck"/><div className="print"><span className="mountain-mark">△</span><strong>{p.collection==='rooted'?'ROOTED':p.collection==='made-new'?'made new.':'LIFTED HIGH'}</strong><small>{p.collection==='rooted'?'STAND FIRM. GROW DEEP.':p.collection==='made-new'?'A NEW CREATION':'FAITH FOR THE CLIMB'}</small></div></div></div>}
function ProductCard({p}){return <a className="product-card" href={`/products/${p.id}`}><div className="product-image"><Garment product={p}/><span className="quick-look">Explore piece <ArrowUpRight size={16}/></span></div><div className="product-line"><h3>{p.name}</h3><span>{money(p.price)}</span></div><p>{p.color} <span> / </span> {(collections.find(c=>c.slug===p.collection)?.name||'Everyday').toLowerCase()}</p></a>}
function useScrollMotion() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('has-arrived');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-scroll-motion]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

const navigationLinks = [
  ['Shop', '/shop'],
  ['Rooted', '/rooted'],
  ['Mountains', '/mountains'],
  ['Made New', '/made-new'],
  ['Our Story', '/our-story'],
];

function App(){useScrollMotion();const path=window.location.pathname; const isHome=path==='/'; const [cart,setCart]=useState(readCart);const [cartOpen,setCartOpen]=useState(false);const [mobile,setMobile]=useState(false);const [search,setSearch]=useState(false);const [query,setQuery]=useState('');const [checkingOut,setCheckingOut]=useState(false);const [checkoutError,setCheckoutError]=useState('');const checkout=async()=>{setCheckingOut(true);setCheckoutError('');try{const result=await createCheckout(cart.map(item=>({merchandiseId:item.variantId,quantity:item.qty})));window.location.assign(result.checkoutUrl)}catch{setCheckoutError('Checkout is temporarily unavailable. Your bag is saved. Please try again.');setCheckingOut(false)}};useEffect(()=>localStorage.setItem(cartStorage,JSON.stringify(cart)),[cart]);useEffect(()=>{document.body.style.overflow=cartOpen||mobile||search?'hidden':'';return()=>document.body.style.overflow=''},[cartOpen,mobile,search]);useEffect(()=>{const handler=e=>{if(e.key==='Tab'){const dialog=document.querySelector('[role=dialog]');if(dialog){const nodes=[...dialog.querySelectorAll('a,button,input,select,[tabindex]')];const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}}if(e.key==='Escape'){setCartOpen(false);setMobile(false);setSearch(false)}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[]);
const add=(p,size,color,qty,variant)=>{const key=variant?.id||`${p.id}-${size}-${color}`;setCart(old=>{const found=old.find(i=>i.key===key);return found?old.map(i=>i.key===key?{...i,qty:i.qty+qty}:i):[...old,{key,id:p.id,size,color,qty,variantId:variant?.id,unitPrice:variant?Number(variant.price.amount):p.price}]});setCartOpen(true)};const change=(key,delta)=>setCart(old=>old.map(i=>i.key===key?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0));const count=cart.reduce((s,i)=>s+i.qty,0);
useEffect(()=>{const names={'/':'Faith for the everyday adventure','/shop':'Shop the everyday essentials','/rooted':'Rooted collection','/mountains':'Mountains collection','/made-new':'Made New collection','/our-story':'Our story'};if(names[path])document.title=`${names[path]} — Lifted High Apparel`},[path]);let page;const collection=collections.find(c=>path===`/${c.slug}`);const product=path.startsWith('/products/')?catalog.get(path.split('/')[2]):null;
if(path==='/')page=<Home/>;else if(collection)page=<Collection collection={collection}/>;else if(path==='/shop')page=<Shop/>;else if(path==='/our-story')page=<Story/>;else if(product)page=product.live?<LiveProduct product={product} add={add} money={money} ProductCard={ProductCard}/>:<Product product={product} add={add}/>;else page=<main className="empty-page"><h1>A little off the trail.</h1><p>This page doesn’t exist. Let’s head back.</p><a className="button dark" href="/">Back home <ArrowRight size={18}/></a></main>;
return <>
  {isHome && <HomeCover/>}
  <header className="site-header" id="site-navigation">
    <a className="wordmark" href="/">LIFTED HIGH<span>APPAREL & LIFESTYLE</span></a>
    <nav aria-label="Main navigation">
      {navigationLinks.map(([label,url])=>(
        <a href={url} key={url} aria-current={path===url?'page':undefined} className={path===url?'active':''}>{label}</a>
      ))}
    </nav>
    <div className="nav-actions">
      <button aria-label="Search products" onClick={()=>setSearch(true)}><Search size={20}/></button>
      <button aria-label={`Open shopping bag, ${count} items`} onClick={()=>setCartOpen(true)}>
        <ShoppingBag size={20}/><span className="bag-count">{count}</span>
      </button>
      <button className="mobile-toggle" aria-label="Open navigation" aria-expanded={mobile} onClick={()=>setMobile(true)}>
        <Menu size={23}/>
      </button>
    </div>
  </header>
  {page}
  <Footer/>
{mobile&&<div className={isHome ? "overlay home-menu-overlay" : "overlay"} onClick={()=>setMobile(false)}><section className="drawer" role="dialog" aria-modal="true" aria-label="Navigation" onClick={e=>e.stopPropagation()}><div className="drawer-head">LIFTED HIGH<button autoFocus aria-label="Close navigation" onClick={()=>setMobile(false)}><X/></button></div>{navigationLinks.map(([label,url])=><a className="mobile-link" href={url} key={url} aria-current={path===url?"page":undefined}>{label}<ArrowUpRight/></a>)}</section></div>}
{search&&<div className="overlay" onClick={()=>setSearch(false)}><section className="search-panel" role="dialog" aria-modal="true" aria-label="Search products" onClick={e=>e.stopPropagation()}><div className="drawer-head">Find your next everyday favorite<button aria-label="Close search" onClick={()=>setSearch(false)}><X/></button></div><label className="search-input"><Search/><input autoFocus placeholder="Search tees, layers, collections…" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="search-results">{products.filter(p=>`${p.name} ${p.collection}`.toLowerCase().includes(query.toLowerCase())).map(p=><a href={`/products/${p.id}`} key={p.id}>{p.name}<span>{money(p.price)} <ArrowUpRight size={16}/></span></a>)}</div>{!products.some(p=>`${p.name} ${p.collection}`.toLowerCase().includes(query.toLowerCase()))&&<p>No pieces found. Try “rooted” or “tee”.</p>}</section></div>}
{cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><section className="drawer cart" role="dialog" aria-modal="true" aria-label="Shopping bag" onClick={e=>e.stopPropagation()}><div className="drawer-head">Your bag ({count})<button autoFocus aria-label="Close shopping bag" onClick={()=>setCartOpen(false)}><X/></button></div>{cart.length? <><div className="cart-items">{cart.map(i=>{const p=catalog.get(i.id);return <div className="cart-item" key={i.key}><Garment product={p}/><div><a href={`/products/${p.id}`}>{p.name}</a><p>{i.color} · {i.size}</p><div className="quantity"><button aria-label={`Decrease ${p.name} quantity`} onClick={()=>change(i.key,-1)}><Minus size={14}/></button><span>{i.qty}</span><button aria-label={`Increase ${p.name} quantity`} onClick={()=>change(i.key,1)}><Plus size={14}/></button></div></div><span>{money((i.unitPrice??p.price)*i.qty)}</span></div>})}</div><div className="cart-bottom"><div><strong>Subtotal</strong><strong>{money(cart.reduce((s,i)=>s+(i.unitPrice??catalog.get(i.id).price)*i.qty,0))}</strong></div><p>{shopifyConfigured?'Shipping and taxes calculated at Shopify checkout.':'This is a preview catalog. Checkout will be available at launch.'}</p>{checkoutError&&<p role="alert">{checkoutError}</p>}{shopifyConfigured?<button className="button dark" disabled={checkingOut} onClick={checkout}>{checkingOut?'Opening checkout…':'SECURE CHECKOUT'} <ArrowRight size={18}/></button>:<button className="button dark" onClick={()=>setCartOpen(false)}>Keep exploring <ArrowRight size={18}/></button>}</div></>:<div className="empty-bag"><ShoppingBag size={36}/><h2>Room for a little adventure.</h2><p>Your bag is empty.</p><a className="button dark" href="/shop">Explore the pieces <ArrowRight size={18}/></a></div>}</section></div>}</>}
function HomeCover() {
  return (
    <section className="home-cover" aria-labelledby="home-brand-title">
      <img src={brandPhotos.hero.src} alt="" fetchPriority="high"/>
      <div className="home-brand">
        <h1 id="home-brand-title">Lifted High<span>Apparel</span></h1>
      </div>
      <a className="home-scroll" href="#site-navigation">
        <span>Explore</span><ChevronDown size={22} aria-hidden="true"/>
      </a>
    </section>
  );
}

function Home() {
  return (
    <main className="minimal-home">
      <section className="collections-section home-collections" id="home-collections" aria-labelledby="home-collections-title">
        <div className="home-collections-heading" data-scroll-motion>
          <h2 id="home-collections-title">Collections</h2>
          <a className="button dark" href="/shop">Shop all <ArrowUpRight size={18}/></a>
        </div>
        <div className="collection-grid">
          {collections.map(collection=>(
            <a href={`/${collection.slug}`} className="collection-tile" key={collection.slug} data-scroll-motion>
              <img src={collection.image} alt={collection.imageAlt} loading="lazy"/>
              <div className="tile-shade"/>
              <div className="tile-content">
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
                <span className="text-link">Explore collection <ArrowUpRight size={18}/></span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
function Collection({collection:c}){return <main><section className="collection-banner"><img src={c.image} alt={c.imageAlt}/><div className="tile-shade"/><div><span className="eyebrow light">THE {c.name} COLLECTION / {c.verse}</span><h1>{c.name}</h1><p>{c.description}</p></div></section><section className="section-pad"><div className="section-heading"><div><h2>Shop the collection</h2></div><span className="tiny-label">{catalog.byCollection(c.slug).length} PIECES</span></div><div className="product-grid collection-products">{catalog.byCollection(c.slug).map(p=><ProductCard p={p} key={p.id}/>)}</div>{!shopifyConfigured&&<p className="catalog-note">Preview catalog · final products coming soon.</p>}</section></main>}
function Shop(){const [filter,setFilter]=useState('all');return <main className="shop section-pad"><span className="eyebrow">LESS, BUT WITH MEANING.</span><h1>The everyday essentials.</h1><p>Small collections. Thoughtful design. A deeper purpose.</p><div className="filters" aria-label="Filter by collection">{[['all','All pieces'],...collections.map(c=>[c.slug,c.name])].map(([s,n])=><button key={s} aria-pressed={filter===s} className={filter===s?'selected':''} onClick={()=>setFilter(s)}>{n}</button>)}</div><div className="product-grid filter-results" key={filter}>{products.filter(p=>filter==='all'||(p.memberships?p.memberships.includes(filter):p.collection===filter)).map(p=><ProductCard p={p} key={p.id}/>)}</div>{!shopifyConfigured&&<p className="catalog-note">Concept pieces shown. Our first small collection is on its way.</p>}</main>}
function Product({product:p,add}){const isClothing=p.type==='tee'||p.type==='sweatshirt';const [size,setSize]=useState(isClothing?'M':'One size');const [color,setColor]=useState(p.color);const [qty,setQty]=useState(1);const [view,setView]=useState(0);const c=collections.find(c=>c.slug===p.collection);const selectedProduct={...p,color,hex:({'Moss':'#626b4d','Bone':'#e2ddcd','Washed black':'#3c3c37','Oat':'#d9cdb6','Forest':'#354936','Faded clay':'#bc8d73','Sand':'#c7b596','Earth':'#987354','Stone':'#ada694'})[color]||p.hex};useEffect(()=>{document.title=`${p.name} — Lifted High Apparel`},[p]);return <main><div className="product-detail section-pad"><div><div className={`detail-image ${view?'back-view':''}`}><Garment product={selectedProduct} large/><span>{view?'BACK VIEW':'FRONT VIEW'} · CONCEPT DESIGN</span></div><div className="thumbnails">{[0,1].map(v=><button aria-label={v?'Show back view':'Show front view'} aria-pressed={view===v} className={view===v?'selected':''} onClick={()=>setView(v)} key={v}><Garment product={p}/><span>{v?'Back':'Front'}</span></button>)}</div></div><div className="product-info"><a className="eyebrow" href={`/${c.slug}`}>{c.name} COLLECTION <ArrowUpRight size={14}/></a><h1>{p.name}</h1><div className="price">{money(p.price)}</div><p>{p.description}</p><label className="option-label" htmlFor="color">COLOR — {color}</label><select id="color" value={color} onChange={e=>setColor(e.target.value)}>{p.colors.map(v=><option key={v}>{v}</option>)}</select><span className="option-label">SIZE — {size}</span><div className="sizes">{(isClothing?['XS','S','M','L','XL','2XL']:['One size']).map(s=><button key={s} aria-pressed={size===s} className={size===s?'selected':''} onClick={()=>setSize(s)}>{s}</button>)}</div><div className="add-row"><div className="quantity"><button aria-label="Decrease quantity" onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={16}/></button><span>{qty}</span><button aria-label="Increase quantity" onClick={()=>setQty(qty+1)}><Plus size={16}/></button></div><button className="button dark" onClick={()=>add(p,size,color,qty)}>ADD TO BAG <ShoppingBag size={18}/></button></div><p className="catalog-note">Preview product. No payments or orders are taken.</p><details open><summary>Product details <ChevronDown size={17}/></summary><p>Concept design from the {c.name.toLowerCase()} collection. Final materials, measurements, and care instructions will be confirmed before launch.</p></details><details><summary>Shipping & returns <ChevronDown size={17}/></summary><p>Shipping rates, fulfillment times, and our return policy will be available at launch. This preview does not place an order.</p></details></div></div><section className="section-pad related"><div className="section-heading"><h2>Good company.</h2><a href={`/${p.collection}`} className="underlined-link">Explore {c.name.toLowerCase()} <ArrowUpRight size={16}/></a></div><div className="product-grid filter-results" key={filter}>{products.filter(q=>q.id!==p.id).sort((a,b)=>(b.collection===p.collection)-(a.collection===p.collection)).slice(0,4).map(q=><ProductCard p={q} key={q.id}/>)}</div></section></main>}
function Story() {
  return (
    <main>
      <section className="story-intro" aria-labelledby="story-title">
        <p className="eyebrow">Our Story</p>
        <h1 id="story-title">Rooted in faith.<br/>Made for life.</h1>
        <p>Lifted High Apparel exists to create clothing that reflects faith through intentional design. Inspired by creation, grounded in Scripture, and made for everyday life, our apparel serves as a reminder of who we are and who we live for.</p>
      </section>
      <img className="story-rack" src="/images/lifted-high-hanging-collection.webp" alt="Lifted High graphic tees and hoodies hanging from a single wooden rail"/>
      <div className="story-shop" data-scroll-motion>
        <a className="button dark" href="/shop">Shop the collections</a>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a className="wordmark" href="/">LIFTED HIGH<span>APPAREL & LIFESTYLE</span></a>
          <p>Rooted in faith. Made for life.</p>
        </div>
        <nav className="footer-links" aria-label="Footer collections">
          <h2>Shop</h2>
          <a href="/shop">Shop all</a>
          {navigationLinks.slice(1,-1).map(([label,url])=>(
            <a href={url} key={url}>{label}</a>
          ))}
        </nav>
        <nav className="footer-links" aria-label="Footer brand links">
          <h2>Lifted High</h2>
          <a href="/our-story">Our story</a>
        </nav>
      </div>
      <div className="footer-legal">
        <small>© {new Date().getFullYear()} Lifted High Apparel</small>
        <a href="#top">Back to top <ArrowUpRight size={16} aria-hidden="true"/></a>
      </div>
    </footer>
  );
}

function Bootstrap(){const [ready,setReady]=useState(!shopifyConfigured);const [error,setError]=useState(false);useEffect(()=>{if(!shopifyConfigured)return;let active=true;fetchShopifyProducts().then(items=>{if(!active)return;const next=items.map(normalizeProduct);setCatalog(next);currency=next[0]?.currency||'USD';setReady(true)}).catch(()=>{if(active)setError(true)});return()=>{active=false}},[]);if(error)return <main className="empty-page"><a className="wordmark" href="/">LIFTED HIGH</a><h1>We’ll be right back.</h1><p>Our shop is temporarily unavailable. Please try again in a moment.</p><button className="button dark" onClick={()=>window.location.reload()}>Try again</button></main>;if(!ready)return <main className="empty-page" role="status"><h1>LIFTED HIGH</h1><p>Opening the shop…</p></main>;return <App/>}
createRoot(document.getElementById('root')).render(<Bootstrap/>);

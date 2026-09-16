import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  Check,
  Menu,
  SlidersHorizontal
} from 'lucide-react';
import {
  storeProducts,
  CookieProduct,
  CATEGORIES_LIST,
  FLAVORS_LIST,
  BRANDS_LIST
} from '../data/storeProducts';
import cookiesMilkImg from '../assets/images/cookies_milk_tower_1789517244986.jpg';
import chocolatePileImg from '../assets/images/chocolate_cookies_pile_1789517259017.jpg';

interface TiendaProps {
  onBackToHome?: () => void;
}

export default function Tienda({ onBackToHome }: TiendaProps) {
  // ---------------------------------------------------------------------------
  // Estado del Carrito y Favoritos (Persistencia en localStorage)
  // ---------------------------------------------------------------------------
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('cp_cart_items');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { 'cookie-1': 1 };
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('cp_fav_items');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set(['cookie-1', 'cookie-3', 'cookie-11']);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Filtros del Catálogo
  // ---------------------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas las galletas');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(['Chocolate']);
  const [maxPrice, setMaxPrice] = useState<number>(20.0);
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas las marcas');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('popular');
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Secciones colapsables del sidebar
  const [openCategory, setOpenCategory] = useState(true);
  const [openFlavor, setOpenFlavor] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openBrand, setOpenBrand] = useState(true);

  // Sincronizar carrito con localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cp_cart_items', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sincronizar favoritos con localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cp_fav_items', JSON.stringify(Array.from(favorites)));
    } catch {
      // ignore
    }
  }, [favorites]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  // ---------------------------------------------------------------------------
  // Operaciones de Carrito
  // ---------------------------------------------------------------------------
  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((acc: number, count) => acc + (Number(count) || 0), 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    let total = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const prod = storeProducts.find((p) => p.id === id);
      if (prod) {
        total += prod.price * (Number(qty) || 0);
      }
    });
    return total;
  }, [cart]);

  const addToCart = (product: CookieProduct) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));
    triggerToast(`¡"${product.name}" agregada al carrito!`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('Todas las galletas');
    setSelectedFlavors([]);
    setMaxPrice(20.0);
    setSelectedBrand('Todas las marcas');
    setSortBy('popular');
  };

  const hasActiveFilters =
    selectedCategory !== 'Todas las galletas' ||
    selectedFlavors.length > 0 ||
    maxPrice < 20.0 ||
    selectedBrand !== 'Todas las marcas';

  // Navegación hash
  const navigateTo = (hash: string) => {
    if (window.history.pushState) {
      window.history.pushState(null, '', hash);
    } else {
      window.location.hash = hash;
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    if (hash === '#inicio' && onBackToHome) {
      onBackToHome();
    }
  };

  // Filtrado y ordenamiento de productos
  const filteredProducts = useMemo(() => {
    return storeProducts
      .filter((product) => {
        if (selectedCategory !== 'Todas las galletas' && product.category !== selectedCategory) {
          return false;
        }
        if (selectedFlavors.length > 0 && !selectedFlavors.includes(product.flavor)) {
          return false;
        }
        if (product.price > maxPrice) {
          return false;
        }
        if (selectedBrand !== 'Todas las marcas' && product.brand !== selectedBrand) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.badge === 'Nuevo' ? 1 : 0) - (a.badge === 'Nuevo' ? 1 : 0);
        return b.popularScore - a.popularScore;
      });
  }, [selectedCategory, selectedFlavors, maxPrice, selectedBrand, sortBy]);

  const displayedProducts = useMemo(() => {
    const list = filteredProducts.length > 0 ? filteredProducts : storeProducts;
    return list.slice(0, itemsPerPage);
  }, [filteredProducts, itemsPerPage]);

  return (
    <div id="tienda" className="w-full min-h-screen bg-[#F8EFE3] text-[#382117] selection:bg-[#FCE0E5]">
      {/* ========================================================================= */}
      {/* 1. NAVBAR PROFESIONAL (#navHeader)                                        */}
      {/* Separación nítida: [Logo] a la izquierda, [Links] centrados con gap,     */}
      {/* y [Carrito] a la derecha. Tienda claramente activo.                       */}
      {/* ========================================================================= */}
      <header
        id="navHeader"
        className="w-full bg-[#111111]/95 backdrop-blur-md sticky top-0 z-40 border-b border-white/10"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo a la izquierda */}
          <div className="flex-1 flex items-center justify-start">
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#inicio');
              }}
              className="text-white font-black text-xl sm:text-2xl tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
            >
              <span className="text-amber-400">●</span>
              <span>Cookie Planet</span>
            </a>
          </div>

          {/* Navegación centrada con gap espaciado y legible */}
          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 flex-1" id="navMenu">
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#inicio');
              }}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Inicio
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#about');
              }}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#projects');
              }}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Top Cookies
            </a>
            <a
              href="#hola"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('#hola');
              }}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Merch
            </a>
            <a
              href="#tienda"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('catalogoSection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-amber-400 font-bold text-sm transition-colors cursor-pointer relative py-1"
            >
              <span>Tienda</span>
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-amber-400 rounded-full" />
            </a>
          </nav>

          {/* Carrito a la derecha */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <button
              id="btnHeaderCart"
              onClick={() => setIsCartOpen(true)}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label={`Abrir carrito con ${totalCartCount} productos`}
            >
              <ShoppingCart className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs font-bold tracking-tight">
                [ CART ({totalCartCount}) ]
              </span>
            </button>

            {/* Botón hamburguesa móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
              aria-label="Menú principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú Mobile desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0d0d0d] border-b border-white/10 px-4 py-3 flex flex-col gap-2.5">
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigateTo('#inicio');
              }}
              className="text-white/80 hover:text-white text-sm py-1.5 px-2 rounded"
            >
              Inicio
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigateTo('#about');
              }}
              className="text-white/80 hover:text-white text-sm py-1.5 px-2 rounded"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigateTo('#projects');
              }}
              className="text-white/80 hover:text-white text-sm py-1.5 px-2 rounded"
            >
              Top Cookies
            </a>
            <a
              href="#hola"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigateTo('#hola');
              }}
              className="text-white/80 hover:text-white text-sm py-1.5 px-2 rounded"
            >
              Merch
            </a>
            <span className="text-amber-400 font-bold text-sm py-1.5 px-2 rounded bg-white/5">
              Tienda (Activo)
            </span>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* CONTENEDOR PRINCIPAL #tienda (Estética artesanal de repostería cálida)     */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-6">
        {/* ======================================================================= */}
        {/* 2. HERO PRINCIPAL (Conserva la composición y temática de galletas)      */}
        {/* ======================================================================= */}
        <section
          id="heroSection"
          className="relative w-full rounded-3xl overflow-hidden mb-8 bg-[#F5ECE0] border border-[#ebdcd0] shadow-[0_2px_12px_rgba(56,33,23,0.04)] flex flex-col md:flex-row items-center justify-between min-h-[230px] md:min-h-[250px] lg:min-h-[270px]"
        >
          {/* Lado Izquierdo: Vaso de leche y torre de galletas doradas */}
          <div className="w-full md:w-[28%] lg:w-[26%] h-[180px] md:h-[250px] lg:h-[270px] relative shrink-0 order-1 md:order-1">
            <img
              src={cookiesMilkImg}
              alt="Torre de galletas artesanales con vaso de leche fresca"
              className="w-full h-full object-cover object-left md:object-center"
            />
            {/* Suave degradado para fundir la imagen con el fondo crema cálido */}
            <div className="hidden md:block absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent to-[#F5ECE0] pointer-events-none" />
            <div className="md:hidden absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#F5ECE0] to-transparent pointer-events-none" />
          </div>

          {/* Área Central: Título artesanal, copy y CTA en fucsia/frambuesa cálido */}
          <div className="flex-1 px-4 sm:px-6 py-5 flex flex-col items-center justify-center text-center relative z-10 order-2 md:order-2">
            {/* Doodles sutiles de fondo */}
            <span className="absolute top-2 left-6 text-[#382117]/30 text-xs select-none pointer-events-none">
              ✦
            </span>
            <span className="absolute top-3 right-8 text-[#C24B6E]/40 text-xs select-none pointer-events-none">
              ♥
            </span>
            <span className="absolute bottom-3 left-10 text-[#382117]/25 text-xs select-none pointer-events-none">
              • •
            </span>

            {/* Cabecera con trazos: -•- GALLETAS -•- */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[#382117]/50 text-xs">━ • ━</span>
              <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#382117] uppercase">
                GALLETAS
              </span>
              <span className="text-[#382117]/50 text-xs">━ • ━</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-[#382117] leading-tight tracking-tight mb-2 max-w-xl">
              Diferentes sabores, <br className="hidden sm:inline" />
              la misma felicidad <span className="text-[#C24B6E]">♥</span>
            </h1>

            {/* Subtítulo comercial */}
            <p className="text-xs sm:text-sm md:text-base text-[#6b584e] font-medium mb-4 max-w-md">
              Crujientes, suaves, deliciosas... ¡hay una para cada antojo!
            </p>

            {/* CTA COMPRAR AHORA en rosa/frambuesa cálido */}
            <button
              onClick={() => {
                const el = document.getElementById('catalogoSection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#C24B6E] hover:bg-[#ae3b5c] text-white text-xs sm:text-sm font-extrabold px-8 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              COMPRAR AHORA
            </button>
          </div>

          {/* Lado Derecho: Pila de galletas de chocolate con nota manuscrita */}
          <div className="w-full md:w-[28%] lg:w-[26%] h-[180px] md:h-[250px] lg:h-[270px] relative shrink-0 order-3 md:order-3">
            <div className="hidden md:block absolute inset-y-0 left-0 w-20 bg-gradient-to-l from-transparent to-[#F5ECE0] z-10 pointer-events-none" />
            <div className="md:hidden absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#F5ECE0] to-transparent z-10 pointer-events-none" />
            <img
              src={chocolatePileImg}
              alt="Galletas artesanales de chocolate con chispas"
              className="w-full h-full object-cover object-right md:object-center"
            />
            {/* Nota manuscrita artesanal */}
            <div className="absolute inset-0 p-3 flex flex-col justify-start items-center z-20 pointer-events-none">
              <span className="font-caveat text-xl sm:text-2xl md:text-3xl font-bold text-[#382117] leading-tight text-center drop-shadow-xs rotate-[-4deg] bg-[#F5ECE0]/85 px-3.5 py-1.5 rounded-2xl backdrop-blur-[2px] mt-2 border border-[#382117]/10">
                Variedad<br />de sabores,<br />texturas y<br />formas ♡
              </span>
            </div>
          </div>
        </section>

        {/* Botón de Filtros para Móvil */}
        <div className="md:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-xl border border-[#ebdcd0] shadow-xs">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-[#382117] bg-[#F5ECE0] px-3.5 py-2 rounded-lg"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C24B6E]" />
            <span>Filtrar Productos</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#C24B6E]" />
            )}
          </button>
          <span className="text-xs text-[#6b584e] font-medium">
            {filteredProducts.length} productos
          </span>
        </div>

        {/* ======================================================================= */}
        {/* 3. ESTRUCTURA: [SIDEBAR (230-240px)] + [CATÁLOGO A TODO EL ANCHO]      */}
        {/* ======================================================================= */}
        <div className="flex flex-col md:flex-row gap-5 lg:gap-6 w-full items-start">
          {/* --------------------------------------------------------------------- */}
          {/* SIDEBAR DE FILTROS                                                    */}
          {/* --------------------------------------------------------------------- */}
          <aside className="hidden md:block w-[230px] lg:w-[240px] shrink-0 bg-[#FDFBF7] p-4 rounded-2xl border border-[#ebdcd0] shadow-[0_2px_8px_rgba(56,33,23,0.03)] space-y-4">
            {/* Encabezado FILTRAR POR */}
            <div className="flex items-center justify-between pb-2 border-b border-[#ebdcd0]/70">
              <h2 className="text-xs font-black tracking-wider text-[#382117] uppercase">
                FILTRAR POR
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#C24B6E] hover:text-[#ae3b5c] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Restablecer filtros"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpiar
                </button>
              )}
            </div>

            {/* Filtro: Categoría */}
            <div className="border-b border-[#ebdcd0]/70 pb-3">
              <button
                type="button"
                onClick={() => setOpenCategory(!openCategory)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#382117] mb-2 cursor-pointer select-none"
              >
                <span>Categoría</span>
                {openCategory ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {openCategory && (
                <div className="space-y-1">
                  {CATEGORIES_LIST.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <label
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="flex items-center gap-2 text-xs text-[#5c4a40] hover:text-[#382117] cursor-pointer select-none py-0.5"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                            isSelected
                              ? 'bg-[#382117] border-[#382117] text-white'
                              : 'border-[#cfbfb0] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </span>
                        <span className={isSelected ? 'font-bold text-[#382117]' : ''}>
                          {cat}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filtro: Sabor */}
            <div className="border-b border-[#ebdcd0]/70 pb-3">
              <button
                type="button"
                onClick={() => setOpenFlavor(!openFlavor)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#382117] mb-2 cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Sabor</span>
                  {selectedFlavors.length > 0 && (
                    <span className="text-[10px] bg-[#C24B6E] text-white font-bold px-1.5 rounded-full">
                      {selectedFlavors.length}
                    </span>
                  )}
                </div>
                {openFlavor ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {openFlavor && (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {FLAVORS_LIST.map((flavor) => {
                    const isChecked = selectedFlavors.includes(flavor);
                    return (
                      <label
                        key={flavor}
                        onClick={() => toggleFlavor(flavor)}
                        className="flex items-center gap-2 text-xs text-[#5c4a40] hover:text-[#382117] cursor-pointer select-none py-0.5"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                            isChecked
                              ? 'bg-[#382117] border-[#382117] text-white'
                              : 'border-[#cfbfb0] bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </span>
                        <span className={isChecked ? 'font-bold text-[#382117]' : ''}>
                          {flavor}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filtro: Precio (Slider) */}
            <div className="border-b border-[#ebdcd0]/70 pb-3">
              <button
                type="button"
                onClick={() => setOpenPrice(!openPrice)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#382117] mb-2 cursor-pointer select-none"
              >
                <span>Precio</span>
                {openPrice ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {openPrice && (
                <div className="space-y-1.5 pt-1">
                  <input
                    type="range"
                    min={0.0}
                    max={20.0}
                    step={0.5}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                    className="w-full accent-[#C24B6E] cursor-pointer h-1.5 bg-[#ebdcd0] rounded-lg appearance-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#6b584e] font-medium">
                    <span>S/ 0.00</span>
                    <span className="text-[#C24B6E] font-bold">
                      S/ {maxPrice.toFixed(2)}
                    </span>
                    <span>S/ 20.00</span>
                  </div>
                </div>
              )}
            </div>

            {/* Filtro: Marca */}
            <div className="border-b border-[#ebdcd0]/70 pb-3">
              <button
                type="button"
                onClick={() => setOpenBrand(!openBrand)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#382117] mb-2 cursor-pointer select-none"
              >
                <span>Marca</span>
                {openBrand ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {openBrand && (
                <div className="space-y-1">
                  {BRANDS_LIST.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    return (
                      <label
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className="flex items-center gap-2 text-xs text-[#5c4a40] hover:text-[#382117] cursor-pointer select-none py-0.5"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                            isSelected
                              ? 'bg-[#382117] border-[#382117] text-white'
                              : 'border-[#cfbfb0] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </span>
                        <span className={isSelected ? 'font-bold text-[#382117]' : ''}>
                          {brand}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ilustración de repostería con dedicatoria: "Elige tu favorita ♥" */}
            <div className="pt-2 flex flex-col items-center text-center">
              <svg
                viewBox="0 0 100 65"
                className="w-20 h-14 text-[#382117]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="34" cy="36" r="18" stroke="#382117" strokeWidth="2.5" fill="#FBF3E8" />
                <circle cx="28" cy="30" r="2.2" fill="#382117" />
                <circle cx="38" cy="28" r="2.2" fill="#382117" />
                <circle cx="42" cy="40" r="2.2" fill="#382117" />
                <circle cx="26" cy="42" r="2" fill="#382117" />
                <circle cx="34" cy="45" r="1.8" fill="#382117" />

                <circle cx="64" cy="30" r="16" stroke="#382117" strokeWidth="2.5" fill="#F8EDE1" />
                <circle cx="60" cy="24" r="2" fill="#382117" />
                <circle cx="70" cy="26" r="2" fill="#382117" />
                <circle cx="68" cy="36" r="2.2" fill="#382117" />
                <circle cx="56" cy="34" r="1.8" fill="#382117" />

                <circle cx="85" cy="42" r="1.5" fill="#382117" />
                <circle cx="88" cy="35" r="1" fill="#382117" />
                <circle cx="12" cy="46" r="1.5" fill="#382117" />

                <path
                  d="M82 18 C80 14, 76 14, 75 18 C74 14, 70 14, 68 18 C68 22, 75 26, 75 26 C75 26, 82 22, 82 18 Z"
                  fill="#C24B6E"
                  stroke="#C24B6E"
                  strokeWidth="1"
                />

                <line x1="14" y1="26" x2="8" y2="28" stroke="#382117" strokeWidth="1.8" />
                <line x1="16" y1="32" x2="10" y2="36" stroke="#382117" strokeWidth="1.8" />
                <line x1="18" y1="20" x2="14" y2="16" stroke="#382117" strokeWidth="1.8" />
              </svg>

              <p className="font-caveat text-2xl font-bold text-[#382117] mt-0.5">
                Elige tu favorita ♥
              </p>
            </div>
          </aside>

          {/* --------------------------------------------------------------------- */}
          {/* CATÁLOGO DE PRODUCTOS (Ocupa TODO el ancho disponible)                */}
          {/* --------------------------------------------------------------------- */}
          <main id="catalogoSection" className="flex-1 w-full min-w-0">
            {/* Barra superior de ordenamiento */}
            <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3.5 text-xs text-[#6b584e]">
              <span className="font-bold tracking-wide uppercase">
                MOSTRANDO 1-{displayedProducts.length} DE 48 RESULTADOS
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#382117]">ORDENAR POR</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-[#ebdcd0] text-[#382117] text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#C24B6E] cursor-pointer shadow-2xs"
                  >
                    <option value="popular">Más populares</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="rating">Mejor calificados</option>
                    <option value="newest">Novedades</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#6b584e]">Mostrar</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-white border border-[#ebdcd0] text-[#382117] text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#C24B6E] cursor-pointer shadow-2xs"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GRID DE PRODUCTOS: 4 Columnas garantizadas en desktop (1366-1440px) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5 mb-8">
              {displayedProducts.map((product) => {
                const isFav = favorites.has(product.id);
                return (
                  <article
                    key={product.id}
                    className="bg-white rounded-2xl p-2.5 sm:p-3 border border-[#ede3d5] shadow-[0_2px_8px_rgba(56,33,23,0.03)] hover:shadow-[0_6px_16px_rgba(56,33,23,0.07)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Cabecera de la tarjeta: Badge y Botón de Favorito */}
                      <div className="flex items-center justify-between mb-1.5 min-h-[22px]">
                        {product.badge ? (
                          <span
                            className={`text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tight text-white ${
                              product.badge === 'Más vendido'
                                ? 'bg-[#C24B6E]'
                                : 'bg-[#3AAFA9]'
                            }`}
                          >
                            {product.badge}
                          </span>
                        ) : (
                          <span />
                        )}

                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="w-6 h-6 rounded-full border border-[#ebdcd0] flex items-center justify-center hover:bg-[#F5ECE0] transition cursor-pointer text-slate-400 active:scale-90 ml-auto"
                          aria-label="Guardar en favoritos"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              isFav ? 'fill-[#C24B6E] text-[#C24B6E]' : 'text-slate-400'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Imagen compacta y apetitosa */}
                      <div className="w-full aspect-[4/3.8] rounded-xl overflow-hidden bg-[#FAF7F2] mb-2 flex items-center justify-center border border-[#f3eee7]">
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            if (product.fallbackImage && e.currentTarget.src !== product.fallbackImage) {
                              e.currentTarget.src = product.fallbackImage;
                            }
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Nombre del Producto (máximo 2 líneas bien alineadas) */}
                      <h3 className="font-bold text-xs sm:text-[13px] text-[#382117] leading-snug line-clamp-2 min-h-[2.1rem] mb-1">
                        {product.name}
                      </h3>

                      {/* Precio en Soles (S/) */}
                      <div className="text-sm font-extrabold text-[#382117] mb-1">
                        S/ {product.price.toFixed(2)}
                      </div>

                      {/* Calificación de estrellas */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-medium text-[#6b584e]">
                          {product.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Botón AGREGAR AL CARRITO alineado al fondo */}
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full rounded-xl bg-[#382117] hover:bg-[#25130b] text-white text-[10px] sm:text-[11px] font-bold py-1.5 px-2 transition-colors duration-150 active:scale-95 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>AGREGAR AL CARRITO</span>
                    </button>
                  </article>
                );
              })}
            </div>
          </main>
        </div>

        {/* ======================================================================= */}
        {/* 4. COLECCIONES DESTACADAS                                               */}
        {/* ======================================================================= */}
        <section className="mt-8 mb-8" id="coleccionesDestacadas">
          <h2 className="font-caveat text-3xl sm:text-4xl font-bold mb-4 text-[#382117] flex items-center gap-2">
            <span>➳</span>
            <span>Colecciones destacadas</span>
            <span>➶</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Clásicas (Beige cálido) */}
            <div
              onClick={() => {
                setSelectedCategory('Clásicas');
                const el = document.getElementById('catalogoSection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#F8E7D5] p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-between text-center cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all min-h-[160px] group border border-[#edd5be]"
            >
              <div className="w-24 sm:w-28 h-20 sm:h-22 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80"
                  alt="Galletas Clásicas"
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                />
              </div>
              <span className="font-caveat text-2xl font-bold text-[#382117] mt-1.5">
                Clásicas →
              </span>
            </div>

            {/* 2. Rellenas (Rosa pastel) */}
            <div
              onClick={() => {
                setSelectedCategory('Rellenas');
                const el = document.getElementById('catalogoSection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#FCE0E5] p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-between text-center cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all min-h-[160px] group border border-[#f3cad2]"
            >
              <div className="w-24 sm:w-28 h-20 sm:h-22 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"
                  alt="Galletas Rellenas de Oreo"
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                />
              </div>
              <span className="font-caveat text-2xl font-bold text-[#382117] mt-1.5">
                Rellenas →
              </span>
            </div>

            {/* 3. Sin azúcar (Lavanda pastel) */}
            <div
              onClick={() => {
                setSelectedCategory('Sin azúcar');
                const el = document.getElementById('catalogoSection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#DFD9F6] p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-between text-center cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all min-h-[160px] group border border-[#cdbfef]"
            >
              <div className="w-24 sm:w-28 h-20 sm:h-22 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516919549054-e08258825f80?w=500&auto=format&fit=crop&q=80"
                  alt="Galletas Sin Azúcar"
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                />
              </div>
              <span className="font-caveat text-2xl font-bold text-[#382117] mt-1.5">
                Sin azúcar →
              </span>
            </div>

            {/* 4. Integrales (Verde salvia pastel) */}
            <div
              onClick={() => {
                setSelectedCategory('Integrales');
                const el = document.getElementById('catalogoSection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#C6D8C2] p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-between text-center cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all min-h-[160px] group border border-[#b2c8ad]"
            >
              <div className="w-24 sm:w-28 h-20 sm:h-22 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=80"
                  alt="Galletas Integrales"
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                />
              </div>
              <span className="font-caveat text-2xl font-bold text-[#382117] mt-1.5">
                Integrales →
              </span>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 5. FOOTER ONDULADO COLOR CHOCOLATE CON DEDICATORIA ARTESANAL            */}
        {/* ======================================================================= */}
        <footer className="w-full relative mt-8" id="footerOndulado">
          <svg
            viewBox="0 0 1200 36"
            className="w-full h-5 sm:h-7 text-[#382117] fill-current block"
            preserveAspectRatio="none"
          >
            <path d="M0,18 C150,36 300,0 450,18 C600,36 750,0 900,18 C1050,36 1150,9 1200,18 L1200,36 L0,36 Z" />
          </svg>
          <div className="w-full bg-[#382117] text-white py-4 sm:py-5 text-center rounded-b-3xl shadow-sm">
            <p className="font-caveat text-xl sm:text-2xl text-amber-100 font-medium tracking-wide flex items-center justify-center gap-3">
              <span className="text-white text-base">♥</span>
              <span>— Galletas que hacen la vida más dulce —</span>
              <span className="text-white text-base">♥</span>
            </p>
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* DRAWER DE FILTROS EN MÓVIL                                                */}
      {/* ========================================================================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/50 backdrop-blur-xs md:hidden">
          <div className="w-[280px] bg-[#FDFBF7] h-full p-4 overflow-y-auto shadow-2xl flex flex-col justify-between border-r border-[#ebdcd0]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#ebdcd0] mb-4">
                <h3 className="text-xs font-black text-[#382117] uppercase">FILTRAR POR</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categorías en móvil */}
              <div className="mb-4">
                <p className="text-xs font-bold text-[#382117] mb-2">Categoría</p>
                <div className="space-y-1">
                  {CATEGORIES_LIST.map((cat) => (
                    <label
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="flex items-center gap-2 text-xs text-[#5c4a40] py-1 cursor-pointer"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          selectedCategory === cat
                            ? 'bg-[#382117] border-[#382117] text-white'
                            : 'border-[#cfbfb0] bg-white'
                        }`}
                      >
                        {selectedCategory === cat && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Slider de precio en móvil */}
              <div className="mb-4">
                <p className="text-xs font-bold text-[#382117] mb-1">Precio máximo: S/ {maxPrice.toFixed(2)}</p>
                <input
                  type="range"
                  min={0.0}
                  max={20.0}
                  step={0.5}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full accent-[#C24B6E]"
                />
              </div>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-[#382117] text-white font-bold py-2.5 rounded-xl text-xs uppercase"
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER LATERAL DEL CARRITO [ CART ]                                       */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col border-l border-[#ebdcd0]">
            {/* Header Carrito */}
            <div className="p-4 border-b border-[#ebdcd0] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#C24B6E]" />
                <h3 className="font-bold text-base text-[#382117]">Tu Carrito de Galletas</h3>
                <span className="text-xs bg-[#C24B6E] text-white px-2 py-0.5 rounded-full font-bold">
                  {totalCartCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de productos en carrito */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {Object.keys(cart).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-[#6b584e]">
                  <ShoppingCart className="w-12 h-12 stroke-[1.5] text-[#ebdcd0]" />
                  <p className="font-bold text-sm text-[#382117]">Tu carrito está vacío</p>
                  <p className="text-xs text-[#6b584e] max-w-xs">
                    ¡Agrega tus galletas favoritas y disfruta de una experiencia dulce y artesanal!
                  </p>
                </div>
              ) : (
                Object.entries(cart).map(([id, qty]) => {
                  const product = storeProducts.find((p) => p.id === id);
                  if (!product) return null;
                  return (
                    <div
                      key={id}
                      className="bg-white rounded-xl p-3 border border-[#ebdcd0] flex items-center gap-3 shadow-xs"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          if (product.fallbackImage && e.currentTarget.src !== product.fallbackImage) {
                            e.currentTarget.src = product.fallbackImage;
                          }
                        }}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#382117] truncate">
                          {product.name}
                        </h4>
                        <div className="text-xs text-[#C24B6E] font-bold mt-0.5">
                          S/ {product.price.toFixed(2)} c/u
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#e2d8cd] rounded-lg bg-[#FAF7F2]">
                          <button
                            onClick={() => updateCartQuantity(id, -1)}
                            className="p-1 hover:bg-[#f3eee7] rounded-l text-[#382117] cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#382117]">{qty}</span>
                          <button
                            onClick={() => updateCartQuantity(id, 1)}
                            className="p-1 hover:bg-[#f3eee7] rounded-r text-[#382117] cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(id)}
                          className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Carrito */}
            {Object.keys(cart).length > 0 && (
              <div className="p-4 border-t border-[#ebdcd0] bg-white space-y-3">
                <div className="flex items-center justify-between text-xs text-[#6b584e]">
                  <span>Subtotal ({totalCartCount} items):</span>
                  <span className="font-bold text-sm text-[#382117]">
                    S/ {cartSubtotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    alert('¡Gracias por tu compra! Tu pedido de galletas artesanales está en camino.');
                    clearCart();
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-[#C24B6E] hover:bg-[#ae3b5c] text-white font-bold py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-sm transition-colors cursor-pointer"
                >
                  FINALIZAR PEDIDO (S/ {cartSubtotal.toFixed(2)})
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-slate-400 hover:text-[#382117] text-[11px] font-medium py-1 transition cursor-pointer"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notificación Toast Flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#382117] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

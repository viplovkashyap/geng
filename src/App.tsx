import { useState, useEffect, useCallback, useRef, type TouchEvent } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, X, Check, ShieldCheck, Heart } from 'lucide-react';

interface FigurineItem {
  src: string;
  bg: string;
  panel: string;
  name: string;
  role: string;
  specs: {
    height: string;
    finish: string;
    edition: string;
    material: string;
  };
}

const IMAGES: FigurineItem[] = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
    name: 'VIPLOV',
    role: 'The 9-Foot Figurine',
    specs: {
      height: '9 Foot (274 cm)',
      finish: 'Matte Clay & UV Gloss',
      edition: '01 / 03 Collector',
      material: 'Hard Vinyl & Polystone Core',
    },
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
    name: 'ANKUR',
    role: 'The 2-Foot Figurine',
    specs: {
      height: '2 Foot (61 cm)',
      finish: 'Hand-painted Vinyl',
      edition: '02 / 03 Collector',
      material: 'Reinforced PVC & Enamel',
    },
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
    name: 'DHEERAJ',
    role: 'The 5 cm Figurine',
    specs: {
      height: '5 cm (2.0 in)',
      finish: 'Satin Resin Polish',
      edition: '03 / 03 Collector',
      material: 'Custom Molded Polyresin',
    },
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    name: 'TRIO',
    role: 'Viplov (9 ft) • Ankur (2 ft) • Dheeraj (5 cm)',
    specs: {
      height: '9 ft • 2 ft • 5 cm',
      finish: 'Matte Clay • Vinyl • Satin Resin',
      edition: 'Collector Trio Set (3-in-1)',
      material: 'Complete 3-Figure Ensemble',
    },
  },
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);
  const [textEntered, setTextEntered] = useState<boolean>(false);

  const touchStartX = useRef<number | null>(null);

  // Preload all 4 images on mount and trigger initial entrance animation
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });

    // Trigger initial slide-in entrance animation on load
    const enterTimer = setTimeout(() => {
      setTextEntered(true);
    }, 150);

    return () => clearTimeout(enterTimer);
  }, []);

  // Responsive mobile detector
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation logic with entrance animation trigger
  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setTextEntered(false);
      if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % 4);
      } else {
        setActiveIndex((prev) => (prev + 3) % 4);
      }
      setTimeout(() => {
        setIsAnimating(false);
        setTextEntered(true);
      }, 650);
    },
    [isAnimating]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showModal) {
        if (e.key === 'Escape') setShowModal(false);
        return;
      }
      if (e.key === 'ArrowLeft') {
        navigate('prev');
      } else if (e.key === 'ArrowRight') {
        navigate('next');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showModal]);

  // Touch swipe support
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }
    touchStartX.current = null;
  };

  // Roles derived from activeIndex
  // center=activeIndex, left=(activeIndex+3)%4, right=(activeIndex+1)%4, back=(activeIndex+2)%4
  const getRole = (index: number): 'center' | 'left' | 'right' | 'back' => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 3) % 4) return 'left';
    if (index === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const currentItem = IMAGES[activeIndex];

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div
      id="toonhub-hero-container"
      className="relative w-full overflow-hidden select-none"
      style={{
        backgroundColor: currentItem.bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
        {/* Top-left brand label "TOONHUB" & Boys Selector */}
        <header
          id="hero-header"
          className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between pointer-events-auto"
          style={{ zIndex: 60 }}
        >
          <div className="flex items-center gap-3">
            <span
              id="brand-label-toonhub"
              className="text-xs font-semibold uppercase text-white tracking-[0.18em]"
              style={{ opacity: 0.9 }}
            >
              TOONHUB
            </span>
            <span className="text-white/30 text-xs hidden md:inline">/</span>
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/80 hidden md:inline">
              Viplov • Ankur • Dheeraj
            </span>
          </div>

          {/* Boy Character Switcher Pills */}
          <div
            id="boy-selector-pills"
            className="flex items-center gap-1 sm:gap-1.5 bg-black/25 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg"
          >
            {IMAGES.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.name}
                  id={`btn-select-${idx}`}
                  onClick={() => {
                    if (isAnimating || activeIndex === idx) return;
                    setIsAnimating(true);
                    setTextEntered(false);
                    setActiveIndex(idx);
                    setTimeout(() => {
                      setIsAnimating(false);
                      setTextEntered(true);
                    }, 650);
                  }}
                  disabled={isAnimating}
                  aria-label={`Select ${item.name}`}
                  className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-black shadow-md scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {idx === 3 ? 'TRIO' : item.name}
                </button>
              );
            })}
          </div>
        </header>

        {/* Carousel Stage - Optimized for low-end PC (no blur shaders, hardware-accelerated translate3d) */}
        <div id="carousel-stage" className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
          {IMAGES.map((item, index) => {
            const role = getRole(index);
            const isTrio = index === 3;

            // Low-end PC optimization:
            // Use hardware-accelerated translate3d and opacity without costly CSS blur() passes.
            let transform = 'translate3d(-50%, 0, 0) scale(1)';
            let opacity = 0.35;
            let zIndex = 5;
            let left = '50%';
            let height = isMobile ? '13%' : '22%';
            let bottom = isMobile ? '32%' : '12%';
            let isClickable = false;

            if (role === 'center') {
              transform = `translate3d(-50%, 0, 0) scale(${isMobile ? 1.2 : (isTrio ? 1.4 : 1.65)})`;
              opacity = 1;
              zIndex = 20;
              left = '50%';
              height = isMobile ? '60%' : '90%';
              bottom = isMobile ? '22%' : '0%';
            } else if (role === 'left') {
              transform = 'translate3d(-50%, 0, 0) scale(1)';
              opacity = 0.85;
              zIndex = 10;
              left = isMobile ? '20%' : '30%';
              height = isMobile ? '16%' : '28%';
              bottom = isMobile ? '32%' : '12%';
              isClickable = true;
            } else if (role === 'right') {
              transform = 'translate3d(-50%, 0, 0) scale(1)';
              opacity = 0.85;
              zIndex = 10;
              left = isMobile ? '80%' : '70%';
              height = isMobile ? '16%' : '28%';
              bottom = isMobile ? '32%' : '12%';
              isClickable = true;
            }

            return (
              <div
                key={item.name}
                id={`carousel-figurine-${index}`}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : -1}
                aria-label={isClickable ? `Rotate to ${item.name}` : `${item.name} figurine`}
                onClick={() => {
                  if (isAnimating) return;
                  if (role === 'left') navigate('prev');
                  if (role === 'right') navigate('next');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (role === 'left') navigate('prev');
                    if (role === 'right') navigate('next');
                  }
                }}
                className={`absolute pointer-events-auto transition-all ${
                  isClickable ? 'cursor-pointer hover:opacity-100' : ''
                }`}
                style={{
                  aspectRatio: isTrio ? (isMobile ? '1.15 / 1' : '1.35 / 1') : '0.6 / 1',
                  left,
                  bottom,
                  height,
                  transform,
                  opacity,
                  zIndex,
                  transition:
                    'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, opacity, left',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {isTrio ? (
                  /* 4th Option: Trio with all 3 boys standing together */
                  <div className="relative w-full h-full flex items-end justify-center select-none">
                    {/* Viplov standing on left - 9 Foot Giant */}
                    <div
                      className="absolute bottom-0 w-[50%] h-[98%] transition-transform duration-500"
                      style={{ left: '2%', zIndex: 1 }}
                    >
                      <img
                        src={IMAGES[0].src}
                        alt="Viplov Figurine (9 Foot)"
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-contain object-bottom select-none drop-shadow-2xl"
                        draggable={false}
                      />
                      <span className="absolute top-4 left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[10px] font-bold tracking-wider text-white border border-white/20">
                        9 FT
                      </span>
                    </div>
                    {/* Ankur standing in center - 2 Foot */}
                    <div
                      className="absolute bottom-0 w-[38%] h-[50%] transition-transform duration-500"
                      style={{ left: '44%', zIndex: 3 }}
                    >
                      <img
                        src={IMAGES[1].src}
                        alt="Ankur Figurine (2 Foot)"
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-contain object-bottom select-none drop-shadow-2xl"
                        draggable={false}
                      />
                      <span className="absolute top-1 left-2 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[9px] font-bold tracking-wider text-white border border-white/20">
                        2 FT
                      </span>
                    </div>
                    {/* Dheeraj standing on right - 5 cm Mini Figurine */}
                    <div
                      className="absolute bottom-0 w-[22%] h-[22%] transition-transform duration-500"
                      style={{ right: '4%', zIndex: 4 }}
                    >
                      <img
                        src={IMAGES[2].src}
                        alt="Dheeraj Figurine (5 cm)"
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-contain object-bottom select-none drop-shadow-xl"
                        draggable={false}
                      />
                      <span className="absolute -top-5 right-0 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[9px] font-bold tracking-wider text-white border border-white/20 whitespace-nowrap">
                        5 CM
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Individual Boy Figurine */
                  <img
                    src={item.src}
                    alt={`${item.name} Figurine`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-contain object-bottom select-none drop-shadow-2xl"
                    draggable={false}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom-left text + nav buttons: Formatted strictly according to the boy & his specifications */}
        <div
          id="bottom-left-info-panel"
          className="absolute bottom-6 left-4 sm:bottom-16 sm:left-12 md:left-20 pointer-events-auto"
          style={{ zIndex: 60, maxWidth: '350px' }}
        >
          {/* Text Information Entrance Wrapper with Slide-in Effect */}
          <div
            id="text-info-content"
            style={{
              transform: textEntered ? 'translate3d(0, 0, 0)' : 'translate3d(-36px, 0, 0)',
              opacity: textEntered ? 1 : 0,
              transition: textEntered
                ? 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'transform 180ms ease-in, opacity 150ms ease-in',
              willChange: 'transform, opacity',
            }}
          >
            {/* Boy Edition Badge */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-sm text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white shadow-sm border border-white/20">
                <Sparkles className="w-3 h-3 text-white" />
                {activeIndex === 3 ? 'TRIO ALLIANCE' : `BOY 0${activeIndex + 1}`}
              </span>
              <span className="text-[11px] text-white/80 font-medium tracking-wide">
                {currentItem.specs.edition}
              </span>
            </div>

            {/* Boy Name */}
            <h1
              id="boy-name-heading"
              className="font-black uppercase tracking-tight text-3xl sm:text-4xl lg:text-[40px] text-white leading-tight mb-1"
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
                letterSpacing: '-0.02em',
              }}
            >
              {currentItem.name}
            </h1>

            {/* Role Title */}
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/90 mb-3.5">
              {currentItem.role}
            </p>

            {/* Specifications Card: Formatted cleanly according to the boy */}
            <div
              id="boy-specifications-card"
              className="bg-black/25 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/15 mb-4 sm:mb-5 shadow-lg"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-2.5 border-b border-white/10 pb-1.5 flex items-center justify-between">
                <span>BOY SPECIFICATIONS</span>
                <span className="font-mono text-[9px] text-white/50">TOONHUB FIGURINE</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-white/60 block uppercase font-medium">Height</span>
                  <span className="font-semibold text-white text-xs leading-snug">
                    {currentItem.specs.height}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-white/60 block uppercase font-medium">Edition</span>
                  <span className="font-semibold text-white text-xs leading-snug">
                    {currentItem.specs.edition}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-white/60 block uppercase font-medium">Finish</span>
                  <span className="font-semibold text-white text-xs leading-snug">
                    {currentItem.specs.finish}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-white/60 block uppercase font-medium">Material</span>
                  <span className="font-semibold text-white text-xs leading-snug">
                    {currentItem.specs.material}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              id="btn-nav-prev"
              onClick={() => navigate('prev')}
              disabled={isAnimating}
              aria-label="Previous figurine"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white border-2 border-white transition-all cursor-pointer hover:scale-105 hover:bg-white/15 active:scale-95 disabled:opacity-40"
              style={{
                transition: 'transform 150ms, background-color 150ms',
                backgroundColor: 'transparent',
              }}
            >
              <ArrowLeft size={22} strokeWidth={2.25} />
            </button>

            <button
              id="btn-nav-next"
              onClick={() => navigate('next')}
              disabled={isAnimating}
              aria-label="Next figurine"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white border-2 border-white transition-all cursor-pointer hover:scale-105 hover:bg-white/15 active:scale-95 disabled:opacity-40"
              style={{
                transition: 'transform 150ms, background-color 150ms',
                backgroundColor: 'transparent',
              }}
            >
              <ArrowRight size={22} strokeWidth={2.25} />
            </button>

            {/* Quick counter */}
            <div className="text-white/90 text-xs font-mono pl-1">
              0{activeIndex + 1} / 04
            </div>
          </div>
        </div>

        {/* Bottom-right link "DISCOVER IT" */}
        <div
          id="bottom-right-discover"
          className="absolute bottom-6 right-4 sm:bottom-16 sm:right-10 pointer-events-auto"
          style={{ zIndex: 60 }}
        >
          <a
            id="link-discover-it"
            href="#discover"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(true);
            }}
            aria-label={`Discover ${currentItem.name} figurine`}
            className="group flex items-center gap-2 sm:gap-3 text-white transition-opacity duration-200 uppercase cursor-pointer"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.95';
            }}
          >
            <span>DISCOVER IT</span>
            <ArrowRight
              className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:translate-x-1.5"
              strokeWidth={2.25}
            />
          </a>
        </div>
      </div>

      {/* Discovery Modal for Viplov, Ankur, and Dheeraj's Figurines */}
      {showModal && (
        <div
          id="figurine-details-modal-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            id="figurine-details-modal"
            className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-white/20 p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#171717',
            }}
          >
            {/* Top close button */}
            <button
              id="btn-close-modal"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center p-1.5 border border-white/20 shadow-md"
                style={{ backgroundColor: currentItem.bg }}
              >
                {activeIndex === 3 ? (
                  <div className="flex items-end justify-center h-full w-full gap-0.5">
                    <img src={IMAGES[0].src} alt="Viplov" className="h-full object-contain" />
                    <img src={IMAGES[1].src} alt="Ankur" className="h-full object-contain" />
                    <img src={IMAGES[2].src} alt="Dheeraj" className="h-full object-contain" />
                  </div>
                ) : (
                  <img
                    src={currentItem.src}
                    alt={currentItem.name}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block">
                  {currentItem.specs.edition}
                </span>
                <h3
                  className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
                    letterSpacing: '-0.02em',
                  }}
                >
                  {currentItem.name}
                </h3>
                <span className="text-xs text-white/80 font-medium">{currentItem.role}</span>
              </div>
            </div>

            {/* Spec Matrix - Pure specifications */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">Height</span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  {currentItem.specs.height}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">Edition</span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  {currentItem.specs.edition}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">Finish</span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  {currentItem.specs.finish}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">Material</span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  {currentItem.specs.material}
                </span>
              </div>
            </div>

            {/* Boys Selector */}
            <div className="mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                Select Boy Figurine
              </span>
              <div className="flex gap-2">
                {IMAGES.map((img, i) => (
                  <button
                    key={img.name}
                    id={`modal-switch-${i}`}
                    onClick={() => {
                      setActiveIndex(i);
                      setTextEntered(true);
                    }}
                    className={`flex-1 py-2 px-1 rounded-xl text-center border transition-all text-xs font-medium cursor-pointer ${
                      activeIndex === i
                        ? 'border-white bg-white text-black font-bold'
                        : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    {i === 3 ? 'TRIO' : img.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            {orderSubmitted ? (
              <div
                id="order-success-banner"
                className="py-3 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Pre-order inquiry confirmed for {currentItem.name}!</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  id="btn-order-collectible"
                  onClick={() => {
                    setOrderSubmitted(true);
                    setTimeout(() => setOrderSubmitted(false), 4000);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-black transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: currentItem.panel }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  PRE-ORDER FIGURINE
                </button>
                <button
                  id="btn-share-link"
                  onClick={handleShare}
                  aria-label="Share figurine link"
                  className="py-3 px-4 rounded-xl border border-white/20 hover:bg-white/10 text-white transition-colors flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

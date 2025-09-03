'use client';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image, { ImageProps } from 'next/image';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Portal } from '@/components/ui/portal';

// Simple icon components to replace @tabler/icons-react
const IconArrowNarrowLeft = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M5 12l6 6" />
    <path d="M5 12l6-6" />
  </svg>
);

const IconArrowNarrowRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 18l6-6" />
    <path d="M13 6l6 6" />
  </svg>
);

const IconX = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  items,
  initialScroll = 0,
}: {
  items: React.ReactNode[];
  initialScroll?: number;
}) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Get the card width and gap based on viewport size
  const getScrollDistance = () => {
    // Card width (w-80 = 320px) + gap-4 (16px)
    const cardWidth = 320;
    const gap = 16;
    const totalWidth = cardWidth + gap;

    // Scroll by 1 card at a time
    const cardsToScroll = 1;
    return totalWidth * cardsToScroll;
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -getScrollDistance(),
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: getScrollDistance(),
        behavior: 'smooth',
      });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 320; // w-80 (320px)
      const gap = isMobile() ? 16 : 16; // gap-4 (16px)
      const scrollPosition = (cardWidth + gap) * index;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              'absolute right-0 z-[10] h-auto w-[5%] overflow-hidden bg-gradient-to-l'
            )}
          ></div>

          <div
            className={cn(
              'flex flex-row justify-start gap-4',
              'mx-auto max-w-7xl' // remove max-w-4xl if you want the carousel to span the full width of its container
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: 'easeOut',
                    once: true,
                  },
                }}
                key={'card' + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2 md:mr-20">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50/80 hover:bg-blue-100/90 disabled:opacity-50 backdrop-blur-sm border border-blue-200/30 shadow-md shadow-blue-400/10 transition-all duration-300"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-blue-600" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50/80 hover:bg-blue-100/90 disabled:opacity-50 backdrop-blur-sm border border-blue-200/30 shadow-md shadow-blue-400/10 transition-all duration-300"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-blue-600" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, handleClose]);

  // @ts-expect-error - useOutsideClick hook with ref parameter
  useOutsideClick(containerRef, () => handleClose());

  return (
    <>
      <Portal>
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-blue-900/30 to-gray-900/20 backdrop-blur-3xl backdrop-saturate-150"
                onClick={handleClose}
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              />

              {/* Modal panel */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                ref={containerRef}
                layoutId={layout ? `card-${card.title}` : undefined}
                className="relative z-[1001] w-full max-w-5xl rounded-3xl bg-gradient-to-br from-white/98 via-white/95 to-blue-50/98 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.7),inset_0_1px_0_rgba(255,255,255,0.8),0_0_200px_rgba(0,122,255,0.03)] border border-white/60 ring-1 ring-blue-200/40 backdrop-blur-xl backdrop-saturate-110"
                initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
              >
                {/* Scroll container with sticky header */}
                <div className="max-h-[85vh] overflow-auto">
                  {/* Header */}
                  <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-3xl bg-gradient-to-r from-white/98 via-blue-50/95 to-white/98 px-8 py-6 backdrop-blur-xl backdrop-saturate-120 border-b border-gradient-to-r shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] md:px-12 md:py-8">
                    <div className="min-w-0">
                      <motion.p
                        layoutId={layout ? `category-${card.title}` : undefined}
                        className="text-sm font-medium uppercase tracking-wide text-blue-600/80"
                      >
                        {card.category}
                      </motion.p>
                      <motion.h2
                        id="modal-title"
                        layoutId={layout ? `title-${card.title}` : undefined}
                        className="mt-2 text-3xl font-bold text-gray-900 md:text-[48px] leading-tight"
                      >
                        {card.title}
                      </motion.h2>
                    </div>

                    <button
                      onClick={handleClose}
                      aria-label="Close"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-gray-500 hover:text-gray-700 hover:bg-white border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.8),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_0_20px_rgba(0,122,255,0.1)] active:scale-95 active:shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-all duration-200 apple-button-press"
                    >
                      <IconX className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="px-8 py-8 md:px-12 md:py-10 bg-gradient-to-b from-white/95 via-blue-50/30 to-white/98 rounded-b-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_0_20px_rgba(0,122,255,0.02)]">
                    {card.content}
                  </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </Portal>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="group relative z-10 flex h-48 w-80 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/90 via-cyan-50/80 to-indigo-50/85 backdrop-blur-xl border border-blue-200/40 shadow-xl shadow-blue-400/12 hover:from-blue-50 hover:via-cyan-50 hover:to-indigo-50 hover:shadow-2xl hover:shadow-blue-500/18 hover:scale-[1.02] transition-all duration-500 ease-out"
      >
        <div className="absolute inset-x-0 top-0 z-30 h-full cursor-pointer bg-gradient-to-b from-white/30 group-hover:from-white/40 via-transparent group-hover:via-cyan-50/20 to-blue-50/30 group-hover:to-indigo-50/40 transition-all duration-500 ease-out" />
        {/*<div className="absolute inset-0 z-20 cursor-pointer bg-black/20 hover:bg-black/2" />*/}
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-sm font-medium text-blue-600 group-hover:text-blue-700 drop-shadow-sm md:text-base transition-colors duration-300"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="max-w-xs text-left font-sans text-xl font-semibold [text-wrap:balance] text-slate-800 group-hover:text-slate-900 drop-shadow-sm md:text-3xl transition-colors duration-300"
          >
            {card.title}
          </motion.p>
        </div>

      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        'transition duration-300',
        isLoading ? 'blur-sm' : 'blur-0',
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === 'string' ? src : undefined}
      alt={alt ? alt : 'Background of a beautiful view'}
      {...rest}
    />
  );
};

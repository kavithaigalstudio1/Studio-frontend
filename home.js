// home.js

// home.js

function Hero() {
    const textRef = React.useRef(null);
    const imageRef = React.useRef(null);

    // Cinematic intro animation
    React.useEffect(() => {
        if (textRef.current && typeof gsap !== 'undefined') {
            gsap.fromTo(
                textRef.current.children,
                { opacity: 0, y: 0 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.4,
                    stagger: 0.15,
                    ease: "power3.out",
                    delay: 0.5
                }
            );
        }
    }, []);

    // Optimized Apple-style parallax using global emitter
    React.useEffect(() => {
        const handleCustomScroll = (e) => {
            // ✅ Use the animated scroll position from Lenis for perfect sync
            const scrollY = e.detail && e.detail.scroll !== undefined ? e.detail.scroll : window.scrollY;
            if (imageRef.current && scrollY < window.innerHeight * 1.5) {
                const progress = Math.min(scrollY / window.innerHeight, 1);
                // Directly set styles - use translate3d for GPU acceleration
                // REMOVED opacity change to ensure image doesn't disappear/fade
                imageRef.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0) scale(${1.05 + progress * 0.1})`;
            }
        };

        window.addEventListener("ks-scroll", handleCustomScroll);
        return () => window.removeEventListener("ks-scroll", handleCustomScroll);
    }, []);

    const [screenWidth, setScreenWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    React.useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

    const heroStyles = {
        section: {
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: (isMobile || isTablet) ? "130px 8% 130px" : "100px 8% 100px",
            background: "linear-gradient(135deg, rgba(72, 72, 72, 1) 0%, rgba(209, 207, 207, 0.65) 100%)",
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
            textAlign: isMobile ? "center" : "left"
        },
        left: {
            flex: isMobile ? "none" : 1.2,
            maxWidth: isMobile ? "100%" : "700px",
            zIndex: 10,
            willChange: "transform, opacity",
            width: "100%"
        },
        right: {
            flex: 1,
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
            height: isMobile ? "400px" : "auto",
            alignItems: "center",
            position: "relative",
            width: "100%",
            marginTop: isMobile ? "3rem" : 0,
            marginLeft: isMobile ? 0 : "4rem",
            zIndex: 5
        },
        title: {
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            fontSize: isMobile ? "2.2rem" : "3.5rem",
            fontWeight: "700",
            lineHeight: "1.2",
            letterSpacing: "-1px",
            marginBottom: "0",
            color: "#ffffff",
        },
        subtitle: {
            fontSize: isMobile ? "1rem" : "1.15rem",
            color: "rgba(255, 255, 255, 0.85)",
            lineHeight: "1.6",
            maxWidth: isMobile ? "100%" : "480px",
            marginBottom: isMobile ? "2rem" : "3rem",
            fontWeight: "400",
            margin: isMobile ? "0 auto 2.5rem" : "0 0 3rem"
        },
        buttonGroup: {
            display: "flex",
            gap: "0.8rem",
            alignItems: "center",
            justifyContent: (isMobile || isTablet) ? "center" : "flex-start",
            flexWrap: "nowrap",
            width: "100%"
        },
        buttonPrimary: {
            padding: (isMobile || isTablet) ? "12px 20px" : "18px 42px",
            fontSize: (isMobile || isTablet) ? "15px" : "17px",
            borderRadius: "50px",
            border: "none",
            background: "#ff2d55",
            color: "#ffffff",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            fontWeight: "600",
            letterSpacing: "0.2px",
            display: "inline-block",
            textDecoration: "none",
            boxShadow: "0 12px 35px rgba(255, 45, 85, 0.4)"
        },
        buttonSecondary: {
            padding: (isMobile || isTablet) ? "12px 20px" : "18px 42px",
            fontSize: (isMobile || isTablet) ? "15px" : "17px",
            borderRadius: "50px",
            border: "1.5px solid rgba(255, 255, 255, 0.5)",
            background: "rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            fontWeight: "600",
            letterSpacing: "0.2px",
            display: "inline-block",
            textDecoration: "none",
            backdropFilter: "blur(12px)"
        },
        imageContainer: {
            width: isMobile ? "100%" : "90%",
            height: isMobile ? "100%" : "70vh",
            borderRadius: isMobile ? "32px" : "60px",
            overflow: "hidden",
            boxShadow: "0 50px 100px rgba(0,0,0,0.3)",
            background: "rgba(255,255,255,0.05)"
        },
        image: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "translate3d(0,0,0) scale(1.05)",
            filter: "brightness(1.02)",
            willChange: "transform"
        }
    };

    const ImageElement = el('div', { style: heroStyles.right },
        el('div', { style: heroStyles.imageContainer },
            el('img', {
                ref: imageRef,
                src: './public/shantanu-kumar-1clnR1l3Ls4-unsplash.jpg',
                alt: 'Cinematic Wedding Photography',
                style: heroStyles.image
            })
        )
    );

    return el('section', { style: heroStyles.section },
        // LEFT TEXT
        el('div', { ref: textRef, style: heroStyles.left },
            el('p', {
                style: {
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '1rem'
                }
            }, 'Kavithakal Studio Presents'),
            el('div', { style: { display: 'block', marginBottom: '2rem' } },
                el(AppleTextReveal, {
                    text: 'We frame your love story',
                    style: { ...heroStyles.title, marginBottom: '0', display: 'block' },
                    highlightIndices: []
                }),
                el(AppleTextReveal, {
                    text: 'in timeless photographs.',
                    style: { ...heroStyles.title, marginBottom: '0', display: 'block' },
                    highlightIndices: [],
                    delay: 300
                })
            ),
            el('p', { style: heroStyles.subtitle },
                'Capture the magic of your most special moments with visually stunning and emotionally rich photography.'
            ),

            // Add image below subtitle only on mobile
            isMobile && ImageElement,

            // Show buttons on all devices but in a single row
            el('div', { style: heroStyles.buttonGroup },
                el('a', {
                    href: '#contact',
                    style: heroStyles.buttonPrimary
                }, 'Book your Shoot'),
                el('a', {
                    href: '#portfolio',
                    style: heroStyles.buttonSecondary
                }, 'View Portfolio')
            )
        ),

        // RIGHT IMAGE - Only shown on desktop
        !isMobile && ImageElement
    );
}

function ExploreWork({ onCardClick }) {
    const cards = CARDS;
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(true);
    const carouselRef = React.useRef(null);

    const getCardsToShow = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) return 1;
        }
        return 3;
    };

    const [cardsToShow, setCardsToShow] = React.useState(getCardsToShow());

    React.useEffect(() => {
        const handleResize = () => setCardsToShow(getCardsToShow());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const extendedCards = [...cards];
    if (cardsToShow > 1) {
        for (let i = 0; i < cardsToShow; i++) {
            extendedCards.push(cards[i]);
        }
    }

    const nextSlide = React.useCallback(() => {
        if (currentIndex >= cards.length) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => prevIndex + 1);
    }, [currentIndex, cards.length]);

    const prevSlide = React.useCallback(() => {
        if (currentIndex <= 0) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => prevIndex - 1);
    }, [currentIndex]);

    // ✅ Sync with GSAP for butter-smooth sliding
    React.useLayoutEffect(() => {
        if (!carouselRef.current) return;

        gsap.to(carouselRef.current, {
            xPercent: -currentIndex * (100 / cardsToShow),
            duration: isTransitioning ? 0.8 : 0,
            ease: "expo.out",
            force3D: true,
            onComplete: () => {
                if (currentIndex === cards.length) {
                    setIsTransitioning(false);
                    setCurrentIndex(0);
                }
            }
        });
    }, [currentIndex, cardsToShow, isTransitioning]);

    React.useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return el('section', { className: 'explore-work', style: { background: '#fff', padding: '120px 8%' } },
        el(AppleTextReveal, { text: 'Explore our Work', style: { marginBottom: '1.5rem', color: '#1d1d1f' } }),
        el(Reveal, { animation: 'fade-up', delay: 150 },
            el('p', { style: { fontSize: '1.2rem', color: '#666', marginBottom: '4rem', fontWeight: '400' } },
                'A glimpse into the stories we’ve had the honor to capture.'
            )
        ),
        el(Reveal, { animation: 'zoom-in', delay: 300, className: 'cards-wrapper' },
            el('div', { className: 'cards-viewport' },
                el('div', {
                    ref: carouselRef,
                    className: 'cards-container-inner',
                    style: { transition: 'none' } // Use GSAP instead
                },
                    extendedCards.map((card, index) =>
                        el(Card, { key: index, card: card, index: index, onClick: () => onCardClick(card) })
                    )
                )
            )
        )
    );
}

function Card({ card, index, onClick }) {
    return el('div', {
        className: 'card',
        style: {
            cursor: 'pointer',
            borderRadius: '24px',
            overflow: 'hidden',
            background: '#f5f5f7',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: 'none',
            border: 'none',
            marginRight: '20px'
        },
        onClick: onClick
    },
        el('div', { style: { overflow: 'hidden', aspectRatio: '16/10' } },
            el('img', {
                src: card.image,
                alt: card.title,
                style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 1s ease'
                }
            })
        ),
        el('div', { className: 'card-content', style: { padding: '1.5rem', background: '#fff' } },
            el(Reveal, { animation: 'fade-up' },
                el('h3', { style: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1d1d1f' } }, card.title)
            ),
            el(Reveal, { animation: 'fade-up', delay: 100 },
                el('p', { style: { fontSize: '0.95rem', color: '#666' } }, card.description)
            )
        )
    );
}

function ReviewsSection() {
    const [reviews, setReviews] = React.useState(() => {
        const saved = localStorage.getItem('ks_reviews_cache');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [slideWidth, setSlideWidth] = React.useState(0);
    const [touchStart, setTouchStart] = React.useState(null);
    const [touchEnd, setTouchEnd] = React.useState(null);
    const sliderRef = React.useRef(null);

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/reviews`)
            .then(res => res.json())
            .then(data => {
                setReviews(data);
                localStorage.setItem('ks_reviews_cache', JSON.stringify(data));
            })
            .catch(err => console.error('Error fetching reviews:', err));
    }, []);

    const updateWidth = () => {
        if (sliderRef.current && sliderRef.current.firstChild) {
            const card = sliderRef.current.firstChild;
            const style = window.getComputedStyle(card);
            const margin = parseFloat(style.marginRight) || 0;
            setSlideWidth(card.offsetWidth + margin);
        }
    };

    React.useEffect(() => {
        updateWidth();
        window.addEventListener('resize', updateWidth);
        const timer = setTimeout(updateWidth, 1000); // Back-up for initial render
        return () => {
            window.removeEventListener('resize', updateWidth);
            clearTimeout(timer);
        };
    }, [reviews]);

    const nextSlide = React.useCallback(() => {
        if (reviews.length === 0) return;
        setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, [reviews.length]);

    const prevSlide = React.useCallback(() => {
        if (reviews.length === 0) return;
        setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
    }, [reviews.length]);

    React.useEffect(() => {
        if (reviews.length <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide, reviews.length]);

    if (reviews.length === 0) return null;

    const minSwipeDistance = 50;
    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEndHandler = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) nextSlide();
        if (distance < -minSwipeDistance) prevSlide();
        setTouchStart(null);
        setTouchEnd(null);
    };

    return el('section', { className: 'home-reviews-preview', style: { padding: '100px 8%', background: '#fff' } },
        el(AppleTextReveal, { text: 'What People Say', style: { fontSize: '2.5rem', marginBottom: '3rem' } }),
        el('div', { 
            className: 'home-review-card',
            onTouchStart: handleTouchStart, 
            onTouchMove: handleTouchMove, 
            onTouchEnd: handleTouchEndHandler,
            style: {
                background: '#f9f9f9',
                padding: '3rem',
                borderRadius: '40px',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '0 auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
            }
        },
            el('i', { className: 'fa-solid fa-quote-left', style: { fontSize: '2rem', color: '#ff2d6c', opacity: 0.2, marginBottom: '1.5rem', display: 'block' } }),
            el('p', { style: { fontSize: '1.25rem', lineHeight: '1.6', color: '#333', marginBottom: '2rem' } }, 
                reviews[currentIndex] ? `"${reviews[currentIndex].reviewText}"` : 'Fetching your stories...'
            ),
            el('h4', { style: { fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' } }, reviews[currentIndex]?.name || ''),
            el('p', { style: { color: '#888', fontSize: '0.9rem' } }, 'Verified Review')
        ),
        el('div', { style: { textAlign: 'center', marginTop: '3rem' } },
            el('a', { href: '#reviews', className: 'btn-pink-pill' }, 'See All Reviews')
        )
    );
}

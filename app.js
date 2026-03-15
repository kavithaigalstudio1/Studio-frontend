
const CARDS = [
    {
        title: 'Pravin Weds Sakthi',
        description: 'A collection of beautiful candid photographs from various locations.',
        image: 'https://images.unsplash.com/photo-1619468129361-605ebea04b44?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Surya Weds Jothika',
        description: 'Elegant and timeless wedding photographs.',
        image: 'https://media.istockphoto.com/id/937881660/photo/attractive-happy-south-indian-couple-in-traditional-dress.jpg?s=612x612&w=0&k=20&c=vchJkx_fi6S7qgvztTSUnvlmHPNdTfhooVW6yf5nzyI='
    },
    {
        title: 'Vijay Weds Sangeetha',
        description: 'Memorable pre-wedding photoshoots in scenic locations.',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200'
    },
    {
        title: 'Ajith Weds Shalini',
        description: 'Vibrant and traditional cultural wedding ceremonies.',
        image: 'https://media.istockphoto.com/id/521806030/photo/hindu-indian-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=DFdbT2iRfsrknde1y7-8QJmHU-Iq156VuY3OjUUGIJI='
    }
];


// Main App Component
function App() {
    React.useLayoutEffect(() => {
        // Instant pre-load for the most critical asset
        const logo = new Image();
        logo.src = globalAssetCache.logo;
    }, []);

    React.useEffect(() => {
        // Background warm-up for all pages (appears within <2s)
        const fetchAndCache = (url, cacheKey, preLoadThumbs = false) => {
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        window.globalAssetCache[cacheKey] = data;
                        if (preLoadThumbs) {
                            // Full pre-load for gallery to ensure < 1sec appearance
                            const itemsToPreload = cacheKey === 'gallery' ? data : data.slice(0, 40);
                            itemsToPreload.forEach(item => {
                                const src = typeof item === 'string' ? item : item.thumb;
                                if (src) { const img = new Image(); img.src = src; }
                            });
                        }
                    }
                }).catch(() => { });
        };

        fetchAndCache(`${window.API_URL}/api/gallery`, 'gallery', true);
        fetchAndCache(`${window.API_URL}/api/montages`, 'montages', true);
        fetchAndCache(`${window.API_URL}/api/reviews`, 'reviews');
        fetchAndCache(`${window.API_URL}/api/review-videos`, 'reviewVideos', true);
    }, []);
    const [route, setRoute] = React.useState(() => {
        const hash = window.location.hash.replace('#', '');
        return hash || 'home';
    });

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({
                duration: 1.6, // Slightly longer for premium weight
                smoothWheel: true,
                smoothTouch: false,
                lerp: 0.05, // Lower lerp = smoother/slower momentum
                wheelMultiplier: 1.1, // Responsive touch
                touchMultiplier: 2,
            });

            // Synchronize GSAP with Lenis
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', (e) => {
                    ScrollTrigger.update();
                    // Global emitter for other components to tap into
                    window.dispatchEvent(new CustomEvent('ks-scroll', { detail: e }));
                });

                const updateLenis = (time) => {
                    lenis.raf(time * 1000);
                };
                gsap.ticker.add(updateLenis);
                gsap.ticker.lagSmoothing(0);

                window.lenis = lenis;

                return () => {
                    lenis.destroy();
                    gsap.ticker.remove(updateLenis);
                };
            }
        }
    }, []);

    React.useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setRoute(hash || 'home');
            setIsMenuOpen(false); // Close menu on route change
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const scrollPosRef = React.useRef(0);

    // Force scroll to top on ANY route change
    React.useLayoutEffect(() => {
        window.scrollTo(0, 0);
        if (window.lenis) {
            window.lenis.scrollTo(0, { immediate: true });
        }
    }, [route]);

    const handleCardClick = (card) => {
        scrollPosRef.current = window.scrollY;
        // Navigation should also force scroll to top for the new view
        window.location.hash = `card-${CARDS.indexOf(card)}`;
    };



    const handleBackToHome = () => {
        window.location.hash = '';
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    let content;
    let headerProps = { onMenuToggle: toggleMenu, isHome: route === 'home' };

    if (route === 'portfolio') {
        content = el(PortfolioPage, { onBack: handleBackToHome });
    } else if (route.startsWith('portfolio-')) {
        const idx = parseInt(route.split('-')[1], 10);
        headerProps = { ...headerProps, backRoute: '#portfolio', hideNav: true, isHome: false, isCategoryPage: true };
        content = el(PortfolioCategoryPage, { categoryIdx: idx });
    } else if (route.startsWith('card-')) {
        const idx = parseInt(route.split('-')[1], 10);
        const card = CARDS[idx];
        if (card) {
            headerProps = { ...headerProps, backRoute: '#home', hideNav: true, isHome: false, isCategoryPage: true };
            content = el(ExploreWorkInnerPage, { card: card, onBack: handleBackToHome });
        }
    } else if (route === 'gallery') {
        content = el(Gallery, { onMenuToggle: toggleMenu });
    } else if (route === 'about') {
        headerProps = { ...headerProps, backRoute: '#home', hideNav: true, isHome: false };
        content = el(About, null);
    } else if (route === 'montages') {
        content = el(Montages, null);
    } else if (route === 'reviews') {
        content = el(AnomaliesReview, null);
    } else if (route === 'contact') {
        content = el(Contact, null);
    } else if (route === 'admin') {
        return el(AdminPage, null);
    }

    // Default to home
    if (!content) {
        content = el(React.Fragment, null,
            el(Hero, null),
            el(ExploreWork, { onCardClick: handleCardClick }),
            el(ReviewsSection, null)
        );
    }

    const routeClass = route.split('-')[0];

    return el('div', { className: `app-container route-${routeClass}` },
        el(MobileMenu, { isOpen: isMenuOpen, onClose: () => setIsMenuOpen(false) }),
        el(Header, headerProps),
        content,
        el(Footer, null),
        el(WhatsAppFloat, null)
    );
}

function Header({ onMenuToggle, backRoute, hideNav, isHome, isCategoryPage }) {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;
            const diff = currentScrollY - lastScrollY;

            if (currentScrollY <= 0) {
                setIsVisible(true);
            } else if (diff > 5 && currentScrollY > 100) {
                // Scrolling down - hide
                setIsVisible(false);
            } else if (diff < -5) {
                // Scrolling up - show
                setIsVisible(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClass = isVisible ? 'header-visible' : 'header-hidden';
    const categoryClass = isCategoryPage ? 'category-header' : '';

    return el('header', { className: `${headerClass} ${!isHome ? 'subpage-header' : 'home-header'} ${categoryClass}` },
        // Left Section: Back button + Logo Image
        el('div', { className: 'header-left' },
            isCategoryPage && el('a', { href: backRoute || '#home', className: 'mobile-home-back' },
                el('i', { className: 'fa-solid fa-arrow-left' })
            ),
            el('div', { className: 'logo-img-container', style: { cursor: 'pointer' }, onClick: () => window.location.hash = '#home' },
                el('img', { src: './public/logo copy.png', alt: 'Kavithakal Studio Logo', className: 'logo-img' })
            )
        ),

        // Center Section: Studio Name
        el('div', { className: 'header-center', style: { cursor: 'pointer' }, onClick: () => window.location.hash = '#home' },
            el('div', { className: 'logo-text-wrapper' },
                ' Kavithakal ', el('span', null, 'Studio')
            )
        ),

        // Right Column: Navigation & Icons
        el('div', { className: 'header-right' },
            !hideNav && el('ul', { className: 'nav-links' },
                el('li', null, el('a', { href: '#home' }, 'Home')),
                el('li', null, el('a', { href: '#portfolio' }, 'Portfolio')),
                el('li', null, el('a', { href: '#gallery' }, 'Gallery')),
                el('li', null, el('a', { href: '#montages' }, 'Montages')),
                el('li', null, el('a', { href: '#reviews' }, 'Anomalies Review')),
                el('li', null, el('a', { href: '#contact' }, 'Contact'))
            ),
            el('div', { className: 'nav-icons desktop-icons' },
                el('a', { href: 'https://www.instagram.com/kavithaigal_studio', className: 'nav-icon-link' }, el('i', { className: 'fa-brands fa-instagram' })),
                el('a', { href: 'https://wa.me/919384684082', className: 'nav-icon-link' }, el('i', { className: 'fa-brands fa-whatsapp' })),
                el('a', { href: 'tel:+919384684082', className: 'nav-icon-link' }, el('i', { className: 'fa-solid fa-phone' }))
            ),
            el('div', { className: 'mobile-hamburger', onClick: onMenuToggle },
                el('i', { className: 'fa-solid fa-bars' })
            )
        )
    );
}

function MobileMenu({ isOpen, onClose }) {
    if (!isOpen) return null;

    return el('div', { className: 'mobile-menu-overlay', onClick: onClose },
        el('div', { className: 'mobile-menu-dropdown', onClick: (e) => e.stopPropagation() },
            el('button', { className: 'close-menu', onClick: onClose },
                el('i', { className: 'fa-solid fa-xmark' })
            ),
            el('nav', { className: 'mobile-nav' },
                el('div', { className: 'mobile-nav-box' },
                    el('ul', null,
                        el('li', null, el('a', { href: '#home', onClick: onClose }, 'Home')),
                        el('li', null, el('a', { href: '#portfolio', onClick: onClose }, 'Portfolio')),
                        el('li', null, el('a', { href: '#gallery', onClick: onClose }, 'Gallery')),
                        el('li', null, el('a', { href: '#montages', onClick: onClose }, 'Montages')),
                        el('li', null, el('a', { href: '#reviews', onClick: onClose }, 'Anomalies Review')),
                        el('li', null, el('a', { href: '#contact', onClick: onClose }, 'Contact'))
                    )
                )
            ),
            el('div', { className: 'mobile-menu-footer' },
                el('div', { className: 'mobile-social-icons' },
                    el('a', { href: 'https://www.instagram.com/kavithaigal_studio', className: 'nav-icon-link' }, el('i', { className: 'fa-brands fa-instagram' })),
                    el('a', { href: 'https://wa.me/919384684082', className: 'nav-icon-link' }, el('i', { className: 'fa-brands fa-whatsapp' })),
                    el('a', { href: 'tel:+919384684082', className: 'nav-icon-link' }, el('i', { className: 'fa-solid fa-phone' }))
                )
            )
        )
    );
}

function Footer() {
    return el('footer', null,
        el('div', null,
            '© 2026 ', el('span', null, 'Kavithakal Studio'), '. All rights reserved. ',
            el('a', { href: '#admin', className: 'admin-footer-link' }, 'Admin')
        ),
        el('div', { className: 'developer-credits', style: { fontSize: '0.7rem', marginTop: '10px', opacity: 0.7 } }, 'designed & developed by Monisha Loganathan')
    );
}

function WhatsAppFloat() {
    return el('a', { href: 'https://wa.me/919384684082', className: 'whatsapp-float', 'aria-label': 'Chat on WhatsApp' },
        el('i', { className: 'fa-brands fa-whatsapp' })
    );
}

// Render the App
const rootNode = document.getElementById('root');
const root = ReactDOM.createRoot(rootNode);
root.render(el(App));

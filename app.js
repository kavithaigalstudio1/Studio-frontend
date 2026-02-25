
const CARDS = [
    {
        title: 'Pravin Weds Sakthi',
        description: 'A collection of beautiful candid photographs from various locations.',
        image: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=600'
    },
    {
        title: 'Surya Weds Jothika',
        description: 'Elegant and timeless wedding photographs.',
        image: 'https://images.unsplash.com/photo-1537368910025-702804a546da?auto=format&fit=crop&q=80&w=600'
    },
    {
        title: 'Vijay Weds Sangeetha',
        description: 'Memorable pre-wedding photoshoots in scenic locations.',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600'
    },
    {
        title: 'Ajith Weds Shalini',
        description: 'Vibrant and traditional cultural wedding ceremonies.',
        image: 'https://images.unsplash.com/photo-1587314540251-5126fce7cdd1?auto=format&fit=crop&q=80&w=600'
    }
];

// Main App Component
function App() {
    const [route, setRoute] = React.useState(() => {
        const hash = window.location.hash.replace('#', '');
        return hash || 'home';
    });

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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

    const handleCardClick = (card) => {
        scrollPosRef.current = window.scrollY;
        window.location.hash = `card-${CARDS.indexOf(card)}`;
    };

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [route]);

    const handleBackToHome = () => {
        window.location.hash = '';
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    let content;
    const isSpecialPage = route === 'portfolio' || route.startsWith('portfolio-') || route === 'gallery';

    if (route === 'portfolio') {
        content = el(React.Fragment, null,
            el(Header, { onMenuToggle: toggleMenu }),
            el(PortfolioPage, { onBack: handleBackToHome })
        );
    } else if (route.startsWith('portfolio-')) {
        const idx = parseInt(route.split('-')[1], 10);
        content = el(React.Fragment, null,
            el(Header, { onMenuToggle: toggleMenu, backRoute: '#portfolio', hideNav: true }),
            el(PortfolioCategoryPage, { categoryIdx: idx })
        );
    } else if (route.startsWith('card-')) {
        const idx = parseInt(route.split('-')[1], 10);
        const card = CARDS[idx];
        if (card) {
            content = el(React.Fragment, null,
                el(Header, { onMenuToggle: toggleMenu, backRoute: '#home', hideNav: true }),
                el(ExploreWorkInnerPage, { card: card, onBack: handleBackToHome })
            );
        }
    } else if (route === 'gallery') {
        content = el(React.Fragment, null,
            el(Header, { onMenuToggle: toggleMenu }),
            el(Gallery, { onMenuToggle: toggleMenu })
        );
    } else if (route === 'about') {
        content = el(React.Fragment, null, el(Header, { onMenuToggle: toggleMenu, backRoute: '#home', hideNav: true }), el(About, null));
    } else if (route === 'montages') {
        content = el(React.Fragment, null, el(Header, { onMenuToggle: toggleMenu }), el(Montages, null));
    } else if (route === 'reviews') {
        content = el(React.Fragment, null, el(Header, { onMenuToggle: toggleMenu }), el(AnomaliesReview, null));
    } else if (route === 'contact') {
        content = el(React.Fragment, null, el(Header, { onMenuToggle: toggleMenu }), el(Contact, null));
    } else if (route === 'admin') {
        content = el(AdminPage, null);
    }

    // Default to home
    if (!content) {
        content = el(React.Fragment, null,
            el(Header, { onMenuToggle: toggleMenu }),
            el(Hero, null),
            el(ExploreWork, { onCardClick: handleCardClick }),
            el(ReviewsSection, null)
        );
    }

    const routeClass = route.split('-')[0]; // portfolio, gallery, home, etc.

    return el('div', { className: `app-container route-${routeClass}` },
        el(MobileMenu, { isOpen: isMenuOpen, onClose: () => setIsMenuOpen(false) }),
        content,
        el(Footer, null),
        el(WhatsAppFloat, null)
    );
}

function Header({ onMenuToggle, backRoute, hideNav }) {
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
    return el('header', { className: headerClass },
        backRoute && el('a', { href: backRoute, className: 'header-back-btn' }, el('i', { className: 'fa-solid fa-arrow-left' })),
        el('div', { className: 'logo' },
            el('img', { src: './public/logo copy.png', alt: 'Kavithakal Studio Logo', className: 'logo-img' }),
            el('div', { className: 'logo-text-wrapper' },
                ' Kavithagal ', el('span', null, 'Studio')
            )
        ),
        !hideNav && el('ul', { className: 'nav-links' },
            el('li', null, el('a', { href: '#home' }, 'Home')),
            el('li', null, el('a', { href: '#portfolio' }, 'Portfolio')),
            el('li', null, el('a', { href: '#gallery' }, 'Gallery')),
            el('li', null, el('a', { href: '#montages' }, 'Montages')),
            el('li', null, el('a', { href: '#reviews' }, 'Anomalies Review')),
            el('li', null, el('a', { href: '#contact' }, 'Contact'))
        ),
        !hideNav && el('div', { className: 'header-right' },
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

    return el('div', { className: 'mobile-menu-overlay' },
        el('button', { className: 'close-menu', onClick: onClose },
            el('i', { className: 'fa-solid fa-xmark' })
        ),
        el('nav', { className: 'mobile-nav' },
            el('ul', null,
                el('li', null, el('a', { href: '#home', onClick: onClose }, 'Home')),
                el('li', null, el('a', { href: '#portfolio', onClick: onClose }, 'Portfolio')),
                el('li', null, el('a', { href: '#gallery', onClick: onClose }, 'Gallery')),
                el('li', null, el('a', { href: '#montages', onClick: onClose }, 'Montages')),
                el('li', null, el('a', { href: '#reviews', onClick: onClose }, 'Anomalies Review')),
                el('li', null, el('a', { href: '#contact', onClick: onClose }, 'Contact'))
            )
        ),
        el('div', { className: 'mobile-menu-footer' },
            el('div', { className: 'mobile-social-icons' },
                el('a', { href: 'https://www.instagram.com/kavithaigal_studio', className: 'nav-icon-link' }, el('i', { className: 'fa-brands fa-instagram' })),
                el('a', { href: 'https://wa.me/919384684082', className: 'nav-icon-link' }, el('i', { className: 'fa-brands fa-whatsapp' })),
                el('a', { href: 'tel:+919384684082', className: 'nav-icon-link' }, el('i', { className: 'fa-solid fa-phone' }))
            )
        )
    );
}

function Footer() {
    return el(Reveal, { animation: 'fade-up' },
        el('footer', null,
            '© 2026 ', el('span', null, 'Kavithakal Studio'), '. All rights reserved. ',
            el('a', { href: '#admin', className: 'admin-footer-link' }, 'Admin')
        )
    );
}

function WhatsAppFloat() {
    return el('a', { href: '#', className: 'whatsapp-float', 'aria-label': 'Chat on WhatsApp' },
        el('i', { className: 'fa-brands fa-whatsapp' })
    );
}

// Render the App
const rootNode = document.getElementById('root');
const root = ReactDOM.createRoot(rootNode);
root.render(el(App));

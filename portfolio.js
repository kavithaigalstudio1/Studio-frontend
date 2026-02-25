// portfolio.js

const getPortfolioCategories = () => {
    const saved = localStorage.getItem('ks_portfolio_data');
    if (saved) {
        return JSON.parse(saved).map((cat, idx) => ({ ...cat, link: `#portfolio-${idx}` }));
    }
    return [
        { title: 'Portraits', image: './public/b6.jpg', link: '#portfolio-0' },
        { title: 'Pre Weddings', image: './public/b5.jpg', link: '#portfolio-1' },
        { title: 'Weddings', image: './public/b4.jpg', link: '#portfolio-2' },
        { title: 'Reception', image: './public/b3.jpg', link: '#portfolio-3' },
        { title: 'Model Shoot', image: './public/b2.jpg', link: '#portfolio-4' },
        { title: 'Engagement', image: './public/b1.jpg', link: '#portfolio-5' }
    ];
};

let PORTFOLIO_CATEGORIES = getPortfolioCategories();

function PortfolioPage({ onBack }) {
    const categories = React.useMemo(() => getPortfolioCategories(), []);
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return el('div', { className: 'portfolio-page-container' },
        el('div', { className: 'portfolio-header-area', style: { padding: '20px' } },

        ),
        el('div', { className: 'portfolio-content' },
            el(Reveal, { animation: 'fade-up' },
                el('h1', { className: 'portfolio-title', style: { textAlign: 'center' } }, 'Our ', el('span', null, 'Portfolio'))
            ),
            el(Reveal, { animation: 'fade-up', delay: 100 },
                el('p', { className: 'portfolio-subtitle', style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--pink-accent)' } }, 'Where Love Becomes Cinema')
            ),
            el(Reveal, { animation: 'fade-up', delay: 200 },
                el('p', { style: { textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto', color: '#666', lineHeight: '1.6' } },
                    'At Kavithaigal Studio, every frame is a scene, every moment a story. From pre-wedding dreams to wedding vows, receptions, engagements, portraits, and cinematic films — we capture emotions as they unfold naturally.'
                )
            ),

            el('div', { className: 'portfolio-grid' },
                categories.map((cat, idx) =>
                    el(Reveal, { key: idx, animation: 'fade-up', delay: (idx % 2) * 100 },
                        el('a', { href: cat.link, className: 'portfolio-card' },
                            el('img', { src: cat.image, alt: cat.title, className: 'portfolio-card-img' }),
                            el('div', { className: 'portfolio-card-overlay' },
                                el('h3', null, cat.title)
                            )
                        )
                    )
                )
            )
        )
    );
}

function PortfolioCategoryPage({ categoryIdx }) {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [activeImageIndex, setActiveImageIndex] = React.useState(null);
    const category = PORTFOLIO_CATEGORIES[categoryIdx];
    const categoryName = category.title;

    const [galleryImages, setGalleryImages] = React.useState([
        './public/b6.jpg',
        './public/b5.jpg',
        './public/b4.jpg',
        './public/b3.jpg',
        './public/b2.jpg',
        './public/b1.jpg'
    ]);

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/portfolio/${encodeURIComponent(categoryName)}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setGalleryImages(data);
            })
            .catch(err => console.error('Error fetching portfolio categories:', err));
    }, [categoryName]);

    return el('div', { className: 'category-page-container' },
        el('div', { className: 'inner-banner-wrapper', style: { height: '70vh' } },
            el('img', { className: 'inner-banner-image', src: PORTFOLIO_CATEGORIES[categoryIdx].image, alt: categoryName }),
            el('div', { className: 'inner-banner-overlay' },
                el('h1', { style: { fontSize: '3rem', maxWidth: '1000px', textAlign: 'center', padding: '0 20px' } }, 'Wedding Portraits That Tell Your Love Story'),
                el('p', { style: { fontSize: '1.5rem', fontWeight: '400', marginTop: '1rem', padding: '0 20px' } }, 'Moments that matter, memories that stay.')
            )
        ),

        el('div', { className: 'category-content' },
            el('div', { className: 'fancy-masonry-grid' },
                galleryImages.map((src, idx) =>
                    el(Reveal, { key: idx, animation: 'fade-up', delay: (idx % 3) * 100 },
                        el('div', {
                            className: `fancy-masonry-item item-${idx}`,
                            onClick: () => setActiveImageIndex(idx),
                            style: { cursor: 'pointer' }
                        },
                            el('img', { src: src, alt: `Gallery image ${idx + 1}` })
                        )
                    )
                )
            ),

            el(Reveal, { animation: 'zoom-in', delay: 100 },
                el('div', { className: 'category-cta' },
                    el('p', null, `Ready to book your ${categoryName.toLowerCase()}?`),
                    el('a', { href: '#contact', className: 'btn btn-primary' }, 'Get in touch')
                )
            )
        ),

        activeImageIndex !== null && el(Lightbox, {
            images: galleryImages,
            activeIndex: activeImageIndex,
            onClose: () => setActiveImageIndex(null),
            onNext: () => setActiveImageIndex((prev) => (prev + 1) % galleryImages.length),
            onPrev: () => setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
        })
    );
}

function ExploreWorkInnerPage({ card, onBack }) {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [activeImageIndex, setActiveImageIndex] = React.useState(null);

    const galleryImages = [
        './public/b6.jpg',
        './public/b5.jpg',
        './public/b4.jpg',
        './public/b3.jpg',
        './public/b2.jpg',
        './public/b1.jpg'
    ];

    return el('div', { className: 'inner-page-container' },
        el('div', { className: 'inner-banner-wrapper', style: { height: '70vh' } },
            el('img', { className: 'inner-banner-image', src: card.image, alt: card.title }),
            el('div', { className: 'inner-banner-overlay' },
                el(Reveal, { animation: 'fade-up' }, el('h1', null, card.title))
            )
        ),
        el('div', { className: 'inner-content' },
            el(Reveal, { animation: 'fade-up', delay: 100 }, el('p', { className: 'inner-description' }, card.description)),
            el(Reveal, { animation: 'fade-up', delay: 200 }, el('p', { className: 'inner-description' }, 'Explore the full story below. We focus on capturing every feeling.')),

            el('div', { className: 'masonry-grid' },
                galleryImages.map((src, idx) =>
                    el(Reveal, { key: idx, animation: 'zoom-in', delay: (idx % 3) * 150 },
                        el('div', {
                            className: `masonry-item ${idx % 2 === 0 ? 'portrait' : 'landscape'}`,
                            onClick: () => setActiveImageIndex(idx),
                            style: { cursor: 'pointer' }
                        },
                            el('img', { src: src, alt: `Gallery image ${idx + 1}` })
                        )
                    )
                )
            )
        ),
        activeImageIndex !== null && el(Lightbox, {
            images: galleryImages,
            activeIndex: activeImageIndex,
            onClose: () => setActiveImageIndex(null),
            onNext: () => setActiveImageIndex((prev) => (prev + 1) % galleryImages.length),
            onPrev: () => setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
        })
    );
}

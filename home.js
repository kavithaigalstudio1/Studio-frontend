// home.js

function Hero() {
    const images = [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1000'
    ];

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return el('section', { className: 'hero' },
        el('div', { className: 'hero-content' },
            el(Reveal, { animation: 'fade-up', delay: 100 }, el('div', { className: 'hero-subtitle' }, 'Kavithakal Studio Presents')),
            el(Reveal, { animation: 'fade-up', delay: 300 }, el('h1', null, 'We frame your love story in')),
            el(Reveal, { animation: 'fade-up', delay: 400 }, el('h1', null, 'timeless photographs.')),
            el(Reveal, { animation: 'fade-up', delay: 500 }, el('p', null, 'Capture the magic of your most special moments with visually stunning and emotionally rich photography.')),
            el(Reveal, { animation: 'fade-up', delay: 600 }, el('div', { className: 'hero-buttons' },
                el('button', { className: 'btn btn-primary' }, 'Book your Shoot'),
                el('a', { className: 'btn btn-secondary', href: '#portfolio' }, 'View Portfolio')
            ))
        ),
        el('div', { className: 'hero-image' },
            el('img', {
                src: images[currentImageIndex],
                alt: 'Indian Wedding Photography'
            })
        )
    );
}

function ExploreWork({ onCardClick }) {
    const cards = CARDS;

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [touchStart, setTouchStart] = React.useState(null);
    const [touchEnd, setTouchEnd] = React.useState(null);
    const [isTransitioning, setIsTransitioning] = React.useState(true);

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

    // Create a cloned array for infinite loop effect
    const extendedCards = [...cards];
    // Clone enough cards at the end to cover the visible window, but ONLY if not mobile
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

    // Handle seamless infinite loop snapping
    React.useEffect(() => {
        if (currentIndex === cards.length) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 500); // Wait for transition
            return () => clearTimeout(timer);
        }
    }, [currentIndex, cards.length]);

    // Auto slide exactly 1 card every 2 seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 2000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    // Touch handlers for swiping
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEndHandler = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    return el('section', { className: 'explore-work' },
        el(Reveal, { animation: 'fade-up' }, el('h2', null, 'Explore ', el('span', null, 'our'), ' Work')),
        el(Reveal, { animation: 'fade-up', delay: 100 }, el('p', { className: 'section-subtitle', style: { color: '#666', marginBottom: '2rem' } }, 'Capturing your timeless stories, frame by frame.')),
        el('div', { className: 'cards-wrapper' },
            el('div', {
                className: `carousel-arrow left`,
                onClick: prevSlide
            }, el('i', { className: 'fa-solid fa-chevron-left' })),

            el('div', {
                className: 'cards-viewport',
                onTouchStart: onTouchStart,
                onTouchMove: onTouchMove,
                onTouchEnd: onTouchEndHandler
            },
                el('div', {
                    className: 'cards-container-inner',
                    style: {
                        transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
                        transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
                    }
                },
                    extendedCards.map((card, index) =>
                        el(Card, { key: index, card: card, index: index, onClick: () => onCardClick(card) })
                    )
                )
            ),

            el('div', {
                className: `carousel-arrow right`,
                onClick: nextSlide
            }, el('i', { className: 'fa-solid fa-chevron-right' }))
        )
    );
}

function Card({ card, index, onClick }) {
    return el('div', { className: 'card', style: { cursor: 'pointer' }, onClick: onClick },
        el(Reveal, { animation: 'zoom-in', delay: index % 6 * 150 },
            el('img', { src: card.image, alt: card.title }),
            el('div', { className: 'card-content' },
                el('h3', null, card.title),
                el('p', null, card.description)
            )
        )
    );
}

function ReviewsSection() {
    const [reviews, setReviews] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [slideWidth, setSlideWidth] = React.useState(0);
    const [touchStart, setTouchStart] = React.useState(null);
    const [touchEnd, setTouchEnd] = React.useState(null);
    const sliderRef = React.useRef(null);

    React.useEffect(() => {
        fetch(`${window.API_URL}/api/reviews`)
            .then(res => res.json())
            .then(data => setReviews(data))
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

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();
        setTouchStart(null);
        setTouchEnd(null);
    };


}

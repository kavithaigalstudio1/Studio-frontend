// simple_pages.js

function About() {
    return el('div', { className: 'about-page' },
        el('div', { className: 'about-hero', style: { textAlign: 'center', padding: '120px 8% 60px' } },
            el(AppleTextReveal, { text: 'Our Story' }),
            el(Reveal, { animation: 'fade-up', delay: 150 }, el('p', { style: { fontSize: '1.2rem', color: '#666', marginTop: '1.5rem' } }, 'Capturing the essence of human emotions through the lens.'))
        ),
        el('div', { className: 'about-content-section' },
            el('div', { className: 'about-grid' },
                el(Reveal, { animation: 'fade-right', className: 'about-text' },
                    el(Reveal, { animation: 'fade-up' }, el('h2', null, 'Who we are')),
                    el(Reveal, { animation: 'fade-up', delay: 100 }, el('p', null, 'Kavithagal Studio is a team of passionate photographers and cinematographers dedicated to capturing your most precious moments. We believe that every wedding is a poem, and every frame should be a masterpiece.')),
                    el(Reveal, { animation: 'fade-up', delay: 200 }, el('p', null, 'With over a decade of experience in the industry, we have mastered the art of blending traditional values with modern cinematic techniques.'))
                ),
                el(Reveal, { animation: 'fade-left', className: 'about-image' },
                    el('img', { src: './public/shantanu-kumar-1clnR1l3Ls4-unsplash.jpg', alt: 'Studio Team' })
                )
            )
        )
    );
}


function PremiumDropdown({ options, value, onChange, placeholder }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return el('div', { className: 'premium-dropdown', ref: containerRef },
        el('div', {
            className: `premium-dropdown-trigger ${isOpen ? 'open' : ''}`,
            onClick: () => setIsOpen(!isOpen)
        },
            el('span', { style: { opacity: value ? 1 : 0.6 } },
                value ? (selectedOption ? selectedOption.label : value) : placeholder
            ),
            el('i', { className: 'fa-solid fa-chevron-down' })
        ),
        el('div', { className: `premium-dropdown-menu ${isOpen ? 'open' : ''}` },
            el('ul', { className: 'premium-dropdown-list' },
                options.map((opt, idx) => el('li', {
                    key: idx,
                    className: `premium-dropdown-item ${value === opt.value ? 'selected' : ''}`,
                    onClick: () => {
                        onChange(opt.value);
                        setIsOpen(false);
                    }
                }, opt.label))
            )
        )
    );
}

function BookShootCTA({ titlePart1 = 'Ready', titlePart2 = ' to book your Shoot?' }) {
    return el('div', { className: 'book-shoot-cta' },
        el(Reveal, { animation: 'zoom-in' },
            el('div', { className: 'cta-card' },
                el('h2', null,
                    el('span', { style: { color: 'var(--pink-accent)' } }, titlePart1),
                    titlePart2
                ),
                el('a', { href: '#contact', className: 'btn-pink-pill' }, 'Get in touch')
            )
        )
    );
}
window.BookShootCTA = BookShootCTA;

function ReviewVideoCard({ videoUrl, thumbnail, title }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const videoRef = React.useRef(null);

    if (!videoUrl) return null;

    const getYouTubeId = (url) => {
        if (!url) return '';
        if (url.length === 11) return url; // Likely just an ID
        if (url.includes('watch?v=')) return url.split('v=')[1].split('&')[0];
        if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
        if (url.includes('embed/')) return url.split('embed/')[1].split('?')[0];
        return '';
    };

    const videoId = getYouTubeId(videoUrl);
    const isYouTube = videoId !== '' || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    let embedUrl = videoUrl;

    if (isYouTube && videoId) {
        embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&origin=${window.location.origin}&controls=1`;
    } else if (!videoUrl.startsWith('http') && !videoUrl.startsWith('//') && !videoUrl.startsWith('data:')) {
        // Prevent relative URL loading which causes 431 errors on localhost
        return null;
    }

    let displayThumb = thumbnail;
    if (!displayThumb && isYouTube) {
        displayThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    const togglePlay = (e) => {
        if (e) e.stopPropagation();
        if (isYouTube) {
            setIsPlaying(!isPlaying);
            return;
        }
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const closePlayer = (e) => {
        if (e) e.stopPropagation();
        setIsPlaying(false);
    };

    return el('div', {
        className: `review-video-item ${isPlaying ? 'active-video' : ''}`,
        onClick: !isPlaying ? () => setIsPlaying(true) : undefined,
        style: { position: 'relative', cursor: !isPlaying ? 'pointer' : 'default' }
    },
        !isPlaying ? el(React.Fragment, null,
            el('img', {
                src: displayThumb || 'https://via.placeholder.com/600x338?text=Kavithakal+Video',
                alt: title,
                style: { width: '100%', height: '100%', objectFit: 'cover' },
                onError: (e) => {
                    if (e.target.src.includes('maxresdefault')) {
                        e.target.src = e.target.src.replace('maxresdefault', 'mqdefault');
                    }
                }
            }),
            el('div', {
                className: 'montage-overlay',
                style: { background: 'rgba(0,0,0,0.3)' }
            },
                el('div', { className: 'play-btn-circle' },
                    el('i', { className: 'fa-solid fa-play' })
                )
            )
        ) : el(React.Fragment, null,
            isYouTube ?
                el('iframe', {
                    src: embedUrl,
                    style: { width: '100%', height: '100%', border: 'none' },
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                    allowFullScreen: true
                }) :
                el('video', {
                    ref: videoRef,
                    src: videoUrl,
                    poster: displayThumb,
                    controls: false,
                    autoPlay: true,
                    muted: isMuted,
                    className: 'full-video',
                    style: { width: '100%', height: '100%', backgroundColor: '#000' }
                }),
            
            // Custom Control Overlay
            el('div', { 
                className: 'video-custom-controls',
                style: {
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: '15px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    zIndex: 10
                }
            },
                el('button', {
                    onClick: togglePlay,
                    className: 'video-mini-btn',
                    style: { width: '36px', height: '36px' }
                }, el('i', { className: isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play' })),
                
                el('button', {
                    onClick: toggleMute,
                    className: 'video-mini-btn',
                    style: { width: '36px', height: '36px' }
                }, el('i', { className: isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high' }))
            ),

            el('button', {
                onClick: closePlayer,
                className: 'close-video-btn',
                style: {
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    zIndex: 100,
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }
            }, el('i', { className: 'fa-solid fa-xmark' }))
        )
    );
}

function AnomaliesReview() {
    const [videos, setVideos] = React.useState(window.globalAssetCache.reviewVideos || []);
    const [reviews, setReviews] = React.useState(window.globalAssetCache.reviews || []);
    const [formData, setFormData] = React.useState({ name: '', phone: '', shootType: '', stars: 0, reviewText: '' });
    const [touchStart, setTouchStart] = React.useState(null);
    const [touchEnd, setTouchEnd] = React.useState(null);
    const sliderRef = React.useRef(null);
    const [slideWidth, setSlideWidth] = React.useState(0);

    const getCardsToShow = () => {
        if (typeof window === 'undefined') return 3;
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };

    const [cardsToShow, setCardsToShow] = React.useState(getCardsToShow());
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(true);

    const updateWidth = React.useCallback(() => {
        if (sliderRef.current) {
            const viewport = sliderRef.current.parentElement;
            if (viewport) {
                const width = viewport.getBoundingClientRect().width;
                if (width > 0) {
                    if (window.innerWidth >= 1024) {
                        setSlideWidth(650 + 32); // 550px card + 32px (2rem) gap
                    } else if (window.innerWidth >= 769) {
                        setSlideWidth(width / 2);
                    } else {
                        setSlideWidth(width);
                    }
                }
            }
        }
    }, []);

    const nextSlide = React.useCallback(() => {
        if (reviews.length === 0) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    }, [reviews.length]);

    const prevSlide = React.useCallback(() => {
        if (reviews.length === 0) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev - 1);
    }, [reviews.length]);

    // Better Infinite Loop Reset
    React.useLayoutEffect(() => {
        const total = reviews.length;
        if (total === 0) return;

        // Forward Jump: If we reach the end clone set, jump back to start
        if (currentIndex >= total) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 600); // Wait for transition to finish
            return () => clearTimeout(timer);
        }
        // Backward Jump: If we go before the start, jump to the end
        if (currentIndex < 0) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(total - 1);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, reviews.length]);

    React.useEffect(() => {
        const handleResize = () => {
            setCardsToShow(getCardsToShow());
            updateWidth();
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        const timer = setTimeout(handleResize, 500);
        const timer2 = setTimeout(handleResize, 1500); // Fail-safe
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, [reviews.length, updateWidth]);

    React.useEffect(() => {
        // Fetch reviews
        fetch(`${window.API_URL}/api/reviews`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filtered = data.filter(r => r.reviewText);
                    setReviews(filtered);
                    window.globalAssetCache.reviews = filtered;
                }
            })
            .catch(err => console.error('Error fetching reviews:', err));

        // Fetch showcase videos
        fetch(`${window.API_URL}/api/review-videos`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setVideos(data);
                    window.globalAssetCache.reviewVideos = data;
                }
            })
            .catch(err => console.error('Error fetching showcase videos:', err));
    }, []);


    React.useEffect(() => {
        if (reviews.length <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide, reviews.length]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.stars === 0) {
            alert('Please select a rating!');
            return;
        }
        if (formData.phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number!');
            return;
        }
        if (!formData.shootType) {
            alert('Please select a shoot type!');
            return;
        }

        const submission = {
            ...formData,
            phone: `+91 ${formData.phone}`
        };

        fetch(`${window.API_URL}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submission)
        })
            .then(res => res.json())
            .then(() => {
                alert('Thank you for your review!');
                // Reset ALL form fields completely
                setFormData({ name: '', phone: '', shootType: '', stars: 0, reviewText: '' });

                // Refresh list from MongoDB
                return fetch(`${window.API_URL}/api/reviews`);
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filtered = data.filter(r => r.reviewText);
                    setReviews(filtered);
                    window.globalAssetCache.reviews = filtered;
                }
                setCurrentIndex(0);
                setTimeout(updateWidth, 100);
                window.scrollTo({ top: document.querySelector('.latest-reviews-display')?.offsetTop - 100, behavior: 'smooth' });
            })
            .catch(err => console.error('Error submitting review:', err));
    };

    const totalReviews = reviews.length;
    const numClones = cardsToShow; // Number of clones needed at each end

    const allReviews = React.useMemo(() => {
        if (totalReviews === 0) return [];
        if (totalReviews <= cardsToShow) return reviews; // No need for clones if reviews fit
        return [...reviews.slice(-numClones), ...reviews, ...reviews.slice(0, numClones)];
    }, [reviews, totalReviews, cardsToShow, numClones]);

    const transformValue = React.useMemo(() => {
        if (totalReviews === 0) return 'translateX(0)';
        // Adjust transform to account for leading clones
        return `translateX(-${(currentIndex + (totalReviews > cardsToShow ? numClones : 0)) * slideWidth}px)`;
    }, [currentIndex, slideWidth, totalReviews, cardsToShow, numClones]);

    return el('div', { className: 'anomalies-review-page' },


        el('div', { className: 'review-hero-section', style: { padding: '120px 8% 4rem', textAlign: 'center' } },
            el(AppleTextReveal, { text: 'Anomalies Reviews', style: { textAlign: 'center' } }),

            el('div', { className: 'review-videos-grid' },
                videos.map((vid, idx) => el(Reveal, { key: idx, animation: 'fade-up', delay: idx * 100 },
                    el(ReviewVideoCard, { 
                        videoUrl: vid.videoUrl, 
                        thumbnail: vid.thumb, 
                        title: vid.title 
                    })
                ))
            )
        ),

        el('div', { className: 'review-form-section' },
            el(AppleTextReveal, { text: 'Share Your Experience', style: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', textAlign: 'center' } }),
            el(Reveal, { animation: 'fade-up', delay: 150 },
                el('p', { className: 'review-form-subtitle' }, 'Your words inspire us — and help future couples choose the right studio.')
            ),
            el(Reveal, { animation: 'fade-up', delay: 250 },
                el('form', { className: 'customer-review-form', onSubmit: handleSubmit },

                    // Row 1: Name + Shoot Type
                    el('div', { className: 'form-group' },
                        el('label', null, el('i', { className: 'fa-solid fa-user', style: { marginRight: '8px', color: 'var(--pink-accent)' } }), 'Full Name'),
                        el('input', {
                            type: 'text',
                            required: true,
                            value: formData.name,
                            onChange: (e) => {
                                const val = e.target.value;
                                if (/^[a-zA-Z\s]*$/.test(val)) setFormData({ ...formData, name: val });
                            },
                            placeholder: 'Enter your name'
                        })
                    ),
                    el('div', { className: 'form-group' },
                        el('label', null, el('i', { className: 'fa-solid fa-camera', style: { marginRight: '8px', color: 'var(--pink-accent)' } }), 'Shoot Type'),
                        el(PremiumDropdown, {
                            placeholder: 'Select Shoot Type',
                            value: formData.shootType,
                            options: [
                                { label: 'Wedding', value: 'Wedding' },
                                { label: 'Post-Wedding', value: 'Post-Wedding' },
                                { label: 'Pre-Wedding', value: 'Pre-Wedding' },
                                { label: 'Portrait', value: 'Portrait' },
                                { label: 'Engagement', value: 'Engagement' },
                                { label: 'Model Shoot', value: 'Model Shoot' },
                                { label: 'Maternity', value: 'Maternity' },
                                { label: 'Birthday', value: 'Birthday' },
                                { label: 'Other', value: 'Other' }
                            ],
                            onChange: (val) => setFormData({ ...formData, shootType: val })
                        })
                    ),

                    // New Row: Phone Number
                    el('div', { className: 'form-group', style: { gridColumn: 'span 2' } },
                        el('label', null, el('i', { className: 'fa-solid fa-phone', style: { marginRight: '8px', color: 'var(--pink-accent)' } }), 'Phone Number'),
                        el('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } },
                            el('span', { style: { fontWeight: '600', color: '#666' } }, '+91'),
                            el('input', {
                                type: 'text',
                                required: true,
                                value: formData.phone,
                                onChange: (e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setFormData({ ...formData, phone: val });
                                },
                                placeholder: '10-digit mobile number',
                                style: { flex: 1 }
                            })
                        )
                    ),

                    // Row 2: Star Rating (full width)
                    el('div', { className: 'form-group', style: { gridColumn: 'span 2' } },
                        el('label', null, el('i', { className: 'fa-solid fa-star', style: { marginRight: '8px', color: '#FFD700' } }), 'Your Rating'),
                        el('div', { className: 'star-rating-input', style: { display: 'flex', gap: '10px', fontSize: '1.5rem', marginTop: '10px' } },
                            [1, 2, 3, 4, 5].map(s => el('i', {
                                key: s,
                                className: `fa-star ${s <= formData.stars ? 'fa-solid' : 'fa-regular'}`,
                                onClick: () => setFormData({ ...formData, stars: s }),
                                style: {
                                    cursor: 'pointer',
                                    color: s <= formData.stars ? '#FFD700' : '#d1d1d6',
                                    transition: 'color 0.2s ease'
                                }
                            }))
                        )
                    ),

                    // Row 3: Review Textarea (full width)
                    el('div', { className: 'form-group', style: { gridColumn: 'span 2' } },
                        el('label', null, el('i', { className: 'fa-solid fa-pen-nib', style: { marginRight: '8px', color: 'var(--pink-accent)' } }), 'Your Review'),
                        el('textarea', {
                            required: true,
                            rows: 5,
                            value: formData.reviewText,
                            onChange: (e) => setFormData({ ...formData, reviewText: e.target.value }),
                            placeholder: 'Tell us about your experience with Kavithaigal Studio — what made it special?'
                        })
                    ),

                    // Submit Button (full width)
                    el('button', { type: 'submit', className: 'submit-review-btn' },
                        el('i', { className: 'fa-solid fa-paper-plane', style: { marginRight: '10px' } }),
                        'Submit My Review'
                    )
                )
            )
        ),

        reviews.length > 0 && el('div', { className: 'latest-reviews-display', style: { padding: '6rem 0' } },
            el(AppleTextReveal, { text: 'What Our Clients Say', highlightIndices: [0, 2], style: { textAlign: 'center', marginBottom: '4rem' } }),
            el('div', { className: 'reviews-carousel-wrapper', style: { width: '100%', overflow: 'hidden' } },
                el('div', {
                    className: 'reviews-viewport',
                    style: { width: '100%', overflow: 'hidden', minHeight: '400px' },
                    onTouchStart: (e) => setTouchStart(e.targetTouches[0].clientX),
                    onTouchMove: (e) => setTouchEnd(e.targetTouches[0].clientX),
                    onTouchEnd: () => {
                        if (!touchStart || !touchEnd) return;
                        const distance = touchStart - touchEnd;
                        if (distance > 50) nextSlide();
                        if (distance < -50) prevSlide();
                        setTouchStart(null);
                        setTouchEnd(null);
                    }
                },
                    el('div', {
                        ref: sliderRef,
                        className: 'reviews-slider',
                        style: {
                            display: 'flex',
                            width: 'max-content',
                            transform: transformValue,
                            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                            willChange: 'transform'
                        }
                    },
                        allReviews.map((rev, idx) => el('div', {
                            key: `rev-card-${idx}`,
                            style: {
                                width: slideWidth > 0 ? `${slideWidth}px` : '100vw',
                                flexShrink: 0,
                                padding: '0 20px',
                                boxSizing: 'border-box'
                            }
                        },
                            el('div', {
                                className: 'review-card',
                                style: {
                                    width: '100%',
                                    minWidth: 'auto',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '3rem 2rem',
                                    borderRadius: '40px',
                                    border: '2px solid transparent',
                                    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #c961e6 0%, #6f25e9 100%)',
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'padding-box, border-box',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                                }
                            },
                                el('i', {
                                    className: 'fa-solid fa-quote-left',
                                    style: { color: 'rgba(255, 45, 108, 0.2)', fontSize: '2.5rem', marginBottom: '1.5rem' }
                                }),
                                el('div', { className: 'review-stars', style: { marginBottom: '1.5rem' } },
                                    Array(5).fill(0).map((_, i) => el('i', {
                                        key: i,
                                        className: `fa-star ${i < rev.stars ? 'fa-solid' : 'fa-regular'}`,
                                        style: { color: '#FFD700' }
                                    }))
                                ),
                                el('p', { className: 'review-text', style: { fontSize: '1.1rem', lineHeight: '1.6', color: '#555', marginBottom: '2rem' } }, `"${rev.reviewText}"`),
                                el('div', { className: 'review-author', style: { marginTop: '0' } },
                                    el('h4', { style: { fontSize: '1.4rem', color: '#333', marginBottom: '0.4rem', fontWeight: '700' } }, rev.name),
                                    el('span', { style: { color: '#999', fontSize: '1rem', fontWeight: '500' } }, 'Happy Client')
                                )
                            )
                        ))
                    )
                ),
                // Optimized Pagination Dots
                el('div', {
                    className: 'reviews-dots',
                    style: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '3rem' }
                },
                    reviews.map((_, i) => {
                        let isActive = (currentIndex % reviews.length) === i;
                        if (currentIndex < 0) isActive = ((currentIndex % reviews.length) + reviews.length) % reviews.length === i;

                        return el('div', {
                            key: i,
                            onClick: () => {
                                setIsTransitioning(true);
                                setCurrentIndex(i);
                            },
                            style: {
                                width: isActive ? '12px' : '8px',
                                height: isActive ? '12px' : '8px',
                                borderRadius: '50%',
                                backgroundColor: isActive ? 'var(--pink-accent)' : '#e0e0e0',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }
                        });
                    })
                )
            )
        )
    );
}

function Contact() {
    const [info, setInfo] = React.useState(null);

    React.useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`${window.API_URL}/api/contact-info`)
            .then(res => res.json())
            .then(data => setInfo(data))
            .catch(err => console.error('Error fetching contact info:', err));
    }, []);

    const phone1 = info ? info.phone1 : '+91 93846 84082';
    const phone2 = info ? info.phone2 : '';
    const email = info ? info.email : 'kavithaigalstudio@gmail.com';
    const address = info ? info.address : 'Tamil Nadu, India';
    const instagram = info ? info.instagram : 'https://www.instagram.com/kavithaigal_studio';
    const whatsapp = info ? info.whatsapp : 'https://wa.me/919384684082';
    const mapsUrl = info ? info.mapsUrl : '';
    const workingHours = info ? info.workingHours : 'Mon – Sat: 9 AM – 7 PM';

    return el('div', { className: 'contact-page' },

        // Hero
        el('div', { className: 'contact-hero', style: { textAlign: 'center', padding: '120px 8% 60px' } },
            el(AppleTextReveal, { text: 'Get In Touch' }),
            el(Reveal, { animation: 'fade-up', delay: 150 },
                el('p', { style: { fontSize: '1.2rem', color: '#666', marginTop: '1.5rem' } }, 'We would love to hear from you. Reach out to book a shoot or just say hello!')
            )
        ),

        // Cards grid
        el('div', { className: 'contact-cards-grid' },

            // Row 1: Phones (2 columns or 1 if phone2 missing)
            el(Reveal, { animation: 'fade-up', delay: 0, className: phone2 ? 'span-3' : 'span-6' },
                el('a', { href: `tel:${phone1.replace(/\s/g, '')}`, className: 'contact-card' },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#ff2d6c,#c961e6)' } },
                        el('i', { className: 'fa-solid fa-phone' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Primary Phone'),
                        el('p', null, phone1 || '—')
                    )
                )
            ),

            phone2 && el(Reveal, { animation: 'fade-up', delay: 100, className: 'span-3' },
                el('a', { href: `tel:${phone2.replace(/\s/g, '')}`, className: 'contact-card' },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#e056fd,#686de0)' } },
                        el('i', { className: 'fa-solid fa-phone-volume' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Secondary Phone'),
                        el('p', null, phone2)
                    )
                )
            ),

            // Row 2: Digital (3 columns)
            el(Reveal, { animation: 'fade-up', delay: 200, className: 'span-2' },
                el('a', { href: `mailto:${email}`, className: 'contact-card' },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#f7971e,#ffd200)' } },
                        el('i', { className: 'fa-solid fa-envelope' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Email'),
                        el('p', null, email || 'kavithaigalstudio@gmail.com')
                    )
                )
            ),

            el(Reveal, { animation: 'fade-up', delay: 300, className: 'span-2' },
                el('a', { href: whatsapp, target: '_blank', rel: 'noreferrer', className: 'contact-card' },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#11998e,#38ef7d)' } },
                        el('i', { className: 'fa-brands fa-whatsapp' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'WhatsApp'),
                        el('p', null, 'Chat with us now')
                    )
                )
            ),

            el(Reveal, { animation: 'fade-up', delay: 400, className: 'span-2' },
                el('a', { href: instagram, target: '_blank', rel: 'noreferrer', className: 'contact-card' },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' } },
                        el('i', { className: 'fa-brands fa-instagram' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Instagram'),
                        el('p', null, '@kavithaigal_studio')
                    )
                )
            ),

            // Row 3: Info (2 columns)
            el(Reveal, { animation: 'fade-up', delay: 500, className: 'span-3' },
                el('div', { className: 'contact-card' },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#4e54c8,#8f94fb)' } },
                        el('i', { className: 'fa-solid fa-clock' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Working Hours'),
                        el('p', null, workingHours || 'Mon – Sat: 9 AM – 7 PM')
                    )
                )
            ),

            el(Reveal, { animation: 'fade-up', delay: 600, className: 'span-3' },
                el('div', { className: 'contact-card' },
                    el('div', { className: 'contact-card-icon', style: { background: 'linear-gradient(135deg,#ff416c,#ff4b2b)' } },
                        el('i', { className: 'fa-solid fa-location-dot' })
                    ),
                    el('div', { className: 'contact-card-body' },
                        el('h4', null, 'Address'),
                        el('p', null, address || 'Tamil Nadu, India'),
                        mapsUrl && el('a', { href: mapsUrl, target: '_blank', rel: 'noreferrer', className: 'contact-maps-link' },
                            el('i', { className: 'fa-solid fa-map' }), ' View on Maps'
                        )
                    )
                )
            )
        )
    );
}

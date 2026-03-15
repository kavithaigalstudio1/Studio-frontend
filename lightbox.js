function Lightbox({ images, activeIndex, onClose, onNext, onPrev }) {
    // Add keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose, onNext, onPrev]);

    // Swipe support for mobile
    const touchStartX = React.useRef(null);
    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) onNext();
            else onPrev();
        }
        touchStartX.current = null;
    };

    const lightboxContent = el('div', {
        className: 'lightbox-overlay',
        onClick: onClose,
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd
    },
        el('button', { className: 'lightbox-close', onClick: (e) => { e.stopPropagation(); onClose(); } },
            el('i', { className: 'fa-solid fa-xmark' })
        ),
        el('button', {
            className: 'lightbox-nav lightbox-prev',
            onClick: (e) => { e.stopPropagation(); onPrev(); }
        }, el('i', { className: 'fa-solid fa-chevron-left' })),
        el('div', { className: 'lightbox-content', onClick: (e) => e.stopPropagation() },
            el('img', {
                src: images[activeIndex],
                alt: 'Full screen image',
                className: 'lightbox-image'
            })
        ),
        el('button', {
            className: 'lightbox-nav lightbox-next',
            onClick: (e) => { e.stopPropagation(); onNext(); }
        }, el('i', { className: 'fa-solid fa-chevron-right' })),
        el('div', { className: 'lightbox-counter' },
            `${activeIndex + 1} / ${images.length}`
        )
    );

    // Use Portal to render at document.body level
    // This bypasses any CSS transform stacking context from parent containers
    return ReactDOM.createPortal(lightboxContent, document.body);
}

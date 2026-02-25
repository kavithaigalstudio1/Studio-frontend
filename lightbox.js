function Lightbox({ images, activeIndex, onClose, onNext, onPrev }) {
    // Add keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev]);

    return el('div', { className: 'lightbox-overlay', onClick: onClose },
        el('button', { className: 'lightbox-close', onClick: onClose }, el('i', { className: 'fa-solid fa-xmark' })),
        el('button', { className: 'lightbox-nav lightbox-prev', onClick: (e) => { e.stopPropagation(); onPrev(); } }, el('i', { className: 'fa-solid fa-chevron-left' })),
        el('div', { className: 'lightbox-content', onClick: (e) => e.stopPropagation() },
            el('img', { src: images[activeIndex], alt: 'Full screen gallery image', className: 'lightbox-image' })
        ),
        el('button', { className: 'lightbox-nav lightbox-next', onClick: (e) => { e.stopPropagation(); onNext(); } }, el('i', { className: 'fa-solid fa-chevron-right' }))
    );
}

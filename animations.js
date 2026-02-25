// animations.js
const el = React.createElement;

function useScrollReveal() {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return [ref, isVisible];
}

function Reveal({ children, className = '', animation = 'fade-up', delay = 0 }) {
    const [ref, isVisible] = useScrollReveal();

    return el('div', {
        ref: ref,
        className: `reveal ${animation} ${isVisible ? 'active' : ''} ${className}`,
        style: {
            transitionDelay: `${delay}ms`,
            transitionDuration: '0.8s',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }
    }, children);
}

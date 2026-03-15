// animations.js
// Apple-style GSAP Reveals

(function () {
    const el = window.el || React.createElement;

    // Register GSAP plugins if available
    window.addEventListener('load', () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            console.log('GSAP & ScrollTrigger registered');
        }
    });

    /**
     * AppleTextReveal Component
     * Ultra-smooth per-word animation (No shake, pure transform).
     */
    function AppleTextReveal({ text, style = {}, delay = 200, highlightIndices = [0], highlightColor = 'var(--pink-accent)' }) {
        const textRef = React.useRef(null);

        React.useEffect(() => {
            if (!textRef.current || typeof gsap === 'undefined') return;
            const words = textRef.current.querySelectorAll(".word");

            gsap.fromTo(
                words,
                { y: 24, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.1,
                    stagger: 0.06,
                    ease: "cubic-bezier(0.22, 1, 0.36, 1)", // Apple curve
                    force3D: true, // GPU only
                    delay: delay / 1000,
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: "top 95%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }, [text, delay]);

        const words = text.split(" ");
        const indices = Array.isArray(highlightIndices) ? highlightIndices : [highlightIndices];

        return el('h1', { ref: textRef, style: { color: '#1d1d1f', ...appleTextStyles.title, ...style } },
            words.map((word, i) =>
                el('span', {
                    key: i,
                    className: "word",
                    style: {
                        ...appleTextStyles.word,
                        color: indices.includes(i) ? highlightColor : 'inherit'
                    }
                }, word, '\u00A0')
            )
        );
    }

    const appleTextStyles = {
        title: {
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            fontSize: "clamp(3.5rem, 8vw, 6rem)",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-2px",
            margin: "0 0 1.5rem 0"
        },
        word: {
            display: "inline-block",
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            marginRight: "0.2rem"
        }
    };

    window.AppleTextReveal = AppleTextReveal;

    /**
     * Reveal Component
     * Uses GSAP + ScrollTrigger for premium Apple-style entries.
     */
    function Reveal({ children, animation = 'fade-up', delay = 0, duration = 0.7, className = '', style = {} }) {
        const domRef = React.useRef(null);
        const [isVisible, setIsVisible] = React.useState(false);

        React.useEffect(() => {
            if (typeof gsap === 'undefined' || !domRef.current || isVisible) return;

            const element = domRef.current;

            let fromVars = { opacity: 0, force3D: true };
            let toVars = {
                opacity: 1,
                duration: duration,
                ease: "cubic-bezier(0.22, 1, 0.36, 1)", // Global Apple curve
                delay: delay / 1000,
                force3D: true,
                scrollTrigger: {
                    trigger: element,
                    start: "top 98%",
                    toggleActions: "play none none none",
                    onEnter: () => setIsVisible(true), // Lock visibility once seen
                    onEnterBack: () => {
                        // Immediately show without animation when scrolling UP
                        setIsVisible(true);
                        gsap.set(element, { opacity: 1, y: 0, x: 0, scale: 1 });
                    }
                }
            };

            if (animation === 'fade-up') {
                fromVars.y = 24; // Smaller movement per user request
                toVars.y = 0;
            } else if (animation === 'fade-right') {
                fromVars.x = -24;
                toVars.x = 0;
            } else if (animation === 'fade-left') {
                fromVars.x = 24;
                toVars.x = 0;
            } else if (animation === 'zoom-in') {
                fromVars.scale = 0.98;
                toVars.scale = 1;
            }

            const anim = gsap.fromTo(element, fromVars, toVars);

            return () => {
                if (anim.scrollTrigger) anim.scrollTrigger.kill();
                anim.kill();
            };
        }, [animation, delay, isVisible]);

        return el('div', {
            ref: domRef,
            className: `reveal ${isVisible ? 'revealed' : ''} ${className}`,
            style: {
                ...style,
                opacity: isVisible ? 1 : 0, // Ensure NO flickering state change
                willChange: isVisible ? 'auto' : 'transform, opacity'
            }
        }, children);
    }

    // Export globally
    window.Reveal = Reveal;

    /**
     * useParallax Hook
     * For small parallax elements as requested.
     */
    function useParallax(ref, speed = -50) {
        React.useEffect(() => {
            if (typeof gsap === 'undefined' || !ref.current) return;

            const tl = gsap.to(ref.current, {
                y: speed,
                ease: "none",
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });

            return () => {
                if (tl.scrollTrigger) tl.scrollTrigger.kill();
                tl.kill();
            };
        }, [ref, speed]);
    }

    window.useParallax = useParallax;

})();

// Enhanced Portfolio JavaScript - Modern 2024/2025 Functionality

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileNav();
        this.setupScrollAnimations();
        this.setupPetalAnimation();
        this.setupSmoothScrolling();
        this.setupNavigationEffects();
        this.setupPerformanceOptimizations();
    }

    // Mobile Navigation
    setupMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu
            navMenu.classList.toggle('nav__menu--active');
            navToggle.classList.toggle('nav__toggle--active');
            
            // Update ARIA attributes
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
        });

        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--active')) {
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
                navToggle.focus();
            }
        });
    }

    // Scroll Animations using Intersection Observer
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in-view');
                }
            });
        }, observerOptions);

        // Observe animated elements
        const animatedElements = document.querySelectorAll('.animate-fade-up');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });

        // Enhanced hover effects for interactive elements
        this.setupHoverEffects();
    }

    // Enhanced hover effects
    setupHoverEffects() {
        // Hero image parallax effect
        const heroImg = document.querySelector('.hero__img');
        if (heroImg) {
            heroImg.addEventListener('mousemove', (e) => {
                const rect = heroImg.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                heroImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });

            heroImg.addEventListener('mouseleave', () => {
                heroImg.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        }

        // Enhanced paragraph hover effects
        const paragraphs = document.querySelectorAll('.about__paragraph');
        paragraphs.forEach(paragraph => {
            paragraph.addEventListener('mouseenter', () => {
                paragraph.style.transform = 'translateX(12px)';
                paragraph.style.color = 'var(--color-primary)';
            });

            paragraph.addEventListener('mouseleave', () => {
                paragraph.style.transform = 'translateX(0)';
                paragraph.style.color = 'var(--color-text-primary)';
            });
        });

        // Footer social links enhanced animation
        const socialLinks = document.querySelectorAll('.footer__social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-4px) scale(1.05)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Petal Animation
    setupPetalAnimation() {
        const petalsContainer = document.getElementById('petals');
        if (!petalsContainer) return;

        const createPetal = () => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            
            // Random positioning and styling
            const size = Math.random() * 8 + 4; // 4-12px
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2; // 2-5s
            const delay = Math.random() * 2; // 0-2s delay
            const opacity = Math.random() * 0.6 + 0.2; // 0.2-0.8
            
            petal.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                animation-duration: ${animationDuration}s;
                animation-delay: ${delay}s;
                opacity: ${opacity};
                background: hsl(${Math.random() * 20 + 340}, 70%, 65%);
            `;
            
            petalsContainer.appendChild(petal);
            
            // Remove petal after animation
            setTimeout(() => {
                if (petalsContainer.contains(petal)) {
                    petalsContainer.removeChild(petal);
                }
            }, (animationDuration + delay) * 1000);
        };

        // Create initial petals
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createPetal(), i * 300);
        }

        // Continuously create new petals
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                createPetal();
            }
        }, 800);
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Navigation effects on scroll
    setupNavigationEffects() {
        const nav = document.querySelector('.nav');
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNav = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = '0 2px 20px rgba(58, 44, 43, 0.1)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.9)';
                nav.style.boxShadow = 'none';
            }

            // Hide/show nav on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const requestNavUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestNavUpdate, { passive: true });
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        const images = document.querySelectorAll('img[src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '0';
                    
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        img.style.opacity = '1';
                    };
                    tempImg.src = img.src;
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Optimize animations based on device performance
        const isLowPerformanceDevice = () => {
            return navigator.hardwareConcurrency < 4 || 
                   navigator.deviceMemory < 4 ||
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };

        if (isLowPerformanceDevice()) {
            document.documentElement.style.setProperty('--duration-normal', '150ms');
            document.documentElement.style.setProperty('--duration-slow', '250ms');
        }

        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            const petals = document.querySelectorAll('.petal');
            if (document.visibilityState === 'hidden') {
                petals.forEach(petal => {
                    petal.style.animationPlayState = 'paused';
                });
            } else {
                petals.forEach(petal => {
                    petal.style.animationPlayState = 'running';
                });
            }
        });

        // Preload critical resources
        this.preloadCriticalResources();
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalImages = [
            'https://i.imgur.com/jnn8GPn.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Utility method for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility method for throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Handle page refresh and back/forward navigation
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Reset any animations or states that might be cached
        const animatedElements = document.querySelectorAll('.animate-fade-up');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = null;
        });
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Skip to main content with Tab
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const mainContent = document.querySelector('.main');
        if (mainContent) {
            mainContent.focus();
        }
    }
});

// Add reduced motion support
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const handleReducedMotion = (e) => {
    if (e.matches) {
        document.documentElement.style.setProperty('--duration-fast', '0ms');
        document.documentElement.style.setProperty('--duration-normal', '0ms');
        document.documentElement.style.setProperty('--duration-slow', '0ms');
    }
};

mediaQuery.addListener(handleReducedMotion);
handleReducedMotion(mediaQuery);

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}

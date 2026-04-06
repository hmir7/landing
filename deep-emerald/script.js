/**
 * LUMINA - Premium Light Theme JavaScript
 * Modern SaaS Landing Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initParallax();
    initScrollAnimations();
    initSmoothScroll();
    initFormHandler();
});

/**
 * Navbar scroll effect
 * Adds 'scrolled' class when page is scrolled
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
}

/**
 * Mobile menu toggle
 * Handles burger button and menu open/close
 */
function initMobileMenu() {
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!burger || !navMenu) return;

    // Toggle menu on burger click
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !burger.contains(e.target)
        ) {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Parallax effect for hero image
 * Smooth parallax scrolling using requestAnimationFrame
 */
function initParallax() {
    const parallaxImage = document.getElementById('parallax-image');
    const parallaxImg = parallaxImage?.querySelector('.parallax-img');
    
    if (!parallaxImage || !parallaxImg) return;

    let ticking = false;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        
        if (!heroSection) {
            ticking = false;
            return;
        }
        
        const heroTop = heroSection.offsetTop;
        const heroHeight = heroSection.offsetHeight;
        
        // Only apply parallax when hero is in view
        if (scrolled < heroTop + heroHeight) {
            const parallaxSpeed = 0.5;
            const offset = scrolled * parallaxSpeed;
            
            // Apply transform to image
            parallaxImg.style.transform = `translateY(${offset * 0.3}px)`;
            
            // Animate floating cards with different speeds
            const card1 = parallaxImage.querySelector('.card-1');
            const card2 = parallaxImage.querySelector('.card-2');
            
            if (card1) {
                card1.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            if (card2) {
                card2.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
        }
        
        ticking = false;
    };

    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
}

/**
 * Scroll animations using Intersection Observer
 * Reveals elements with 'hidden' class when they enter viewport
 */
function initScrollAnimations() {
    const hiddenElements = document.querySelectorAll('.hidden');
    
    if (!hiddenElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before element is fully visible
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Optional: Stop observing once shown
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    hiddenElements.forEach(el => observer.observe(el));
}

/**
 * Smooth scrolling for anchor links
 * Native smooth scroll with fallback
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form submission handler
 * Prevents default submission and shows success message
 */
function initFormHandler() {
    const form = document.getElementById('cta-form');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('.form-input');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!emailInput || !submitButton) return;
        
        const email = emailInput.value.trim();
        
        // Basic email validation
        if (!isValidEmail(email)) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            emailInput.focus();
            return;
        }
        
        // Simulate form submission
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite;">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-opacity="0.3"/>
                <path d="M18 10A8 8 0 0 1 10 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Отправка...
        `;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
        
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    });
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Notification system
 * Shows toast notifications
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${type === 'success' ? 
                '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
                type === 'error' ?
                '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 6.667L13.333 10M13.333 6.667L10 10M10 10L6.667 13.333M10 10L6.667 6.667" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/></svg>' :
                '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/><path d="M10 7V10M10 13H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
            }
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6366F1'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 15px;
        font-weight: 500;
    `;
    
    // Add animation styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add spin animation for loading states
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
if (!document.querySelector('#spin-styles')) {
    spinStyle.id = 'spin-styles';
    document.head.appendChild(spinStyle);
}

/**
 * Performance optimization: Lazy load images
 * Uses native lazy loading with Intersection Observer fallback
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers without native support
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
initLazyLoading();

/**
 * Handle resize events with debounce
 * Optimizes performance by limiting resize handler calls
 */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Re-initialize components that need resize handling
        // Currently handled by CSS media queries
    }, 250);
}, { passive: true });

console.log('🚀 Lumina initialized successfully!');

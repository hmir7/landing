/**
 * NEXUS PREMIUM LANDING PAGE SCRIPTS
 * Функционал: Параллакс, Анимации скролла, Мобильное меню, Sticky Navbar
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. STICKY NAVBAR EFFECT ---
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });


    // --- 2. MOBILE MENU TOGGLE ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .btn-nav');
    
    // Открытие/закрытие меню
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    // --- 3. SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---
    const hiddenElements = document.querySelectorAll('.hidden-element');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Элемент должен появиться на 100px выше низа экрана
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем задержку если указан атрибут data-delay
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, delay);
                
                observer.unobserve(entry.target); // Анимируем только один раз
            }
        });
    }, observerOptions);
    
    hiddenElements.forEach(el => observer.observe(el));


    // --- 4. PARALLAX EFFECT ---
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    const handleParallax = () => {
        const scrollY = window.scrollY;
        
        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed') || 0.05;
            const yPos = -(scrollY * speed);
            
            // Применяем трансформацию только если элемент в поле зрения для оптимизации
            const rect = layer.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                layer.style.transform = `translateY(${yPos}px)`;
            }
        });
    };
    
    window.addEventListener('scroll', handleParallax, { passive: true });


    // --- 5. SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 6. MICRO-INTERACTIONS (BUTTON HOVER GLOW) ---
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--x', `${x}px`);
            btn.style.setProperty('--y', `${y}px`);
        });
    });


    // --- 7. PERFORMANCE OPTIMIZATION ---
    // Debounce функция для тяжелых операций при ресайзе
    function debounce(func, wait) {
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
    
    // Пример использования при изменении размера окна
    window.addEventListener('resize', debounce(() => {
        // Здесь можно добавить логику пересчета позиций если нужно
        console.log('Window resized');
    }, 250));

});

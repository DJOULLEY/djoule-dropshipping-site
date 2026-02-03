// DJOULE DROPSHIPPING - Fichier JavaScript pour les Animations
// Animations avancées et effets visuels

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialiser toutes les animations
    initCounters();
    initParticles();
    initParallax();
    initTypingAnimation();
    initScrollReveal();
    initHoverEffects();
    initMasonry();
    initTimelineAnimation();
    initProgressBars();
    
    /**
     * Animation des compteurs
     */
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
                
                // Add suffix if exists
                const suffix = element.getAttribute('data-suffix');
                if (suffix) {
                    element.textContent += suffix;
                }
            }
        };
        
        updateCounter();
    }
    
    /**
     * Animation de particules en arrière-plan
     */
    function initParticles() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        
        document.body.insertBefore(canvas, document.body.firstChild);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off walls
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#F59E0B';
                ctx.fill();
            });
            
            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(245, 158, 11, ${1 - distance / 100})`;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Resize on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    /**
     * Effet parallaxe
     */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', DjouleUtils.debounce(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-parallax') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 10));
    }
    
    /**
     * Animation de frappe
     */
    function initTypingAnimation() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.getAttribute('data-typing');
            const speed = parseInt(element.getAttribute('data-speed')) || 100;
            let index = 0;
            
            element.textContent = '';
            
            function type() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                }
            }
            
            // Start typing when element is visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    type();
                    observer.disconnect();
                }
            });
            
            observer.observe(element);
        });
    }
    
    /**
     * Révélation au scroll
     */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    const direction = entry.target.getAttribute('data-direction') || 'up';
                    
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                        
                        // Add animation class based on direction
                        switch (direction) {
                            case 'up':
                                entry.target.classList.add('reveal-up');
                                break;
                            case 'left':
                                entry.target.classList.add('reveal-left');
                                break;
                            case 'right':
                                entry.target.classList.add('reveal-right');
                                break;
                            case 'down':
                                entry.target.classList.add('reveal-down');
                                break;
                        }
                    }, delay);
                    
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.classList.add('reveal-element');
            revealObserver.observe(element);
        });
    }
    
    /**
     * Effets au survol
     */
    function initHoverEffects() {
        // 3D card effect
        const cards3D = document.querySelectorAll('.card-3d');
        
        cards3D.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
        
        // Magnetic button effect
        const magneticButtons = document.querySelectorAll('.btn-magnetic');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
        
        // Glow effect on hover
        const glowElements = document.querySelectorAll('.glow-hover');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
            });
        });
    }
    
    /**
     * Layout Masonry pour les galeries
     */
    function initMasonry() {
        const masonryGrids = document.querySelectorAll('.masonry-grid');
        
        masonryGrids.forEach(grid => {
            const items = grid.querySelectorAll('.masonry-item');
            const columnWidth = grid.getAttribute('data-column-width') || 300;
            const gap = grid.getAttribute('data-gap') || 20;
            
            // Simple masonry implementation
            const columns = Math.floor(grid.offsetWidth / (columnWidth + gap));
            const columnHeights = new Array(columns).fill(0);
            
            items.forEach(item => {
                const minHeightColumn = columnHeights.indexOf(Math.min(...columnHeights));
                const x = minHeightColumn * (columnWidth + gap);
                const y = columnHeights[minHeightColumn];
                
                item.style.position = 'absolute';
                item.style.left = `${x}px`;
                item.style.top = `${y}px`;
                item.style.width = `${columnWidth}px`;
                
                // Update column height
                const itemHeight = item.offsetHeight + gap;
                columnHeights[minHeightColumn] += itemHeight;
            });
            
            // Set grid height
            const maxHeight = Math.max(...columnHeights);
            grid.style.height = `${maxHeight}px`;
            grid.style.position = 'relative';
        });
        
        // Reorganize on window resize
        window.addEventListener('resize', DjouleUtils.debounce(() => {
            initMasonry();
        }, 250));
    }
    
    /**
     * Animation de timeline
     */
    function initTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(timelineItems).indexOf(entry.target);
                    const delay = index * 200;
                    
                    setTimeout(() => {
                        entry.target.classList.add('timeline-active');
                        
                        // Animate the line
                        const line = entry.target.querySelector('.timeline-line');
                        if (line) {
                            line.style.width = '100%';
                        }
                    }, delay);
                    
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        timelineItems.forEach(item => {
            const line = item.querySelector('.timeline-line');
            if (line) {
                line.style.width = '0';
                line.style.transition = 'width 0.6s ease';
            }
            timelineObserver.observe(item);
        });
    }
    
    /**
     * Animation des barres de progression
     */
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-animated');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    
                    const bar = entry.target.querySelector('.progress-bar');
                    const target = bar.getAttribute('aria-valuenow');
                    
                    setTimeout(() => {
                        bar.style.width = `${target}%`;
                        bar.style.transition = 'width 2s ease';
                    }, 200);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => progressObserver.observe(bar));
    }
    
    /**
     * Animation de vagues pour les héros
     */
    function initWaveAnimation() {
        const waveContainers = document.querySelectorAll('.wave-hero');
        
        waveContainers.forEach(container => {
            const wave = document.createElement('div');
            wave.className = 'wave';
            wave.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100px;
                background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg"><path fill="%231E3A8A" fill-opacity="0.3" d="M0,50 C320,100 420,0 740,50 C1060,100 1120,0 1440,50 L1440,100 L0,100 Z"></path></svg>');
                background-size: cover;
                animation: wave 10s linear infinite;
            `;
            
            container.appendChild(wave);
        });
    }
    
    /**
     * Effet de néon
     */
    function initNeonEffect() {
        const neonElements = document.querySelectorAll('.neon');
        
        neonElements.forEach(element => {
            element.style.animation = 'neon 2s ease-in-out infinite alternate';
        });
    }
    
    /**
     * Animation de texte glitch
     */
    function initGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animation = 'glitch 0.3s';
                
                setTimeout(() => {
                    element.style.animation = '';
                }, 300);
            });
        });
    }
    
    // Add CSS for animations
    const animationCSS = `
        /* Reveal animations */
        .reveal-element {
            transition: all 0.6s ease;
        }
        
        .reveal-element.revealed {
            opacity: 1 !important;
        }
        
        .reveal-element.revealed.reveal-up {
            transform: translateY(0);
        }
        
        .reveal-element.revealed.reveal-left {
            transform: translateX(0);
        }
        
        .reveal-element.revealed.reveal-right {
            transform: translateX(0);
        }
        
        .reveal-element.revealed.reveal-down {
            transform: translateY(0);
        }
        
        .reveal-element:not(.revealed).reveal-up {
            transform: translateY(30px);
        }
        
        .reveal-element:not(.revealed).reveal-left {
            transform: translateX(-30px);
        }
        
        .reveal-element:not(.revealed).reveal-right {
            transform: translateX(30px);
        }
        
        .reveal-element:not(.revealed).reveal-down {
            transform: translateY(-30px);
        }
        
        /* Timeline animations */
        .timeline-item {
            position: relative;
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.6s ease;
        }
        
        .timeline-item.timeline-active {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Wave animation */
        @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        
        /* Neon animation */
        @keyframes neon {
            0% { text-shadow: 0 0 10px #F59E0B, 0 0 20px #F59E0B, 0 0 30px #F59E0B; }
            50% { text-shadow: 0 0 20px #F59E0B, 0 0 30px #F59E0B, 0 0 40px #F59E0B; }
            100% { text-shadow: 0 0 10px #F59E0B, 0 0 20px #F59E0B, 0 0 30px #F59E0B; }
        }
        
        /* Glitch animation */
        @keyframes glitch {
            0% { text-shadow: 2px 2px 0 red, -2px -2px 0 blue; }
            25% { text-shadow: -2px 2px 0 red, 2px -2px 0 blue; }
            50% { text-shadow: 2px -2px 0 red, -2px 2px 0 blue; }
            75% { text-shadow: -2px -2px 0 red, 2px 2px 0 blue; }
            100% { text-shadow: 2px 2px 0 red, -2px -2px 0 blue; }
        }
        
        /* Pulse animation */
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 2s ease-in-out infinite;
        }
        
        /* Float animation */
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        
        .float {
            animation: float 3s ease-in-out infinite;
        }
        
        /* Bounce animation */
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-30px); }
            60% { transform: translateY(-15px); }
        }
        
        .bounce {
            animation: bounce 2s ease-in-out infinite;
        }
        
        /* Rotate animation */
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .rotate {
            animation: rotate 2s linear infinite;
        }
        
        /* Shake animation for error states */
        @keyframes shakeError {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .shake {
            animation: shakeError 0.5s ease-in-out;
        }
        
        /* Loading spinner */
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: var(--blue-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        /* Progress bar animation */
        .progress-bar {
            transition: width 2s ease;
        }
        
        /* Hover glow */
        .hover-glow:hover {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }
        
        /* Magnetic button animation */
        .btn-magnetic {
            transition: transform 0.2s ease;
        }
        
        /* 3D card animation */
        .card-3d {
            transition: transform 0.1s ease;
            transform-style: preserve-3d;
        }
        
        /* Floating elements */
        .floating {
            animation: float 3s ease-in-out infinite;
        }
        
        .floating-delayed {
            animation: float 3s ease-in-out infinite;
            animation-delay: 1s;
        }
        
        /* Stagger animation */
        .stagger > * {
            opacity: 0;
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .stagger > *:nth-child(1) { animation-delay: 0.1s; }
        .stagger > *:nth-child(2) { animation-delay: 0.2s; }
        .stagger > *:nth-child(3) { animation-delay: 0.3s; }
        .stagger > *:nth-child(4) { animation-delay: 0.4s; }
        .stagger > *:nth-child(5) { animation-delay: 0.5s; }
    `;
    
    // Add CSS to document
    const style = document.createElement('style');
    style.textContent = animationCSS;
    document.head.appendChild(style);
    
    // Initialize additional effects
    initWaveAnimation();
    initNeonEffect();
    initGlitchEffect();
    
    // Expose animation functions to global scope
    window.DjouleAnimations = {
        animateCounter: animateCounter,
        revealElement: (element, delay = 0) => {
            setTimeout(() => {
                element.classList.add('revealed');
            }, delay);
        },
        addPulse: (element) => {
            element.classList.add('pulse');
        },
        removePulse: (element) => {
            element.classList.remove('pulse');
        },
        shake: (element) => {
            element.classList.add('shake');
            setTimeout(() => element.classList.remove('shake'), 500);
        }
    };
});
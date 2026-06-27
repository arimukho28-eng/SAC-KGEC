/* ==========================================================================
   SAC-KGEC WEB ENGINE CLIENT OPERATIONAL LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Custom Interactive Cursor Engine
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorRing = document.querySelector('.custom-cursor-ring');
    const links = document.querySelectorAll('a, button, .domain-card, input, textarea');

    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        // Slight lag on ring for structural fluid weight effect
        setTimeout(() => {
            cursorRing.style.left = e.clientX + 'px';
            cursorRing.style.top = e.clientY + 'px';
        }, 30);
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursorRing.classList.add('expand');
        });
        link.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('expand');
        });
    });

    // 2. Scroll Status Updates & Navbar Transitions
    const navbar = document.querySelector('.navbar');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const speedValue = document.getElementById('speedValue');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Update line width
        progressBar.style.width = scrollPercent + '%';

        // Translate progress percentage directly into mock HUD tachometer value (Max 130 km/h)
        const mockSpeed = Math.floor((scrollPercent / 100) * 130);
        speedValue.textContent = mockSpeed;

        // Navbar structural background transition trigger
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Sequential Reveal On Scroll Trigger Matrix
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
                
                // Trigger nested internal live counter components if present
                const statNums = el.querySelectorAll('.stat-num');
                if (statNums.length > 0) {
                    statNums.forEach(num => {
                        if (!num.classList.contains('counted')) {
                            triggerCounter(num);
                        }
                    });
                }
            }
        });
    };

    // Live numerical counters progression
    const triggerCounter = (el) => {
        el.classList.add('counted');
        const target = parseInt(el.getAttribute('data-target'));
        let count = 0;
        const speed = target / 30; // Execution frame steps
        
        const updateCount = () => {
            count += speed;
            if (count >= target) {
                el.textContent = target;
            } else {
                el.textContent = Math.floor(count);
                requestAnimationFrame(updateCount);
            }
        };
        updateCount();
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Prompt layout baseline checks on initiation
});

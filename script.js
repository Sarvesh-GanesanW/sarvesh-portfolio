const FORM_TIMEOUT_MS = 15000;

function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('i');

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeToggle.setAttribute('aria-pressed', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeToggle.setAttribute('aria-pressed', 'false');
        }
    }
}

function initializeMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            if (hash === '#' || hash === '#main') return;
            const target = document.querySelector(hash);
            if (!target) return;
            e.preventDefault();
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });
}

function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener(
        'scroll',
        () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                navbar.classList.toggle('scrolled', currentScroll > 50);

                if (currentScroll > 100) {
                    navbar.style.transform =
                        currentScroll > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                lastScroll = currentScroll;
                ticking = false;
            });
        },
        { passive: true }
    );
}

function initializeFadeInAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document
            .querySelectorAll(
                'section, .timeline-item, .skill-category, .project-card, .highlight-card'
            )
            .forEach((el) => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document
        .querySelectorAll(
            'section, .timeline-item, .skill-category, .project-card, .highlight-card'
        )
        .forEach((el) => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
}

function initializeActiveNavObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = new Map(
        Array.from(document.querySelectorAll('.nav-link')).map((link) => [
            link.getAttribute('href').substring(1),
            link
        ])
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute('id');
                const navLink = navLinks.get(id);
                if (navLink && entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    navLinks.forEach((link) => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            });
        },
        { threshold: 0.5, rootMargin: '-100px 0px -100px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
}

function initializeCustomCursor() {
    // only initialize on fine-pointer devices with no motion preference
    const mediaQuery = window.matchMedia(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );
    if (!mediaQuery.matches) return;

    document.body.classList.add('custom-cursor-enabled');

    const cursorDot = document.createElement('div');
    const cursorRing = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorRing.className = 'cursor-ring';
    cursorDot.setAttribute('aria-hidden', 'true');
    cursorRing.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = 0,
        mouseY = 0;
    let ringX = 0,
        ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.25;
        ringY += (mouseY - ringY) * 0.25;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    let clickTimeout;
    document.addEventListener('mousedown', () => {
        cursorDot.classList.add('click');
        cursorRing.classList.add('click');
        clearTimeout(clickTimeout);
    });

    document.addEventListener('mouseup', () => {
        clickTimeout = setTimeout(() => {
            cursorDot.classList.remove('click');
            cursorRing.classList.remove('click');
        }, 150);
    });

    const interactiveSelector =
        'a, button, .btn, .project-card, .skill-tag, .contact-detail, .hamburger, .highlight-card, .skill-category, input, textarea';
    document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
}

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !statusDiv || !submitBtn) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const honeypot = form.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        statusDiv.style.display = 'none';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { Accept: 'application/json' },
                signal: controller.signal
            });

            if (response.ok) {
                showStatus(
                    'success',
                    '<i class="fas fa-check-circle" aria-hidden="true"></i> Thanks for your message! I\'ll get back to you soon.'
                );
                form.reset();
            } else {
                showStatus(
                    'error',
                    '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Oops! There was a problem. Please try again or email me directly.'
                );
            }
        } catch (error) {
            const msg =
                error.name === 'AbortError'
                    ? 'Request timed out. Please check your connection and try again.'
                    : 'Network error. Please check your connection and try again.';
            showStatus(
                'error',
                `<i class="fas fa-exclamation-circle" aria-hidden="true"></i> ${msg}`
            );
        } finally {
            clearTimeout(timeoutId);
            submitBtn.disabled = false;
            submitBtn.innerHTML =
                '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 6000);
        }
    });

    function showStatus(kind, html) {
        statusDiv.innerHTML = html;
        statusDiv.className = `form-status ${kind}`;
        statusDiv.style.display = 'block';
    }
}

function initializeFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
}

function initializeExperienceYears() {
    const el = document.getElementById('experience-years');
    if (!el) return;

    const startDate = new Date(`${el.dataset.startDate}T00:00:00`);
    const today = new Date();
    let years = today.getFullYear() - startDate.getFullYear();
    const anniversaryPending =
        today.getMonth() < startDate.getMonth() ||
        (today.getMonth() === startDate.getMonth() && today.getDate() < startDate.getDate());

    if (anniversaryPending) years -= 1;
    el.textContent = `${Math.max(0, years)}+ years`;
}

const RESUME_BY_LENS = {
    all: 'Sarvesh_Resume.pdf',
    ai: 'Sarvesh_Resume_AI.pdf',
    data: 'Sarvesh_Resume_Data.pdf',
    infra: 'Sarvesh_Resume_Infra.pdf'
};
const LENS_HIGHLIGHT_COUNT = 5;

// data-order="ai:2 data:1 infra:3" -> rank for the chosen lens; items without it stay first
function lensRank(element, lens) {
    if (lens === 'all') return Number(element.dataset.origIndex);
    const order = element.dataset.order;
    if (!order) return -1;
    const match = order.split(' ').find((part) => part.startsWith(`${lens}:`));
    return match ? Number(match.split(':')[1]) : Number(element.dataset.origIndex);
}

function initializeLens() {
    const buttons = document.querySelectorAll('.lens-option');
    if (!buttons.length) return;

    const lists = [
        ...document.querySelectorAll('.lens-list'),
        document.querySelector('.projects-grid')
    ].filter(Boolean);
    lists.forEach((list) =>
        Array.from(list.children).forEach((item, index) => {
            item.dataset.origIndex = String(index);
        })
    );
    const resumeLinks = document.querySelectorAll('a[href^="Sarvesh_Resume"]');

    function applyLens(lens) {
        buttons.forEach((button) =>
            button.setAttribute('aria-pressed', String(button.dataset.lens === lens))
        );
        lists.forEach((list) => {
            Array.from(list.children)
                .sort((a, b) => lensRank(a, lens) - lensRank(b, lens))
                .forEach((item) => list.appendChild(item));
        });
        document.querySelectorAll('.lens-list li').forEach((item) => {
            item.classList.toggle(
                'lens-dim',
                lens !== 'all' && lensRank(item, lens) > LENS_HIGHLIGHT_COUNT
            );
        });
        resumeLinks.forEach((link) => {
            const file = RESUME_BY_LENS[lens];
            link.setAttribute('href', file);
            link.setAttribute('download', file.replace('Sarvesh_', 'Sarvesh_Ganesan_'));
        });
    }

    function setUrl(lens) {
        const url = new window.URL(window.location.href);
        if (lens === 'all') url.searchParams.delete('for');
        else url.searchParams.set('for', lens);
        window.history.replaceState(null, '', url);
    }

    buttons.forEach((button) =>
        button.addEventListener('click', () => {
            applyLens(button.dataset.lens);
            setUrl(button.dataset.lens);
        })
    );

    const requested = new window.URLSearchParams(window.location.search).get('for');
    if (requested && requested in RESUME_BY_LENS) applyLens(requested);
}

function initializeFlow() {
    const steps = Array.from(document.querySelectorAll('.flow-step'));
    if (!steps.length) return;
    const nodes = Array.from(document.querySelectorAll('.flow-nodes li'));

    function setActive(step) {
        steps.forEach((item) => item.classList.toggle('active', item === step));
        nodes.forEach((node) =>
            node.classList.toggle('active', node.dataset.node === step.dataset.step)
        );
    }

    setActive(steps[0]);
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActive(entry.target);
            });
        },
        { rootMargin: '-45% 0px -45% 0px' }
    );
    steps.forEach((step) => observer.observe(step));
}

function bootstrap() {
    initializeDarkMode();
    initializeMobileNav();
    initializeSmoothScroll();
    initializeNavbarScroll();
    initializeFadeInAnimations();
    initializeActiveNavObserver();
    initializeCustomCursor();
    initializeContactForm();
    initializeExperienceYears();
    initializeFooterYear();
    initializeLens();
    initializeFlow();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}

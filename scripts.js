//smooth scroll
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

//mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});

//project filters + view all (toolbar stays hidden without JS, so every project remains visible)
const INITIAL_PROJECTS = 6;
const projectGrid = document.getElementById('projects-grid');
const projectCards = Array.from(projectGrid.querySelectorAll('.project-card'));
const projectToolbar = document.getElementById('project-toolbar');
const projectStatus = document.getElementById('project-status');
const projectMore = document.getElementById('project-more');
const viewAll = document.getElementById('view-all');
const filterButtons = document.querySelectorAll('.filter-btn');
let activeFilter = 'all';
let showAllProjects = false;

function renderProjects(fromInteraction) {
    const matches = projectCards.filter(card =>
        activeFilter === 'all' || card.dataset.category.split(' ').includes(activeFilter));
    const limited = activeFilter === 'all' && !showAllProjects;
    const shown = limited ? matches.slice(0, INITIAL_PROJECTS) : matches;

    projectCards.forEach(card => {
        card.hidden = !shown.includes(card);
        card.classList.remove('span-full');
    });
    // Stretch a lone trailing card so the two-column grid never leaves a gap.
    const regular = shown.filter(card => !card.classList.contains('featured'));
    if (regular.length % 2) regular[regular.length - 1].classList.add('span-full');
    if (fromInteraction) shown.forEach(card => card.classList.add('visible'));

    projectStatus.textContent = `Showing ${shown.length} of ${projectCards.length} projects`;
    projectMore.hidden = activeFilter !== 'all';
    viewAll.textContent = showAllProjects ? 'Show Fewer Projects' : 'View All Projects';
    viewAll.setAttribute('aria-expanded', showAllProjects);
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach(b => b.setAttribute('aria-pressed', b === button));
        renderProjects(true);
    });
});
viewAll.addEventListener('click', () => {
    showAllProjects = !showAllProjects;
    renderProjects(true);
    if (!showAllProjects) projectToolbar.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
});
projectToolbar.hidden = false;
renderProjects(false);

//scroll reveal
const revealEls = document.querySelectorAll('.project-card, .about-body, .resume-wrap, .contact-form, .contact-left, .pill, .skill-col');
revealEls.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

//nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 40 ? 'rgba(10,10,10,0.97)' : 'rgba(10,10,10,0.85)';
}, { passive: true });

//active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
            });
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' }); // a thin band mid-viewport also works for sections taller than the screen
sections.forEach(s => sectionObserver.observe(s));
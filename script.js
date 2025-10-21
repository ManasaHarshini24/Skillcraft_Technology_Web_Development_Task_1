const navbar = document.getElementById('navbar');            // Navbar element
const hamburger = document.getElementById('hamburger');      // Hamburger icon for mobile
const navLinks = document.getElementById('navLinks');        // Container for nav links
const navLinkItems = document.querySelectorAll('.nav-links a'); // Individual nav links
const fadeEls = document.querySelectorAll('.fade-in');       // Elements to animate on scroll


// Create scroll progress bar dynamically
const scrollProgress = document.createElement('div');
scrollProgress.id = 'scrollProgress';
document.body.prepend(scrollProgress);  // Add to top of body


// Create back-to-top button dynamically
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'backToTop';
backToTopBtn.innerHTML = '↑';
document.body.appendChild(backToTopBtn); // Append to body


// VARIABLES
let lastScrollTop = 0;          // Track last scroll position for direction
const scrollThreshold = 50;     // Navbar style change threshold
let scrollTimeout;              // Timeout for debounced scroll
let fadeDelay = 150;            // Delay between fade-in staggered animation
let darkMode = false;            // Theme state


// UTILITY FUNCTIONS
// Debounce function to limit how often a function is called
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


// Calculate scroll percentage
function getScrollPercentage() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
}


// NAVBAR SCROLL HANDLER
function handleNavbarScroll() {
    const scrollTop = window.scrollY;

  
    // NAVBAR STYLE CHANGE
    if (scrollTop > scrollThreshold) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');


    // SCROLL DIRECTION DETECTION
    if (scrollTop > lastScrollTop) {
        navbar.classList.add('scrolling-down');
        navbar.classList.remove('scrolling-up');
    } else {
        navbar.classList.add('scrolling-up');
        navbar.classList.remove('scrolling-down');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

  
    // FADE-IN ANIMATIONS ON SCROLL
    fadeEls.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            setTimeout(() => el.classList.add('show'), index * fadeDelay);
        }
    });

  
    // HIGHLIGHT ACTIVE SECTION
    highlightCurrentSection();

    // UPDATE SCROLL PROGRESS BAR
    scrollProgress.style.width = getScrollPercentage() + '%';

    // SHOW/HIDE BACK-TO-TOP BUTTON
    backToTopBtn.style.opacity = scrollTop > 400 ? '1' : '0';
}


// SMOOTH SCROLL TO SECTION
function smoothScroll(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    window.scrollTo({
        top: targetSection.offsetTop - navbar.offsetHeight,
        behavior: 'smooth'
    });

    // Close mobile menu after click
    closeMobileMenu();
}


// HIGHLIGHT CURRENT SECTION LINK
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + navbar.offsetHeight + 50;

    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (!navLink) return;

        if (scrollPos >= top && scrollPos <= bottom) navLink.classList.add('active-link');
        else navLink.classList.remove('active-link');
    });
}


// MOBILE MENU TOGGLE
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // prevent background scrolling
}

// CLOSE MOBILE MENU
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.classList.remove('no-scroll');
}


// BACK-TO-TOP BUTTON CLICK
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// CLOSE MOBILE MENU ON OUTSIDE CLICK
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
    }
});


// WINDOW RESIZE HANDLER
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 900) closeMobileMenu();
}, 100));


// // THEME TOGGLE (LIGHT/DARK MODE)
// const themeBtn = document.createElement('button');
// themeBtn.id = 'themeToggle';
// themeBtn.textContent = '🌙';
// document.body.appendChild(themeBtn);

// themeBtn.addEventListener('click', () => {
//     darkMode = !darkMode;
//     document.body.classList.toggle('dark-mode', darkMode);
//     themeBtn.textContent = darkMode ? '☀️' : '🌙';
// });


// STAGGERED CARD ANIMATIONS
function animateCards(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            setTimeout(() => card.classList.add('card-animate'), index * 100);
        }
    });
}

// OPTIONAL: ELEMENT ZOOM ON SCROLL
function zoomOnScroll(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.style.transform = 'scale(1.05)';
        } else {
            el.style.transform = 'scale(1)';
        }
    });
}



// EVENT LISTENERS
window.addEventListener('scroll', debounce(() => {
    handleNavbarScroll();
    animateCards('.service-card');
    zoomOnScroll('.hero-content, .fade-in');
}, 20));

hamburger.addEventListener('click', toggleMobileMenu);
navLinkItems.forEach(link => link.addEventListener('click', smoothScroll));


// INITIALIZATION
handleNavbarScroll();
fadeEls.forEach(el => el.classList.remove('show'));
backToTopBtn.style.opacity = '0';
themeBtn.style.position = 'fixed';
themeBtn.style.bottom = '20px';
themeBtn.style.right = '20px';
themeBtn.style.padding = '10px 15px';
themeBtn.style.border = 'none';
themeBtn.style.borderRadius = '50%';
themeBtn.style.cursor = 'pointer';
themeBtn.style.background = '#007bff';
themeBtn.style.color = '#fff';
themeBtn.style.fontSize = '1.2rem';
themeBtn.style.zIndex = '1001';
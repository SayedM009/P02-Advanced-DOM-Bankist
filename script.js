'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const section01 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');
const dotsContainer = document.querySelector('.dots');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// MOUSEOVER EFFECT
function handlOver(e) {
  if (e.target.classList.contains('nav__link')) {
    // 1. The link that was hovered
    const link = e.target;
    // 2. The siblings of the link that was hovered
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // 3. The logo of the navigation bar
    const logo = link.closest('.nav').querySelector('.nav__logo');
    // 4. Set the opacity of the siblings and the logo
    siblings.forEach(sib => {
      if (sib !== link) sib.style.opacity = this;
    });

    logo.style.opacity = this;
  }
}
nav.addEventListener('mouseover', handlOver.bind(0.5));
nav.addEventListener('mouseout', handlOver.bind(1));

// Sticky Navigation
// window.addEventListener('scroll', function() {
//   if(this.window.scrollY > section01.getBoundingClientRect().top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// })

function observerCallBack(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}
const observerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
};

const observer = new IntersectionObserver(observerCallBack, observerOptions);
observer.observe(header);

// SMOOTH SCROLLING OF NAVIGATION LINKS
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // 1. Prevent default action
  e.preventDefault();
  // 2. Determine which link was clicked
  const clicked = e.target.closest('.nav__link');
  // 3. Guard clause
  if (!e.target.closest('.nav__link')) return;
  const id = clicked.getAttribute('href');
  // 4. Scroll to the section
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
});

// SMOOTH SCROLLING OF LEARN MORE BUTTON
document.querySelector('.btn--scroll-to').addEventListener('click', e =>
  // 1. Scroll to the section
  section01.scrollIntoView({ behavior: 'smooth' })
);

// TABS BUTTONS
document
  .querySelector('.operations__tab-container')
  .addEventListener('click', function (e) {
    // 1. Determine which tab was clicked
    const clicked = e.target.closest('.operations__tab');
    // 2. Guard clause
    if (!clicked) return;
    // 3. Remove active classes from all tabs
    document
      .querySelectorAll('.operations__tab')
      .forEach(tab => tab.classList.remove('operations__tab--active'));
    // 4. Add active class to the clicked tab
    clicked.classList.add('operations__tab--active');
    // 5. Remove active classes from all contents
    document
      .querySelectorAll('.operations__content')
      .forEach(content =>
        content.classList.remove('operations__content--active')
      );
    // 6. Add active class to the clicked content
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });

// SECTIONS SCROLL ANIMATION
function callBackEffect(entries, observer) {
  const [entry] = entries;
  // 1. Guard clause
  if (!entry.isIntersecting) return;
  // 2. Remove hidden class
  entry.target.classList.remove('section--hidden');
  // 3. Stop observing the section
  observer.unobserve(entry.target);
}

const options = {
  root: null,
  threshold: 0.15,
};

allSections.forEach(section => {
  // 1. Get the next section
  new IntersectionObserver(callBackEffect, options).observe(section);
  // 2. Add class to the section
  section.classList.add('section--hidden');
});

// LAZY LOAD IMAGES
const images = document.querySelectorAll('.lazy-img');

function callBackLazy(entries, observer) {
  const [entry] = entries;
  // 1. Guard clause
  if (!entry.isIntersecting) return;
  // 2. Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // 3. Remove lazy-img class
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
}

const lazyOptions = {
  root: null,
  threshold: 0.2,
};

images.forEach(img => {
  new IntersectionObserver(callBackLazy, lazyOptions).observe(img);
});

// SLIDER
const slides = document.querySelectorAll('.slide');

let count = 0;

function goToSlides(count) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - count)}%)`;
  });
}

// NEXT SLIDE FUNCTION
const nextSlide = function () {
  if (count === slides.length - 1) count = 0;
  else count++;
  goToSlides(count);
  addActiveClass(count);
};

document
  .querySelector('.slider__btn--right')
  .addEventListener('click', nextSlide);

// PREV SLIDE FUNCTION
const previousSlide = function () {
  if (count === 0) count = slides.length - 1;
  else count--;
  goToSlides(count);
  addActiveClass(count);
};

document
  .querySelector('.slider__btn--left')
  .addEventListener('click', previousSlide);

// ARROW OF THE SLIDER
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') previousSlide();
});

// CREATE BULLETS
function createBullets() {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'afterbegin',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
}

// SET EVENT ON EACH BULLET
dotsContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    goToSlides(e.target.dataset.slide);
    addActiveClass(e.target.dataset.slide);
  }
});

// ADDING CLASS ACTIVE TO CURRENT BULLET
function addActiveClass(num) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`[data-slide='${num}']`)
    .classList.add('dots__dot--active');
}

function init() {
  goToSlides(0);
  createBullets();
  addActiveClass(0);
}
init();

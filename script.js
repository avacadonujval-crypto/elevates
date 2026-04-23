document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Reveal ---
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  elements.forEach((el) => observer.observe(el));

  // --- Header Scroll State ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });

  // --- Smooth Scroll for Navigation ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 58, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Mobile Menu Toggle ---
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.header__mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('header__mobile--open');
    });
  }

  // --- Carousel Logic ---
  const initCarousel = (id) => {
    const container = document.getElementById(id);
    if (!container) return;

    const track = container.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = container.querySelector('.carousel-btn--next');
    const prevBtn = container.querySelector('.carousel-btn--prev');
    const nav = container.querySelector('.carousel-nav');
    
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('carousel-dot--active');
      dot.addEventListener('click', () => moveToSlide(i));
      nav.appendChild(dot);
    });

    const dots = Array.from(nav.children);

    const updateDots = (index) => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('carousel-dot--active', i === index);
      });
    };

    const moveToSlide = (index) => {
      if (index < 0 || index >= slides.length) return;
      
      // Calculate offset based on visible slides
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseInt(getComputedStyle(track).gap);
      const offset = index * (slideWidth + gap);
      
      track.style.transform = `translateX(-${offset}px)`;
      currentIndex = index;
      updateDots(index);
    };

    nextBtn.addEventListener('click', () => {
      const visibleSlides = getVisibleSlides();
      if (currentIndex < slides.length - visibleSlides) {
        moveToSlide(currentIndex + 1);
      } else {
        moveToSlide(0); // Loop back
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        moveToSlide(currentIndex - 1);
      } else {
        moveToSlide(slides.length - getVisibleSlides()); // Loop to end
      }
    });

    const getVisibleSlides = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };

    // Responsive adjustment
    window.addEventListener('resize', () => moveToSlide(currentIndex));
  };

  initCarousel('pro-roadmap');
});

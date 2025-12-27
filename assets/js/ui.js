// UI interactions and functionality
function initUI() {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-theme');
  }
  
  themeToggle?.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    let theme = 'light';
    if (document.body.classList.contains('dark-theme')) {
      theme = 'dark';
    }
    localStorage.setItem('theme', theme);
  });

  // Back to top button
  const backToTopButton = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton?.classList.add('visible');
    } else {
      backToTopButton?.classList.remove('visible');
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Hide/show navbar on scroll
  let lastScrollTop = 0;
  const navbar = document.querySelector('.nav');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      navbar?.classList.add('hidden');
    } else {
      navbar?.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
  });

  // Parallax effect for header
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    if (header && scrolled < 500) {
      header.style.transform = `translateY(${scrolled * 0.5}px)`;
      header.style.opacity = 1 - (scrolled / 500);
    }
  });
}
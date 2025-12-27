// Main application script
document.addEventListener('DOMContentLoaded', function() {
  // Load all components
  const components = [
    { id: 'header-container', file: 'components/header.html' },
    { id: 'nav-container', file: 'components/nav.html' },
    { id: 'about-container', file: 'components/about.html' },
    { id: 'skills-container', file: 'components/skills.html' },
    { id: 'research-container', file: 'components/research.html' },
    { id: 'publications-container', file: 'components/publications.html' },
    { id: 'projects-container', file: 'components/projects.html' },
    { id: 'achievements-container', file: 'components/achievements.html' },
    { id: 'contact-container', file: 'components/contact.html' },
    { id: 'footer-container', file: 'components/footer.html' }
  ];

  components.forEach(component => {
    fetch(component.file)
      .then(response => response.text())
      .then(data => {
        const container = document.getElementById(component.id);
        if (container) {
          container.innerHTML = data;
          
          // Initialize components after loading
          if (component.id === 'skills-container') {
            initSkillBars();
          }
        }
      })
      .catch(error => console.error(`Error loading ${component.file}:`, error));
  });

  // Initialize all modules
  initAccessibility();
  initUI();
  initEffects();
  initParticles();
});
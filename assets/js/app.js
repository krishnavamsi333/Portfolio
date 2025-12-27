document.addEventListener('DOMContentLoaded', async () => {
  showLoadingState();

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

  await Promise.all(
    components.map(c =>
      fetch(c.file)
        .then(r => r.text())
        .then(html => {
          document.getElementById(c.id).innerHTML = html;
        })
    )
  );

  initUI();        // ✅ UI AFTER components
  initEffects?.(); // ✅ optional (from effects.js)

  hideLoadingState();
});

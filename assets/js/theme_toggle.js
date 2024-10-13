document.addEventListener("DOMContentLoaded", function() {
  const toggleSwitch = document.querySelector('#theme-toggle');
  const toggleIcon = document.querySelector('.theme-switch label i');
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === "dark") {
      toggleSwitch.checked = true;
      toggleIcon.classList.remove('fa-toggle-off');
      toggleIcon.classList.add('fa-toggle-on');
    }
  }

  toggleSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      toggleIcon.classList.remove('fa-toggle-off');
      toggleIcon.classList.add('fa-toggle-on');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      toggleIcon.classList.remove('fa-toggle-on');
      toggleIcon.classList.add('fa-toggle-off');
    }
  });
});
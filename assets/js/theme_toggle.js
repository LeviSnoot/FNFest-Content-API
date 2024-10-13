document.addEventListener("DOMContentLoaded", function() {
  const toggleSwitch = document.querySelector('#theme-toggle');
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === "dark") {
      toggleSwitch.checked = true;
    }
  }

  toggleSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
});
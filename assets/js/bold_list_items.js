document.addEventListener("DOMContentLoaded", function() {
  const listItems = document.querySelectorAll("ul li");

  listItems.forEach(item => {
    const link = item.querySelector("a");
    if (link) {
      const text = link.textContent;
      if (text.includes("/")) {
        const parts = text.split("/");
        link.innerHTML = `${parts[0]}/<strong>${parts.slice(1).join("/")}</strong>`;
      } else {
        link.innerHTML = `<strong>${text}</strong>`;
      }
    }
  });
});
document.addEventListener("DOMContentLoaded", function() {
  const listItems = document.querySelectorAll("ul li");

  listItems.forEach(item => {
    const text = item.textContent;
    if (text.includes("/")) {
      const parts = text.split("/");
      item.innerHTML = `${parts[0]}/<strong>${parts.slice(1).join("/")}</strong>`;
    } else {
      item.innerHTML = `<strong>${text}</strong>`;
    }
  });
});
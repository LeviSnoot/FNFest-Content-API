document.addEventListener("DOMContentLoaded", function() {
  const searchBar = document.getElementById('search-bar');
  const sortDropdown = document.getElementById('sort-dropdown');
  const list = document.getElementById('list');
  let listItems = Array.from(list.getElementsByTagName('li'));

  function renderListItems(items) {
    list.innerHTML = '';
    items.forEach(item => list.appendChild(item));
  }

  renderListItems(listItems);

  searchBar.addEventListener('input', function() {
    const filter = searchBar.value.toLowerCase();
    const filteredItems = listItems.filter(item => {
      const text = item.textContent.toLowerCase();
      return text.includes(filter);
    });
    renderListItems(filteredItems);
  });

  sortDropdown.addEventListener('change', function() {
    const sortOrder = sortDropdown.value;
    const sortedItems = listItems.sort((a, b) => {
      const textA = a.textContent.toLowerCase();
      const textB = b.textContent.toLowerCase();
      if (sortOrder === 'asc') {
        return textA.localeCompare(textB);
      } else if (sortOrder === 'desc') {
        return textB.localeCompare(textA);
      } else {
        return 0;
      }
    });

    renderListItems(sortedItems);
  });
});
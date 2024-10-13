document.addEventListener("DOMContentLoaded", function() {
  const searchBar = document.getElementById('search-bar');
  const sortDropdown = document.getElementById('sort-dropdown');
  const list = document.getElementById('list');
  const listItems = Array.from(list.getElementsByTagName('li'));

  searchBar.addEventListener('input', function() {
    const filter = searchBar.value.toLowerCase();
    listItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(filter)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
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

    sortedItems.forEach(item => list.appendChild(item));
  });
});
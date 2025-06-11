(function () {
  'use strict';


  const list = document.getElementById('list');
  const searchBar = document.getElementById('search-bar');
  const sortDropdown = document.getElementById('sort-dropdown');
  const jsonViewer = document.getElementById('json-viewer');
  const jsonContent = document.getElementById('json-content');
  const jsonTitle = document.getElementById('json-viewer-title');
  const copyButton = document.getElementById('copy-json');
  const downloadButton = document.getElementById('download-json');
  const closeButton = document.getElementById('close-json');
  const fullApiLink = document.querySelector('[data-full-api]');
  const loadingIndicator = document.getElementById('loading-indicator');


  let currentTrack = null;
  let currentTrackUrl = null;
  const trackData = new WeakMap();
  let listItems = [];
  let originalOrder = [];


  function renderListItems(items) {
    if (!list) return;


    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      fragment.appendChild(item);
    });


    list.innerHTML = '';
    list.appendChild(fragment);
  }


  function applySort() {
    if (!sortDropdown || !list) return;

    const sortValue = sortDropdown.value;

    if (sortValue === 'default') {

      renderListItems([...originalOrder]);
      return;
    }

    const [sortBy, sortOrder] = sortValue.split('-');

    const sortedItems = [...listItems].sort((a, b) => {

      const aArtist = a.dataset.artist || '';
      const bArtist = b.dataset.artist || '';
      const aTitle = a.dataset.title || '';
      const bTitle = b.dataset.title || '';

      let compareA, compareB;

      if (sortBy === 'artist') {

        compareA = `${aArtist} ${aTitle}`.toLowerCase();
        compareB = `${bArtist} ${bTitle}`.toLowerCase();
      } else {

        compareA = `${aTitle} ${aArtist}`.toLowerCase();
        compareB = `${bTitle} ${bArtist}`.toLowerCase();
      }

      const comparison = compareA.localeCompare(compareB);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    renderListItems(sortedItems);
  }


  function createTrackItem(trackData, url) {
    const li = document.createElement('li');
    const link = document.createElement('a');

    try {

      const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
      const absoluteUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      link.href = absoluteUrl;


      const artist = trackData?.track?.artistName || '';
      let title = trackData?.track?.trackTitle || '';


      if (!title) {
        const filename = url.split('/').pop().replace('.json', '');
        title = filename.replace(/[-_]/g, ' ');
      }


      li.dataset.artist = artist.toLowerCase();
      li.dataset.title = title.toLowerCase();


      if (artist) {
        const artistSpan = document.createElement('span');
        artistSpan.className = 'artist';
        artistSpan.textContent = artist;

        const titleSpan = document.createElement('span');
        titleSpan.className = 'title';
        titleSpan.textContent = title;

        link.appendChild(artistSpan);
        link.appendChild(titleSpan);
        link.title = `${artist} - ${title}`;
      } else {

        const titleSpan = document.createElement('span');
        titleSpan.className = 'title';
        titleSpan.textContent = title;
        link.appendChild(titleSpan);
        link.title = title;
      }

      li.appendChild(link);


      li._trackData = trackData;

      return li;
    } catch (error) {
      console.error('Error creating track item:', error);

      link.textContent = url.split('/').pop().replace('.json', '').replace(/[-_]/g, ' ');
      link.href = url;
      li.appendChild(link);
      return li;
    }
  }


  function displayTrackData(track) {
    if (!track || !jsonTitle || !jsonContent) return;


    const artist = track.track?.artistName || '';
    const title = track.track?.trackTitle || 'Track Details';


    jsonTitle.innerHTML = artist
      ? `<span class="artist">${artist}</span><span class="title">${title}</span>`
      : `<span class="title">${title}</span>`;

    try {

      const formattedJson = JSON.stringify(track, null, 2);


      const highlightedJson = formattedJson
        .replace(/\n/g, '<br>')
        .replace(/\s{2,}/g, match => '&nbsp;'.repeat(match.length))
        .replace(/("[^"]+"):/g, '<span class="json-key">$1</span>:')
        .replace(/: ("[^"]*")/g, ': <span class="json-string">$1</span>')
        .replace(/: (true|false|null|\d+)/g, (match, p1) => {
          const className = p1 === 'null' ? 'json-null' : 'json-boolean';
          return `: <span class="${className}">${p1}</span>`;
        });


      jsonContent.innerHTML = `<pre class="json-viewer-content">${highlightedJson}</pre>`;
    } catch (error) {
      console.error('Error displaying track data:', error);
      jsonContent.innerHTML = '<p>Error displaying track data</p>';
    }
  }


  function handleTrackClick(event, item) {
    event.preventDefault();

    const track = trackData.get(item) || item._trackData;
    if (!track) return;

    currentTrack = track;
    currentTrackUrl = item._fileUrl;
    displayTrackData(track);
    if (jsonViewer) {
      jsonViewer.classList.add('active');
    }
  }


  function copyToClipboard() {
    if (!currentTrack) return;

    try {
      const jsonString = JSON.stringify(currentTrack, null, 2);
      navigator.clipboard.writeText(jsonString).then(() => {
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          copyButton.innerHTML = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }


  function downloadJson() {
    if (!currentTrack || !currentTrackUrl) {
      console.error('No current track or download URL available');
      return;
    }

    try {
      let url = currentTrackUrl;
      const a = document.createElement('a');
      a.href = url;
      a.download = currentTrackUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error('Error downloading JSON:', error);
    }
  }


  function closeJsonViewer() {
    if (jsonViewer) {
      jsonViewer.classList.remove('active');
    }
    currentTrack = null;
  }


  function initEventListeners() {

    if (searchBar) {
      searchBar.addEventListener('input', function () {
        const filter = this.value.toLowerCase().trim();
        if (!filter) {
          listItems.forEach(item => item.style.display = '');
          return;
        }

        listItems.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(filter) ? '' : 'none';
        });
      });
    }


    if (sortDropdown) {
      sortDropdown.addEventListener('change', applySort);
    }


    if (list) {
      listItems = Array.from(list.querySelectorAll('li'));
      originalOrder = [...listItems];


      listItems.forEach(item => {
        const scriptTag = item.querySelector('script.track-data');
        if (scriptTag) {
          try {
            const trackData = JSON.parse(scriptTag.textContent.trim());
            item._trackData = trackData;
          } catch (e) {
            console.error('Error parsing track data:', e);
          }
        }

        const link = item.querySelector('a');
        if (link) {
          item._fileUrl = link.href;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            handleTrackClick(e, item);
          });
        }
      });
    }


    if (copyButton) {
      copyButton.addEventListener('click', copyToClipboard);
    }


    if (downloadButton) {
      downloadButton.addEventListener('click', downloadJson);
    }


    if (closeButton) {
      closeButton.addEventListener('click', closeJsonViewer);
    }


    if (fullApiLink) {
      fullApiLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(fullApiLink.href);
          if (response.ok) {
            const data = await response.json();
            currentTrack = data;
            currentTrackUrl = fullApiLink.href;
            displayTrackData(data);
            if (jsonViewer) {
              jsonViewer.classList.add('active');
            }
            if (jsonTitle) {
              jsonTitle.textContent = 'Full API';
            }
          }
        } catch (error) {
          console.error('Error loading full API:', error);
        }
      });
    }
  }


  document.addEventListener('DOMContentLoaded', () => {
    if (!list) {
      console.error('Track list element not found');
      return;
    }


    initEventListeners();


    listItems = Array.from(list.querySelectorAll('li'));
    originalOrder = [...listItems];


    listItems.forEach(item => {
      const scriptTag = item.querySelector('script.track-data');
      if (scriptTag) {
        try {
          const trackData = JSON.parse(scriptTag.textContent.trim());
          item._trackData = trackData;
        } catch (e) {
          console.error('Error parsing track data:', e);
        }
      }

      const link = item.querySelector('a');
      if (link) {
        item._fileUrl = link.href;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          handleTrackClick(e, item);
        });
      }
    });


    applySort();
  });
})();
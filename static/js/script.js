document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) {
        console.error("Required DOM elements not found.");
        return;
    }

    // Search functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase(); // Case-insensitive search
        if (query.length > 0) {
            const url = `/artists?q=${encodeURIComponent(query)}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    searchResults.innerHTML = '';
                    if (Array.isArray(data) && data.length > 0) {
                        data.forEach(item => {
                            const div = document.createElement('div');
                            div.className = 'search-result-item';

                            // Create suggestion text
                            const name = item.name || item.Name || 'Unknown Artist';
                            const type = item.Name;
                            div.textContent = `${name} - ${type}`;

                            div.addEventListener('click', () => {
                                const id = item.id || item.Id || item.ID;
                                if (id) {
                                    window.location.href = `/artist/${id}`;
                                } else {
                                    alert('Sorry, unable to find details for this artist.');
                                }
                            });
                            searchResults.appendChild(div);
                        });
                        searchResults.style.display = 'block';
                    } else {
                        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
                        searchResults.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    searchResults.innerHTML = '<div class="search-result-item">Error fetching results</div>';
                    searchResults.style.display = 'block';
                });
        } else {
            searchResults.style.display = 'none';
        }
    });

    // Hide search results when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchResults.contains(event.target) && event.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });

    // Section display function
    function showSection(sectionId, updateUrl = true) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.toggle('hidden', section.id !== sectionId && sectionId !== 'all');
        });

        if (updateUrl) {
            const url = new URL(window.location);
            url.searchParams.set('section', sectionId);
            window.history.replaceState({}, '', url);
        }

        if (sectionId !== 'all') {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Handle URL parameters on page load
    function handleUrlParams() {
        const section = new URLSearchParams(window.location.search).get('section') || 'all';
        showSection(section, false);
    }
    handleUrlParams();

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleUrlParams);

    // Shortcut keys for navigation
    document.addEventListener('keydown', function(event) {
        if (!event.altKey) return;

        event.preventDefault();
        const actions = {
            'arrowleft': () => history.back(),
            'arrowright': () => history.forward(),
            'l': () => showSection('locations'),
            'd': () => showSection('dates'),
            'r': () => showSection('relations'),
            'a': () => showSection('all'),
        };
        actions[event.key.toLowerCase()]?.();
    });

    // Override default anchor behavior for section links
    document.querySelectorAll('.links a').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const sectionId = link.getAttribute('href').replace('#', '');
            showSection(sectionId);
        });
    });

    function goHome() {
        window.location.href = '/';
    }
    console.log('Script loaded');
});

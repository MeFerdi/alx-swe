
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

console.log('Script loaded');

searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    console.log('Search query:', query);

    if (query.length > 0) {
        const url = `/artists?q=${encodeURIComponent(query)}`;
        console.log('Fetching from URL:', url);

        fetch(url)
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                searchResults.innerHTML = '';
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'search-result-item';

                        // Display artist/band name with relevant date or location
                        if (item.type === 'artist/band') {
                            div.textContent = `${item.name} - ${item.type}`;
                        } else if (item.type === 'member') {
                            div.textContent = `${item.name} - ${item.type} - ${item.bandName}`;
                        } else if (item.type === 'location') {
                            div.textContent = `${item.name} - ${item.type} - ${item.bandName}`;
                        }else if (item.type === 'first album dates') {
                            div.textContent = `${item.name} - ${item.type} - ${item.band}`;
                        }else if (item.type === 'creation dates') {
                            div.textContent = `${item.name} - ${item.type} - ${item.band}`;
                        }
                        // Redirect on click
                        div.addEventListener('click', () => {
                            if (item.id) {
                                if (item.type === 'location') {
                                    window.location.href = `/artist/${item.id}?section=locations`;
                                }else if (item.type === 'first album dates') {
                                    window.location.href = `/artist/${item.id}?section=dates`;
                                 } else if (item.type === 'creation dates') {
                                    window.location.href = `/artist/${item.id}?section=dates`;
                                 }else {
                                    window.location.href = `/artist/${item.id}`;
                                }
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
        console.log('Empty query, hiding results');
        searchResults.style.display = 'none';
    }
});

// Hide search results when clicking outside
document.addEventListener('click', function(event) {
    if (!searchResults.contains(event.target) && event.target !== searchInput) {
        searchResults.style.display = 'none';
    }
});

console.log('Event listeners added');

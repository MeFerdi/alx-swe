function toggleDropdown(event) {
    const dropdown = event.target.nextElementSibling;
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const suggestionsList = document.getElementById('suggestions');

    searchBar.addEventListener('input', async function() {
        const query = searchBar.value.trim();

        // Hide suggestions if the input is empty
        if (!query) {
            suggestionsList.style.display = 'none';
            suggestionsList.innerHTML = '';
            return;
        }

        // Fetch suggestions from the server
        try {
            const response = await fetch(`/search/?query=${encodeURIComponent(query)}`);
            const results = await response.json();

            // Clear previous suggestions
            suggestionsList.innerHTML = '';
            suggestionsList.style.display = results.length ? 'block' : 'none';

            // Populate suggestions
            results.forEach(result => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = `${result.Name} - ${result.Type}`;
                suggestionItem.addEventListener('click', () => {
                    searchBar.value = result.Name; // Set the search bar to the selected suggestion
                    suggestionsList.style.display = 'none'; // Hide the suggestions
                });
                suggestionsList.appendChild(suggestionItem);
            });
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchBar.contains(event.target) && !suggestionsList.contains(event.target)) {
            suggestionsList.style.display = 'none';
        }
    });
});

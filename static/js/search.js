function showSection(sectionId, updateUrl = true) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId || sectionId === 'all') {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });

    if (updateUrl) {
        // Update URL without adding to browser history
        const url = new URL(window.location);
        url.searchParams.set('section', sectionId);
        window.history.replaceState({}, '', url);
    }

    // Smooth scroll to the section
    if (sectionId !== 'all') {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section') || 'all';
    showSection(section, false);
}

// Call handleUrlParams on page load
handleUrlParams();

// Listen for popstate events (browser back/forward)
window.addEventListener('popstate', handleUrlParams);

// Update event listeners
document.addEventListener('keydown', function(event) {
    if (event.altKey) {
        event.preventDefault(); // Prevent default browser behavior for Alt key combinations
        switch (event.key.toLowerCase()) {
            case 'arrowleft':
                history.back();
                break;
            case 'arrowright':
                history.forward();
                break;
            case 'l':
                showSection('locations');
                break;
            case 'd':
                showSection('dates');
                break;
            case 'r':
                showSection('relations');
                break;
            case 'a':
                showSection('all');
                break;
        }
    }
});

// Prevent default anchor behavior and use showSection instead
document.querySelectorAll('.links a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const section = this.getAttribute('href').split('=')[1];
        showSection(section);
    });
});
function showSection(sectionId, updateUrl = true) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });

    if (sectionId === 'all') {
        sections.forEach(section => {
            section.classList.remove('hidden');
        });
    }

    if (updateUrl) {
        const url = new URL(window.location);
        url.searchParams.set('section', sectionId);
        window.history.replaceState({}, '', url);
    }

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

document.addEventListener('DOMContentLoaded', function() {
    // Hide all sections by default
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    handleUrlParams();

    window.addEventListener('popstate', handleUrlParams);

    document.addEventListener('keydown', function(event) {
        if (event.altKey) {
            event.preventDefault();
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

    document.querySelectorAll('.links a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const section = this.getAttribute('href').split('=')[1];
            showSection(section);
        });
    });
});

function goHome() {
    window.location.href = '/';
}

document.querySelector('.dropdown-button').addEventListener('click', function(e) {
    e.preventDefault();
    this.parentNode.classList.toggle('active');
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelector('.dropdown').classList.remove('active');
    }
});
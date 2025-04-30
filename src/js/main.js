// main.js

// Entry point for the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized.');

    // Example: Attach event listeners or initialize components here
    const button = document.getElementById('exampleButton');
    if (button) {
        button.addEventListener('click', () => {
            alert('Button clicked!');
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('/')) {
                // Allow navigation to external pages
                return;
            }
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Form validation
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Formulario enviado correctamente.');
    });
});
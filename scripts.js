// script.js remains the same as before
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoElement({
            behavior: 'smooth'
        });
    });
});

// Resume upload handling
document.getElementById('resume-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('resume-preview');
            preview.innerHTML = `
                <p style="color: var(--primary); margin-top: 1rem;">
                    Uploaded: ${file.name}
                </p>
            `;
        };
        reader.readAsDataURL(file);
    }
});

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your form submission logic here
    alert('Message sent successfully!');
    this.reset();
});
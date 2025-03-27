document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".nav-item");
    const content = document.getElementById("content");
    const contactFooterContent = document.getElementById("contact-footer");

    const sections = {
        "welcome": "content/welcome.html",
        "projects": "content/projects.html",
        "contact": "content/contact.html"
    };

    // Function to update footer visibility based on the current section
    function updateFooterVisibility(currentSection) {
        if (currentSection === 'contact') {
            contactFooterContent.classList.add('hidden'); // Hide footer on 'contact' page
        } else {
            contactFooterContent.classList.remove('hidden'); // Show footer on all other pages
        }
    }

    // Function to load content dynamically
    function loadContent(section) {
        fetch(sections[section])
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;

                // Update the footer visibility when the content is loaded
                updateFooterVisibility(section);

                // Load contact footer content dynamically when not on 'contact' page
                if (section !== 'contact') {
                    fetch('content/contact.html')
                        .then(response => response.text())
                        .then(data => {
                            contactFooterContent.innerHTML = data;
                        });
                }
            });
    }

    // Initial load (welcome section by default)
    loadContent("welcome");

    // Handle nav item clicks
    navItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();

            // Remove 'active' class from all nav items
            navItems.forEach(nav => nav.classList.remove("active"));

            // Add 'active' class to the clicked item
            this.classList.add("active");

            // Get the section from the data-section attribute
            const section = this.getAttribute("data-section");

            // Load the content for the clicked section
            loadContent(section);
        });
    });
});

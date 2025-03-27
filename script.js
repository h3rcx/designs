document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".nav-item");
    const content = document.getElementById("content");
    const contactFooterContent = document.getElementById("contact-footer");

    const sections = {
        "welcome": "content/welcome.html",
        "projects": "content/projects.html",
        "contact": "content/contact.html",
        "project-template": "content/project-template.html" // Add the project-template section
    };

    // Store the footer content once to avoid reloading it multiple times
    let footerContentLoaded = false;

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

                // Load the contact footer content if not already done
                if (section !== 'contact' && !footerContentLoaded) {
                    fetch('content/contact.html')
                        .then(response => response.text())
                        .then(data => {
                            contactFooterContent.innerHTML = data;
                            footerContentLoaded = true; // Mark footer content as loaded
                        });
                }

                // If we're on the projects page, add click event listeners to images
                if (section === 'projects') {
                    const projectImages = document.querySelectorAll('.project-cover img');
                    projectImages.forEach(img => {
                        img.addEventListener('click', function (e) {
                            e.preventDefault();
                            loadProjectTemplate(); // Load the project details template
                        });
                    });
                }
            });

        // Update the URL in the browser without reloading the page
        history.pushState({ section }, '', `#${section}`);
    }

    // Function to load the project template
    function loadProjectTemplate() {
        fetch(sections["project-template"])
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data; // Replace content with the project details

                // Here you can modify the project details dynamically, if needed
                // Example: You can inject specific project info based on which image was clicked.
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

    // Handle browser back/forward navigation
    window.addEventListener("popstate", function (e) {
        const section = e.state ? e.state.section : "welcome";
        loadContent(section);
    });
});

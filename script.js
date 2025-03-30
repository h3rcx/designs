document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".nav-item");
    const content = document.getElementById("content");
    const contactFooterContent = document.getElementById("contact-footer");

    const sections = {
        "welcome": "content/welcome.html",
        "projects": "content/projects.html",
        "contact": "content/contact.html",
        "project-template": "content/project-template.html",
    };
    

    let projectsData = {}; // Store projects from JSON
    let footerContentLoaded = false;

    // Function to update footer visibility
    function updateFooterVisibility(currentSection) {
        if (currentSection === 'contact') {
            contactFooterContent.classList.add('hidden');
        } else {
            contactFooterContent.classList.remove('hidden');
        }
    }

    // Function to load content dynamically
    function loadContent(section) {
        fetch(sections[section])
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
                updateFooterVisibility(section);

                // Load the footer only once
                if (section !== 'contact' && !footerContentLoaded) {
                    fetch('content/contact.html')
                        .then(response => response.text())
                        .then(data => {
                            contactFooterContent.innerHTML = data;
                            footerContentLoaded = true;
                        });
                }

                // If the projects page is loaded, add event listeners for images
                if (section === 'projects') {
                    addProjectClickListeners();
                }
            });

        // Update browser history state
        history.pushState({ section }, '', `#${section}`);
    }

    // Function to attach event listeners to project images
    function addProjectClickListeners() {
        document.querySelectorAll('.project-cover img').forEach(img => {
            img.addEventListener('click', function (e) {
                e.preventDefault();
                const projectId = this.getAttribute("data-project-id");
                loadProject(projectId);
            });
        });
    }

    // Function to load the project dynamically based on ID
    function loadProject(projectId) {
        const projectFileName = `content/project${projectId}.html`;

        fetch(projectFileName)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Project file not found");
                }
                return response.text();
            })
            .then(html => {
                document.getElementById("content").innerHTML = html;

                // Update browser history
                history.pushState({ section: `project-${projectId}` }, '', `#project-${projectId}`);
            })
            .catch(error => console.error("Error loading project:", error));
    }

    // We used to load project content into templates
    // function loadProjectTemplate(project) {
    //     fetch(sections["project-template"])
    //         .then(response => response.text())
    //         .then(template => {
    //             template = template.replace("{title}", project.title);
    //             template = template.replace("{description}", project.description);
    //             template = template.replace("{summary-title}", project.summaryTitle);
    //             template = template.replace("{summary-description}", project.summaryDescription);
            
    //             content.innerHTML = template;

    //             // Select all project images
    //             const projectImages = document.querySelectorAll(".project-cover img");

    //             // Loop through images and replace src with corresponding image from JSON
    //             projectImages.forEach((img, index) => {
    //                 img.src = project.images[index]; // Fallback for missing images
    //                 img.alt = `Project Image ${index + 1}`; // Improve accessibility
    //             });
    //         });

    //     // Update browser history for project
    //     history.pushState({ section: "project-template" }, '', `#project-${project.id}`);
    // }

    // Initial loading
    loadContent("welcome");

    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");
            loadContent(this.getAttribute("data-section"));
        });
    });

    // Handle browser back/forward navigation
    window.addEventListener("popstate", function (e) {
        const section = e.state ? e.state.section : "welcome";
        loadContent(section);
    });
});

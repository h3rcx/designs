 // Toggle burger menu
 function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const burger = document.querySelector('.burger');
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
}

document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".nav-item");
    const content = document.getElementById("content");
    const contactFooterContent = document.getElementById("contact-footer");

    const sections = {
        "/": "welcome",
        "/welcome": "welcome",
        "/projects": "projects",
        "/contact": "contact",
    };

    const sectionFiles = {
        "welcome": "content/welcome.html",
        "projects": "content/projects.html",
        "contact": "content/contact.html",
        "project-template": "content/project-template.html",
    };

    function updateFooterVisibility(currentSection) {
        if (currentSection === 'contact') {
            contactFooterContent.classList.add('hidden');
        } else {
            contactFooterContent.classList.remove('hidden');
        }
    }

    function loadContent(section, push = true) {
        const file = sectionFiles[section];
        if (!file) return;

        fetch(file)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
                updateFooterVisibility(section);

                if (section === "projects") {
                    addProjectClickListeners();
                }

                if (push) {
                    const path = section === "welcome" ? "/" : `/${section}`;
                    history.pushState({ section }, '', path);
                }
            });
    }

    function getSectionFromPath(path) {
        return sections[path] || "welcome";
    }

    function addProjectClickListeners() {
        document.querySelectorAll('.project-cover img').forEach(img => {
            img.addEventListener('click', function (e) {
                e.preventDefault();
                const projectId = this.getAttribute("data-project-id");
                loadProject(projectId);
            });
        });
    }

    function loadProject(projectId) {
        const projectFileName = `content/project${projectId}.html`;

        fetch(projectFileName)
            .then(response => {
                if (!response.ok) throw new Error("Project not found");
                return response.text();
            })
            .then(html => {
                content.innerHTML = html;
                history.pushState({ section: `project-${projectId}` }, '', `/project-${projectId}`);
            })
            .catch(console.error);
    }

    // 🧠 INITIAL LOAD BASED ON PATHNAME
    const currentPath = window.location.pathname;
    const initialSection = getSectionFromPath(currentPath);
    loadContent(initialSection, false);

    // NAV CLICKS
    navItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
    
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");
    
            // Load new section
            const section = this.getAttribute("data-section");
            loadContent(section);
    
            // 🔒 Close burger menu on mobile
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.burger').classList.remove('toggle');
        });
    });

    // HANDLE POPSTATE
    window.addEventListener("popstate", (e) => {
        const path = window.location.pathname;
        const section = getSectionFromPath(path);
        loadContent(section, false);
    });
});

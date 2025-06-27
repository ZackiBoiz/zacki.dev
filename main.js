document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    const navbar = document.getElementById("main-nav");

    function setTheme(theme) {
        html.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        const icon = themeToggle.querySelector("i");
        if (icon) {
            icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
    }

    function getCurrentTheme() {
        return html.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }

    setTheme(getCurrentTheme());
    themeToggle.addEventListener("click", () => {
        setTheme(getCurrentTheme());
    });
});
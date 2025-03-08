document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    let lastX = 0;
    let lastY = 0;
    const minDistance = 50; // Increase to make stars appear less frequently

    document.addEventListener("mousemove", (event) => {
        // Ensure mouse tracking works everywhere
        if (Math.abs(event.clientX - lastX) > minDistance || Math.abs(event.clientY - lastY) > minDistance) {
            lastX = event.clientX;
            lastY = event.clientY;
            createStar(event.clientX, event.clientY);
        }
    });

    function createStar(x, y) {
        const star = document.createElement("img");
        star.src = "images/star.png"; // Your custom star image path
        star.classList.add("star");

        // Position the star at the mouse location
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        document.body.appendChild(star);

        // Animate and remove after fading out
        setTimeout(() => {
            star.style.opacity = "0";
            star.style.transform = "scale(0.5)"; // Shrinks before disappearing
            setTimeout(() => {
                star.remove();
            }, 300);
        }, 300);
    }
});

  
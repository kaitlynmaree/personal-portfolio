document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const navbar = document.getElementById('navbar');

  // Enhanced smooth scrolling with offset for fixed nav
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      const offsetTop = targetSection.offsetTop - 100;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    });
  });

  // Enhanced navbar updates with smooth transitions
  function updateNavbar() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // Scroll reveal animation system
  function createScrollObserver() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve after animation to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
      observer.observe(el);
    });
  }

  // Skills tabs functionality
  function initSkillsTabs() {
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillContents = document.querySelectorAll('.skills-content');

    skillTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // Update active tab
        skillTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding content
        skillContents.forEach(content => {
          content.style.display = 'none';
          content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(`skills-${category}`);
        if (targetContent) {
          targetContent.style.display = 'grid';
          setTimeout(() => {
            targetContent.classList.add('active');
          }, 50);
        }
      });
    });
  }

  // Enhanced cursor trail effect
  function initCursorTrail() {
    const trails = document.querySelectorAll('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    const positions = Array.from({length: trails.length}, () => ({x: 0, y: 0}));

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateTrail() {
      let prevX = mouseX;
      let prevY = mouseY;

      positions.forEach((pos, index) => {
        pos.x += (prevX - pos.x) * (0.3 - index * 0.05);
        pos.y += (prevY - pos.y) * (0.3 - index * 0.05);

        trails[index].style.transform = `translate(${pos.x - 10}px, ${pos.y - 10}px)`;
        trails[index].style.opacity = 0.8 - index * 0.15;
        trails[index].style.transform += ` scale(${1 - index * 0.1})`;

        prevX = pos.x;
        prevY = pos.y;
      });

      requestAnimationFrame(updateTrail);
    }

    updateTrail();

    // Show trail on mouse enter, hide on leave
    document.addEventListener('mouseenter', () => {
      trails.forEach(trail => {
        trail.style.opacity = '0.8';
      });
    });

    document.addEventListener('mouseleave', () => {
      trails.forEach(trail => {
        trail.style.opacity = '0';
      });
    });
  }

  // Enhanced contact form with better UX
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Update UI for loading state
      submitButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="animation: spin 1s linear infinite;">
          <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
        </svg>
        Sending...
      `;
      submitButton.disabled = true;
      this.classList.add('form-loading');
      
      // Hide previous status
      formStatus.classList.remove('show', 'success', 'error');

      try {
        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          formStatus.textContent = '✨ Message sent successfully! I\'ll get back to you soon.';
          formStatus.classList.add('show', 'success');
          this.reset();
          
          // Animate form reset
          setTimeout(() => {
            const inputs = this.querySelectorAll('input, textarea');
            inputs.forEach(input => {
              input.style.transform = 'scale(0.95)';
              setTimeout(() => {
                input.style.transform = 'scale(1)';
              }, 150);
            });
          }, 100);
        } else {
          throw new Error(data.error || 'Failed to send message');
        }
      } catch (error) {
        console.error('Error:', error);
        formStatus.textContent = '⚠ Failed to send message. Please try again or contact me directly.';
        formStatus.classList.add('show', 'error');
      } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        this.classList.remove('form-loading');
      }
    });

    // Enhanced input focus effects
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
      });
    });
  }

  // Performance optimized scroll handler
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Parallax effect for background elements
  function initParallax() {
    const meshGradient = document.querySelector('.mesh-gradient');
    const bgLayers = document.querySelectorAll('.bg-layer');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      if (meshGradient) {
        meshGradient.style.transform = `translate3d(0, ${rate}px, 0)`;
      }
      
      bgLayers.forEach((layer, index) => {
        const rate = scrolled * (-0.3 - index * 0.1);
        layer.style.transform = `translate3d(0, ${rate}px, 0)`;
      });
    });
  }

  // Initialize all functionality
  createScrollObserver();
  initSkillsTabs();
  initCursorTrail();
  initContactForm();
  initParallax();
  
  // Event listeners
  window.addEventListener('scroll', onScroll);
  updateNavbar(); // Initial call

  // Preload critical images for better performance
  const criticalImages = [
    'images/robot_cad.png',
    'images/home_assistant.png',
    'images/qanser.jpg'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Add some interactive microinteractions
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Enhanced project card interactions
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-15px) scale(1.02)';
      this.style.boxShadow = '0 30px 60px rgba(99, 102, 241, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '';
    });
  });

  console.log('🚀 Portfolio loaded successfully!');
});


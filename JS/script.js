function loadContent(url, element) {
    const mainContent = document.getElementById('main-content');
    const heroSection = document.getElementById('hero-section');
    const discoverText = document.querySelector('.discover-text');
    const socialIcons = document.getElementById('social-icons');
    const menuItems = document.querySelectorAll('.menu-left ul li a');
  
    if (url === 'index.html') {
        // Show hero section and discover text for home page
        if (heroSection) heroSection.style.display = 'block';
        if (discoverText) discoverText.style.display = 'block';
        mainContent.innerHTML = ''; // Clear main content
  
        // Show social icons on home page
        if (socialIcons) socialIcons.style.display = 'flex';
    } else {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                if (heroSection) heroSection.style.display = 'none';
                if (discoverText) discoverText.style.display = 'none';
                mainContent.innerHTML = data;
  
                // Hide social icons on dynamically loaded pages
                if (socialIcons) socialIcons.style.display = 'none';
            })
            .catch(error => console.error('Error loading content:', error));
    }
  
    // Update active link
    menuItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
  
    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
  
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
  
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
  
    const loadingScreen = document.querySelector('.loading-screen');
  
    function startSliding() {
        loadingScreen.classList.add('slide-left');
        setTimeout(function () {
            window.location.href = "index.html";
        }, 500);
    }
  
    const loadingGif = new Image();
    loadingGif.src = '/giphy.gif';
    loadingGif.onload = function () {
        setTimeout(startSliding, 6000);
    };
  
    const enterButton = document.createElement('button');
    enterButton.textContent = 'Enter';
    enterButton.classList.add('enter-button');
  
    enterButton.addEventListener('click', function () {
        window.location.href = "index.html";
    });
  
    const loadingContent = document.querySelector('.loading-content');
    loadingContent.appendChild(enterButton);
  
    enterButton.addEventListener('mouseover', function () {
        enterButton.style.color = '#dddddd';
    });
  
    enterButton.addEventListener('mouseout', function () {
        enterButton.style.color = 'white';
    });
  
    // Hide social icons on initial load if not on index.html
    const socialIcons = document.getElementById('social-icons');
    const currentPage = window.location.pathname.split('/').pop();
    if (socialIcons && currentPage !== 'index.html' && currentPage !== '') {
        socialIcons.style.display = 'none';
    }
  });
  
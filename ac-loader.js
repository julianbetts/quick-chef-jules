// Anti-coder Loader
class AntiCoderLoader {
    constructor() {
        this.endpoint = document.body.getAttribute('data-ac-endpoint');
        this.init();
    }

    async init() {
        try {
            await this.loadContent();
        } catch (error) {
            console.error('Failed to load content:', error);
            this.showFallback();
        }
    }

    async loadContent() {
        const response = await fetch(this.endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.hydrateContent(data);
    }

    hydrateContent(data) {
        // Update JSON-LD
        const jsonld = document.getElementById('jsonld');
        if (jsonld && data.jsonld) {
            jsonld.textContent = JSON.stringify(data.jsonld);
        }

        // Update simple text elements
        this.updateElement('brand', data.brand);
        this.updateElement('hero-headline', data.heroHeadline);
        this.updateElement('hero-sub', data.heroSub);
        this.updateElement('about-title', data.aboutTitle);
        this.updateElement('about-body', data.aboutBody);
        this.updateElement('menu-title', data.menuTitle);
        this.updateElement('contact-note', data.contactNote);
        this.updateElement('footer', data.footer);

        // Update CTA button
        this.updateCTA(data.cta);

        // Update email button
        this.updateEmailBtn(data.emailBtn);

        // Update Instagram link
        this.updateInsta(data.insta);

        // Inject services
        this.injectServices(data.services);

        // Inject menu items
        this.injectMenuItems(data.menuItems);

        // Inject testimonials
        this.injectTestimonials(data.testimonials);
    }

    updateElement(selector, content) {
        const element = document.querySelector(`[data-ac="${selector}"]`);
        if (element && content) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = content;
            } else {
                element.textContent = content;
            }
        }
    }

    updateCTA(ctaData) {
        const ctaElement = document.querySelector('[data-ac="cta"]');
        if (ctaElement && ctaData) {
            ctaElement.textContent = ctaData.text;
            if (ctaData.href) {
                ctaElement.href = ctaData.href;
            }
        }
    }

    updateEmailBtn(emailData) {
        const emailElement = document.querySelector('[data-ac="email-btn"]');
        if (emailElement && emailData) {
            emailElement.textContent = emailData.text;
            emailElement.href = `mailto:${emailData.email}`;
        }
    }

    updateInsta(instaData) {
        const instaElement = document.querySelector('[data-ac="insta"]');
        if (instaElement && instaData) {
            instaElement.textContent = instaData.handle;
            instaElement.href = instaData.url;
        }
    }

    injectServices(services) {
        const container = document.querySelector('[data-ac="services"]');
        if (!container || !services) return;

        container.innerHTML = services.map(service => `
            <div class="service-card">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            </div>
        `).join('');
    }

    injectMenuItems(menuItems) {
        const container = document.querySelector('[data-ac="menu-items"]');
        if (!container || !menuItems) return;

        container.innerHTML = menuItems.map(item => `
            <div class="menu-item">
                <h4>${item.course}</h4>
                <p>${item.description}</p>
            </div>
        `).join('');
    }

    injectTestimonials(testimonials) {
        const container = document.querySelector('[data-ac="testimonials"]');
        if (!container || !testimonials) return;

        container.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>"${testimonial.quote}"</p>
                </div>
                <div class="testimonial-author">
                    <h4>${testimonial.author}</h4>
                    <p>${testimonial.event}</p>
                </div>
            </div>
        `).join('');
    }

    showFallback() {
        const heroHeadline = document.querySelector('[data-ac="hero-headline"]');
        if (heroHeadline) {
            heroHeadline.textContent = 'Chef Jules - Private Chef';
        }
        
        const heroSub = document.querySelector('[data-ac="hero-sub"]');
        if (heroSub) {
            heroSub.textContent = 'Content loading failed. Please refresh the page.';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AntiCoderLoader());
} else {
    new AntiCoderLoader();
}

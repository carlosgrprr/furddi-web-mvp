// main.js

// Entry point for the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized.');

    // Example: Attach event listeners or initialize components here
    const button = document.getElementById('exampleButton');
    if (button) {
        button.addEventListener('click', () => {
            alert('Button clicked!');
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('/')) {
                // Allow navigation to external pages
                return;
            }
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Form validation
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Formulario enviado correctamente.');
    });

    // Add to Cart functionality
    document.querySelectorAll('.product button').forEach(button => {
        button.addEventListener('click', () => {
            alert('Producto añadido al carrito');
        });
    });

    // Fetch blog articles and display them
    async function fetchBlogArticles() {
        try {
            const response = await fetch('/api/blog');
            const articles = await response.json();
            const blogContainer = document.getElementById('blog-articles');
            articles.forEach(article => {
                const articleElement = document.createElement('article');
                articleElement.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.content}</p>
                `;
                blogContainer.appendChild(articleElement);
            });
        } catch (error) {
            console.error('Error fetching blog articles:', error);
        }
    }

    // Fetch and display filtered blog articles
    async function fetchFilteredBlogArticles(category) {
        try {
            const response = await fetch(`/api/blog?category=${category}`);
            const articles = await response.json();
            const blogContainer = document.getElementById('blog-articles');
            blogContainer.innerHTML = ''; // Clear existing articles
            articles.forEach(article => {
                const articleElement = document.createElement('article');
                articleElement.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.content}</p>
                    <p><strong>Category:</strong> ${article.category}</p>
                    <p><strong>Published:</strong> ${new Date(article.createdAt).toLocaleDateString()}</p>
                `;
                blogContainer.appendChild(articleElement);
            });
        } catch (error) {
            console.error('Error fetching blog articles:', error);
        }
    }

    // Fetch marketplace products and display them
    async function fetchMarketplaceProducts() {
        try {
            const response = await fetch('/api/marketplace');
            const products = await response.json();
            const productContainer = document.querySelector('.product-grid');
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <button>Comprar</button>
                `;
                productContainer.appendChild(productElement);
            });
        } catch (error) {
            console.error('Error fetching marketplace products:', error);
        }
    }

    // Fetch and display filtered products
    async function fetchFilteredProducts(category) {
        try {
            const response = await fetch(`/api/marketplace?category=${category}`);
            const products = await response.json();
            const productContainer = document.querySelector('.product-grid');
            productContainer.innerHTML = ''; // Clear existing products
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Stock:</strong> ${product.stock}</p>
                    <button>Comprar</button>
                `;
                productContainer.appendChild(productElement);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Fetch and display reviews for a product
    async function fetchProductReviews(productId) {
        try {
            const response = await fetch(`/api/marketplace/${productId}/reviews`);
            const reviews = await response.json();
            const reviewsContainer = document.getElementById('reviews-container');
            reviewsContainer.innerHTML = ''; // Clear existing reviews
            reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('review');
                reviewElement.innerHTML = `
                    <p><strong>${review.user.name}:</strong> ${review.comment}</p>
                    <p>Rating: ${review.rating}/5</p>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        } catch (error) {
            console.error('Error fetching product reviews:', error);
        }
    }

    // Submit a new review for a product
    async function submitProductReview(productId, userId, rating, comment) {
        try {
            const response = await fetch(`/api/marketplace/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, rating, comment })
            });
            if (response.ok) {
                alert('Review submitted successfully');
                fetchProductReviews(productId); // Refresh reviews
            } else {
                const error = await response.text();
                alert(`Failed to submit review: ${error}`);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    }

    // Handle user registration
    async function registerUser(email, password) {
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                alert('User registered successfully');
            } else {
                const error = await response.text();
                alert(`Registration failed: ${error}`);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    // Handle user login
    async function loginUser(email, password) {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                alert('Login successful');
            } else {
                const error = await response.text();
                alert(`Login failed: ${error}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    // Example usage
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;
            registerUser(email, password);
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            loginUser(email, password);
        });
    }

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const productId = reviewForm.dataset.productId;
            const userId = localStorage.getItem('userId'); // Assume user ID is stored in localStorage
            const rating = reviewForm.querySelector('input[name="rating"]').value;
            const comment = reviewForm.querySelector('textarea[name="comment"]').value;
            submitProductReview(productId, userId, rating, comment);
        });
    }

    // Event listeners for filtering
    const blogCategoryDropdown = document.getElementById('blog-category');
    if (blogCategoryDropdown) {
        blogCategoryDropdown.addEventListener('change', (e) => {
            fetchFilteredBlogArticles(e.target.value);
        });
    }

    const productCategoryDropdown = document.getElementById('product-category');
    if (productCategoryDropdown) {
        productCategoryDropdown.addEventListener('change', (e) => {
            fetchFilteredProducts(e.target.value);
        });
    }

    // Initialize data fetching
    fetchBlogArticles();
    fetchMarketplaceProducts();
});
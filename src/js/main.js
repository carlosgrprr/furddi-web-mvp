// Function to fetch and display product tracking details
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed.');

  const productTrackerDiv = document.getElementById('product-tracker');

  if (!productTrackerDiv) {
    console.warn('Product tracker div not found in the DOM.');
    return;
  }

  // Fetch product tracker data (mocked for now)
  const products = [
    { id: 1, name: 'Artesanía de Madera', origin: 'Pueblo A', status: 'En tránsito' },
    { id: 2, name: 'Jabón Orgánico', origin: 'Pueblo B', status: 'Entregado' },
    { id: 3, name: 'Miel Pura', origin: 'Pueblo C', status: 'En almacén' },
  ];

  // Generate HTML content for each product
  const productHTML = products.map(product => `
    <div class="product">
      <h2>${product.name}</h2>
      <p><strong>Origen:</strong> ${product.origin}</p>
      <p><strong>Estado:</strong> ${product.status}</p>
    </div>
  `).join('');

  // Insert the generated HTML into the product tracker div
  productTrackerDiv.innerHTML = productHTML;

  // Log the current page URL
  console.log('Current page URL:', window.location.pathname);

  // Check if the current page is blog.html
  if (document.getElementById('blog-articles')) {
    console.log('Executing blog articles logic.');

    // Fetch and display blog articles
    const blogContainer = document.getElementById('blog-articles');
    console.log('Blog container:', blogContainer);

    if (!blogContainer) {
      console.warn('Blog container not found in the DOM.');
      return;
    }

    // Fetch blog articles data (mocked for now)
    const articles = [
      { id: 1, title: 'Cómo hacer artesanías', author: 'Juan Pérez', date: '2023-03-01' },
      { id: 2, title: 'Beneficios del jabón orgánico', author: 'Ana Gómez', date: '2023-03-05' },
      { id: 3, title: 'Producción de miel pura', author: 'Carlos Ruiz', date: '2023-03-10' },
    ];

    // Generate HTML content for each article
    const articlesHTML = articles.map(article => `
      <div class="article">
        <h2>${article.title}</h2>
        <p><strong>Autor:</strong> ${article.author}</p>
        <p><strong>Fecha:</strong> ${article.date}</p>
      </div>
    `).join('');

    // Insert the generated HTML into the blog articles container
    blogContainer.innerHTML = articlesHTML;
  } else {
    console.log('Skipping blog articles logic.');
  }

  // Check if the current page is marketplace.html
  if (document.querySelector('.product-grid')) {
    console.log('Executing marketplace products logic.');

    // Fetch and display marketplace products
    const productContainer = document.querySelector('.product-grid');
    console.log('Product grid container:', productContainer);

    if (!productContainer) {
      console.warn('Product grid container not found in the DOM.');
      return;
    }

    // Fetch marketplace products data (mocked for now)
    const marketplaceProducts = [
      { id: 1, name: 'Producto A', price: '$10' },
      { id: 2, name: 'Producto B', price: '$20' },
      { id: 3, name: 'Producto C', price: '$30' },
    ];

    // Generate HTML content for each marketplace product
    const marketplaceHTML = marketplaceProducts.map(product => `
      <div class="marketplace-product">
        <h2>${product.name}</h2>
        <p><strong>Precio:</strong> ${product.price}</p>
      </div>
    `).join('');

    // Insert the generated HTML into the product grid container
    productContainer.innerHTML = marketplaceHTML;
  } else {
    console.log('Skipping marketplace products logic.');
  }
});
// Function to fetch and display product tracking details
document.addEventListener('DOMContentLoaded', () => {
  const productTrackerDiv = document.getElementById('product-tracker');

  if (productTrackerDiv) {
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
  }
});
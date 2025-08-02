// Temporary in-memory data (no database yet)
let products = [
  {
    id: 1,
    name: 'Samsung Galaxy S23',
    price: 800,
    description: 'Latest Samsung smartphone',
    image: '/images/products/samsung-s23.jpg',
    stock: 10
  },
  {
    id: 2,
    name: 'iPhone 15',
    price: 1000,
    description: 'Latest Apple iPhone',
    image: '/images/products/iphone-15.jpg',
    stock: 5
  }
];

const getAllProducts = (req, res) => {
  res.json({ success: true, products });
};

const getProduct = (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product });
};

module.exports = { getAllProducts, getProduct };
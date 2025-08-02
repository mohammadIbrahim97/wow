// Session-based cart (no database)
const addToCart = (req, res) => {
  if (!req.session.cart) req.session.cart = [];
  
  const { productId, quantity } = req.body;
  const existingItem = req.session.cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    req.session.cart.push({ productId, quantity });
  }
  
  res.json({ message: 'Product added to cart', cart: req.session.cart });
};

module.exports = { addToCart, getCart, removeFromCart };
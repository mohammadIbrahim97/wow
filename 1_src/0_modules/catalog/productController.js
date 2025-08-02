// Temporary in-memory data (no database yet)
let products = [
  {
    id: 1,
    name: 'Samsung Galaxy A54',
    price: 850000, // SYP
    priceUSD: 340,
    description: 'هاتف ذكي متطور مع كاميرا عالية الجودة ومعالج قوي',
    image: '/images/products/samsung-a54.jpg',
    stock: 15,
    category: 'هواتف ذكية'
  },
  {
    id: 2,
    name: 'iPhone 13',
    price: 2500000, // SYP
    priceUSD: 1000,
    description: 'آيفون 13 - أداء استثنائي وكاميرا احترافية',
    image: '/images/products/iphone-13.jpg',
    stock: 8,
    category: 'هواتف ذكية'
  },
  {
    id: 3,
    name: 'Xiaomi Redmi Note 12',
    price: 625000, // SYP
    priceUSD: 250,
    description: 'هاتف ذكي اقتصادي بمواصفات ممتازة وبطارية تدوم طويلاً',
    image: '/images/products/xiaomi-redmi-note12.jpg',
    stock: 20,
    category: 'هواتف ذكية'
  },
  {
    id: 4,
    name: 'سماعات AirPods Pro',
    price: 875000, // SYP
    priceUSD: 350,
    description: 'سماعات لاسلكية مع إلغاء الضوضاء وجودة صوت عالية',
    image: '/images/products/airpods-pro.jpg',
    stock: 12,
    category: 'إكسسوارات'
  },
  {
    id: 5,
    name: 'ساعة Apple Watch SE',
    price: 1250000, // SYP
    priceUSD: 500,
    description: 'ساعة ذكية متطورة لتتبع الصحة واللياقة البدنية',
    image: '/images/products/apple-watch-se.jpg',
    stock: 6,
    category: 'ساعات ذكية'
  },
  {
    id: 6,
    name: 'شاحن محمول Anker 20000mAh',
    price: 187500, // SYP
    priceUSD: 75,
    description: 'شاحن محمول بسعة كبيرة وشحن سريع لجميع الأجهزة',
    image: '/images/products/anker-powerbank.jpg',
    stock: 25,
    category: 'إكسسوارات'
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
// Temporary in-memory data (no database yet)
let products = [
  {
    id: 1,
    name: 'سيروم فيتامين سي',
    price: 125000, // SYP
    priceUSD: 50,
    description: 'سيروم مضاد للأكسدة يحتوي على فيتامين سي لإشراق البشرة وتوحيد لونها',
    image: '/images/products/vitamin-c-serum.jpg',
    stock: 25,
    category: 'العناية بالبشرة'
  },
  {
    id: 2,
    name: 'كريم مرطب للوجه',
    price: 87500, // SYP
    priceUSD: 35,
    description: 'كريم مرطب يومي للبشرة الجافة والحساسة مع حماية من أشعة الشمس',
    image: '/images/products/face-moisturizer.jpg',
    stock: 30,
    category: 'العناية بالبشرة'
  },
  {
    id: 3,
    name: 'أحمر شفاه مات',
    price: 62500, // SYP
    priceUSD: 25,
    description: 'أحمر شفاه بتركيبة مقاومة للماء وثبات يدوم طوال اليوم',
    image: '/images/products/matte-lipstick.jpg',
    stock: 18,
    category: 'أحمر الشفاه'
  },
  {
    id: 4,
    name: 'ماسكارا مكثفة',
    price: 75000, // SYP
    priceUSD: 30,
    description: 'ماسكارا لتكثيف وإطالة الرموش مع تركيبة مقاومة للتلطخ',
    image: '/images/products/volume-mascara.jpg',
    stock: 22,
    category: 'مكياج العيون'
  },
  {
    id: 5,
    name: 'بودرة الأساس',
    price: 100000, // SYP
    priceUSD: 40,
    description: 'بودرة مضغوطة لتغطية مثالية وثبات طويل الأمد مناسبة لجميع أنواع البشرة',
    image: '/images/products/foundation-powder.jpg',
    stock: 15,
    category: 'كريم الأساس'
  },
  {
    id: 6,
    name: 'عطر نسائي فرنسي',
    price: 187500, // SYP
    priceUSD: 75,
    description: 'عطر نسائي راقي برائحة الورد والياسمين يدوم لساعات طويلة',
    image: '/images/products/french-perfume.jpg',
    stock: 12,
    category: 'العطور'
  },
  {
    id: 7,
    name: 'شامبو للشعر الجاف',
    price: 50000, // SYP
    priceUSD: 20,
    description: 'شامبو مغذي للشعر الجاف والتالف مع زيت الأرغان والكيراتين',
    image: '/images/products/dry-hair-shampoo.jpg',
    stock: 35,
    category: 'العناية بالشعر'
  },
  {
    id: 8,
    name: 'كريم مزيل العرق',
    price: 37500, // SYP
    priceUSD: 15,
    description: 'مزيل عرق طبيعي خالي من الألومنيوم برائحة منعشة تدوم 24 ساعة',
    image: '/images/products/deodorant-cream.jpg',
    stock: 40,
    category: 'العناية الشخصية'
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
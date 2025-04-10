
// Mock data for products
const mockProducts = [
  {
    id: '1',
    name: 'Organic Bananas',
    category: 'fruits',
    price: 1.99,
    originalPrice: 2.49,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    description: 'Sweet and nutritious organic bananas, perfect for smoothies or as a quick snack. Each bunch contains approximately 5-7 bananas.',
    stock: 50,
    rating: 4.5,
    reviewCount: 23,
    featured: true,
    nutrients: ['Potassium', 'Vitamin C', 'Vitamin B6'],
    tags: ['organic', 'fruit', 'fresh']
  },
  {
    id: '2',
    name: 'Fresh Avocados',
    category: 'fruits',
    price: 2.99,
    originalPrice: 3.49,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80',
    description: 'Creamy and delicious avocados, perfect for guacamole or avocado toast. Sold individually.',
    stock: 30,
    rating: 4.8,
    reviewCount: 42,
    featured: true,
    nutrients: ['Healthy Fats', 'Vitamin K', 'Folate'],
    tags: ['fruit', 'fresh', 'keto']
  },
  {
    id: '3',
    name: 'Red Bell Peppers',
    category: 'vegetables',
    price: 1.49,
    originalPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1513530176992-0cf39c4cbed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Sweet and crunchy red bell peppers, perfect for salads, stir-fries, or roasting. Sold individually.',
    stock: 40,
    rating: 4.3,
    reviewCount: 18,
    featured: false,
    nutrients: ['Vitamin C', 'Vitamin A', 'Vitamin B6'],
    tags: ['vegetable', 'fresh', 'low-calorie']
  },
  {
    id: '4',
    name: 'Organic Whole Milk',
    category: 'dairy',
    price: 3.99,
    originalPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
    description: 'Fresh organic whole milk from grass-fed cows. Rich in calcium and vitamin D. 1 gallon.',
    stock: 25,
    rating: 4.7,
    reviewCount: 36,
    featured: true,
    nutrients: ['Calcium', 'Vitamin D', 'Protein'],
    tags: ['dairy', 'organic', 'refrigerated']
  },
  {
    id: '5',
    name: 'Artisan Sourdough Bread',
    category: 'bakery',
    price: 4.99,
    originalPrice: 5.99,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1585478259715-94c659f8ee2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Freshly baked artisan sourdough bread with a crispy crust and chewy interior. Perfect for sandwiches or alongside soup.',
    stock: 15,
    rating: 4.9,
    reviewCount: 51,
    featured: true,
    nutrients: ['Fiber', 'Protein'],
    tags: ['bakery', 'fresh', 'artisan']
  },
  {
    id: '6',
    name: 'Organic Spinach',
    category: 'vegetables',
    price: 2.99,
    originalPrice: 3.49,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1110&q=80',
    description: 'Fresh organic spinach, perfect for salads, smoothies, or cooking. Pre-washed and ready to eat. 8 oz package.',
    stock: 35,
    rating: 4.6,
    reviewCount: 27,
    featured: false,
    nutrients: ['Iron', 'Vitamin K', 'Vitamin A'],
    tags: ['vegetable', 'organic', 'leafy green']
  },
  {
    id: '7',
    name: 'Cheddar Cheese Block',
    category: 'dairy',
    price: 4.49,
    originalPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1618164436241-4473d3e2de0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Sharp cheddar cheese block, aged for 12 months for a rich flavor. Perfect for sandwiches, cooking, or cheese boards. 8 oz block.',
    stock: 20,
    rating: 4.4,
    reviewCount: 31,
    featured: true,
    nutrients: ['Calcium', 'Protein', 'Vitamin B12'],
    tags: ['dairy', 'cheese', 'refrigerated']
  },
  {
    id: '8',
    name: 'Chocolate Chip Cookies',
    category: 'bakery',
    price: 3.99,
    originalPrice: 4.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    description: 'Freshly baked chocolate chip cookies with a soft center and crispy edges. Pack of 12.',
    stock: 25,
    rating: 4.8,
    reviewCount: 45,
    featured: false,
    nutrients: [],
    tags: ['bakery', 'dessert', 'treat']
  },
  {
    id: '9',
    name: 'Organic Strawberries',
    category: 'fruits',
    price: 3.99,
    originalPrice: 4.59,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1081&q=80',
    description: 'Sweet and juicy organic strawberries, perfect for snacking or desserts. 1 lb container.',
    stock: 20,
    rating: 4.7,
    reviewCount: 38,
    featured: true,
    nutrients: ['Vitamin C', 'Fiber', 'Antioxidants'],
    tags: ['fruit', 'organic', 'berries']
  },
  {
    id: '10',
    name: 'Sweet Potatoes',
    category: 'vegetables',
    price: 1.99,
    originalPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1596097635166-cad370697ef0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Nutritious sweet potatoes, perfect for roasting, mashing, or making fries. Sold by the pound.',
    stock: 40,
    rating: 4.5,
    reviewCount: 22,
    featured: false,
    nutrients: ['Vitamin A', 'Vitamin C', 'Fiber'],
    tags: ['vegetable', 'root vegetable', 'starchy']
  },
  {
    id: '11',
    name: 'Greek Yogurt',
    category: 'dairy',
    price: 2.49,
    originalPrice: null,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    description: 'Creamy plain Greek yogurt, high in protein and probiotics. Perfect for breakfast, snacks, or cooking. 32 oz container.',
    stock: 30,
    rating: 4.6,
    reviewCount: 29,
    featured: true,
    nutrients: ['Protein', 'Calcium', 'Probiotics'],
    tags: ['dairy', 'yogurt', 'protein']
  },
  {
    id: '12',
    name: 'Whole Grain Bread',
    category: 'bakery',
    price: 3.49,
    originalPrice: 3.99,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Nutritious whole grain bread, perfect for sandwiches or toast. 16 oz loaf.',
    stock: 25,
    rating: 4.4,
    reviewCount: 33,
    featured: false,
    nutrients: ['Fiber', 'Protein', 'B Vitamins'],
    tags: ['bakery', 'whole grain', 'bread']
  }
];

// Mock categories
const mockCategories = [
  {
    id: '1',
    name: 'Fruits',
    slug: 'fruits',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    productCount: 45
  },
  {
    id: '2',
    name: 'Vegetables',
    slug: 'vegetables',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    productCount: 38
  },
  {
    id: '3',
    name: 'Dairy',
    slug: 'dairy',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    productCount: 24
  },
  {
    id: '4',
    name: 'Bakery',
    slug: 'bakery',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    productCount: 30
  }
];

// Mock orders for user
const mockOrders = [
  {
    id: '1',
    date: '2023-05-10T10:30:00',
    status: 'delivered',
    total: 29.97,
    items: [
      { id: '1', name: 'Organic Bananas', price: 1.99, quantity: 2 },
      { id: '4', name: 'Organic Whole Milk', price: 3.99, quantity: 1 },
      { id: '5', name: 'Artisan Sourdough Bread', price: 4.99, quantity: 1 },
      { id: '9', name: 'Organic Strawberries', price: 3.99, quantity: 3 }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'Credit Card (ending in 4321)'
  },
  {
    id: '2',
    date: '2023-06-15T14:45:00',
    status: 'delivered',
    total: 22.45,
    items: [
      { id: '2', name: 'Fresh Avocados', price: 2.99, quantity: 3 },
      { id: '7', name: 'Cheddar Cheese Block', price: 4.49, quantity: 1 },
      { id: '10', name: 'Sweet Potatoes', price: 1.99, quantity: 2 },
      { id: '11', name: 'Greek Yogurt', price: 2.49, quantity: 2 }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'PayPal'
  },
  {
    id: '3',
    date: '2023-07-22T09:15:00',
    status: 'processing',
    total: 35.93,
    items: [
      { id: '4', name: 'Organic Whole Milk', price: 3.99, quantity: 2 },
      { id: '5', name: 'Artisan Sourdough Bread', price: 4.99, quantity: 1 },
      { id: '8', name: 'Chocolate Chip Cookies', price: 3.99, quantity: 1 },
      { id: '9', name: 'Organic Strawberries', price: 3.99, quantity: 2 },
      { id: '12', name: 'Whole Grain Bread', price: 3.49, quantity: 2 }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'Credit Card (ending in 4321)'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const getMockProducts = async (category = null) => {
  await delay(800); // Simulate network delay
  if (category && category !== 'all') {
    return mockProducts.filter(product => product.category === category);
  }
  return mockProducts;
};

export const getMockProductById = async (id) => {
  await delay(600); // Simulate network delay
  const product = mockProducts.find(product => product.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const getMockCategories = async () => {
  await delay(500); // Simulate network delay
  return mockCategories;
};

export const getMockFeaturedProducts = async () => {
  await delay(800); // Simulate network delay
  return mockProducts.filter(product => product.featured);
};

export const getMockUserOrders = async (userId) => {
  await delay(700); // Simulate network delay
  return mockOrders;
};

export const createMockOrder = async (orderData) => {
  await delay(1000); // Simulate network delay
  
  // In a real application, this would be sending the order to a server
  const newOrder = {
    id: Math.floor(Math.random() * 1000).toString(),
    date: new Date().toISOString(),
    status: 'processing',
    ...orderData
  };
  
  return {
    success: true,
    order: newOrder
  };
};

export const getMockRelatedProducts = async (productId, category) => {
  await delay(800); // Simulate network delay
  return mockProducts
    .filter(product => product.category === category && product.id !== productId)
    .slice(0, 4);
};

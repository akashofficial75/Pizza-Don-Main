import { DatabaseState, MenuCategory, MenuItem, GoogleReview, GalleryItem, BusinessSettings } from '../types';

export const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: 'cat-1', name: 'Premium Pizza', description: 'Hand-tossed Italian crust with lavish toppings & rich American cheeses', icon: 'Pizza', orderIndex: 1 },
  { id: 'cat-2', name: 'Regular Pizza', description: 'Classic family favorites baked to golden perfection', icon: 'Pizza', orderIndex: 2 },
  { id: 'cat-3', name: 'Burger', description: 'Juicy patties with signature Don sauces & toasted brioche buns', icon: 'Beef', orderIndex: 3 },
  { id: 'cat-4', name: 'Meat Box', description: 'Loaded boxes packed with meats, fries, cheese & secret spices', icon: 'Utensils', orderIndex: 4 },
  { id: 'cat-5', name: 'Shawarma', description: 'Authentic spiced chicken & beef wrapped with creamy garlic tahini', icon: 'Sandwich', orderIndex: 5 },
  { id: 'cat-6', name: 'Chowmein', description: 'Wok-tossed noodles with tender meats, vegetables & oriental glaze', icon: 'UtensilsCrossed', orderIndex: 6 },
  { id: 'cat-7', name: 'Pasta', description: 'Creamy Italian oven-baked & sautéed pastas with generous cheese', icon: 'ChefHat', orderIndex: 7 },
  { id: 'cat-8', name: 'Chicken Wings', description: 'Crispy wings tossed in signature BBQ, Naga & Garlic sauces', icon: 'Flame', orderIndex: 8 },
  { id: 'cat-9', name: 'Chicken Fry', description: 'Golden crispy fried chicken with secret herb seasoning', icon: 'Drumstick', orderIndex: 9 },
  { id: 'cat-10', name: 'Popcorn & Crispy Chicken', description: 'Bite-sized chicken delights & American crispy platters', icon: 'Box', orderIndex: 10 },
  { id: 'cat-11', name: 'French Fry', description: 'Crispy salted, masala, and spicy potato fries', icon: 'Sparkles', orderIndex: 11 },
  { id: 'cat-12', name: 'Momo', description: 'Steamed & fried dumplings with spicy chili garlic dip', icon: 'Flame', orderIndex: 12 },
  { id: 'cat-13', name: 'Coffee & Shake', description: 'Rich cold coffee, velvety shakes & refreshing lassi', icon: 'Coffee', orderIndex: 13 },
  { id: 'cat-14', name: 'Fresh Juice', description: 'Hand-squeezed citrus & seasonal tropical fruit juices', icon: 'CupSoda', orderIndex: 14 }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Premium Pizza (8"/10"/12")
  {
    id: 'p-1',
    name: 'Turkish Meat Lover',
    category: 'Premium Pizza',
    description: 'A lavish feast of seasoned chicken, sausage, mushroom & jalapeño under a double cheese blanket.',
    ingredients: 'Chicken, Cheese, Mushroom, Capsicum, Jalapeno, Sausage, Tomato, Oregano',
    price: { '8': 500, '10': 600, '12': 750 },
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 1
  },
  {
    id: 'p-2',
    name: 'Loaded Chicken Deluxe',
    category: 'Premium Pizza',
    description: 'Overloaded with succulent chicken chunks, fresh bell peppers and imported Spanish olives.',
    ingredients: 'Chicken, Cheese, Capsicum, Tomato, Black Olive',
    price: { '8': 520, '10': 620, '12': 770 },
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 2
  },
  {
    id: 'p-3',
    name: 'Loaded Cheese Pizza',
    category: 'Premium Pizza',
    description: 'The Don’s ultimate cheese pull: American cheddar and mozzarella with chili flakes & spicy jalapeños.',
    ingredients: 'Cheese, American Cheese, Chicken, Black Olive, Oregano, Chili Flakes, Jalapeno',
    price: { '8': 550, '10': 650, '12': 800 },
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller', 'Spicy'],
    orderIndex: 3
  },
  {
    id: 'p-4',
    name: 'Chicken Pepperoni',
    category: 'Premium Pizza',
    description: 'Classic Italian pepperoni slices paired with spiced chicken and oregano aromatics.',
    ingredients: 'Chicken, Cheese, Pepperoni, Oregano, Capsicum, Chili Flakes',
    price: { '8': 430, '10': 530, '12': 700 },
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 4
  },
  {
    id: 'p-5',
    name: 'House Special',
    category: 'Premium Pizza',
    description: 'The Godfather of our pizzas. Premium beef, smoked sausages, mushrooms & olives on our grand 12-inch crust.',
    ingredients: 'Beef, Capsicum, Mushroom, Sausage, Tomato, Black Olive, Jalapeno, Oregano, Chili Flakes',
    price: { '12': 999 },
    note: 'Only available in 12"',
    imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller', 'Spicy'],
    orderIndex: 5
  },

  // Regular Pizza (8"/10"/12")
  {
    id: 'rp-1',
    name: 'Meat Lover',
    category: 'Regular Pizza',
    description: 'Packed with tender chicken, sliced sausage, jalapeños and signature oregano tomato base.',
    ingredients: 'Chicken, Sausage, Cheese, Capsicum, Tomato, Oregano, Chili Flakes, Jalapeno',
    price: { '8': 350, '10': 550, '12': 700 },
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 6
  },
  {
    id: 'rp-2',
    name: 'BBQ Blaze Chicken',
    category: 'Regular Pizza',
    description: 'Smoky barbecue glazed chicken, button mushrooms, black olives & chili flakes.',
    ingredients: 'BBQ Sauce, Chicken, Mushroom, Black Olive, Chili Flakes, Oregano',
    price: { '8': 330, '10': 470, '12': 620 },
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 7
  },
  {
    id: 'rp-3',
    name: 'Fantastic 4',
    category: 'Regular Pizza',
    description: 'Four meat varieties: chicken, meatballs, smoked sausage, and mushrooms with oregano.',
    ingredients: 'Chicken, Meat Ball, Cheese, Mushroom, Sausage, Chili Flakes, Oregano, Capsicum',
    price: { '8': 370, '10': 570, '12': 730 },
    imageUrl: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 8
  },
  {
    id: 'rp-4',
    name: 'Classic Sausage Pizza',
    category: 'Regular Pizza',
    description: 'Succulent chicken sausage over secret sauce, diced onions, and chili flakes.',
    ingredients: 'Chicken Sausage, Cheese, Secret Sauce, Onion, Chili Flakes',
    price: { '8': 350, '10': 480, '12': 620 },
    imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 9
  },
  {
    id: 'rp-5',
    name: 'Mushroom Supreme',
    category: 'Regular Pizza',
    description: 'Earth-fresh mushrooms paired with seasoned chicken & golden mozzarella.',
    ingredients: 'Mushroom, Chicken, Cheese, Oregano, Capsicum',
    price: { '8': 350, '10': 500, '12': 630 },
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 10
  },
  {
    id: 'rp-6',
    name: 'Loaded Chicken Supreme',
    category: 'Regular Pizza',
    description: 'Generous chicken cubes with black olives and crisp capsicum.',
    ingredients: 'Chicken, Cheese, Capsicum, Tomato, Black Olive',
    price: { '8': 320, '10': 450, '12': 580 },
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 11
  },
  {
    id: 'rp-7',
    name: 'Beef Boss Supreme',
    category: 'Regular Pizza',
    description: 'Juicy spiced beef chunks with fiery jalapeños and black olives.',
    ingredients: 'Beef, Capsicum, Tomato, Black Olive, Chili Flakes, Oregano, Jalapeno',
    price: { '8': 500, '10': 600, '12': 800 },
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 12
  },
  {
    id: 'rp-8',
    name: 'Naga Fire Blast',
    category: 'Regular Pizza',
    description: 'For spice lovers: loaded with special Naga ghost-pepper sauce and chili flakes.',
    ingredients: 'Chicken, Cheese, Capsicum, Tomato, Special Naga Sauce, Chili Flakes',
    price: { '8': 370, '10': 470, '12': 600 },
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000&auto=format&fit=crop',
    tags: ['Spicy'],
    orderIndex: 13
  },
  {
    id: 'rp-9',
    name: 'Sausage Blast',
    category: 'Regular Pizza',
    description: 'Double sausage layers with melted mozzarella and oregano.',
    ingredients: 'Sausage, Cheese, Capsicum, Tomato, Oregano',
    price: { '8': 250, '10': 350, '12': 500 },
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 14
  },
  {
    id: 'rp-10',
    name: 'Veg Lover',
    category: 'Regular Pizza',
    description: 'Garden fresh tomatoes, capsicum, olives & oregano over melted cheese.',
    ingredients: 'Cheese, Capsicum, Tomato, Oregano, Black Olive',
    price: { '8': 250, '10': 330, '12': 450 },
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 15
  },

  // Burger
  {
    id: 'bg-1',
    name: 'Chicken Burger',
    category: 'Burger',
    description: 'Tender chicken patty with mayo and crisp lettuce on a toasted bun.',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 16
  },
  {
    id: 'bg-2',
    name: 'BBQ Chicken Burger',
    category: 'Burger',
    description: 'Smoky barbecue glaze over grilled chicken patty with melted cheese.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 17
  },
  {
    id: 'bg-3',
    name: 'Crispy Chicken Burger',
    category: 'Burger',
    description: 'Extra crunch golden chicken fillet with creamy garlic sauce.',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 18
  },
  {
    id: 'bg-4',
    name: 'Naga Burger',
    category: 'Burger',
    description: 'Fiery Naga ghost-pepper infused sauce over spicy chicken fillet.',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
    tags: ['Spicy'],
    orderIndex: 19
  },
  {
    id: 'bg-5',
    name: 'American Patty Burger',
    category: 'Burger',
    description: 'Thick American-style juicy beef patty with cheddar slice & secret Don sauce.',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 20
  },

  // Meat Box
  {
    id: 'mb-1',
    name: 'Student Meat Box',
    category: 'Meat Box',
    description: 'Budget-friendly loaded box of fries, chicken bites & creamy mayo.',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 21
  },
  {
    id: 'mb-2',
    name: 'Classic Meat Box',
    category: 'Meat Box',
    description: 'Generous chicken cubes, sausages, seasoned fries & cheese drizzle.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 22
  },
  {
    id: 'mb-3',
    name: 'BBQ Meat Box',
    category: 'Meat Box',
    description: 'Smoky BBQ glazed meats over crispy fries with garlic sauce.',
    price: 170,
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 23
  },
  {
    id: 'mb-4',
    name: 'Motka Meat Box',
    category: 'Meat Box',
    description: 'Traditional clay-pot style spiced meat box with melted cheese layer.',
    price: 190,
    imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 24
  },
  {
    id: 'mb-5',
    name: 'Don Special Meat Box',
    category: 'Meat Box',
    description: 'The ultimate boss box: beef, chicken, sausages, double cheese, and secret spices.',
    price: 220,
    imageUrl: 'https://images.unsplash.com/photo-1623238913973-21e45cced554?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller', 'Spicy'],
    orderIndex: 25
  },

  // French Fry
  {
    id: 'ff-1',
    name: 'Masala French Fry',
    category: 'French Fry',
    description: 'Crispy golden fries tossed in secret aromatic masala seasoning.',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 26
  },
  {
    id: 'ff-2',
    name: 'Spicy French Fry',
    category: 'French Fry',
    description: 'Hot chili garlic seasoned fries served with spicy dip.',
    price: 130,
    imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=1000&auto=format&fit=crop',
    tags: ['Spicy'],
    orderIndex: 27
  },

  // Shawarma
  {
    id: 'sh-1',
    name: 'Chicken Shawarma',
    category: 'Shawarma',
    description: 'Marinated rotisserie chicken with garlic tahini wrapped in soft bread.',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 28
  },
  {
    id: 'sh-2',
    name: 'Cheesy Shawarma',
    category: 'Shawarma',
    description: 'Loaded chicken shawarma with melted mozzarella & cheddar.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 29
  },
  {
    id: 'sh-3',
    name: 'Naga Shawarma',
    category: 'Shawarma',
    description: 'Spicy Naga pepper sauce mixed with roasted chicken & pickles.',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1000&auto=format&fit=crop',
    tags: ['Spicy'],
    orderIndex: 30
  },
  {
    id: 'sh-4',
    name: 'Pizza Don Special Shawarma',
    category: 'Shawarma',
    description: 'Oven-toasted signature shawarma with double meats and garlic cream.',
    price: 220,
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 31
  },
  {
    id: 'sh-5',
    name: 'Beef Shawarma',
    category: 'Shawarma',
    description: 'Spiced shredded beef with onions, tomatoes & tahini.',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 32
  },

  // Chowmein
  {
    id: 'ch-1',
    name: 'Chicken Chowmein',
    category: 'Chowmein',
    description: 'Wok-fried egg noodles with tender chicken strips & vegetables.',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 33
  },
  {
    id: 'ch-2',
    name: 'Mix Chowmein',
    category: 'Chowmein',
    description: 'Chicken, beef & sausages wok-tossed with oyster soy glaze.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 34
  },
  {
    id: 'ch-3',
    name: 'Don Special Chowmein',
    category: 'Chowmein',
    description: 'Loaded boss noodles with fried egg, prawn, beef, chicken and chili oil.',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller', 'Spicy'],
    orderIndex: 35
  },

  // Pasta
  {
    id: 'pa-1',
    name: 'Chicken Pasta',
    category: 'Pasta',
    description: 'Penne pasta tossed in rich tomato herbs with roasted chicken.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281298?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 36
  },
  {
    id: 'pa-2',
    name: 'Creamy Mushroom Pasta',
    category: 'Pasta',
    description: 'Silky white cream sauce with garlic mushrooms and parmesan.',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 37
  },
  {
    id: 'pa-3',
    name: 'Oven Baked Pasta',
    category: 'Pasta',
    description: 'Italian oven-baked cheese crusted pasta loaded with chicken & sausage.',
    price: 200,
    imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 38
  },
  {
    id: 'pa-4',
    name: 'Beef Pasta',
    category: 'Pasta',
    description: 'Savory minced beef bolognese pasta with Italian herbs.',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 39
  },

  // Chicken Wings
  {
    id: 'cw-1',
    name: 'Crispy Wings',
    category: 'Chicken Wings',
    description: 'Crunchy golden battered chicken wings served with garlic dip.',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1527477247444-e7951d0e6518?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 40
  },
  {
    id: 'cw-2',
    name: 'BBQ Wings',
    category: 'Chicken Wings',
    description: 'Glazed in sticky smoky hickory barbecue sauce.',
    price: 190,
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 41
  },
  {
    id: 'cw-3',
    name: 'Naga Wings',
    category: 'Chicken Wings',
    description: 'Fiery ghost-pepper sauce wings that kick back.',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=1000&auto=format&fit=crop',
    tags: ['Spicy'],
    orderIndex: 42
  },
  {
    id: 'cw-4',
    name: 'Garlic Wings',
    category: 'Chicken Wings',
    description: 'Tossed in roasted garlic butter and parsley.',
    price: 190,
    imageUrl: 'https://images.unsplash.com/photo-1527477247444-e7951d0e6518?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 43
  },
  {
    id: 'cw-5',
    name: 'Hot Buffalo Chicken',
    category: 'Chicken Wings',
    description: 'American classic tangy hot buffalo glaze.',
    price: 220,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop',
    tags: ['Spicy'],
    orderIndex: 44
  },

  // Chicken Fry (1pc / 4pcs)
  {
    id: 'cf-1',
    name: 'Chicken Fry',
    category: 'Chicken Fry',
    description: 'Signature crispy fried chicken piece with herb crust.',
    price: { '1pc': 90, '4pcs': 340 },
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 45
  },
  {
    id: 'cf-2',
    name: 'Thai Fry Chicken',
    category: 'Chicken Fry',
    description: 'Sweet and spicy Thai glazed fried chicken pieces.',
    price: { '1pc': 100, '4pcs': 380 },
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 46
  },
  {
    id: 'cf-3',
    name: 'BBQ Chicken',
    category: 'Chicken Fry',
    description: 'Oven-roasted chicken leg glazed in smoky BBQ reduction.',
    price: { '1pc': 120, '4pcs': 460 },
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 47
  },

  // Popcorn & Crispy Chicken
  {
    id: 'pc-1',
    name: 'Popcorn Chicken (8pcs)',
    category: 'Popcorn & Crispy Chicken',
    description: 'Bite-sized golden crunchy chicken nuggets.',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 48
  },
  {
    id: 'pc-2',
    name: 'American Chicken (6pcs)',
    category: 'Popcorn & Crispy Chicken',
    description: 'Southern American style crispy chicken tenders.',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1585325701165-351af916e581?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 49
  },
  {
    id: 'pc-3',
    name: 'Balallam Chicken Box',
    category: 'Popcorn & Crispy Chicken',
    description: 'Loaded box of crispy chicken pieces, fries & special dips.',
    price: 220,
    imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 50
  },

  // Coffee & Shake
  {
    id: 'cs-1',
    name: 'Cold Coffee',
    category: 'Coffee & Shake',
    description: 'Chilled espresso blended with milk & vanilla ice cream.',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 51
  },
  {
    id: 'cs-2',
    name: 'Chocolate Cold Coffee',
    category: 'Coffee & Shake',
    description: 'Rich Belgian chocolate syrup infused cold brew coffee.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 52
  },
  {
    id: 'cs-3',
    name: 'Lassi',
    category: 'Coffee & Shake',
    description: 'Traditional sweetened churned yogurt drink.',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 53
  },
  {
    id: 'cs-4',
    name: 'Strawberry Shake',
    category: 'Coffee & Shake',
    description: 'Creamy milkshake with ripe strawberries and cream.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 54
  },
  {
    id: 'cs-5',
    name: 'Oreo Shake',
    category: 'Coffee & Shake',
    description: 'Crushed Oreo cookies blended with thick vanilla cream.',
    price: 130,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 55
  },

  // Fresh Juice
  {
    id: 'fj-1',
    name: 'Mint Lemonade',
    category: 'Fresh Juice',
    description: 'Refreshingly cool mint leaves muddled with fresh lemon.',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 56
  },
  {
    id: 'fj-2',
    name: 'Lemonade',
    category: 'Fresh Juice',
    description: 'Classic chilled sweetened fresh lime juice.',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 57
  },
  {
    id: 'fj-3',
    name: 'Kacha Aamer Juice',
    category: 'Fresh Juice',
    description: 'Authentic green mango juice with green chili & black salt.',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 58
  },
  {
    id: 'fj-4',
    name: 'Orange Juice',
    category: 'Fresh Juice',
    description: 'Freshly squeezed sweet orange citrus juice.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 59
  },
  {
    id: 'fj-5',
    name: 'Mango Juice',
    category: 'Fresh Juice',
    description: 'Rich tropical ripe mango nectar.',
    price: 130,
    imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 60
  },

  // Momo
  {
    id: 'mo-1',
    name: 'Chicken MoMo (6pcs)',
    category: 'Momo',
    description: 'Juicy steamed chicken dumplings served with spicy garlic sauce.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 61
  },
  {
    id: 'mo-2',
    name: 'Garlic MoMo (6pcs)',
    category: 'Momo',
    description: 'Dumplings infused with aromatic roasted garlic.',
    price: 170,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1000&auto=format&fit=crop',
    tags: [],
    orderIndex: 62
  },
  {
    id: 'mo-3',
    name: 'Naga MoMo (6pcs)',
    category: 'Momo',
    description: 'Fiery Naga chili sauce drizzled over steamed chicken dumplings.',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=1000&auto=format&fit=crop',
    tags: ['Spicy'],
    orderIndex: 63
  },
  {
    id: 'mo-4',
    name: 'Fry MoMo (6pcs)',
    category: 'Momo',
    description: 'Crispy pan-fried dumplings with crunchy golden bottoms.',
    price: 170,
    imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=1000&auto=format&fit=crop',
    tags: ['Best Seller'],
    orderIndex: 64
  }
];

export const INITIAL_REVIEWS: GoogleReview[] = [
  {
    id: 'rev-1',
    authorName: 'Tanvir Ahmed',
    rating: 5,
    timeAgo: '2 weeks ago',
    comment: 'Best pizza in Dhamrai! The Turkish Meat Lover 12" is loaded with cheese and toppings. The Don vibe is classy and perfect for family hangouts at Thana Stand.',
    badge: 'Local Guide'
  },
  {
    id: 'rev-2',
    authorName: 'Fahmida Rahman',
    rating: 5,
    timeAgo: '1 month ago',
    comment: 'We celebrated my brother’s birthday here. Excellent table service and the Motka Meat Box & Naga Wings were incredible. 5/5 stars!',
    badge: 'Verified Customer'
  },
  {
    id: 'rev-3',
    authorName: 'Sajidul Islam',
    rating: 5,
    timeAgo: '3 weeks ago',
    comment: 'The Italian-American mob-boss interior theme looks stunning! Also their WhatsApp order reply is super fast. Highly recommend Kacha Aamer Juice after spicy pizza.',
    badge: 'Dhamrai Resident'
  },
  {
    id: 'rev-4',
    authorName: 'Mahmudur Chowdhury',
    rating: 5,
    timeAgo: '2 months ago',
    comment: 'Finally an upscale boutique pizzeria in Dhamrai! The crust is hand-tossed and fresh. House Special pizza is worth every Taka.',
    badge: 'Foodie'
  },
  {
    id: 'rev-5',
    authorName: 'Afrin Sultana',
    rating: 5,
    timeAgo: '1 month ago',
    comment: 'Loved the atmosphere at Monowar Complex. Clean, hygienic, and very courteous staff. Will definitely visit again.',
    badge: 'Verified Customer'
  },
  {
    id: 'rev-6',
    authorName: 'Rakib Hossain',
    rating: 5,
    timeAgo: '3 weeks ago',
    comment: 'BBQ Blaze Pizza & Oreo Shake combination is top notch! Very reasonable price for such premium quality in Dhamrai.',
    badge: 'Local Guide'
  },
  {
    id: 'rev-7',
    authorName: 'Kamrul Hasan',
    rating: 4,
    timeAgo: '1 week ago',
    comment: 'Food was really tasty, especially the Naga Wings. Delivery took a bit longer than expected on a Friday night, but worth the wait.',
    badge: 'Verified Customer'
  },
  {
    id: 'rev-8',
    authorName: 'Nusrat Jahan',
    rating: 3,
    timeAgo: '5 days ago',
    comment: 'Taste is good overall, but I felt the portion for the price could be a little bigger. Will try their pizza next time.',
    badge: 'Foodie'
  },
  {
    id: 'rev-9',
    authorName: 'Imran Kabir',
    rating: 4,
    timeAgo: '2 weeks ago',
    comment: 'Loved the Beef Boss Supreme pizza! Service was a bit slow during a busy evening but the staff were polite and the food made up for it.',
    badge: 'Local Guide'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Turkish Meat Lover 12"',
    category: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
    caption: 'Our signature Turkish Meat Lover with double mozzarella and beef sausages.'
  },
  {
    id: 'gal-2',
    title: 'The Don’s Velvet Lounge',
    category: 'Ambiance',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
    caption: 'Dim moody lighting, tailored elegance, and old-money Italian atmosphere in Dhamrai.'
  },
  {
    id: 'gal-3',
    title: 'Hand-Tossed Artisan Crust',
    category: 'Craft',
    imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=1000&auto=format&fit=crop',
    caption: 'Every pizza is hand-kneaded with imported olive oil and 48-hour fermented dough.'
  },
  {
    id: 'gal-4',
    title: 'Motka Meat Box Supreme',
    category: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    caption: 'Clay-pot style spiced meat box overflowing with chicken, sausage, and melted cheese.'
  },
  {
    id: 'gal-5',
    title: 'Private Party Table Setup',
    category: 'Ambiance',
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop',
    caption: 'Reserve our boutique VIP tables for birthdays, family gatherings, and corporate events.'
  },
  {
    id: 'gal-6',
    title: 'Crispy Wings & Spiced Shawarma',
    category: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1000&auto=format&fit=crop',
    caption: 'Golden battered wings tossed in signature BBQ glaze alongside toasted chicken shawarma.'
  }
];

export const INITIAL_SETTINGS: BusinessSettings = {
  restaurantName: 'Pizza Don',
  address: 'Monowar Complex, Thana Stand, Dhamrai 1350, Bangladesh',
  whatsappOrderNumber: '8801729668090',
  whatsappDisplay: '01729-668090',
  phoneNumber: '01911-901910',
  openingHours: 'Open Daily, 12:00 PM – 10:00 PM',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.514781492983!2d90.2088!3d23.9189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755e88888888889%3A0x8888888888888888!2sDhamrai!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd',
  heroTagline: 'More Than Pizza — The Full Don Experience.',
  heroSubtitle: 'Dhamrai’s premier upscale boutique pizzeria. Hand-tossed crusts, rich American cheeses, and classic Italian-American elegance.',
  aboutText: 'Born in the heart of Dhamrai at Monowar Complex (Thana Stand), Pizza Don was founded with a singular cinematic vision: to bring old-money Italian restaurant craftsmanship together with bold, unforgettable flavor. Whether you crave our 12-inch Turkish Meat Lover, our signature Motka Meat Box, or a private VIP birthday celebration, our house welcomes you like family.',
  facebookUrl: 'https://www.facebook.com/pizzadondhamrai',
  instagramUrl: 'https://instagram.com',
  siteLogoUrl: '/pizzadon-logo.jpg'
};

export const INITIAL_DATABASE_STATE: DatabaseState = {
  categories: INITIAL_CATEGORIES,
  items: INITIAL_MENU_ITEMS,
  bookings: [
    {
      id: 'book-101',
      bookingType: 'table',
      name: 'Shahriar Alam',
      phone: '01711-234567',
      date: '2026-08-05',
      timeSlot: '18:30',
      guests: 4,
      occasion: 'Family Dinner',
      notes: 'Window side table if possible',
      status: 'Confirmed',
      createdAt: '2026-08-01T14:20:00Z'
    },
    {
      id: 'book-102',
      bookingType: 'event',
      name: 'Nusrat Jahan',
      phone: '01822-890123',
      date: '2026-08-10',
      timeSlot: '19:00',
      guests: 18,
      occasion: 'Birthday Party',
      eventThemeRequest: 'Black & Gold Don Theme with table balloons',
      notes: 'We will bring our own birthday cake',
      status: 'Pending',
      createdAt: '2026-08-02T10:15:00Z'
    }
  ],
  blockedDates: [],
  settings: INITIAL_SETTINGS,
  gallery: INITIAL_GALLERY,
  reviews: INITIAL_REVIEWS
};

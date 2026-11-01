import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import { ProductModel } from '@/models/Product';
import { CategoryModel } from '@/models/Category';
import { OrderModel } from '@/models/Order';
import { SiteSettingsModel } from '@/models/SiteSettings';
import { BranchModel } from '@/models/Branch';
import {
  Product,
  Category,
  Order,
  Branch,
  SiteSettings,
  OrderStatus,
} from '@/types';
import {
  initialCategories,
  initialProducts,
  initialBranches,
  initialSiteSettings,
} from './initial-data';

// Persistent local file-cache helpers for standalone / serverless multi-worker resilience
const CACHE_DIR = path.join(process.cwd(), '.data-cache');

function ensureCacheDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  } catch {
    // Ignore
  }
}

function loadCache<T>(key: string, fallback: T): T {
  try {
    ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch {
    // Ignore
  }
  return fallback;
}

function saveCache<T>(key: string, data: T): void {
  try {
    ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Ignore
  }
}

function getMemoryCategories(): Category[] {
  return loadCache<Category[]>('categories', [...initialCategories]);
}
function setMemoryCategories(cats: Category[]): void {
  saveCache('categories', cats);
}

function getMemoryProducts(): Product[] {
  return loadCache<Product[]>('products', [...initialProducts]);
}
function setMemoryProducts(prods: Product[]): void {
  saveCache('products', prods);
}

function getMemoryBranches(): Branch[] {
  return loadCache<Branch[]>('branches', [...initialBranches]);
}
function setMemoryBranches(branches: Branch[]): void {
  saveCache('branches', branches);
}

function getMemorySiteSettings(): SiteSettings {
  return loadCache<SiteSettings>('settings', { ...initialSiteSettings });
}
function setMemorySiteSettings(settings: SiteSettings): void {
  saveCache('settings', settings);
}

function getMemoryOrders(): Order[] {
  return loadCache<Order[]>('orders', []);
}
function setMemoryOrders(orders: Order[]): void {
  saveCache('orders', orders);
}

const realImageFallbackMap: Record<string, string> = {
  '/images/baklava.svg': '/images/products/baklava-real.jpg',
  '/images/kleicha.svg': '/images/products/kleicha-real.jpg',
  '/images/maamoul.svg': '/images/products/maamoul-real.jpg',
  '/images/chocolate.svg': '/images/products/chocolate-real.jpg',
  '/images/cups.svg': '/images/products/cups-real.jpg',
  '/images/petit-fours.svg': '/images/products/petit-fours-real.jpg',
  '/images/savory.svg': '/images/products/savory-real.jpg',
  '/images/boxes.svg': '/images/products/boxes-real.jpg',
  '/images/hero.svg': '/images/hero-patisserie.jpg',
};

function normalizeProductPhotos(prod: Product): Product {
  if (!prod) return prod;
  const copy = { ...prod };
  if (Array.isArray(copy.images)) {
    copy.images = copy.images.map((img) => ({
      ...img,
      url: realImageFallbackMap[img.url] || img.url,
    }));
  }
  return copy;
}

function normalizeCategoryPhotos(cat: Category): Category {
  if (!cat) return cat;
  return {
    ...cat,
    image: cat.image ? (realImageFallbackMap[cat.image] || cat.image) : '',
  };
}

async function initMongoSeedIfNeeded() {
  try {
    const catCount = await CategoryModel.countDocuments();
    if (catCount === 0) {
      await CategoryModel.insertMany(initialCategories);
    }
    const prodCount = await ProductModel.countDocuments();
    if (prodCount === 0) {
      await ProductModel.insertMany(initialProducts);
    }
    const branchCount = await BranchModel.countDocuments();
    if (branchCount === 0) {
      await BranchModel.insertMany(initialBranches);
    }
    const settingsCount = await SiteSettingsModel.countDocuments();
    if (settingsCount === 0) {
      await SiteSettingsModel.create(initialSiteSettings);
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await initMongoSeedIfNeeded();
      const list = await CategoryModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
      return JSON.parse(JSON.stringify(list)).map(normalizeCategoryPhotos);
    } catch (err) {
      console.error('Error fetching categories from MongoDB:', err);
    }
  }
  return getMemoryCategories().filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder).map(normalizeCategoryPhotos);
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await initMongoSeedIfNeeded();
      const list = await CategoryModel.find().sort({ sortOrder: 1 }).lean();
      return JSON.parse(JSON.stringify(list)).map(normalizeCategoryPhotos);
    } catch (err) {
      console.error('Error fetching admin categories from MongoDB:', err);
    }
  }
  return [...getMemoryCategories()].sort((a, b) => a.sortOrder - b.sortOrder).map(normalizeCategoryPhotos);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await initMongoSeedIfNeeded();
      const cat = await CategoryModel.findOne({ slug }).lean();
      return cat ? normalizeCategoryPhotos(JSON.parse(JSON.stringify(cat))) : null;
    } catch (err) {
      console.error('Error fetching category by slug from MongoDB:', err);
    }
  }
  const found = getMemoryCategories().find((c) => c.slug === slug);
  return found ? normalizeCategoryPhotos(found) : null;
}

export async function updateCategory(
  category: Partial<Category> & { _id: string }
): Promise<Category | null> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      const updated = await CategoryModel.findByIdAndUpdate(category._id, category, {
        new: true,
      }).lean();
      return updated ? JSON.parse(JSON.stringify(updated)) : null;
    } catch (err) {
      console.error('Error updating category in MongoDB:', err);
    }
  }

  const cats = getMemoryCategories();
  const idx = cats.findIndex((c) => c._id === category._id);
  if (idx !== -1) {
    cats[idx] = { ...cats[idx], ...category } as Category;
    setMemoryCategories(cats);
    return cats[idx];
  }
  return null;
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const db = await connectToDatabase();
  const cats = getMemoryCategories();
  const newCat: Category = {
    _id: `cat-${Date.now()}`,
    name: category.name || '',
    nameEn: category.nameEn || '',
    slug: category.slug || `cat-${Date.now()}`,
    description: category.description || '',
    image: category.image || '',
    isActive: category.isActive !== undefined ? category.isActive : true,
    sortOrder: category.sortOrder || cats.length + 1,
  };

  if (db.isConnected) {
    try {
      const created = await CategoryModel.create(newCat);
      return JSON.parse(JSON.stringify(created));
    } catch (err) {
      console.error('Error creating category in MongoDB:', err);
    }
  }

  cats.push(newCat);
  setMemoryCategories(cats);
  return newCat;
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  if (category._id && category._id.length > 3) {
    const updated = await updateCategory(category as Partial<Category> & { _id: string });
    if (updated) return updated;
  }
  return createCategory(category);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await CategoryModel.findByIdAndDelete(id);
      return true;
    } catch (err) {
      console.error('Error deleting category from MongoDB:', err);
    }
  }
  const cats = getMemoryCategories().filter((c) => c._id !== id);
  setMemoryCategories(cats);
  return true;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export async function getProducts(options?: {
  categorySlug?: string;
  isFeatured?: boolean;
  search?: string;
  limit?: number;
  saleMethod?: string;
}): Promise<Product[]> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await initMongoSeedIfNeeded();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = { isPublished: true };

      if (options?.categorySlug) {
        query.categorySlug = options.categorySlug;
      }
      if (options?.isFeatured !== undefined) {
        query.isFeatured = options.isFeatured;
      }
      if (options?.search) {
        query.$or = [
          { name: { $regex: options.search, $options: 'i' } },
          { nameEn: { $regex: options.search, $options: 'i' } },
          { description: { $regex: options.search, $options: 'i' } },
        ];
      }
      if (options?.saleMethod) {
        query['variants.saleMethod'] = options.saleMethod;
      }

      let q = ProductModel.find(query).sort({ createdAt: -1 });
      if (options?.limit) q = q.limit(options.limit);
      const list = await q.lean();
      return JSON.parse(JSON.stringify(list)).map(normalizeProductPhotos);
    } catch (err) {
      console.error('Error fetching products from MongoDB:', err);
    }
  }

  let list = getMemoryProducts().filter((p) => p.isPublished);

  if (options?.categorySlug) {
    list = list.filter((p) => p.categorySlug === options.categorySlug);
  }
  if (options?.isFeatured !== undefined) {
    list = list.filter((p) => p.isFeatured === options.isFeatured);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(s)) ||
        (p.description && p.description.toLowerCase().includes(s))
    );
  }
  if (options?.saleMethod) {
    list = list.filter((p) =>
      p.variants.some((v) => v.saleMethod === options.saleMethod)
    );
  }

  if (options?.limit) list = list.slice(0, options.limit);
  return list.map(normalizeProductPhotos);
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await initMongoSeedIfNeeded();
      const list = await ProductModel.find().sort({ createdAt: -1 }).lean();
      return JSON.parse(JSON.stringify(list)).map(normalizeProductPhotos);
    } catch (err) {
      console.error('Error fetching admin products from MongoDB:', err);
    }
  }
  return getMemoryProducts().map(normalizeProductPhotos);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await initMongoSeedIfNeeded();
      const prod = await ProductModel.findOne({ slug }).lean();
      return prod ? normalizeProductPhotos(JSON.parse(JSON.stringify(prod))) : null;
    } catch (err) {
      console.error('Error fetching product by slug from MongoDB:', err);
    }
  }
  const found = getMemoryProducts().find((p) => p.slug === slug);
  return found ? normalizeProductPhotos(found) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await initMongoSeedIfNeeded();
      const prod = await ProductModel.findById(id).lean();
      return prod ? normalizeProductPhotos(JSON.parse(JSON.stringify(prod))) : null;
    } catch (err) {
      console.error('Error fetching product by id from MongoDB:', err);
    }
  }
  const found = getMemoryProducts().find((p) => p._id === id);
  return found ? normalizeProductPhotos(found) : null;
}

export async function updateProduct(
  product: Partial<Product> & { _id: string }
): Promise<Product | null> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      const updated = await ProductModel.findByIdAndUpdate(product._id, product, {
        new: true,
      }).lean();
      return updated ? JSON.parse(JSON.stringify(updated)) : null;
    } catch (err) {
      console.error('Error updating product in MongoDB:', err);
    }
  }

  const prods = getMemoryProducts();
  const idx = prods.findIndex((p) => p._id === product._id);
  if (idx !== -1) {
    prods[idx] = { ...prods[idx], ...product } as Product;
    setMemoryProducts(prods);
    return prods[idx];
  }
  return null;
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const db = await connectToDatabase();
  const newProd: Product = {
    _id: `prod-${Date.now()}`,
    name: product.name || '',
    nameEn: product.nameEn,
    slug: product.slug || `prod-${Date.now()}`,
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    categorySlug: product.categorySlug || 'eastern-sweets-baklava',
    categoryName: product.categoryName || 'الحلويات الشرقية والبقلاوة',
    images: product.images || [],
    variants: product.variants || [],
    calories: product.calories,
    caloriesBasis: product.caloriesBasis,
    weight: product.weight,
    isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
    isPublished: product.isPublished !== undefined ? product.isPublished : true,
    isFeatured: product.isFeatured || false,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (db.isConnected) {
    try {
      const created = await ProductModel.create(newProd);
      return JSON.parse(JSON.stringify(created));
    } catch (err) {
      console.error('Error creating product in MongoDB:', err);
    }
  }

  const prods = getMemoryProducts();
  prods.unshift(newProd);
  setMemoryProducts(prods);
  return newProd;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  if (product._id && product._id.length > 3) {
    const updated = await updateProduct(product as Partial<Product> & { _id: string });
    if (updated) return updated;
  }
  return createProduct(product);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await ProductModel.findByIdAndDelete(id);
      return true;
    } catch (err) {
      console.error('Error deleting product from MongoDB:', err);
    }
  }
  const prods = getMemoryProducts().filter((p) => p._id !== id);
  setMemoryProducts(prods);
  return true;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export async function getOrders(options?: {
  status?: OrderStatus;
  search?: string;
  limit?: number;
}): Promise<Order[]> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
      if (options?.status) query.status = options.status;
      if (options?.search) {
        query.$or = [
          { orderNumber: { $regex: options.search, $options: 'i' } },
          { 'customer.phone': { $regex: options.search, $options: 'i' } },
          { 'customer.name': { $regex: options.search, $options: 'i' } },
        ];
      }
      let q = OrderModel.find(query).sort({ createdAt: -1 });
      if (options?.limit) q = q.limit(options.limit);
      const list = await q.lean();
      return JSON.parse(JSON.stringify(list));
    } catch (err) {
      console.error('Error fetching orders from MongoDB:', err);
    }
  }

  let list = [...getMemoryOrders()];
  if (options?.status) {
    list = list.filter((o) => o.status === options.status);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(s) ||
        o.customer.phone.includes(s) ||
        (o.customer.name && o.customer.name.toLowerCase().includes(s))
    );
  }
  list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (options?.limit) list = list.slice(0, options.limit);
  return list;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      const order = await OrderModel.findOne({ orderNumber }).lean();
      return order ? JSON.parse(JSON.stringify(order)) : null;
    } catch (err) {
      console.error('Error fetching order by number from MongoDB:', err);
    }
  }
  return getMemoryOrders().find((o) => o.orderNumber === orderNumber) || null;
}

export async function trackOrderByPhone(
  phone: string,
  orderNumber?: string
): Promise<{ success: boolean; latestOrder?: Order; orders?: Order[]; error?: string }> {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 8) {
    return {
      success: false,
      error: 'يرجى إدخال رقم جوال صحيح لا يقل عن 8 أرقام.',
    };
  }

  const pQuery = cleanPhone.slice(-9);
  const cleanOrderNumber = orderNumber?.trim().toUpperCase();

  const db = await connectToDatabase();
  let matchingOrders: Order[] = [];

  if (db.isConnected) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {
        'customer.phone': { $regex: pQuery },
      };
      if (cleanOrderNumber) {
        query.orderNumber = cleanOrderNumber;
      }
      const list = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
      matchingOrders = JSON.parse(JSON.stringify(list));
    } catch (err) {
      console.error('Error tracking orders from MongoDB:', err);
    }
  }

  if (matchingOrders.length === 0) {
    const all = getMemoryOrders();
    matchingOrders = all.filter((o) => {
      const orderPhoneDigits = (o.customer?.phone || '').replace(/[^0-9]/g, '');
      const matchesPhone = orderPhoneDigits.endsWith(pQuery) || pQuery.endsWith(orderPhoneDigits);
      if (cleanOrderNumber) {
        return matchesPhone && o.orderNumber.toUpperCase() === cleanOrderNumber;
      }
      return matchesPhone;
    });
    matchingOrders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  if (matchingOrders.length === 0) {
    return {
      success: false,
      error: cleanOrderNumber
        ? `لم يتم العثور على طلب برقم (${cleanOrderNumber}) ورقم الجوال المدخل.`
        : 'لم يتم العثور على أي طلبات مسجلة برقم الجوال المدخل. يرجى التأكد من كتابة الرقم بشكل صحيح.',
    };
  }

  return {
    success: true,
    latestOrder: matchingOrders[0],
    orders: matchingOrders,
  };
}

export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const res = await trackOrderByPhone(phone, orderNumber);
  return {
    success: res.success,
    order: res.latestOrder,
    error: res.error,
  };
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const db = await connectToDatabase();

  const newOrder: Order = {
    _id: `ord-${Date.now()}`,
    orderNumber: orderData.orderNumber || `HA-${Date.now()}`,
    customer: orderData.customer || {
      name: '',
      phone: '',
      city: '',
      district: '',
      address: '',
    },
    orderType: orderData.orderType || 'retail',
    deliveryMethod: orderData.deliveryMethod || 'delivery',
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    discountTotal: orderData.discountTotal || 0,
    deliveryFee: orderData.deliveryFee || 0,
    total: orderData.total || 0,
    status: 'new',
    customerNotes: orderData.customerNotes || '',
    adminNotes: orderData.adminNotes || '',
    idempotencyKey: orderData.idempotencyKey,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (db.isConnected) {
    try {
      const created = await OrderModel.create(newOrder);
      return JSON.parse(JSON.stringify(created));
    } catch (err) {
      console.error('Error creating order in MongoDB:', err);
    }
  }

  const orders = getMemoryOrders();
  orders.unshift(newOrder);
  setMemoryOrders(orders);
  return newOrder;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus,
  adminNotes?: string
): Promise<Order | null> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = { status };
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      const updated = await OrderModel.findOneAndUpdate(
        { orderNumber },
        updateData,
        { new: true }
      ).lean();
      return updated ? JSON.parse(JSON.stringify(updated)) : null;
    } catch (err) {
      console.error('Error updating order status in MongoDB:', err);
    }
  }

  const orders = getMemoryOrders();
  const order = orders.find((o) => o.orderNumber === orderNumber);
  if (order) {
    order.status = status;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    order.updatedAt = new Date().toISOString();
    setMemoryOrders(orders);
    return order;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Branches
// ---------------------------------------------------------------------------
export async function getBranches(onlyActive = true): Promise<Branch[]> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await initMongoSeedIfNeeded();
      const query = onlyActive ? { isActive: true } : {};
      const list = await BranchModel.find(query).lean();
      return JSON.parse(JSON.stringify(list));
    } catch (err) {
      console.error('Error fetching branches from MongoDB:', err);
    }
  }
  const branches = getMemoryBranches();
  return onlyActive ? branches.filter((b) => b.isActive) : branches;
}

export async function saveBranch(branch: Partial<Branch>): Promise<Branch> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    if (branch._id && branch._id.length > 10) {
      const updated = await BranchModel.findByIdAndUpdate(branch._id, branch, {
        new: true,
      }).lean();
      if (updated) return JSON.parse(JSON.stringify(updated));
    } else {
      const created = await BranchModel.create(branch);
      return JSON.parse(JSON.stringify(created));
    }
  }

  const branches = getMemoryBranches();
  if (branch._id) {
    const idx = branches.findIndex((b) => b._id === branch._id);
    if (idx !== -1) {
      branches[idx] = { ...branches[idx], ...branch } as Branch;
      setMemoryBranches(branches);
      return branches[idx];
    }
  }

  const newBranch: Branch = {
    _id: `branch-${Date.now()}`,
    name: branch.name || 'فرع جديد',
    city: branch.city || 'حائل',
    district: branch.district || '',
    address: branch.address || '',
    mapUrl: branch.mapUrl || '',
    phone: branch.phone || '+966546002435',
    workingHours: branch.workingHours || 'من 9:00 ص إلى 11:30 م',
    isActive: branch.isActive !== undefined ? branch.isActive : true,
    isHQ: branch.isHQ || false,
    serviceAreas: branch.serviceAreas || [],
  };
  branches.push(newBranch);
  setMemoryBranches(branches);
  return newBranch;
}

// ---------------------------------------------------------------------------
// Site Settings
// ---------------------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      await initMongoSeedIfNeeded();
      const s = await SiteSettingsModel.findOne().lean();
      if (s) return JSON.parse(JSON.stringify(s));
    } catch (err) {
      console.error('Error fetching settings from MongoDB:', err);
    }
  }
  return getMemorySiteSettings();
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = await connectToDatabase();
  if (db.isConnected) {
    try {
      const updated = await SiteSettingsModel.findOneAndUpdate({}, settings, {
        new: true,
        upsert: true,
      }).lean();
      if (updated) return JSON.parse(JSON.stringify(updated));
    } catch (err) {
      console.error('Error updating settings in MongoDB:', err);
    }
  }
  const current = getMemorySiteSettings();
  const updated = { ...current, ...settings };
  setMemorySiteSettings(updated);
  return updated;
}

// ---------------------------------------------------------------------------
// Dashboard Stats
// ---------------------------------------------------------------------------
export async function getDashboardStats() {
  const products = await getAllProductsAdmin();
  const orders = await getOrders();

  const totalProducts = products.length;
  const newOrders = orders.filter((o) => o.status === 'new').length;
  const reviewingOrders = orders.filter((o) => o.status === 'reviewing' || o.status === 'confirmed').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const totalOrdersValue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);

  return {
    totalProducts,
    newOrders,
    reviewingOrders,
    completedOrders,
    totalOrdersValue,
    recentOrders: orders.slice(0, 8),
  };
}

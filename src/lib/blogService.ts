import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Blog, BlogCategory } from '@/types/schema';

const BLOGS_COLLECTION = 'blogs';
const BLOG_CATEGORIES_COLLECTION = 'blog_categories';

// Helper to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Get all published blogs
export async function getPublishedBlogs(): Promise<Blog[]> {
  // First get all published blogs
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where('isPublished', '==', true)
  );
  
  const snapshot = await getDocs(q);
  const blogs: Blog[] = [];
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    // Only include blogs that have been actually published (have a publishedAt date or are marked published)
    if (data.isPublished === true) {
      blogs.push({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        author: data.author,
        category: data.category,
        tags: data.tags || [],
        isPublished: data.isPublished,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        publishedAt: data.publishedAt?.toDate?.()?.toISOString()
      });
    }
  });
  
  // Sort by publishedAt or createdAt in JavaScript to avoid composite index requirement
  blogs.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt).getTime();
    return dateB - dateA;
  });
  
  return blogs;
}

// Get all blogs (including drafts) - for admin
export async function getAllBlogs(): Promise<Blog[]> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const blogs: Blog[] = [];
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    blogs.push({
      id: doc.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      author: data.author,
      category: data.category,
      tags: data.tags || [],
      isPublished: data.isPublished,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      publishedAt: data.publishedAt?.toDate?.()?.toISOString()
    });
  });
  
  return blogs;
}

// Get a single blog by ID
export async function getBlogById(id: string): Promise<Blog | null> {
  const docRef = doc(db, BLOGS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    author: data.author,
    category: data.category,
    tags: data.tags || [],
    isPublished: data.isPublished,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    publishedAt: data.publishedAt?.toDate?.()?.toISOString()
  };
}

// Get a single blog by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where('slug', '==', slug),
    where('isPublished', '==', true)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  const data = doc.data();
  
  return {
    id: doc.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    author: data.author,
    category: data.category,
    tags: data.tags || [],
    isPublished: data.isPublished,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    publishedAt: data.publishedAt?.toDate?.()?.toISOString()
  };
}

// Get blogs by category
export async function getBlogsByCategory(categorySlug: string): Promise<Blog[]> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where('category', '==', categorySlug),
    where('isPublished', '==', true)
  );
  
  const snapshot = await getDocs(q);
  const blogs: Blog[] = [];
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    blogs.push({
      id: doc.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      author: data.author,
      category: data.category,
      tags: data.tags || [],
      isPublished: data.isPublished,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      publishedAt: data.publishedAt?.toDate?.()?.toISOString()
    });
  });
  
  // Sort by publishedAt in JavaScript
  blogs.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt).getTime();
    return dateB - dateA;
  });
  
  return blogs;
}

// Create a new blog
export async function createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, BLOGS_COLLECTION), {
    ...blog,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: blog.isPublished ? serverTimestamp() : null
  });
  
  return docRef.id;
}

// Update a blog
export async function updateBlog(id: string, blog: Partial<Blog>): Promise<void> {
  const docRef = doc(db, BLOGS_COLLECTION, id);
  
  const updateData: Record<string, unknown> = {
    ...blog,
    updatedAt: serverTimestamp()
  };
  
  // Set publishedAt when publishing for the first time
  if (blog.isPublished) {
    const existingDoc = await getDoc(docRef);
    const existingData = existingDoc.data();
    if (!existingData?.publishedAt) {
      updateData.publishedAt = serverTimestamp();
    }
  }
  
  await updateDoc(docRef, updateData);
}

// Delete a blog
export async function deleteBlog(id: string): Promise<void> {
  const docRef = doc(db, BLOGS_COLLECTION, id);
  await deleteDoc(docRef);
}

// Get all blog categories
export async function getAllCategories(): Promise<BlogCategory[]> {
  const q = query(collection(db, BLOG_CATEGORIES_COLLECTION));
  
  const snapshot = await getDocs(q);
  const categories: BlogCategory[] = [];
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    categories.push({
      id: doc.id,
      name: data.name,
      slug: data.slug,
      description: data.description
    });
  });
  
  return categories;
}

// Create a blog category
export async function createCategory(category: Omit<BlogCategory, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, BLOG_CATEGORIES_COLLECTION), category);
  return docRef.id;
}

// Default categories to seed if none exist
export const DEFAULT_CATEGORIES = [
  { name: 'SSB Preparation', slug: 'ssb-preparation', description: 'Tips and strategies for SSB exam preparation' },
  { name: 'Interview Experience', slug: 'interview-experience', description: 'Real SSB interview experiences and stories' },
  { name: 'Psychology Tests', slug: 'psychology-tests', description: 'TAT, WAT, SRT and other psychological test preparation' },
  { name: 'GTO Tasks', slug: 'gto-tasks', description: 'Group testing officer tasks and tips' },
  { name: 'General Knowledge', slug: 'general-knowledge', description: 'Current affairs and general knowledge for SSB' }
];

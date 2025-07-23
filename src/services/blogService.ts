import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { BlogPost } from '../types';

export const blogService = {
  // Create a new blog post
  async createBlog(blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'blogs'), {
      ...blogData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Get all blog posts
  async getAllBlogs(): Promise<BlogPost[]> {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as BlogPost[];
  },

  // Get a single blog post
  async getBlogById(id: string): Promise<BlogPost | null> {
    const docRef = doc(db, 'blogs', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as BlogPost;
    }
    return null;
  },

  // Update a blog post
  async updateBlog(id: string, updateData: Partial<BlogPost>) {
    const docRef = doc(db, 'blogs', id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
  },

  // Delete a blog post
  async deleteBlog(id: string) {
    const docRef = doc(db, 'blogs', id);
    await deleteDoc(docRef);
  },

  // Get blogs by author
  async getBlogsByAuthor(authorId: string): Promise<BlogPost[]> {
    const q = query(
      collection(db, 'blogs'), 
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as BlogPost[];
  }
};
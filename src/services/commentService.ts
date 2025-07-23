import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Comment } from '../types';

export const commentService = {
  // Add a comment to a blog post
  async addComment(commentData: Omit<Comment, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'comments'), {
      ...commentData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Get all comments for a blog post
  async getCommentsByBlog(blogId: string): Promise<Comment[]> {
    const q = query(
      collection(db, 'comments'),
      where('blogId', '==', blogId),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Comment[];
  },

  // Delete a comment
  async deleteComment(id: string) {
    const docRef = doc(db, 'comments', id);
    await deleteDoc(docRef);
  }
};
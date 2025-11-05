import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Post {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  likedBy: string[];
  isHighlighted?: boolean;
  timestamp: string;
  createdAt: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  timestamp: string;
  createdAt: number;
}

// Posts
export const createPost = async (postData: Omit<Post, 'id'>) => {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...postData,
    createdAt: Date.now(),
    timestamp: 'Agora'
  });
  return docRef.id;
};

export const getPosts = async (): Promise<Post[]> => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Post));
};

export const updatePost = async (postId: string, data: Partial<Post>) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, data);
};

export const deletePost = async (postId: string) => {
  await deleteDoc(doc(db, 'posts', postId));
};

export const likePost = async (postId: string, userId: string, isLiking: boolean) => {
  const postRef = doc(db, 'posts', postId);
  const posts = await getPosts();
  const post = posts.find(p => p.id === postId);
  
  if (!post) return;

  const likedBy = isLiking 
    ? [...post.likedBy, userId]
    : post.likedBy.filter(id => id !== userId);

  await updateDoc(postRef, {
    likes: isLiking ? increment(1) : increment(-1),
    likedBy
  });
};

// Comments
export const createComment = async (commentData: Omit<Comment, 'id'>) => {
  const docRef = await addDoc(collection(db, 'comments'), {
    ...commentData,
    createdAt: Date.now(),
    timestamp: 'Agora'
  });
  return docRef.id;
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  const q = query(
    collection(db, 'comments'), 
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Comment));
};

export const deleteComment = async (commentId: string) => {
  await deleteDoc(doc(db, 'comments', commentId));
};

// User Profile
export const saveUserProfile = async (userId: string, userData: any) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, userData).catch(async () => {
    // Se o documento não existe, cria
    await addDoc(collection(db, 'users'), {
      id: userId,
      ...userData
    });
  });
};

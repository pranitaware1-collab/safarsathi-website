import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Feedback } from '../types';

const FEEDBACK_COLLECTION = 'feedback';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const submitFeedback = async (rating: number, comment: string, tripName?: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to submit feedback');

  console.log('Submitting feedback for user:', user.uid);

  const feedbackData = {
    userId: user.uid,
    userName: user.displayName || 'Anonymous',
    userPhoto: user.photoURL || '',
    rating,
    comment,
    tripName: tripName || 'General Service',
    createdAt: serverTimestamp(),
    isApproved: true,
  };

  try {
    const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), feedbackData);
    console.log('Feedback submitted successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    handleFirestoreError(error, OperationType.WRITE, FEEDBACK_COLLECTION);
  }
};

export const subscribeToFeedback = (callback: (feedback: Feedback[]) => void) => {
  console.log('Subscribing to feedback collection...');
  const q = query(
    collection(db, FEEDBACK_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    console.log(`Received feedback snapshot with ${snapshot.docs.length} documents`);
    const feedback = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString() 
          : new Date().toISOString()
      } as Feedback;
    });
    callback(feedback);
  }, (error) => {
    console.error('Error in subscribeToFeedback:', error);
    handleFirestoreError(error, OperationType.GET, FEEDBACK_COLLECTION);
  });
};

export const deleteFeedback = async (feedbackId: string) => {
  try {
    await deleteDoc(doc(db, FEEDBACK_COLLECTION, feedbackId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${FEEDBACK_COLLECTION}/${feedbackId}`);
  }
};

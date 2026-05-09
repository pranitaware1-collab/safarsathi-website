import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

const NOTICE_DOC_PATH = 'settings/notice';

export const getNotice = async () => {
  try {
    const docRef = doc(db, NOTICE_DOC_PATH);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().content as string;
    }
    return '';
  } catch (error) {
    console.error('Error fetching notice:', error);
    return '';
  }
};

export const updateNotice = async (content: string) => {
  try {
    const docRef = doc(db, NOTICE_DOC_PATH);
    await setDoc(docRef, {
      content,
      updatedAt: serverTimestamp(),
      updatedBy: auth.currentUser?.email || 'Admin'
    });
    return true;
  } catch (error) {
    console.error('Error updating notice:', error);
    throw error;
  }
};
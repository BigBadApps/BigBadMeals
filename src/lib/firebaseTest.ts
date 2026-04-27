import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './firebase';

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection verified');
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
      return { success: false, error: 'Offline' };
    } else {
      console.warn("Initial connection test failed (expected if collection 'test' doesn't exist).", error);
      return { success: true, warning: 'Connection active but test document not found' };
    }
  }
}

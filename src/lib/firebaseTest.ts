import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Verifies Firestore is reachable using a path allowed by firestore.rules
 * (`users/{uid}` for the signed-in user). Does not probe legacy `test/*`
 * paths (those are denied by rules and spam the console).
 */
export async function testConnection(): Promise<{
  success: boolean;
  skipped?: boolean;
  warning?: string;
  error?: string;
}> {
  const user = auth.currentUser;
  if (!user) {
    return {
      success: true,
      skipped: true,
      warning: 'Sign in to verify Firestore reads against your user document.',
    };
  }

  try {
    await getDocFromServer(doc(db, 'users', user.uid));
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Firebase appears offline; check configuration and network.');
      return { success: false, error: 'Offline' };
    }
    console.warn('Firestore verification failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

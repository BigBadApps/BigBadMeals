import { firestoreService } from './firestoreService';
import { inMemoryDataService } from './inMemoryDataService';

export type DataService = typeof firestoreService;

const useInMemory = import.meta.env.VITE_USE_INMEMORY_DB === 'true';

export const dataService: DataService = (useInMemory ? inMemoryDataService : firestoreService) as DataService;


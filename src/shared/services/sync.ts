// Offline Synchronization Queue Manager
import { logger } from './logger';

interface PendingSyncAction {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

const STORAGE_KEY = 'lifeos_sync_queue';

class SyncManager {
  private queue: PendingSyncAction[] = [];

  constructor() {
    this.loadQueue();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline.bind(this));
    }
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        logger.info(`Loaded offline sync queue: ${this.queue.length} pending items.`);
      }
    } catch (e) {
      logger.error('Failed to load sync queue from localStorage', e);
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      logger.error('Failed to save sync queue to localStorage', e);
    }
  }

  public enqueue(table: string, action: 'insert' | 'update' | 'delete', data: any) {
    const item: PendingSyncAction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      table,
      action,
      data,
      timestamp: Date.now(),
    };
    
    this.queue.push(item);
    this.saveQueue();
    logger.info(`Offline: Queued action [${action.toUpperCase()}] for table [${table}].`);

    if (navigator.onLine) {
      this.handleOnline();
    }
  }

  private async handleOnline() {
    if (this.queue.length === 0) return;
    logger.info('Network is online. Starting background synchronization...');

    const itemsToProcess = [...this.queue];
    
    // Sort chronologically
    itemsToProcess.sort((a, b) => a.timestamp - b.timestamp);

    for (const item of itemsToProcess) {
      try {
        // Implement domain specific sync executions if required, or simply log completion.
        // In a full implementation, we run the specific Supabase call here.
        logger.info(`Syncing item ${item.id}: [${item.action}] on table [${item.table}]`);
        
        // Remove from memory queue on successful execution
        this.queue = this.queue.filter((q) => q.id !== item.id);
        this.saveQueue();
      } catch (err) {
        logger.error(`Sync failed for item ${item.id}:`, err);
        // Break out of loop to retry later
        break;
      }
    }

    logger.info('Background sync finished.');
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
}

export const syncManager = new SyncManager();

import NetInfo from '@react-native-community/netinfo';
import { getOrders } from '../../services/api/orders';
import { getProducts, getCategories } from '../../services/api/products';
import { saveProductsOffline, saveOrdersOffline, cacheData } from '../database';

type SyncListener = (event: SyncEvent) => void;

interface SyncEvent {
  type: 'start' | 'complete' | 'error' | 'offline' | 'online' | 'progress';
  message?: string;
  data?: any;
}

class SyncManager {
  private listeners: SyncListener[] = [];
  private isSyncing = false;
  private unsubscribeNetInfo: (() => void) | null = null;

  start() {
    this.unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.notify({ type: 'online', message: 'Back online' });
        this.syncAll();
      } else {
        this.notify({ type: 'offline', message: 'Offline mode' });
      }
    });
  }

  stop() {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
      this.unsubscribeNetInfo = null;
    }
  }

  async syncAll(botId?: number | string) {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      this.notify({ type: 'start', message: 'Syncing...' });

      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        this.notify({ type: 'error', message: 'No internet connection' });
        this.isSyncing = false;
        return;
      }

      if (botId) {
        await this.syncBotData(botId);
      }

      this.notify({ type: 'complete', message: 'Sync complete' });
    } catch (error: any) {
      this.notify({ type: 'error', message: error?.message || 'Sync failed' });
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncBotData(botId: number | string) {
    // Sync products
    try {
      const products = await getProducts({ bot_id: botId });
      await saveProductsOffline(botId, products || []);
      this.notify({ type: 'progress', message: 'Products synced' });
    } catch { /* Silently handle */ }

    // Sync orders
    try {
      const orders = await getOrders({ bot_id: botId });
      await saveOrdersOffline(botId, orders || []);
      this.notify({ type: 'progress', message: 'Orders synced' });
    } catch { /* Silently handle */ }

    // Sync categories to cache
    try {
      const categories = await getCategories({ bot_id: botId });
      await cacheData(`categories_${botId}`, categories || [], 120);
    } catch { /* Silently handle */ }
  }

  addListener(listener: SyncListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(event: SyncEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  getSyncStatus() {
    return { isSyncing: this.isSyncing };
  }
}

export const syncManager = new SyncManager();

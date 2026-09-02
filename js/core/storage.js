/**
 * 星绥小手机 - 存储系统核心模块
 * 
 * 设计原则：
 * 1. 重要数据固定存在localStorage，永远不搬去IndexedDB（避免iOS系统清理导致丢失）
 * 2. 大文件存在IndexedDB（图片、聊天记录等），丢了也没关系
 * 3. 统一的API，调用简单，不用关心存在哪里
 * 
 * 数据分类：
 * - LS_DATA: 重要的小数据，存在localStorage（布局、设置、配置等）
 * - IDB_DATA: 大文件数据，存在IndexedDB（图片、聊天记录等）
 */

// ============================================
// 第一部分：localStorage 封装（重要数据，永久保存）
// ============================================

const LSStorage = {
  /**
   * 读取数据
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值（读取失败时返回）
   * @returns {*} 读取到的数据
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      return JSON.parse(value);
    } catch (e) {
      console.warn('[LSStorage] 读取失败:', key, e);
      return defaultValue;
    }
  },

  /**
   * 保存数据
   * @param {string} key - 键名
   * @param {*} value - 要保存的数据
   * @returns {boolean} 是否保存成功
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[LSStorage] 保存失败:', key, e);
      return false;
    }
  },

  /**
   * 删除数据
   * @param {string} key - 键名
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('[LSStorage] 删除失败:', key, e);
    }
  },

  /**
   * 检查是否存在某个键
   * @param {string} key - 键名
   * @returns {boolean} 是否存在
   */
  has(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch (e) {
      return false;
    }
  },

  /**
   * 获取所有键名
   * @returns {string[]} 键名数组
   */
  keys() {
    try {
      return Object.keys(localStorage);
    } catch (e) {
      return [];
    }
  },

  /**
   * 清空所有数据（谨慎使用！）
   */
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('[LSStorage] 清空失败:', e);
    }
  }
};

// ============================================
// 第二部分：IndexedDB 封装（大文件数据）
// ============================================

const IDBStorage = {
  dbName: 'stellasei-db',
  dbVersion: 1,
  storeName: 'files',
  db: null,

  /**
   * 初始化数据库
   * @returns {Promise<IDBDatabase>} 数据库实例
   */
  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('[IDBStorage] 数据库初始化失败:', event.target.error);
        reject(event.target.error);
      };
    });
  },

  /**
   * 保存文件
   * @param {string} key - 键名
   * @param {*} value - 要保存的文件数据
   * @returns {Promise<boolean>} 是否保存成功
   */
  async set(key, value) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(value, key);

        request.onsuccess = () => resolve(true);
        request.onerror = () => {
          console.error('[IDBStorage] 保存失败:', key, request.error);
          reject(request.error);
        };
      });
    } catch (e) {
      console.error('[IDBStorage] 保存异常:', key, e);
      return false;
    }
  },

  /**
   * 读取文件
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {Promise<*>} 读取到的数据
   */
  async get(key, defaultValue = null) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          const result = request.result;
          resolve(result === undefined ? defaultValue : result);
        };
        request.onerror = () => {
          console.error('[IDBStorage] 读取失败:', key, request.error);
          reject(request.error);
        };
      });
    } catch (e) {
      console.error('[IDBStorage] 读取异常:', key, e);
      return defaultValue;
    }
  },

  /**
   * 删除文件
   * @param {string} key - 键名
   * @returns {Promise<boolean>} 是否删除成功
   */
  async remove(key) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve(true);
        request.onerror = () => {
          console.error('[IDBStorage] 删除失败:', key, request.error);
          reject(request.error);
        };
      });
    } catch (e) {
      console.error('[IDBStorage] 删除异常:', key, e);
      return false;
    }
  },

  /**
   * 检查是否存在某个键
   * @param {string} key - 键名
   * @returns {Promise<boolean>} 是否存在
   */
  async has(key) {
    const value = await this.get(key, null);
    return value !== null;
  },

  /**
   * 获取所有键名
   * @returns {Promise<string[]>} 键名数组
   */
  async keys() {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => {
          console.error('[IDBStorage] 获取键名失败:', request.error);
          reject(request.error);
        };
      });
    } catch (e) {
      console.error('[IDBStorage] 获取键名异常:', e);
      return [];
    }
  },

  /**
   * 清空所有数据（谨慎使用！）
   */
  async clear() {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = () => {
          console.error('[IDBStorage] 清空失败:', request.error);
          reject(request.error);
        };
      });
    } catch (e) {
      console.error('[IDBStorage] 清空异常:', e);
      return false;
    }
  }
};

// ============================================
// 第三部分：统一存储API（对外暴露，调用简单）
// ============================================

/**
 * 星绥存储系统 - 统一API
 * 
 * 使用方式：
 * - 重要小数据：Storage.get('layout') / Storage.set('layout', data)
 * - 大文件数据：Storage.getFile('image-1') / Storage.setFile('image-1', data)
 * 
 * 重要数据会自动存在localStorage，大文件存在IndexedDB，不用关心具体存在哪里。
 */
const Storage = {
  // ---- 重要小数据（localStorage，同步API，永久保存）----

  /**
   * 读取重要数据
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 读取到的数据
   */
  get(key, defaultValue = null) {
    return LSStorage.get(key, defaultValue);
  },

  /**
   * 保存重要数据
   * @param {string} key - 键名
   * @param {*} value - 要保存的数据
   * @returns {boolean} 是否保存成功
   */
  set(key, value) {
    return LSStorage.set(key, value);
  },

  /**
   * 删除重要数据
   * @param {string} key - 键名
   */
  remove(key) {
    LSStorage.remove(key);
  },

  /**
   * 检查重要数据是否存在
   * @param {string} key - 键名
   * @returns {boolean} 是否存在
   */
  has(key) {
    return LSStorage.has(key);
  },

  // ---- 大文件数据（IndexedDB，异步API）----

  /**
   * 读取大文件
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {Promise<*>} 读取到的数据
   */
  async getFile(key, defaultValue = null) {
    return await IDBStorage.get(key, defaultValue);
  },

  /**
   * 保存大文件
   * @param {string} key - 键名
   * @param {*} value - 要保存的文件数据
   * @returns {Promise<boolean>} 是否保存成功
   */
  async setFile(key, value) {
    return await IDBStorage.set(key, value);
  },

  /**
   * 删除大文件
   * @param {string} key - 键名
   * @returns {Promise<boolean>} 是否删除成功
   */
  async removeFile(key) {
    return await IDBStorage.remove(key);
  },

  /**
   * 检查大文件是否存在
   * @param {string} key - 键名
   * @returns {Promise<boolean>} 是否存在
   */
  async hasFile(key) {
    return await IDBStorage.has(key);
  },

  // ---- 图片存储（专门处理图片，自动压缩）----

  /**
   * 保存图片（自动压缩）
   * @param {File|Blob} imageFile - 图片文件
   * @param {string} [customId] - 自定义ID（不填则自动生成）
   * @returns {Promise<string|null>} 图片ID（保存失败返回null）
   */
  async saveImage(imageFile, customId = null) {
    try {
      // 自动压缩图片
      const compressed = await this._compressImage(imageFile);
      const imageId = customId || `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const success = await this.setFile(imageId, compressed);
      return success ? imageId : null;
    } catch (e) {
      console.error('[Storage] 保存图片失败:', e);
      return null;
    }
  },

  /**
   * 读取图片（返回可直接用的URL）
   * @param {string} imageId - 图片ID
   * @returns {Promise<string|null>} 图片URL（读取失败返回null）
   */
  async getImageUrl(imageId) {
    try {
      const blob = await this.getFile(imageId, null);
      if (!blob) return null;
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error('[Storage] 读取图片失败:', imageId, e);
      return null;
    }
  },

  /**
   * 压缩图片（内部方法）
   * @param {File|Blob} imageFile - 原始图片
   * @param {number} maxSize - 最大边长（像素）
   * @param {number} quality - JPEG质量（0-1）
   * @returns {Promise<Blob>} 压缩后的图片Blob
   */
  async _compressImage(imageFile, maxSize = 1280, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(imageFile);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        // 计算缩放比例
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        // 绘制到canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转成Blob
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('压缩失败')),
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('图片加载失败'));
      };
      
      img.src = url;
    });
  },

  // ---- 数据导出导入（备份恢复用）----

  /**
   * 导出所有重要数据（localStorage）
   * @returns {Object} 所有数据的对象
   */
  exportAllLS() {
    const data = {};
    const keys = LSStorage.keys();
    for (const key of keys) {
      data[key] = LSStorage.get(key);
    }
    return data;
  },

  /**
   * 导入重要数据（localStorage）
   * @param {Object} data - 要导入的数据对象
   * @param {boolean} overwrite - 是否覆盖已有数据
   */
  importAllLS(data, overwrite = true) {
    if (!data || typeof data !== 'object') return;
    for (const [key, value] of Object.entries(data)) {
      if (overwrite || !LSStorage.has(key)) {
        LSStorage.set(key, value);
      }
    }
  }
};

// 暴露到全局
window.Storage = Storage;
window.LSStorage = LSStorage;
window.IDBStorage = IDBStorage;

console.log('[星绥存储系统] 初始化完成！');

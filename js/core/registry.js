/**
 * 星绥小手机 - 应用注册表
 * 
 * 功能：
 * 1. 注册所有可用的应用
 * 2. 获取应用信息（名称、图标、入口函数等）
 * 3. 管理应用的显示/隐藏
 */

const AppRegistry = {
  // 已注册的应用
  apps: {},

  /**
   * 注册应用
   * @param {Object} appConfig - 应用配置
   * @param {string} appConfig.id - 应用ID（唯一）
   * @param {string} appConfig.name - 应用名称
   * @param {string} appConfig.icon - 应用图标（emoji或HTML）
   * @param {string} appConfig.description - 应用描述
   * @param {Function} appConfig.onOpen - 打开应用时的回调
   * @param {Function} appConfig.onClose - 关闭应用时的回调
   * @param {boolean} appConfig.visible - 是否在应用列表中显示（默认true）
   */
  register(appConfig) {
    if (!appConfig.id) {
      console.error('[应用注册表] 应用ID不能为空');
      return;
    }
    
    this.apps[appConfig.id] = {
      id: appConfig.id,
      name: appConfig.name || appConfig.id,
      icon: appConfig.icon || '📱',
      description: appConfig.description || '',
      onOpen: appConfig.onOpen || (() => {}),
      onClose: appConfig.onClose || (() => {}),
      visible: appConfig.visible !== false
    };
    
    console.log('[应用注册表] 已注册应用:', appConfig.id, '-', appConfig.name);
  },

  /**
   * 获取应用信息
   * @param {string} appId - 应用ID
   * @returns {Object|null} 应用信息
   */
  getAppInfo(appId) {
    return this.apps[appId] || null;
  },

  /**
   * 获取所有已注册的应用
   * @param {boolean} onlyVisible - 只返回可见的应用
   * @returns {Object[]} 应用信息数组
   */
  getAllApps(onlyVisible = false) {
    const apps = Object.values(this.apps);
    if (onlyVisible) {
      return apps.filter(app => app.visible);
    }
    return apps;
  },

  /**
   * 检查应用是否已注册
   * @param {string} appId - 应用ID
   * @returns {boolean} 是否已注册
   */
  hasApp(appId) {
    return !!this.apps[appId];
  },

  /**
   * 注销应用
   * @param {string} appId - 应用ID
   */
  unregister(appId) {
    if (this.apps[appId]) {
      delete this.apps[appId];
      console.log('[应用注册表] 已注销应用:', appId);
    }
  },

  /**
   * 设置应用是否可见
   * @param {string} appId - 应用ID
   * @param {boolean} visible - 是否可见
   */
  setVisible(appId, visible) {
    if (this.apps[appId]) {
      this.apps[appId].visible = visible;
    }
  }
};

// 暴露到全局
window.AppRegistry = AppRegistry;

console.log('[星绥应用注册表] 模块加载完成！');

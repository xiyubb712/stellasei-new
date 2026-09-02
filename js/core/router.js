/**
 * 星绥小手机 - 应用路由系统
 * 
 * 功能：
 * 1. 打开应用（切换到应用界面）
 * 2. 关闭应用（返回主屏幕）
 * 3. 应用之间的切换
 * 4. 应用历史记录（支持返回）
 */

const AppRouter = {
  // 当前打开的应用ID
  currentApp: null,
  
  // 应用历史记录（用于返回）
  history: [],
  
  // 应用容器元素
  appContainer: null,
  
  // 主屏幕元素
  desktopElement: null,

  /**
   * 初始化路由系统
   */
  init() {
    this.appContainer = document.getElementById('app-container');
    this.desktopElement = document.getElementById('desktop');
    
    // 绑定返回按钮
    const backButton = document.getElementById('back-button');
    if (backButton) {
      backButton.addEventListener('click', () => this.back());
    }
    
    // 绑定主页按钮
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
      homeButton.addEventListener('click', () => this.closeAll());
    }
    
    console.log('[应用路由系统] 初始化完成');
  },

  /**
   * 打开应用
   * @param {string} appId - 应用ID
   * @param {Object} [params] - 传递给应用的参数
   * @returns {boolean} 是否打开成功
   */
  open(appId, params = {}) {
    const appInfo = AppRegistry.getAppInfo(appId);
    if (!appInfo) {
      console.error('[应用路由系统] 应用不存在:', appId);
      return false;
    }
    
    // 如果当前有打开的应用，先保存到历史
    if (this.currentApp) {
      this.history.push(this.currentApp);
    }
    
    // 关闭当前应用
    if (this.currentApp) {
      this._closeApp(this.currentApp);
    }
    
    // 打开新应用
    this.currentApp = appId;
    this._showAppContainer();
    
    // 调用应用的onOpen回调
    try {
      appInfo.onOpen(params, this.appContainer);
    } catch (e) {
      console.error('[应用路由系统] 应用打开失败:', appId, e);
      this._showError(appId, e);
    }
    
    // 更新状态栏
    this._updateStatusBar(appInfo);
    
    console.log('[应用路由系统] 已打开应用:', appId, '-', appInfo.name);
    return true;
  },

  /**
   * 关闭当前应用，返回主屏幕
   */
  close() {
    if (!this.currentApp) return;
    
    this._closeApp(this.currentApp);
    this.currentApp = null;
    this.history = [];
    this._showDesktop();
    this._updateStatusBar(null);
    
    console.log('[应用路由系统] 已关闭应用，返回主屏幕');
  },

  /**
   * 关闭所有应用（等同于按主页键）
   */
  closeAll() {
    this.close();
  },

  /**
   * 返回上一个应用或主屏幕
   */
  back() {
    if (this.history.length > 0) {
      // 返回上一个应用
      const previousApp = this.history.pop();
      this._closeApp(this.currentApp);
      this.currentApp = previousApp;
      
      const appInfo = AppRegistry.getAppInfo(previousApp);
      if (appInfo) {
        this._showAppContainer();
        try {
          appInfo.onOpen({}, this.appContainer);
        } catch (e) {
          console.error('[应用路由系统] 返回应用失败:', previousApp, e);
        }
        this._updateStatusBar(appInfo);
      }
      
      console.log('[应用路由系统] 返回到应用:', previousApp);
    } else {
      // 没有历史记录，返回主屏幕
      this.close();
    }
  },

  /**
   * 关闭指定应用（内部方法）
   * @param {string} appId - 应用ID
   */
  _closeApp(appId) {
    const appInfo = AppRegistry.getAppInfo(appId);
    if (appInfo) {
      try {
        appInfo.onClose();
      } catch (e) {
        console.error('[应用路由系统] 应用关闭回调失败:', appId, e);
      }
    }
    
    // 清空应用容器
    if (this.appContainer) {
      this.appContainer.innerHTML = '';
    }
  },

  /**
   * 显示应用容器，隐藏主屏幕
   */
  _showAppContainer() {
    if (this.desktopElement) {
      this.desktopElement.classList.add('hidden');
    }
    if (this.appContainer) {
      this.appContainer.classList.remove('hidden');
    }
  },

  /**
   * 显示主屏幕，隐藏应用容器
   */
  _showDesktop() {
    if (this.desktopElement) {
      this.desktopElement.classList.remove('hidden');
    }
    if (this.appContainer) {
      this.appContainer.classList.add('hidden');
    }
    
    // 重新渲染主屏幕
    if (window.LayoutSystem) {
      LayoutSystem.render();
    }
  },

  /**
   * 更新状态栏（显示当前应用名称）
   * @param {Object|null} appInfo - 应用信息
   */
  _updateStatusBar(appInfo) {
    const statusBarTitle = document.getElementById('status-bar-title');
    if (statusBarTitle) {
      statusBarTitle.textContent = appInfo ? appInfo.name : '';
    }
    
    // 显示/隐藏返回按钮
    const backButton = document.getElementById('back-button');
    if (backButton) {
      if (appInfo) {
        backButton.classList.remove('hidden');
      } else {
        backButton.classList.add('hidden');
      }
    }
  },

  /**
   * 显示应用错误信息
   * @param {string} appId - 应用ID
   * @param {Error} error - 错误对象
   */
  _showError(appId, error) {
    if (this.appContainer) {
      this.appContainer.innerHTML = `
        <div class="app-error">
          <div class="app-error-icon">⚠️</div>
          <div class="app-error-title">应用打开失败</div>
          <div class="app-error-app">${appId}</div>
          <div class="app-error-message">${error.message}</div>
          <button class="app-error-button" onclick="AppRouter.close()">返回主屏幕</button>
        </div>
      `;
    }
  }
};

// 暴露到全局
window.AppRouter = AppRouter;

console.log('[星绥应用路由系统] 模块加载完成！');

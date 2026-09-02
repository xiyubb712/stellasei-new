/**
 * 星绥小手机 - 入口文件
 * 
 * 功能：
 * 1. 初始化所有核心模块
 * 2. 注册基础应用
 * 3. 绑定全局事件
 * 4. 启动应用
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  console.log('========================================');
  console.log('  星绥小手机 启动中...');
  console.log('========================================');
  
  // 第零步：初始化应用高度（解决iOS白边问题）
  console.log('[启动] 初始化应用高度...');
  initAppHeight();
  
  // 第一步：初始化所有SVG图标
  console.log('[启动] 初始化SVG图标...');
  initIcons();
  
  // 第一步：初始化存储系统
  console.log('[启动] 初始化存储系统...');
  // storage.js 加载时会自动初始化
  
  // 第二步：初始化应用注册表（注册基础应用）
  console.log('[启动] 注册基础应用...');
  registerBaseApps();
  
  // 第三步：初始化布局系统
  console.log('[启动] 初始化布局系统...');
  LayoutSystem.init();
  
  // 第四步：初始化应用路由系统
  console.log('[启动] 初始化应用路由系统...');
  AppRouter.init();
  
  // 第五步：渲染主屏幕
  console.log('[启动] 渲染主屏幕...');
  LayoutSystem.render();
  
  // 第六步：更新状态栏时间
  updateStatusBarTime();
  setInterval(updateStatusBarTime, 1000);
  
  // 第七步：绑定全局事件
  bindGlobalEvents();
  
  console.log('========================================');
  console.log('  星绥小手机 启动完成！');
  console.log('========================================');
});

/**
 * 注册基础应用
 */
function registerBaseApps() {
  // 聊天应用
  AppRegistry.register({
    id: 'chat',
    name: '聊天',
    icon: 'chat',
    description: '与AI角色聊天',
    onOpen: function(params, container) {
      if (window.ChatApp) {
        ChatApp.render(container, params);
      } else {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">聊天应用开发中...</div>';
      }
    },
    onClose: function() {
      if (window.ChatApp && ChatApp.onClose) {
        ChatApp.onClose();
      }
    }
  });
  
  // 联系人应用
  AppRegistry.register({
    id: 'contacts',
    name: '联系人',
    icon: 'contacts',
    description: '管理你的角色和联系人',
    onOpen: function(params, container) {
      if (window.ContactsApp) {
        ContactsApp.render(container, params);
      } else {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">联系人应用开发中...</div>';
      }
    },
    onClose: function() {
      if (window.ContactsApp && ContactsApp.onClose) {
        ContactsApp.onClose();
      }
    }
  });
  
  // 世界书应用
  AppRegistry.register({
    id: 'worldbook',
    name: '世界书',
    icon: 'worldbook',
    description: '管理世界观和设定',
    onOpen: function(params, container) {
      if (window.WorldBookApp) {
        WorldBookApp.render(container, params);
      } else {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">世界书应用开发中...</div>';
      }
    },
    onClose: function() {
      if (window.WorldBookApp && WorldBookApp.onClose) {
        WorldBookApp.onClose();
      }
    }
  });
  
  // 设置应用
  AppRegistry.register({
    id: 'settings',
    name: '设置',
    icon: 'settings',
    description: '应用设置和偏好',
    onOpen: function(params, container) {
      if (window.SettingsApp) {
        SettingsApp.render(container, params);
      } else {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">设置应用开发中...</div>';
      }
    },
    onClose: function() {
      if (window.SettingsApp && SettingsApp.onClose) {
        SettingsApp.onClose();
      }
    }
  });
  
  console.log('[启动] 基础应用注册完成，共', Object.keys(AppRegistry.apps).length, '个应用');
}

/**
 * 更新状态栏时间
 */
function updateStatusBarTime() {
  const timeElement = document.getElementById('status-bar-time');
  if (timeElement) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
  }
}

/**
 * 绑定全局事件
 */
function bindGlobalEvents() {
  // 绑定Dock栏点击事件
  const dockItems = document.querySelectorAll('.dock-item');
  dockItems.forEach(item => {
    item.addEventListener('click', function() {
      const appId = this.dataset.app;
      if (appId) {
        AppRouter.open(appId);
      }
    });
  });
  
  // 绑定键盘返回键（电脑端测试用）
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      AppRouter.back();
    }
  });
  
  // 页面可见性变化（从后台切回来时刷新）
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      console.log('[启动] 应用从后台恢复，刷新主屏幕');
      if (!AppRouter.currentApp) {
        LayoutSystem.render();
      }
    }
  });
  
  console.log('[启动] 全局事件绑定完成');
}

/**
 * 初始化所有SVG图标
 * 把所有带 data-icon 属性的元素替换成对应的SVG图标
 */
function initIcons() {
  // 替换所有 data-icon 元素
  const iconElements = document.querySelectorAll('[data-icon]');
  iconElements.forEach(el => {
    const iconName = el.dataset.icon;
    const svg = getIcon(iconName, 'icon-svg');
    if (svg) {
      el.innerHTML = svg;
    }
  });
  
  // 状态栏图标（单独处理，因为需要特殊样式）
  const signalEl = document.getElementById('status-bar-signal');
  if (signalEl) {
    signalEl.innerHTML = getIcon('signal', 'status-icon-svg');
  }
  
  const batteryEl = document.getElementById('status-bar-battery');
  if (batteryEl) {
    batteryEl.innerHTML = getIcon('battery', 'status-icon-svg');
  }
  
  console.log('[启动] SVG图标初始化完成，共', iconElements.length, '个图标');
}

// 暴露一些全局函数，方便调试
window.StarSui = {
  storage: Storage,
  layout: LayoutSystem,
  router: AppRouter,
  registry: AppRegistry,
  
  // 调试函数：重置所有数据
  resetAll: function() {
    if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
      Storage.remove('stellasei-layout');
      location.reload();
    }
  },
  
  // 调试函数：导出所有数据
  exportAll: function() {
    const data = Storage.exportAllLS();
    console.log('所有数据:', data);
    return data;
  }
};

console.log('[启动] 全局调试对象已创建：window.StarSui');

/**
 * 初始化应用高度（解决iOS白边问题）
 * 参考原作者miya的实现，用CSS变量--app-height动态设置高度
 * iOS情况下高度加1px，避免白边
 */
function initAppHeight() {
  let lastAppHeight = 0;
  let setHFrame = 0;
  
  // 检测是否是iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // 检测是否是PWA模式（添加到主屏幕）
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone === true;
  
  console.log('[应用高度] iOS:', isIOS, 'PWA模式:', isStandalone);
  
  // 设置高度的核心函数
  function setAppHeightNow() {
    const innerH = window.innerHeight || 0;
    let finalH = innerH;
    
    if (isIOS) {
      // iOS PWA模式下，用屏幕高度来计算
      if (isStandalone) {
        const sH = window.screen.height || 0;
        const sW = window.screen.width || 0;
        const exp = window.innerWidth > window.innerHeight ? Math.min(sH, sW) : Math.max(sH, sW);
        if (exp > 0) finalH = Math.max(finalH, exp);
      }
      // 关键！iOS情况下高度加1px，避免白边
      finalH = finalH + 1;
    } else {
      // 非iOS，用visualViewport来计算
      const clientH = document.documentElement.clientHeight || 0;
      const vv = window.visualViewport;
      const vvH = vv ? vv.height : 0;
      const vvTop = vv ? (vv.offsetTop || 0) : 0;
      finalH = Math.max(innerH, clientH, vvH + vvTop);
    }
    
    // 高度变化小于2px就不更新，避免频繁重绘
    if (lastAppHeight > 0 && Math.abs(finalH - lastAppHeight) < 2) return;
    
    lastAppHeight = finalH;
    document.documentElement.style.setProperty('--app-height', finalH + 'px');
    console.log('[应用高度] 设置为:', finalH + 'px');
  }
  
  // 用requestAnimationFrame节流
  function setAppHeight() {
    if (setHFrame) return;
    setHFrame = requestAnimationFrame(function() {
      setHFrame = 0;
      setAppHeightNow();
    });
  }
  
  // 立即设置一次
  setAppHeightNow();
  
  // 监听窗口大小变化
  window.addEventListener('resize', setAppHeight);
  
  // 监听屏幕旋转
  window.addEventListener('orientationchange', function() {
    lastAppHeight = 0;
    setTimeout(setAppHeightNow, 100);
    setTimeout(setAppHeightNow, 300);
  });
  
  // 监听visualViewport变化（移动端地址栏等）
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setAppHeight);
    if (!isIOS) {
      window.visualViewport.addEventListener('scroll', setAppHeight);
    }
  }
  
  // 暴露全局函数，方便手动刷新
  window.refreshAppHeight = function(force) {
    if (force) lastAppHeight = 0;
    setAppHeightNow();
  };
  
  console.log('[应用高度] 初始化完成');
}

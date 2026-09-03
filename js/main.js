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
    window.showConfirmDialog({
      title: '重置所有数据',
      message: '确定要重置所有数据吗？此操作不可恢复！',
      confirmText: '重置',
      cancelText: '取消',
      danger: true,
      onConfirm: function() {
        Storage.remove('stellasei-layout');
        location.reload();
      }
    });
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
 * 完全参考原作者miya的实现，用CSS变量--app-height动态设置高度
 * iOS情况下高度加1px，避免白边
 */
function initAppHeight() {
  let lastAppHeight = 0;
  let setHFrame = 0;
  
  // 检测是否是iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // 检测是否是移动端
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // 检测是否是PWA模式（添加到主屏幕）
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone === true;
  
  console.log('[应用高度] iOS:', isIOS, '移动端:', isMobile, 'PWA模式:', isStandalone);
  
  // 计算键盘高度（参考原作者）
  function keyboardInsetPx() {
    const vv = window.visualViewport;
    if (!vv) return 0;
    return Math.max(0, Math.round(window.innerHeight - vv.height - (vv.offsetTop || 0)));
  }
  
  // 设置高度的核心函数（完全参考原作者setHNow）
  function setAppHeightNow() {
    const innerH = window.innerHeight || 0;
    const kbOpen = keyboardInsetPx() > 40;
    let finalH = innerH;
    
    if (isIOS) {
      // iOS PWA模式下，键盘没打开时用屏幕高度来计算
      if (isStandalone && !kbOpen) {
        const sH = window.screen.height || 0;
        const sW = window.screen.width || 0;
        const exp = window.innerWidth > window.innerHeight ? Math.min(sH, sW) : Math.max(sH, sW);
        if (exp > 0) finalH = Math.max(finalH, exp);
      }
      // 关键！iOS情况下高度加1px，避免白边
      const rH = finalH + 1;
      // 只有移动端才做"高度变化小于2px就不更新"的判断
      if (isMobile && lastAppHeight > 0 && Math.abs(rH - lastAppHeight) < 2) return;
      lastAppHeight = rH;
      document.documentElement.style.setProperty('--app-height', rH + 'px');
      console.log('[应用高度] iOS设置为:', rH + 'px');
      return;
    }
    
    // 非iOS，用visualViewport来计算
    const clientH = document.documentElement.clientHeight || 0;
    const vv = window.visualViewport;
    const vvH = vv ? vv.height : 0;
    const vvTop = vv ? (vv.offsetTop || 0) : 0;
    finalH = Math.max(innerH, clientH, vvH + vvTop);
    const rH = finalH;
    // 只有移动端才做"高度变化小于2px就不更新"的判断
    if (isMobile && lastAppHeight > 0 && Math.abs(rH - lastAppHeight) < 2) return;
    lastAppHeight = rH;
    document.documentElement.style.setProperty('--app-height', rH + 'px');
    console.log('[应用高度] 设置为:', rH + 'px');
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
  
  // 切回前台时重新计算高度（参考原作者）
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) return;
    requestAnimationFrame(function() {
      if (document.hidden) return;
      var y = window.scrollY || window.pageYOffset || 0;
      if (isIOS && y > 0) window.scrollTo(0, 0);
      lastAppHeight = 0;
      setAppHeightNow();
    });
  });
  
  // 页面加载完成后重新计算高度
  window.addEventListener('load', function() {
    lastAppHeight = 0;
    setAppHeightNow();
    setTimeout(setAppHeightNow, 300);
  });
  
  // 暴露全局函数，方便手动刷新
  window.refreshAppHeight = function(force) {
    if (force) lastAppHeight = 0;
    setAppHeightNow();
  };
  
  // 持续重新计算高度的函数（用于输入法弹出收起动画期间）
  function keepRecalculatingHeight(duration) {
    let count = 0;
    const interval = setInterval(function() {
      lastAppHeight = 0;
      setAppHeightNow();
      count++;
      if (count >= duration / 100) {
        clearInterval(interval);
      }
    }, 100);
  }
  
  // 监听输入框获得/失去焦点（第三方输入法弹出收起），重新计算高度避免白边
  document.addEventListener('focusin', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      // 输入法弹出，立即重新计算
      lastAppHeight = 0;
      setAppHeight();
      // 持续计算2秒，确保输入法动画完成
      keepRecalculatingHeight(2000);
    }
  });
  
  document.addEventListener('focusout', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      // 输入法收起，立即重新计算
      lastAppHeight = 0;
      setAppHeight();
      // 持续计算3秒，确保输入法完全收起，避免底部白边
      keepRecalculatingHeight(3000);
    }
  });
  
  // 监听页面滚动（输入法收起后可能会有滚动），重新计算高度
  window.addEventListener('scroll', function() {
    lastAppHeight = 0;
    setAppHeight();
  }, { passive: true });
  
  console.log('[应用高度] 初始化完成');
}

/**
 * 全局自定义确认弹窗
 * 所有应用都可以调用 window.showConfirmDialog()
 */
window.showConfirmDialog = function(options) {
  const {
    title = '确认操作',
    message = '确定要执行此操作吗？',
    confirmText = '确认',
    cancelText = '取消',
    onConfirm = null,
    danger = false
  } = options;
  
  // 移除已有的弹窗
  const existing = document.querySelector('.global-confirm-overlay');
  if (existing) existing.remove();
  
  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.className = 'global-confirm-overlay';
  
  // 创建弹窗
  const dialog = document.createElement('div');
  dialog.className = 'global-confirm-dialog' + (danger ? ' danger' : '');
  
  dialog.innerHTML = `
    <div class="global-confirm-icon">
      ${danger ? `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ` : `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      `}
    </div>
    <div class="global-confirm-title">${title}</div>
    <div class="global-confirm-message">${message}</div>
    <div class="global-confirm-buttons">
      <button class="global-confirm-btn global-confirm-cancel">${cancelText}</button>
      <button class="global-confirm-btn global-confirm-ok ${danger ? 'danger' : ''}">${confirmText}</button>
    </div>
  `;
  
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  
  // 显示动画
  setTimeout(() => {
    overlay.classList.add('show');
    dialog.classList.add('show');
  }, 10);
  
  // 取消按钮
  const cancelBtn = dialog.querySelector('.global-confirm-cancel');
  cancelBtn.addEventListener('click', () => {
    window.closeConfirmDialog(overlay);
  });
  
  // 确认按钮
  const okBtn = dialog.querySelector('.global-confirm-ok');
  okBtn.addEventListener('click', () => {
    window.closeConfirmDialog(overlay);
    if (onConfirm) onConfirm();
  });
  
  // 点击遮罩层取消
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      window.closeConfirmDialog(overlay);
    }
  });
};

/**
 * 关闭全局确认弹窗
 */
window.closeConfirmDialog = function(overlay) {
  const dialog = overlay.querySelector('.global-confirm-dialog');
  overlay.classList.remove('show');
  dialog.classList.remove('show');
  
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }, 200);
};

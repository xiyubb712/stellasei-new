/**
 * 星绥小手机 - 设置应用（基础版）
 * 极简风格，SVG线性图标
 */

const SettingsApp = {
  container: null,
  
  render(container, params = {}) {
    this.container = container;
    
    container.innerHTML = `
      <div class="settings-page">
        <div class="settings-header">
          <div class="settings-icon">${getIcon('settings', 'settings-header-icon')}</div>
          <h2 class="settings-title">设置</h2>
        </div>
        
        <div class="settings-group">
          <div class="settings-item">
            <div class="settings-item-left">
              <span class="settings-item-icon">${getIcon('palette')}</span>
              <span class="settings-item-text">主题设置</span>
            </div>
            <span class="settings-item-arrow">›</span>
          </div>
          <div class="settings-item">
            <div class="settings-item-left">
              <span class="settings-item-icon">${getIcon('image')}</span>
              <span class="settings-item-text">壁纸设置</span>
            </div>
            <span class="settings-item-arrow">›</span>
          </div>
          <div class="settings-item">
            <div class="settings-item-left">
              <span class="settings-item-icon">${getIcon('grid')}</span>
              <span class="settings-item-text">应用管理</span>
            </div>
            <span class="settings-item-arrow">›</span>
          </div>
        </div>
        
        <div class="settings-group">
          <div class="settings-item">
            <div class="settings-item-left">
              <span class="settings-item-icon">${getIcon('cloud')}</span>
              <span class="settings-item-text">云端备份</span>
            </div>
            <span class="settings-item-arrow">›</span>
          </div>
          <div class="settings-item">
            <div class="settings-item-left">
              <span class="settings-item-icon">${getIcon('database')}</span>
              <span class="settings-item-text">存储管理</span>
            </div>
            <span class="settings-item-arrow">›</span>
          </div>
        </div>
        
        <div class="settings-footer">
          <div class="settings-version">星绥小手机 v0.1.0</div>
          <div class="settings-subtitle">从零搭建，持续开发中...</div>
        </div>
        
        <button class="settings-reset-btn" onclick="StarSui.resetAll()">
          重置所有数据
        </button>
      </div>
    `;
    
    console.log('[设置应用] 渲染完成');
  },
  
  onClose() {
    console.log('[设置应用] 关闭');
  }
};

window.SettingsApp = SettingsApp;
console.log('[设置应用] 模块加载完成');

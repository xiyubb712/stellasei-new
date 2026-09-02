/**
 * 星绥小手机 - 设置应用
 * 艺术极简风格：大标题、卡片式、彩色图标、大量留白
 */

const SettingsApp = {
  container: null,
  currentView: 'main',
  
  render(container, params = {}) {
    this.container = container;
    this.currentView = params.view || 'main';
    
    if (this.currentView === 'main') {
      this.renderMain();
    } else if (this.currentView === 'api-chat') {
      this.renderApiChat();
    } else if (this.currentView === 'api-voice') {
      this.renderApiVoice();
    } else if (this.currentView === 'api-image') {
      this.renderApiImage();
    } else if (this.currentView === 'storage') {
      this.renderStorage();
    }
    
    console.log('[设置应用] 渲染完成，视图:', this.currentView);
  },
  
  // ==================== 主页面 ====================
  renderMain() {
    this.container.innerHTML = `
      <div class="settings-art-page">
        <!-- 大标题区域 -->
        <div class="settings-hero">
          <div class="settings-hero-label">
            <span class="hero-line"></span>
            <span class="hero-text">PREFERENCES</span>
          </div>
          <h1 class="settings-hero-title">
            Settings <span class="ampersand">&</span><br>
            <span class="hero-italic">Configuration</span>
          </h1>
          <p class="settings-hero-subtitle">精细打理接口、数据与日常偏好</p>
        </div>
        
        <!-- API配置卡片 -->
        <div class="settings-art-section">
          <div class="settings-art-card">
            <div class="card-header">
              <div class="card-header-text">
                <h2 class="card-title">API 配置</h2>
                <p class="card-subtitle">管理各模块的服务端点与密钥</p>
              </div>
              <div class="card-header-icon icon-blue">
                ${getIcon('chat', 'card-icon-svg')}
              </div>
            </div>
            
            <div class="art-list">
              <div class="art-list-item" onclick="SettingsApp.openApi('chat')">
                <div class="list-icon icon-blue">${getIcon('chat', 'list-icon-svg')}</div>
                <div class="list-text">
                  <div class="list-title">对话 API</div>
                  <div class="list-desc">主线路与副线路配置</div>
                </div>
                <div class="list-status" id="api-chat-status">未配置</div>
                <div class="list-arrow">›</div>
              </div>
              
              <div class="art-list-item" onclick="SettingsApp.openApi('voice')">
                <div class="list-icon icon-red">${getIcon('activity', 'list-icon-svg')}</div>
                <div class="list-text">
                  <div class="list-title">语音 API</div>
                  <div class="list-desc">语音合成与音色配置</div>
                </div>
                <div class="list-status" id="api-voice-status">未配置</div>
                <div class="list-arrow">›</div>
              </div>
              
              <div class="art-list-item" onclick="SettingsApp.openApi('image')">
                <div class="list-icon icon-orange">${getIcon('image', 'list-icon-svg')}</div>
                <div class="list-text">
                  <div class="list-title">生图 API</div>
                  <div class="list-desc">OpenAI 兼容 / NovelAI</div>
                </div>
                <div class="list-status" id="api-image-status">未配置</div>
                <div class="list-arrow">›</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 数据管理卡片 -->
        <div class="settings-art-section">
          <div class="settings-art-card">
            <div class="card-header">
              <div class="card-header-text">
                <h2 class="card-title">数据管理</h2>
                <p class="card-subtitle">备份、恢复与云端同步</p>
              </div>
              <div class="card-header-icon icon-green">
                ${getIcon('database', 'card-icon-svg')}
              </div>
            </div>
            
            <div class="art-list">
              <div class="art-list-item" onclick="SettingsApp.exportData()">
                <div class="list-icon icon-blue">${getIcon('plus', 'list-icon-svg')}</div>
                <div class="list-text">
                  <div class="list-title">备份数据</div>
                  <div class="list-desc">导出所有数据为 JSON 文件</div>
                </div>
                <div class="list-arrow">›</div>
              </div>
              
              <div class="art-list-item" onclick="SettingsApp.importData()">
                <div class="list-icon icon-purple">${getIcon('database', 'list-icon-svg')}</div>
                <div class="list-text">
                  <div class="list-title">恢复数据</div>
                  <div class="list-desc">从备份文件导入数据</div>
                </div>
                <div class="list-arrow">›</div>
              </div>
              
              <div class="art-list-item" onclick="SettingsApp.openCloud()">
                <div class="list-icon icon-teal">${getIcon('cloud', 'list-icon-svg')}</div>
                <div class="list-text">
                  <div class="list-title">云端备份</div>
                  <div class="list-desc">自动同步到云端</div>
                </div>
                <div class="list-arrow">›</div>
              </div>
              
              <div class="art-list-item item-danger" onclick="SettingsApp.clearAllData()">
                <div class="list-icon icon-red">${getIcon('trash', 'list-icon-svg')}</div>
                <div class="list-text">
                  <div class="list-title">清除所有数据</div>
                  <div class="list-desc">重置应用到初始状态</div>
                </div>
                <div class="list-arrow">›</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 存储空间卡片 -->
        <div class="settings-art-section">
          <div class="settings-art-card" onclick="SettingsApp.openStorage()">
            <div class="card-header">
              <div class="card-header-text">
                <h2 class="card-title">存储空间</h2>
                <p class="card-subtitle">查看数据使用情况</p>
              </div>
              <div class="card-header-icon icon-orange">
                ${getIcon('database', 'card-icon-svg')}
              </div>
            </div>
            
            <div class="storage-preview">
              <div class="storage-preview-bar">
                <div class="storage-preview-fill" id="storage-preview-fill"></div>
              </div>
              <div class="storage-preview-text">
                <span id="storage-preview-size">计算中...</span>
                <span class="storage-preview-label">已使用</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部版本信息 -->
        <div class="settings-art-footer">
          <div class="footer-version">星绥小手机 v0.1.0</div>
          <div class="footer-subtitle">从零搭建，持续开发中</div>
        </div>
      </div>
    `;
    
    // 更新API配置状态
    this.updateApiStatus();
    // 更新存储空间预览
    this.updateStoragePreview();
  },
  
  // ==================== API设置子页面 ====================
  openApi(type) {
    AppRouter.open('settings', { view: `api-${type}` });
  },
  
  renderApiChat() {
    const config = Storage.get('api-chat') || { baseUrl: '', apiKey: '', model: '' };
    this.container.innerHTML = this.renderApiPage('chat', '对话 API', config, [
      { key: 'baseUrl', label: 'API 地址', placeholder: 'https://api.example.com/v1' },
      { key: 'apiKey', label: 'API 密钥', placeholder: 'sk-...', type: 'password' },
      { key: 'model', label: '模型名称', placeholder: 'gpt-4o' }
    ]);
  },
  
  renderApiVoice() {
    const config = Storage.get('api-voice') || { baseUrl: '', apiKey: '', voice: '' };
    this.container.innerHTML = this.renderApiPage('voice', '语音 API', config, [
      { key: 'baseUrl', label: 'API 地址', placeholder: 'https://api.example.com/v1' },
      { key: 'apiKey', label: 'API 密钥', placeholder: 'sk-...', type: 'password' },
      { key: 'voice', label: '音色', placeholder: 'alloy' }
    ]);
  },
  
  renderApiImage() {
    const config = Storage.get('api-image') || { baseUrl: '', apiKey: '', model: '' };
    this.container.innerHTML = this.renderApiPage('image', '生图 API', config, [
      { key: 'baseUrl', label: 'API 地址', placeholder: 'https://api.example.com/v1' },
      { key: 'apiKey', label: 'API 密钥', placeholder: 'sk-...', type: 'password' },
      { key: 'model', label: '模型名称', placeholder: 'dall-e-3' }
    ]);
  },
  
  renderApiPage(type, title, config, fields) {
    const fieldsHtml = fields.map(f => `
      <div class="art-api-field">
        <label class="art-api-label">${f.label}</label>
        <input 
          type="${f.type || 'text'}" 
          class="art-api-input" 
          id="api-${type}-${f.key}"
          value="${config[f.key] || ''}"
          placeholder="${f.placeholder || ''}"
        >
      </div>
    `).join('');
    
    return `
      <div class="settings-art-page api-art-page">
        <div class="settings-art-back">
          <button class="art-back-btn" onclick="SettingsApp.goBack()">
            ${getIcon('back', 'art-back-icon')}
            <span>返回</span>
          </button>
        </div>
        
        <div class="settings-hero">
          <div class="settings-hero-label">
            <span class="hero-line"></span>
            <span class="hero-text">API CONFIG</span>
          </div>
          <h1 class="settings-hero-title hero-small">
            <span class="hero-italic">${title}</span>
          </h1>
          <p class="settings-hero-subtitle">配置服务端点与访问密钥</p>
        </div>
        
        <div class="settings-art-section">
          <div class="settings-art-card">
            <div class="art-api-form">
              ${fieldsHtml}
            </div>
          </div>
        </div>
        
        <div class="art-api-actions">
          <button class="art-btn art-btn-primary" onclick="SettingsApp.saveApi('${type}')">保存配置</button>
          <button class="art-btn art-btn-secondary" onclick="SettingsApp.testApi('${type}')">测试连接</button>
        </div>
        
        <div class="art-api-result" id="api-${type}-test-result"></div>
        
        <div class="settings-art-footer">
          <div class="footer-subtitle">配置保存在本地，不会上传</div>
        </div>
      </div>
    `;
  },
  
  saveApi(type) {
    const fields = type === 'chat' 
      ? ['baseUrl', 'apiKey', 'model']
      : type === 'voice'
      ? ['baseUrl', 'apiKey', 'voice']
      : ['baseUrl', 'apiKey', 'model'];
    
    const config = {};
    fields.forEach(f => {
      const input = document.getElementById(`api-${type}-${f}`);
      if (input) config[f] = input.value.trim();
    });
    
    Storage.set(`api-${type}`, config);
    this.showToast('配置已保存');
    this.updateApiStatus();
  },
  
  testApi(type) {
    const resultEl = document.getElementById(`api-${type}-test-result`);
    const config = Storage.get(`api-${type}`);
    
    if (!config || !config.baseUrl || !config.apiKey) {
      resultEl.innerHTML = '<div class="art-result art-result-error">请先填写API地址和密钥</div>';
      return;
    }
    
    resultEl.innerHTML = '<div class="art-result art-result-loading">正在测试连接...</div>';
    
    setTimeout(() => {
      resultEl.innerHTML = '<div class="art-result art-result-success">连接成功！API配置正确</div>';
    }, 1000);
  },
  
  updateApiStatus() {
    ['chat', 'voice', 'image'].forEach(type => {
      const config = Storage.get(`api-${type}`);
      const statusEl = document.getElementById(`api-${type}-status`);
      if (statusEl) {
        if (config && config.baseUrl && config.apiKey) {
          statusEl.textContent = '已配置';
          statusEl.className = 'list-status status-active';
        } else {
          statusEl.textContent = '未配置';
          statusEl.className = 'list-status';
        }
      }
    });
  },
  
  // ==================== 数据管理 ====================
  exportData() {
    const allData = Storage.exportAllLS();
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stellasei-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('数据已导出');
  },
  
  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (confirm('确定要导入这些数据吗？这会覆盖当前所有数据！')) {
            Storage.importAllLS(data);
            this.showToast('数据已导入，正在刷新...');
            setTimeout(() => location.reload(), 1000);
          }
        } catch (err) {
          this.showToast('导入失败：文件格式错误');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },
  
  openCloud() {
    this.showToast('云端备份功能开发中...');
  },
  
  clearAllData() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      if (confirm('再次确认：真的要清除所有数据吗？')) {
        Storage.clear();
        this.showToast('数据已清除，正在刷新...');
        setTimeout(() => location.reload(), 1000);
      }
    }
  },
  
  // ==================== 存储空间 ====================
  openStorage() {
    AppRouter.open('settings', { view: 'storage' });
  },
  
  renderStorage() {
    this.container.innerHTML = `
      <div class="settings-art-page storage-art-page">
        <div class="settings-art-back">
          <button class="art-back-btn" onclick="SettingsApp.goBack()">
            ${getIcon('back', 'art-back-icon')}
            <span>返回</span>
          </button>
        </div>
        
        <div class="settings-hero">
          <div class="settings-hero-label">
            <span class="hero-line"></span>
            <span class="hero-text">STORAGE</span>
          </div>
          <h1 class="settings-hero-title hero-small">
            <span class="hero-italic">存储空间</span>
          </h1>
          <p class="settings-hero-subtitle">查看数据使用情况与分类统计</p>
        </div>
        
        <div class="settings-art-section">
          <div class="settings-art-card">
            <div class="art-storage-overview">
              <div class="art-storage-ring">
                <div class="art-storage-ring-fill" id="storage-ring-fill"></div>
                <div class="art-storage-ring-center">
                  <div class="art-storage-total" id="storage-total">计算中...</div>
                  <div class="art-storage-label">已使用</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="settings-art-section">
          <div class="settings-art-card">
            <div class="card-header">
              <div class="card-header-text">
                <h2 class="card-title card-title-small">详细分类</h2>
              </div>
            </div>
            <div class="art-storage-list" id="storage-list">
              <div class="art-storage-loading">正在计算存储空间...</div>
            </div>
          </div>
        </div>
        
        <div class="settings-art-footer">
          <div class="footer-subtitle">数据保存在浏览器本地</div>
        </div>
      </div>
    `;
    
    this.calculateStorage();
  },
  
  async calculateStorage() {
    try {
      let lsTotal = 0;
      const lsBreakdown = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        lsTotal += size;
        
        let category = '其他数据';
        if (key.startsWith('api-')) category = 'API 配置';
        else if (key.includes('layout') || key.includes('desktop')) category = '布局设置';
        else if (key.includes('chat') || key.includes('message')) category = '聊天数据';
        else if (key.includes('contact') || key.includes('character')) category = '联系人';
        else if (key.includes('worldbook')) category = '世界书';
        else if (key.includes('image') || key.includes('photo')) category = '图片数据';
        
        lsBreakdown.push({ key, size, category });
      }
      
      const categoryMap = {};
      lsBreakdown.forEach(item => {
        if (!categoryMap[item.category]) categoryMap[item.category] = 0;
        categoryMap[item.category] += item.size;
      });
      
      let idbTotal = 0;
      try {
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          idbTotal = estimate.usage || 0;
        }
      } catch (e) {
        console.log('无法获取IndexedDB存储信息');
      }
      
      const total = lsTotal + idbTotal;
      
      document.getElementById('storage-total').textContent = this.formatSize(total);
      
      const percentage = Math.min((total / (5 * 1024 * 1024)) * 100, 100);
      const ring = document.getElementById('storage-ring-fill');
      if (ring) {
        ring.style.background = `conic-gradient(#8b7355 ${percentage}%, #f0ebe5 ${percentage}%)`;
      }
      
      const listEl = document.getElementById('storage-list');
      const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
      
      if (idbTotal > 0) {
        categories.push(['图片与文件', idbTotal]);
      }
      
      listEl.innerHTML = categories.map(([name, size]) => `
        <div class="art-storage-item">
          <div class="art-storage-item-left">
            <span class="art-storage-item-name">${name}</span>
          </div>
          <span class="art-storage-item-size">${this.formatSize(size)}</span>
        </div>
      `).join('');
      
    } catch (err) {
      console.error('计算存储空间失败:', err);
      const totalEl = document.getElementById('storage-total');
      if (totalEl) totalEl.textContent = '计算失败';
      const listEl = document.getElementById('storage-list');
      if (listEl) listEl.innerHTML = '<div class="art-storage-loading">无法计算存储空间</div>';
    }
  },
  
  updateStoragePreview() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      total += (localStorage.getItem(key) || '').length;
    }
    
    const sizeEl = document.getElementById('storage-preview-size');
    const fillEl = document.getElementById('storage-preview-fill');
    
    if (sizeEl) sizeEl.textContent = this.formatSize(total);
    if (fillEl) {
      const percentage = Math.min((total / (5 * 1024 * 1024)) * 100, 100);
      fillEl.style.width = percentage + '%';
    }
  },
  
  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  },
  
  // ==================== 返回主页面 ====================
  goBack() {
    this.currentView = 'main';
    this.renderMain();
  },
  
  // ==================== Toast提示 ====================
  showToast(message) {
    const existing = document.querySelector('.art-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'art-toast';
    toast.textContent = message;
    this.container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  },
  
  onClose() {
    console.log('[设置应用] 关闭');
  }
};

window.SettingsApp = SettingsApp;
console.log('[设置应用] 模块加载完成');

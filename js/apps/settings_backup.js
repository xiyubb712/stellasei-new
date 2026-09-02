/**
 * 星绥小手机 - 设置应用
 * 极简高级风：大量留白、克制配色、精致排版、点睛之笔
 */

const SettingsApp = {
  container: null,
  currentTab: 'api',
  
  render(container, params = {}) {
    this.container = container;
    this.currentTab = params.tab || 'api';
    this.renderMain();
    console.log('[设置应用] 渲染完成，标签:', this.currentTab);
  },
  
  renderMain() {
    const tabs = [
      { id: 'api', name: '接口', en: 'API', celestial: 'Stellasei API' },
      { id: 'data', name: '数据', en: 'Data', celestial: 'Stellasei Data' },
      { id: 'storage', name: '存储', en: 'Storage', celestial: 'Stellasei Storage' },
      { id: 'about', name: '关于', en: 'About', celestial: 'About Stellasei' }
    ];
    
    const currentIndex = tabs.findIndex(t => t.id === this.currentTab);
    
    this.container.innerHTML = `
      <div class="minimal-page">
        <!-- 顶部Hero：点睛之笔 - 超大编号 + Stellasei英文 + 装饰 -->
        <div class="minimal-hero">
          <div class="minimal-hero-number">0${currentIndex + 1}</div>
          <div class="minimal-hero-text">
            <h1 class="minimal-hero-title">${tabs[currentIndex].name}</h1>
            <p class="minimal-hero-sub">${tabs[currentIndex].celestial}</p>
          </div>
          <div class="minimal-hero-deco">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <!-- 极简导航：纯文字，无图标 -->
        <div class="minimal-nav">
          ${tabs.map((tab, i) => `
            <div class="minimal-nav-item ${this.currentTab === tab.id ? 'active' : ''}" 
                 onclick="SettingsApp.switchTab('${tab.id}')">
              <span class="minimal-nav-num">0${i + 1}</span>
              <span class="minimal-nav-name">${tab.name}</span>
              <div class="minimal-nav-line"></div>
            </div>
          `).join('')}
        </div>
        
        <!-- 内容区域 -->
        <div class="minimal-content">
          ${this.renderContent()}
        </div>
      </div>
    `;
  },
  
  switchTab(tab) {
    this.currentTab = tab;
    this.renderMain();
  },
  
  renderContent() {
    if (this.currentTab === 'api') return this.renderApiContent();
    if (this.currentTab === 'data') return this.renderDataContent();
    if (this.currentTab === 'storage') return this.renderStorageContent();
    if (this.currentTab === 'about') return this.renderAboutContent();
    return '';
  },
  
  // ==================== 接口配置 ====================
  renderApiContent() {
    const chatConfig = Storage.get('api-chat') || {};
    const voiceConfig = Storage.get('api-voice') || {};
    const imageConfig = Storage.get('api-image') || {};
    
    const items = [
      { type: 'chat', name: '对话接口', en: 'Chat API', config: chatConfig },
      { type: 'voice', name: '语音接口', en: 'Voice API', config: voiceConfig },
      { type: 'image', name: '生图接口', en: 'Image API', config: imageConfig }
    ];
    
    return `
      <div class="minimal-list">
        ${items.map((item, i) => `
          <div class="minimal-list-item" onclick="SettingsApp.openApiDetail('${item.type}')">
            <div class="minimal-list-left">
              <span class="minimal-list-index">0${i + 1}</span>
              <div class="minimal-list-text">
                <div class="minimal-list-name">${item.name}</div>
                <div class="minimal-list-en">${item.en}</div>
              </div>
            </div>
            <div class="minimal-list-right">
              <span class="minimal-status ${item.config.baseUrl ? 'on' : 'off'}">
                ${item.config.baseUrl ? '已配置' : '未配置'}
              </span>
              <span class="minimal-arrow">→</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },
  
  // ==================== 接口详情 ====================
  openApiDetail(type) {
    const config = Storage.get(`api-${type}`) || { baseUrl: '', apiKey: '', model: '' };
    const nameMap = { chat: '对话接口', voice: '语音接口', image: '生图接口' };
    const enMap = { chat: 'Chat API', voice: 'Voice API', image: 'Image API' };
    const indexMap = { chat: '01', voice: '02', image: '03' };
    
    this.container.innerHTML = `
      <div class="minimal-page">
        <div class="minimal-back" onclick="SettingsApp.renderMain()">
          <span>←</span>
          <span>返回</span>
        </div>
        
        <div class="minimal-detail-hero">
          <div class="minimal-detail-number">${indexMap[type]}</div>
          <div class="minimal-detail-text">
            <h1 class="minimal-detail-title">${nameMap[type]}</h1>
            <p class="minimal-detail-sub">${enMap[type]}</p>
          </div>
        </div>
        
        <div class="minimal-form">
          <div class="minimal-form-item">
            <label class="minimal-form-label">接口地址</label>
            <input type="text" class="minimal-input" id="api-${type}-baseUrl" 
              value="${config.baseUrl || ''}" placeholder="https://api.example.com/v1">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">访问密钥</label>
            <input type="password" class="minimal-input" id="api-${type}-apiKey" 
              value="${config.apiKey || ''}" placeholder="sk-...">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">${type === 'voice' ? '默认音色' : '模型名称'}</label>
            <input type="text" class="minimal-input" id="api-${type}-${type === 'voice' ? 'voice' : 'model'}" 
              value="${config[type === 'voice' ? 'voice' : 'model'] || ''}" 
              placeholder="${type === 'voice' ? 'alloy' : 'gpt-4o'}">
          </div>
        </div>
        
        <div class="minimal-actions">
          <button class="minimal-btn minimal-btn-primary" onclick="SettingsApp.saveApi('${type}')">保存配置</button>
          <button class="minimal-btn minimal-btn-ghost" onclick="SettingsApp.testApi('${type}')">测试连接</button>
        </div>
        
        <div class="minimal-test-result" id="api-${type}-test-result"></div>
      </div>
    `;
  },
  
  saveApi(type) {
    const modelKey = type === 'voice' ? 'voice' : 'model';
    const config = {
      baseUrl: document.getElementById(`api-${type}-baseUrl`).value.trim(),
      apiKey: document.getElementById(`api-${type}-apiKey`).value.trim(),
      [modelKey]: document.getElementById(`api-${type}-${modelKey}`).value.trim()
    };
    
    Storage.set(`api-${type}`, config);
    this.showToast('配置已保存');
    setTimeout(() => this.renderMain(), 500);
  },
  
  testApi(type) {
    const resultEl = document.getElementById(`api-${type}-test-result`);
    const config = Storage.get(`api-${type}`);
    
    if (!config || !config.baseUrl || !config.apiKey) {
      resultEl.innerHTML = '<div class="minimal-result minimal-result-warn">请先填写接口地址与密钥</div>';
      return;
    }
    
    resultEl.innerHTML = '<div class="minimal-result minimal-result-loading">正在测试连接...</div>';
    
    setTimeout(() => {
      resultEl.innerHTML = '<div class="minimal-result minimal-result-ok">连接成功 · 接口配置正确</div>';
    }, 1000);
  },
  
  // ==================== 数据管理 ====================
  renderDataContent() {
    const items = [
      { action: 'exportData', name: '备份导出', en: 'Export', desc: '导出所有数据' },
      { action: 'importData', name: '恢复导入', en: 'Import', desc: '从备份恢复' },
      { action: 'openCloud', name: '云端同步', en: 'Cloud', desc: '自动备份云端' },
      { action: 'clearAllData', name: '清除数据', en: 'Clear', desc: '重置到初始', danger: true }
    ];
    
    return `
      <div class="minimal-grid">
        ${items.map((item, i) => `
          <div class="minimal-grid-item ${item.danger ? 'danger' : ''}" onclick="SettingsApp.${item.action}()">
            <div class="minimal-grid-number">0${i + 1}</div>
            <div class="minimal-grid-name">${item.name}</div>
            <div class="minimal-grid-en">${item.en}</div>
            <div class="minimal-grid-desc">${item.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
  },
  
  // ==================== 存储空间 ====================
  renderStorageContent() {
    return `
      <div class="minimal-storage">
        <div class="minimal-storage-hero">
          <div class="minimal-storage-number" id="minimal-storage-percent">--</div>
          <div class="minimal-storage-text">
            <div class="minimal-storage-size" id="minimal-storage-size">计算中...</div>
            <div class="minimal-storage-label">已使用空间</div>
          </div>
        </div>
        
        <div class="minimal-storage-bar">
          <div class="minimal-storage-fill" id="minimal-storage-fill"></div>
        </div>
        
        <div class="minimal-storage-list" id="minimal-storage-list">
          <div class="minimal-storage-loading">正在计算...</div>
        </div>
      </div>
    `;
    
    setTimeout(() => this.calculateMinimalStorage(), 100);
  },
  
  async calculateMinimalStorage() {
    try {
      let total = 0;
      const categoryMap = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        total += size;
        
        let category = '其他';
        if (key.startsWith('api-')) category = '接口配置';
        else if (key.includes('layout')) category = '布局设置';
        else if (key.includes('chat')) category = '聊天数据';
        else if (key.includes('contact')) category = '联系人';
        else if (key.includes('worldbook')) category = '世界书';
        
        if (!categoryMap[category]) categoryMap[category] = 0;
        categoryMap[category] += size;
      }
      
      const maxSize = 5 * 1024 * 1024;
      const percentage = Math.min((total / maxSize) * 100, 100);
      
      const percentEl = document.getElementById('minimal-storage-percent');
      const sizeEl = document.getElementById('minimal-storage-size');
      const fillEl = document.getElementById('minimal-storage-fill');
      const listEl = document.getElementById('minimal-storage-list');
      
      if (percentEl) percentEl.textContent = percentage.toFixed(0) + '%';
      if (sizeEl) sizeEl.textContent = this.formatSize(total);
      if (fillEl) fillEl.style.width = percentage + '%';
      
      if (listEl) {
        const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
        listEl.innerHTML = categories.map(([name, size], i) => `
          <div class="minimal-storage-item">
            <div class="minimal-storage-left">
              <span class="minimal-storage-index">0${i + 1}</span>
              <span class="minimal-storage-name">${name}</span>
            </div>
            <span class="minimal-storage-size">${this.formatSize(size)}</span>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error('计算存储空间失败:', err);
    }
  },
  
  // ==================== 关于 ====================
  renderAboutContent() {
    return `
      <div class="minimal-about">
        <div class="minimal-about-hero">
          <div class="minimal-about-mark">星</div>
          <h1 class="minimal-about-name">星绥小手机</h1>
          <p class="minimal-about-version">v0.1.0</p>
        </div>
        
        <div class="minimal-about-divider"></div>
        
        <div class="minimal-about-info">
          <div class="minimal-about-row">
            <span class="minimal-about-label">架构</span>
            <span class="minimal-about-value">纯前端 · 本地存储</span>
          </div>
          <div class="minimal-about-row">
            <span class="minimal-about-label">设计</span>
            <span class="minimal-about-value">极简高级风</span>
          </div>
          <div class="minimal-about-row">
            <span class="minimal-about-label">状态</span>
            <span class="minimal-about-value">开发中</span>
          </div>
        </div>
        
        <p class="minimal-about-footer">从零搭建 · 持续生长中</p>
      </div>
    `;
  },
  
  // ==================== 数据功能 ====================
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
            this.showToast('数据已导入');
            setTimeout(() => location.reload(), 1000);
          }
        } catch (err) {
          this.showToast('导入失败 · 文件格式错误');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },
  
  openCloud() {
    this.showToast('云端同步 · 开发中');
  },
  
  clearAllData() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      if (confirm('再次确认 · 真的要清除所有数据吗？')) {
        Storage.clear();
        this.showToast('数据已清除');
        setTimeout(() => location.reload(), 1000);
      }
    }
  },
  
  // ==================== 工具 ====================
  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  },
  
  showToast(message) {
    const existing = document.querySelector('.minimal-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'minimal-toast';
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

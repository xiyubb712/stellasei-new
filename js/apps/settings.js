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
        <!-- 顶部杂志风装饰条（包含返回按钮） -->
        <div class="minimal-magazine-bar">
          <button class="minimal-back-btn" onclick="AppRouter.close()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="minimal-magazine-vol">VOL. 0${currentIndex + 1}</span>
          <span class="minimal-magazine-dot"></span>
          <span class="minimal-magazine-editorial">EDITORIAL</span>
          <span class="minimal-magazine-dot"></span>
          <span class="minimal-magazine-date">${new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
        </div>
        
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
              <span class="minimal-nav-en">${tab.en}</span>
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
      { type: 'chat', name: '对话接口', en: 'Chat API', config: chatConfig, action: 'showChatApiList' },
      { type: 'voice', name: '语音接口', en: 'Voice API', config: voiceConfig, action: 'showVoiceApiList' },
      { type: 'image', name: '生图接口', en: 'Image API', config: imageConfig, action: 'showImageApiList' }
    ];
    
    return `
      <div class="minimal-list">
        ${items.map((item, i) => `
          <div class="minimal-list-item" onclick="SettingsApp.${item.action}('${item.type}')">
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
  
  // ==================== 对话API列表 ====================
  getChatApiList() {
    const list = Storage.get('chat-api-list');
    if (!list || list.length === 0) {
      // 初始化默认API
      const defaultConfig = Storage.get('api-chat') || {};
      const defaultApi = {
        id: 'default',
        name: '默认接口',
        provider: 'OpenAI',
        baseUrl: defaultConfig.baseUrl || '',
        apiKey: defaultConfig.apiKey || '',
        model: defaultConfig.model || '',
        isDefault: true,
        createdAt: Date.now()
      };
      Storage.set('chat-api-list', [defaultApi]);
      return [defaultApi];
    }
    return list;
  },
  
  saveChatApiList(list) {
    Storage.set('chat-api-list', list);
    // 同步默认API到旧的存储位置
    const defaultApi = list.find(api => api.isDefault);
    if (defaultApi) {
      Storage.set('api-chat', {
        baseUrl: defaultApi.baseUrl,
        apiKey: defaultApi.apiKey,
        model: defaultApi.model
      });
    }
  },
  
  showChatApiList() {
    const apiList = this.getChatApiList();
    
    this.container.innerHTML = `
      <div class="minimal-page">
        <!-- 顶部杂志风装饰条 -->
        <div class="minimal-magazine-bar">
          <button class="minimal-back-btn" onclick="SettingsApp.renderMain()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="minimal-magazine-vol">VOL. 01</span>
          <span class="minimal-magazine-dot"></span>
          <span class="minimal-magazine-editorial">CHAT API</span>
          <span class="minimal-magazine-dot"></span>
          <span class="minimal-magazine-date">${new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
          <button class="minimal-add-api-btn" onclick="SettingsApp.openApiEditor()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>新增API</span>
          </button>
        </div>
        
        <!-- Hero区 -->
        <div class="minimal-hero">
          <div class="minimal-hero-number">01</div>
          <div class="minimal-hero-text">
            <h1 class="minimal-hero-title">对话接口</h1>
            <p class="minimal-hero-sub">CHAT API SETTINGS</p>
          </div>
          <div class="minimal-hero-deco">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <!-- 全局接口说明 -->
        <div class="api-global-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span>以下为全局对话接口，默认所有需要文本API的功能都使用「默认接口」。你可以新增多个API方案，随时切换使用。</span>
        </div>
        
        <!-- API列表 -->
        <div class="api-grid">
          ${apiList.map((api, i) => `
            <div class="api-card ${api.isDefault ? 'api-card-default' : ''}">
              <div class="api-card-header">
                <div class="api-card-name">${api.name}</div>
                ${api.isDefault ? '<span class="api-card-badge">默认</span>' : ''}
              </div>
              <div class="api-card-model">${api.model || '未设置模型'}</div>
              <div class="api-card-provider">${api.provider}</div>
              <div class="api-card-actions">
                <button class="api-card-btn" onclick="SettingsApp.openApiEditor('${api.id}')" title="编辑">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  </svg>
                </button>
                <button class="api-card-btn" onclick="SettingsApp.duplicateApiConfig('${api.id}')" title="复制">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                </button>
                ${!api.isDefault ? `
                  <button class="api-card-btn api-card-btn-danger" onclick="SettingsApp.deleteApiConfig('${api.id}')" title="删除">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                ` : ''}
                ${!api.isDefault ? `
                  <button class="api-card-btn api-card-btn-primary" onclick="SettingsApp.setDefaultApi('${api.id}')" title="设为默认">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  // ==================== API编辑器弹窗 ====================
  openApiEditor(apiId = null) {
    const apiList = this.getChatApiList();
    const api = apiId ? apiList.find(a => a.id === apiId) : null;
    const isEdit = !!api;
    
    const providers = ['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Moonshot', 'Zhipu', 'Qwen', 'Other'];
    
    // 移除已存在的弹窗
    const existing = document.getElementById('api-editor-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'api-editor-modal';
    modal.className = 'minimal-modal-overlay';
    modal.innerHTML = `
      <div class="minimal-modal api-editor-modal">
        <div class="minimal-modal-header">
          <h3 class="minimal-modal-title">${isEdit ? '编辑配置' : '新增配置'}</h3>
          <button class="minimal-modal-close" onclick="SettingsApp.closeApiEditor()">×</button>
        </div>
        
        <div class="api-editor-form">
          <div class="minimal-form-item">
            <label class="minimal-form-label">配置名称</label>
            <input type="text" class="minimal-input" id="api-editor-name" 
              value="${api?.name || ''}" placeholder="例如：OpenAI 官方">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">服务商</label>
            <select class="minimal-input minimal-select" id="api-editor-provider">
              ${providers.map(p => `<option value="${p}" ${api?.provider === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">接口地址 (Base URL)</label>
            <input type="text" class="minimal-input" id="api-editor-baseUrl" 
              value="${api?.baseUrl || ''}" placeholder="https://api.openai.com/v1">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">访问密钥 (API Key)</label>
            <input type="password" class="minimal-input" id="api-editor-apiKey" 
              value="${api?.apiKey || ''}" placeholder="sk-...">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">默认模型</label>
            <div class="minimal-input-with-btn">
              <input type="text" class="minimal-input" id="api-editor-model" 
                value="${api?.model || ''}" placeholder="gpt-4o">
              <button class="minimal-fetch-btn" onclick="SettingsApp.fetchModelsForEditor()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                  <path d="M16 16h5v5"/>
                </svg>
                <span>拉取模型</span>
              </button>
            </div>
          </div>
          
          <div class="api-editor-actions">
            <button class="minimal-btn minimal-btn-ghost" onclick="SettingsApp.testApiConnection()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                <line x1="12" x2="12.01" y1="20" y2="20"/>
              </svg>
              测试连接
            </button>
            <button class="minimal-btn minimal-btn-primary" onclick="SettingsApp.saveApiConfig('${apiId || ''}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              保存配置
            </button>
          </div>
          
          <div class="api-editor-test-result" id="api-editor-test-result"></div>
        </div>
      </div>
    `;
    
    this.container.appendChild(modal);
    
    // 点击遮罩关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeApiEditor();
    });
  },
  
  closeApiEditor() {
    const modal = document.getElementById('api-editor-modal');
    if (modal) modal.remove();
  },
  
  async fetchModelsForEditor() {
    const baseUrl = document.getElementById('api-editor-baseUrl').value.trim();
    const apiKey = document.getElementById('api-editor-apiKey').value.trim();
    
    if (!baseUrl || !apiKey) {
      this.showToast('请先填写接口地址与密钥');
      return;
    }
    
    const btn = document.querySelector('#api-editor-modal .minimal-fetch-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>获取中...</span>';
    btn.disabled = true;
    
    try {
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const models = data.data || data.models || [];
      
      if (models.length === 0) {
        this.showToast('未获取到模型列表');
        return;
      }
      
      // 显示模型选择弹窗
      this.showModelSelectorForEditor(models);
      
    } catch (error) {
      console.error('获取模型失败:', error);
      this.showToast('获取模型失败，请检查接口地址');
    }
    
    btn.innerHTML = originalText;
    btn.disabled = false;
  },
  
  showModelSelectorForEditor(models) {
    const existing = document.getElementById('model-selector-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'model-selector-modal';
    modal.className = 'minimal-modal-overlay';
    modal.innerHTML = `
      <div class="minimal-modal">
        <div class="minimal-modal-header">
          <h3 class="minimal-modal-title">选择模型</h3>
          <span class="minimal-modal-count">共 ${models.length} 个</span>
          <button class="minimal-modal-close" onclick="SettingsApp.closeModelSelector()">×</button>
        </div>
        <div class="minimal-modal-search">
          <input type="text" class="minimal-modal-input" id="model-search-input" 
            placeholder="搜索模型..." oninput="SettingsApp.filterModels()">
        </div>
        <div class="minimal-modal-list" id="model-list">
          ${models.map((model, i) => `
            <div class="minimal-modal-item" onclick="SettingsApp.selectModelForEditor('${model.id || model.name}')">
              <span class="minimal-modal-item-index">${String(i + 1).padStart(2, '0')}</span>
              <span class="minimal-modal-item-name">${model.id || model.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    this.container.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModelSelector();
    });
  },
  
  selectModelForEditor(modelId) {
    const input = document.getElementById('api-editor-model');
    if (input) input.value = modelId;
    this.closeModelSelector();
    this.showToast('已选择模型: ' + modelId);
  },
  
  async testApiConnection() {
    const resultEl = document.getElementById('api-editor-test-result');
    const baseUrl = document.getElementById('api-editor-baseUrl').value.trim();
    const apiKey = document.getElementById('api-editor-apiKey').value.trim();
    
    if (!baseUrl || !apiKey) {
      resultEl.innerHTML = '<div class="minimal-result minimal-result-warn">请先填写接口地址与密钥</div>';
      return;
    }
    
    resultEl.innerHTML = '<div class="minimal-result minimal-result-loading">正在测试连接...</div>';
    
    try {
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        resultEl.innerHTML = '<div class="minimal-result minimal-result-ok">连接成功 · 接口配置正确</div>';
      } else {
        resultEl.innerHTML = `<div class="minimal-result minimal-result-error">连接失败 · HTTP ${response.status}</div>`;
      }
    } catch (error) {
      resultEl.innerHTML = `<div class="minimal-result minimal-result-error">连接失败 · ${error.message}</div>`;
    }
  },
  
  saveApiConfig(apiId = null) {
    const name = document.getElementById('api-editor-name').value.trim();
    const provider = document.getElementById('api-editor-provider').value;
    const baseUrl = document.getElementById('api-editor-baseUrl').value.trim();
    const apiKey = document.getElementById('api-editor-apiKey').value.trim();
    const model = document.getElementById('api-editor-model').value.trim();
    
    if (!name) {
      this.showToast('请填写配置名称');
      return;
    }
    
    const apiList = this.getChatApiList();
    
    if (apiId) {
      // 编辑现有配置
      const index = apiList.findIndex(a => a.id === apiId);
      if (index !== -1) {
        apiList[index] = {
          ...apiList[index],
          name,
          provider,
          baseUrl,
          apiKey,
          model,
          updatedAt: Date.now()
        };
      }
    } else {
      // 新增配置
      const newApi = {
        id: 'api_' + Date.now(),
        name,
        provider,
        baseUrl,
        apiKey,
        model,
        isDefault: apiList.length === 0,
        createdAt: Date.now()
      };
      apiList.push(newApi);
    }
    
    this.saveChatApiList(apiList);
    this.closeApiEditor();
    this.showToast(apiId ? '配置已更新' : '配置已保存');
    this.showChatApiList();
  },
  
  deleteApiConfig(apiId) {
    if (!confirm('确定要删除这个API配置吗？')) return;
    
    const apiList = this.getChatApiList();
    const newList = apiList.filter(a => a.id !== apiId);
    this.saveChatApiList(newList);
    this.showToast('配置已删除');
    this.showChatApiList();
  },
  
  duplicateApiConfig(apiId) {
    const apiList = this.getChatApiList();
    const api = apiList.find(a => a.id === apiId);
    if (!api) return;
    
    const newApi = {
      ...api,
      id: 'api_' + Date.now(),
      name: api.name + ' (副本)',
      isDefault: false,
      createdAt: Date.now()
    };
    
    apiList.push(newApi);
    this.saveChatApiList(apiList);
    this.showToast('配置已复制');
    this.showChatApiList();
  },
  
  setDefaultApi(apiId) {
    const apiList = this.getChatApiList();
    apiList.forEach(api => {
      api.isDefault = api.id === apiId;
    });
    this.saveChatApiList(apiList);
    this.showToast('已设为默认接口');
    this.showChatApiList();
  },
  
  // ==================== 语音API列表 ====================
  getVoiceApiList() {
    let list = Storage.get('voice-api-list');
    if (!list || list.length === 0) {
      const defaultConfig = Storage.get('api-voice') || {};
      const defaultApi = {
        id: 'default',
        name: 'Minimax 语音',
        provider: 'Minimax 国内版',
        apiKey: defaultConfig.apiKey || '',
        groupId: defaultConfig.groupId || '',
        voice: defaultConfig.voice || 'male-qn-qingse',
        speed: 1.0,
        pitch: 0,
        language: '中文',
        model: 'speech-02-turbo',
        enabled: true,
        isDefault: true,
        createdAt: Date.now()
      };
      Storage.set('voice-api-list', [defaultApi]);
      Storage.set('voice-api-migrated', 'true');
      return [defaultApi];
    }
    
    // 迁移逻辑：只在第一次迁移时执行，之后不再自动覆盖用户修改
    const hasMigrated = Storage.get('voice-api-migrated');
    if (!hasMigrated) {
      let needUpdate = false;
      list = list.map(api => {
        if (api.isDefault) {
          if (!api.provider || api.provider === 'OpenAI') {
            api.provider = 'Minimax 国内版';
            api.name = 'Minimax 语音';
            needUpdate = true;
          }
          if (!api.model) {
            api.model = 'speech-02-turbo';
            needUpdate = true;
          }
          if (!api.voice || api.voice === 'alloy') {
            api.voice = 'male-qn-qingse';
            needUpdate = true;
          }
          if (!api.language) {
            api.language = '中文';
            needUpdate = true;
          }
          if (api.groupId === undefined) {
            api.groupId = '';
            needUpdate = true;
          }
        }
        return api;
      });
      
      if (needUpdate) {
        Storage.set('voice-api-list', list);
      }
      Storage.set('voice-api-migrated', 'true');
    }
    
    return list;
  },
  
  saveVoiceApiList(list) {
    Storage.set('voice-api-list', list);
    const defaultApi = list.find(api => api.isDefault);
    if (defaultApi) {
      Storage.set('api-voice', {
        apiKey: defaultApi.apiKey,
        voice: defaultApi.voice,
        speed: defaultApi.speed,
        pitch: defaultApi.pitch,
        model: defaultApi.model,
        enabled: defaultApi.enabled
      });
    }
  },
  
  showVoiceApiList() {
    const apiList = this.getVoiceApiList();
    
    this.container.innerHTML = `
      <div class="minimal-page">
        <!-- 顶部杂志风装饰条 -->
        <div class="minimal-magazine-bar">
          <button class="minimal-back-btn" onclick="SettingsApp.renderMain()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="minimal-magazine-vol">VOL. 02</span>
          <span class="minimal-magazine-dot"></span>
          <span class="minimal-magazine-editorial">VOICE API</span>
          <span class="minimal-magazine-dot"></span>
          <span class="minimal-magazine-date">${new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
          <button class="minimal-add-api-btn" onclick="SettingsApp.openVoiceApiEditor()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>新增语音</span>
          </button>
        </div>
        
        <!-- Hero区 -->
        <div class="minimal-hero">
          <div class="minimal-hero-number">02</div>
          <div class="minimal-hero-text">
            <h1 class="minimal-hero-title">语音接口</h1>
            <p class="minimal-hero-sub">VOICE API SETTINGS</p>
          </div>
          <div class="minimal-hero-deco">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <!-- 全局接口说明 -->
        <div class="api-global-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span>以下为全局语音接口，默认所有需要语音合成的功能都使用「默认语音」。你可以新增多个语音方案，随时切换使用。</span>
        </div>
        
        <!-- API列表 -->
        <div class="api-grid">
          ${apiList.map((api, i) => `
            <div class="api-card ${api.isDefault ? 'api-card-default' : ''}">
              <div class="api-card-header">
                <div class="api-card-name">${api.name}</div>
                ${api.isDefault ? '<span class="api-card-badge">默认</span>' : ''}
              </div>
              <div class="api-card-model">${api.voice || '未设置音色'}</div>
              <div class="api-card-provider">${api.provider} · 语速 ${api.speed}x</div>
              <div class="api-card-actions">
                <button class="api-card-btn" onclick="SettingsApp.openVoiceApiEditor('${api.id}')" title="编辑">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  </svg>
                </button>
                <button class="api-card-btn" onclick="SettingsApp.duplicateVoiceApiConfig('${api.id}')" title="复制">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                </button>
                ${!api.isDefault ? `
                  <button class="api-card-btn api-card-btn-danger" onclick="SettingsApp.deleteVoiceApiConfig('${api.id}')" title="删除">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                ` : ''}
                ${!api.isDefault ? `
                  <button class="api-card-btn api-card-btn-primary" onclick="SettingsApp.setDefaultVoiceApi('${api.id}')" title="设为默认">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  // ==================== 语音API编辑器 ====================
  openVoiceApiEditor(apiId = null) {
    const apiList = this.getVoiceApiList();
    const api = apiId ? apiList.find(a => a.id === apiId) : null;
    const isEdit = !!api;
    
    const providers = ['OpenAI', 'Minimax 国内版', 'Minimax 国际版', 'Azure', 'ElevenLabs', 'Google', 'Other'];
    const languages = ['不指定（保持默认）', '中文', '英文', '日文', '韩文', '法文', '德文', '西班牙文'];
    
    const existing = document.getElementById('voice-api-editor-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'voice-api-editor-modal';
    modal.className = 'minimal-modal-overlay';
    modal.innerHTML = `
      <div class="minimal-modal api-editor-modal voice-editor-modal">
        <div class="minimal-modal-header">
          <h3 class="minimal-modal-title">${isEdit ? '编辑语音配置' : '新增语音配置'}</h3>
          <button class="minimal-modal-close" onclick="SettingsApp.closeVoiceApiEditor()">×</button>
        </div>
        
        <div class="api-editor-form">
          <div class="minimal-form-item">
            <label class="minimal-form-label">配置名称</label>
            <input type="text" class="minimal-input" id="voice-editor-name" 
              value="${api?.name || ''}" placeholder="例如：Minimax 语音">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">服务商</label>
            <select class="minimal-input minimal-select" id="voice-editor-provider">
              ${providers.map(p => `<option value="${p}" ${api?.provider === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">API Key</label>
            <input type="password" class="minimal-input" id="voice-editor-apiKey" 
              value="${api?.apiKey || ''}" placeholder="输入密钥...">
          </div>
          
          <div class="minimal-form-item" id="voice-group-id-item" style="display: ${api?.provider?.includes('Minimax') ? 'block' : 'none'};">
            <label class="minimal-form-label">Group ID（分组ID）</label>
            <input type="text" class="minimal-input" id="voice-editor-groupId" 
              value="${api?.groupId || ''}" placeholder="输入Minimax分组ID...">
            <div class="form-hint">Minimax特有，与API Key不同，在Minimax控制台获取</div>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">
              语速 (Speed)
              <span class="slider-value" id="voice-speed-value">${api?.speed ?? 1.0}x</span>
            </label>
            <input type="range" class="minimal-slider" id="voice-editor-speed" 
              min="0.5" max="2.0" step="0.1" value="${api?.speed ?? 1.0}"
              oninput="document.getElementById('voice-speed-value').textContent = this.value + 'x'">
            <div class="slider-labels">
              <span>0.5x</span>
              <span>1.0x 默认</span>
              <span>2.0x</span>
            </div>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">
              音调 (Pitch)
              <span class="slider-value" id="voice-pitch-value">${api?.pitch ?? 0}</span>
            </label>
            <input type="range" class="minimal-slider" id="voice-editor-pitch" 
              min="-12" max="12" step="1" value="${api?.pitch ?? 0}"
              oninput="document.getElementById('voice-pitch-value').textContent = this.value">
            <div class="slider-labels">
              <span>-12</span>
              <span>0 默认</span>
              <span>+12</span>
            </div>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">朗读语言</label>
            <select class="minimal-input minimal-select" id="voice-editor-language">
              ${languages.map(l => `<option value="${l}" ${api?.language === l ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">语音模型 (TTS Model)</label>
            <input type="text" class="minimal-input" id="voice-editor-model" 
              value="${api?.model || 'tts-1'}" placeholder="tts-1">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">默认音色 (Voice ID)</label>
            <input type="text" class="minimal-input" id="voice-editor-voice" 
              value="${api?.voice || ''}" placeholder="输入音色ID或名称，例如：male-qn-qingse">
            <div class="form-hint">不同服务商音色不同，请填写对应服务商支持的音色ID</div>
          </div>
          
          <div class="voice-actions-row">
            <button class="minimal-btn minimal-btn-ghost minimal-btn-sm" onclick="SettingsApp.syncVoiceList()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                <path d="M16 16h5v5"/>
              </svg>
              同步音色列表
            </button>
          </div>
          
          <div class="voice-toggle-item">
            <div class="voice-toggle-text">
              <div class="voice-toggle-title">启用语音合成 (TTS)</div>
              <div class="voice-toggle-desc">开启后自动朗读AI回复内容</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="voice-editor-enabled" ${api?.enabled !== false ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="api-editor-actions">
            <button class="minimal-btn minimal-btn-primary" onclick="SettingsApp.saveVoiceApiConfig('${apiId || ''}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              保存配置
            </button>
          </div>
        </div>
      </div>
    `;
    
    this.container.appendChild(modal);
    
    // 监听服务商变化，显示/隐藏Group ID
    const providerSelect = document.getElementById('voice-editor-provider');
    if (providerSelect) {
      providerSelect.addEventListener('change', function() {
        const groupIdItem = document.getElementById('voice-group-id-item');
        if (groupIdItem) {
          groupIdItem.style.display = this.value.includes('Minimax') ? 'block' : 'none';
        }
      });
    }
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeVoiceApiEditor();
    });
  },
  
  closeVoiceApiEditor() {
    const modal = document.getElementById('voice-api-editor-modal');
    if (modal) modal.remove();
  },
  
  testVoicePlay() {
    this.showToast('试听功能开发中...');
  },
  
  syncVoiceList() {
    this.showToast('同步音色列表功能开发中...');
  },
  
  uploadVoiceClone() {
    this.showToast('上传音频克隆功能开发中...');
  },
  
  saveVoiceApiConfig(apiId = null) {
    const name = document.getElementById('voice-editor-name').value.trim();
    const provider = document.getElementById('voice-editor-provider').value;
    const apiKey = document.getElementById('voice-editor-apiKey').value.trim();
    const groupId = document.getElementById('voice-editor-groupId')?.value.trim() || '';
    const speed = parseFloat(document.getElementById('voice-editor-speed').value);
    const pitch = parseInt(document.getElementById('voice-editor-pitch').value);
    const language = document.getElementById('voice-editor-language').value;
    const model = document.getElementById('voice-editor-model').value.trim();
    const voice = document.getElementById('voice-editor-voice').value;
    const enabled = document.getElementById('voice-editor-enabled').checked;
    
    if (!name) {
      this.showToast('请填写配置名称');
      return;
    }
    
    const apiList = this.getVoiceApiList();
    
    if (apiId) {
      const index = apiList.findIndex(a => a.id === apiId);
      if (index !== -1) {
        apiList[index] = {
          ...apiList[index],
          name,
          provider,
          apiKey,
          groupId,
          speed,
          pitch,
          language,
          model,
          voice,
          enabled,
          updatedAt: Date.now()
        };
      }
    } else {
      const newApi = {
        id: 'voice_' + Date.now(),
        name,
        provider,
        apiKey,
        groupId,
        speed,
        pitch,
        language,
        model,
        voice,
        enabled,
        isDefault: apiList.length === 0,
        createdAt: Date.now()
      };
      apiList.push(newApi);
    }
    
    this.saveVoiceApiList(apiList);
    this.closeVoiceApiEditor();
    this.showToast(apiId ? '语音配置已更新' : '语音配置已保存');
    this.showVoiceApiList();
  },
  
  deleteVoiceApiConfig(apiId) {
    if (!confirm('确定要删除这个语音配置吗？')) return;
    
    const apiList = this.getVoiceApiList();
    const newList = apiList.filter(a => a.id !== apiId);
    this.saveVoiceApiList(newList);
    this.showToast('语音配置已删除');
    this.showVoiceApiList();
  },
  
  duplicateVoiceApiConfig(apiId) {
    const apiList = this.getVoiceApiList();
    const api = apiList.find(a => a.id === apiId);
    if (!api) return;
    
    const newApi = {
      ...api,
      id: 'voice_' + Date.now(),
      name: api.name + ' (副本)',
      isDefault: false,
      createdAt: Date.now()
    };
    
    apiList.push(newApi);
    this.saveVoiceApiList(apiList);
    this.showToast('语音配置已复制');
    this.showVoiceApiList();
  },
  
  setDefaultVoiceApi(apiId) {
    const apiList = this.getVoiceApiList();
    apiList.forEach(api => {
      api.isDefault = api.id === apiId;
    });
    this.saveVoiceApiList(apiList);
    this.showToast('已设为默认语音');
    this.showVoiceApiList();
  },
  
  // ==================== 生图API列表 ====================
  getImageApiList() {
    let list = Storage.get('image-api-list');
    if (!list || list.length === 0) {
      const defaultConfig = Storage.get('api-image') || {};
      const defaultApi = {
        id: 'default',
        name: '默认生图',
        provider: 'OpenAI兼容（第三方生图API）',
        baseUrl: defaultConfig.baseUrl || '',
        apiKey: defaultConfig.apiKey || '',
        model: defaultConfig.model || 'gpt-image-1',
        size: '1024x1024',
        quality: 'auto',
        prompt: '构图干净，主体突出，光影柔和自然，色彩协调，画面层次丰富，画面真实自然，细节干净，画面清晰',
        negativePrompt: '低质量，模糊，变形，扭曲，多余的手指，缺失的手指，丑陋，畸形，多余的肢体，断肢，水印，文字，签名',
        enabled: true,
        isDefault: true,
        createdAt: Date.now()
      };
      Storage.set('image-api-list', [defaultApi]);
      return [defaultApi];
    }
    return list;
  },
  
  saveImageApiList(list) {
    Storage.set('image-api-list', list);
    const defaultApi = list.find(api => api.isDefault);
    if (defaultApi) {
      Storage.set('api-image', {
        baseUrl: defaultApi.baseUrl,
        apiKey: defaultApi.apiKey,
        model: defaultApi.model,
        size: defaultApi.size,
        quality: defaultApi.quality,
        prompt: defaultApi.prompt,
        negativePrompt: defaultApi.negativePrompt,
        enabled: defaultApi.enabled
      });
    }
  },
  
  showImageApiList() {
    const apiList = this.getImageApiList();
    
    this.container.innerHTML = `
      <div class="minimal-page">
        <!-- 顶部杂志风装饰条 -->
        <div class="minimal-magazine-bar">
          <button class="minimal-back-btn" onclick="SettingsApp.renderMain()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="minimal-magazine-vol">VOL. 03</span>
          <span class="minimal-magazine-dot"></span>
          <span class="minimal-magazine-editorial">IMAGE API</span>
          <span class="minimal-magazine-dot"></span>
          <span class="minimal-magazine-date">${new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
          <button class="minimal-add-api-btn" onclick="SettingsApp.openImageApiEditor()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>新增生图</span>
          </button>
        </div>
        
        <!-- Hero区 -->
        <div class="minimal-hero">
          <div class="minimal-hero-number">03</div>
          <div class="minimal-hero-text">
            <h1 class="minimal-hero-title">生图接口</h1>
            <p class="minimal-hero-sub">IMAGE API SETTINGS</p>
          </div>
          <div class="minimal-hero-deco">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <!-- 全局接口说明 -->
        <div class="api-global-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span>以下为全局生图接口，默认所有需要图像生成的功能都使用「默认生图」。你可以新增多个生图方案，随时切换使用。</span>
        </div>
        
        <!-- API列表 -->
        <div class="api-grid">
          ${apiList.map((api, i) => `
            <div class="api-card ${api.isDefault ? 'api-card-default' : ''}">
              <div class="api-card-header">
                <div class="api-card-name">${api.name}</div>
                ${api.isDefault ? '<span class="api-card-badge">默认</span>' : ''}
              </div>
              <div class="api-card-model">${api.model || '未设置模型'}</div>
              <div class="api-card-provider">${api.provider} · ${api.size}</div>
              <div class="api-card-actions">
                <button class="api-card-btn" onclick="SettingsApp.openImageApiEditor('${api.id}')" title="编辑">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  </svg>
                </button>
                <button class="api-card-btn" onclick="SettingsApp.duplicateImageApiConfig('${api.id}')" title="复制">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                </button>
                ${!api.isDefault ? `
                  <button class="api-card-btn api-card-btn-danger" onclick="SettingsApp.deleteImageApiConfig('${api.id}')" title="删除">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                ` : ''}
                ${!api.isDefault ? `
                  <button class="api-card-btn api-card-btn-primary" onclick="SettingsApp.setDefaultImageApi('${api.id}')" title="设为默认">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  // ==================== 生图API编辑器 ====================
  openImageApiEditor(apiId = null) {
    const apiList = this.getImageApiList();
    const api = apiId ? apiList.find(a => a.id === apiId) : null;
    const isEdit = !!api;
    
    const providers = ['OpenAI兼容（第三方生图API）', 'NovelAI', 'Midjourney', 'Stability AI', 'Other'];
    const sizes = ['1024x1024', '1024x1536', '1536x1024', '1024x1792', '1792x1024'];
    const qualities = ['auto', 'low', 'medium', 'high', 'hd'];
    
    const existing = document.getElementById('image-api-editor-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'image-api-editor-modal';
    modal.className = 'minimal-modal-overlay';
    modal.innerHTML = `
      <div class="minimal-modal api-editor-modal image-editor-modal">
        <div class="minimal-modal-header">
          <h3 class="minimal-modal-title">${isEdit ? '编辑生图配置' : '新增生图配置'}</h3>
          <button class="minimal-modal-close" onclick="SettingsApp.closeImageApiEditor()">×</button>
        </div>
        
        <div class="api-editor-form">
          <div class="voice-toggle-item">
            <div class="voice-toggle-text">
              <div class="voice-toggle-title">启用自动生图</div>
              <div class="voice-toggle-desc">角色输出照片标签时自动调用图像生成API</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="image-editor-enabled" ${api?.enabled !== false ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">配置名称</label>
            <input type="text" class="minimal-input" id="image-editor-name" 
              value="${api?.name || ''}" placeholder="例如：OpenAI 生图">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">服务商</label>
            <select class="minimal-input minimal-select" id="image-editor-provider">
              ${providers.map(p => `<option value="${p}" ${api?.provider === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">接口地址 (Base URL)</label>
            <input type="text" class="minimal-input" id="image-editor-baseUrl" 
              value="${api?.baseUrl || ''}" placeholder="https://api.openai.com/v1">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">API Key</label>
            <input type="password" class="minimal-input" id="image-editor-apiKey" 
              value="${api?.apiKey || ''}" placeholder="输入密钥...">
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">模型名称</label>
            <div class="minimal-input-with-btn">
              <input type="text" class="minimal-input" id="image-editor-model" 
                value="${api?.model || ''}" placeholder="gpt-image-1">
              <button class="minimal-fetch-btn" onclick="SettingsApp.fetchModelsForImageEditor()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                  <path d="M16 16h5v5"/>
                </svg>
                <span>拉取模型</span>
              </button>
            </div>
          </div>
          
          <div class="form-row">
            <div class="minimal-form-item">
              <label class="minimal-form-label">尺寸</label>
              <select class="minimal-input minimal-select" id="image-editor-size">
                ${sizes.map(s => `<option value="${s}" ${api?.size === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="minimal-form-item">
              <label class="minimal-form-label">质量</label>
              <select class="minimal-input minimal-select" id="image-editor-quality">
                ${qualities.map(q => `<option value="${q}" ${api?.quality === q ? 'selected' : ''}>${q}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">补充提示词</label>
            <textarea class="minimal-textarea" id="image-editor-prompt" 
              placeholder="输入补充提示词..." rows="3">${api?.prompt || ''}</textarea>
            <div class="form-hint">会自动追加到用户提示词后面，用于提升画面质量</div>
          </div>
          
          <div class="minimal-form-item">
            <label class="minimal-form-label">负面提示词</label>
            <textarea class="minimal-textarea" id="image-editor-negativePrompt" 
              placeholder="输入负面提示词..." rows="3">${api?.negativePrompt || ''}</textarea>
            <div class="form-hint">指定不希望出现在图片里的内容，例如：低质量、模糊、变形等</div>
          </div>
          
          <div class="api-editor-actions">
            <button class="minimal-btn minimal-btn-ghost" onclick="SettingsApp.testImageGeneration()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              测试生图
            </button>
            <button class="minimal-btn minimal-btn-primary" onclick="SettingsApp.saveImageApiConfig('${apiId || ''}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              保存配置
            </button>
          </div>
          
          <div class="api-editor-test-result" id="image-editor-test-result"></div>
        </div>
      </div>
    `;
    
    this.container.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeImageApiEditor();
    });
  },
  
  closeImageApiEditor() {
    const modal = document.getElementById('image-api-editor-modal');
    if (modal) modal.remove();
  },
  
  async fetchModelsForImageEditor() {
    const baseUrl = document.getElementById('image-editor-baseUrl').value.trim();
    const apiKey = document.getElementById('image-editor-apiKey').value.trim();
    
    if (!baseUrl || !apiKey) {
      this.showToast('请先填写接口地址与密钥');
      return;
    }
    
    const btn = document.querySelector('#image-api-editor-modal .minimal-fetch-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>获取中...</span>';
    btn.disabled = true;
    
    try {
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const models = data.data || data.models || [];
      
      if (models.length === 0) {
        this.showToast('未获取到模型列表');
        return;
      }
      
      // 显示模型选择弹窗
      this.showModelSelectorForImageEditor(models);
      
    } catch (error) {
      console.error('获取模型失败:', error);
      this.showToast('获取模型失败，请检查接口地址');
    }
    
    btn.innerHTML = originalText;
    btn.disabled = false;
  },
  
  showModelSelectorForImageEditor(models) {
    const existing = document.getElementById('model-selector-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'model-selector-modal';
    modal.className = 'minimal-modal-overlay';
    modal.innerHTML = `
      <div class="minimal-modal">
        <div class="minimal-modal-header">
          <h3 class="minimal-modal-title">选择模型</h3>
          <span class="minimal-modal-count">共 ${models.length} 个</span>
          <button class="minimal-modal-close" onclick="SettingsApp.closeModelSelector()">×</button>
        </div>
        <div class="minimal-modal-search">
          <input type="text" class="minimal-modal-input" id="model-search-input" 
            placeholder="搜索模型..." oninput="SettingsApp.filterModels()">
        </div>
        <div class="minimal-modal-list" id="model-list">
          ${models.map((model, i) => `
            <div class="minimal-modal-item" onclick="SettingsApp.selectModelForImageEditor('${model.id || model.name}')">
              <span class="minimal-modal-item-index">${String(i + 1).padStart(2, '0')}</span>
              <span class="minimal-modal-item-name">${model.id || model.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    this.container.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModelSelector();
    });
  },
  
  selectModelForImageEditor(modelId) {
    const input = document.getElementById('image-editor-model');
    if (input) input.value = modelId;
    this.closeModelSelector();
    this.showToast('已选择模型: ' + modelId);
  },
  
  testImageGeneration() {
    const resultEl = document.getElementById('image-editor-test-result');
    resultEl.innerHTML = '<div class="minimal-result minimal-result-loading">测试生图功能开发中...</div>';
  },
  
  saveImageApiConfig(apiId = null) {
    const name = document.getElementById('image-editor-name').value.trim();
    const provider = document.getElementById('image-editor-provider').value;
    const baseUrl = document.getElementById('image-editor-baseUrl').value.trim();
    const apiKey = document.getElementById('image-editor-apiKey').value.trim();
    const model = document.getElementById('image-editor-model').value.trim();
    const size = document.getElementById('image-editor-size').value;
    const quality = document.getElementById('image-editor-quality').value;
    const prompt = document.getElementById('image-editor-prompt').value.trim();
    const negativePrompt = document.getElementById('image-editor-negativePrompt').value.trim();
    const enabled = document.getElementById('image-editor-enabled').checked;
    
    if (!name) {
      this.showToast('请填写配置名称');
      return;
    }
    
    const apiList = this.getImageApiList();
    
    if (apiId) {
      const index = apiList.findIndex(a => a.id === apiId);
      if (index !== -1) {
        apiList[index] = {
          ...apiList[index],
          name,
          provider,
          baseUrl,
          apiKey,
          model,
          size,
          quality,
          prompt,
          negativePrompt,
          enabled,
          updatedAt: Date.now()
        };
      }
    } else {
      const newApi = {
        id: 'image_' + Date.now(),
        name,
        provider,
        baseUrl,
        apiKey,
        model,
        size,
        quality,
        prompt,
        negativePrompt,
        enabled,
        isDefault: apiList.length === 0,
        createdAt: Date.now()
      };
      apiList.push(newApi);
    }
    
    this.saveImageApiList(apiList);
    this.closeImageApiEditor();
    this.showToast(apiId ? '生图配置已更新' : '生图配置已保存');
    this.showImageApiList();
  },
  
  deleteImageApiConfig(apiId) {
    if (!confirm('确定要删除这个生图配置吗？')) return;
    
    const apiList = this.getImageApiList();
    const newList = apiList.filter(a => a.id !== apiId);
    this.saveImageApiList(newList);
    this.showToast('生图配置已删除');
    this.showImageApiList();
  },
  
  duplicateImageApiConfig(apiId) {
    const apiList = this.getImageApiList();
    const api = apiList.find(a => a.id === apiId);
    if (!api) return;
    
    const newApi = {
      ...api,
      id: 'image_' + Date.now(),
      name: api.name + ' (副本)',
      isDefault: false,
      createdAt: Date.now()
    };
    
    apiList.push(newApi);
    this.saveImageApiList(apiList);
    this.showToast('生图配置已复制');
    this.showImageApiList();
  },
  
  setDefaultImageApi(apiId) {
    const apiList = this.getImageApiList();
    apiList.forEach(api => {
      api.isDefault = api.id === apiId;
    });
    this.saveImageApiList(apiList);
    this.showToast('已设为默认生图');
    this.showImageApiList();
  },
  
  // ==================== 接口详情（旧版，保留兼容） ====================
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
            <div class="minimal-input-with-btn">
              <input type="text" class="minimal-input" id="api-${type}-${type === 'voice' ? 'voice' : 'model'}" 
                value="${config[type === 'voice' ? 'voice' : 'model'] || ''}" 
                placeholder="${type === 'voice' ? 'alloy' : 'gpt-4o'}">
              <button class="minimal-fetch-btn" onclick="SettingsApp.fetchModels('${type}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                  <path d="M16 16h5v5"/>
                </svg>
                <span>获取模型</span>
              </button>
            </div>
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
  
  // ==================== 自动获取模型 ====================
  async fetchModels(type) {
    const baseUrl = document.getElementById(`api-${type}-baseUrl`).value.trim();
    const apiKey = document.getElementById(`api-${type}-apiKey`).value.trim();
    
    if (!baseUrl || !apiKey) {
      this.showToast('请先填写接口地址与密钥');
      return;
    }
    
    const btn = document.querySelector(`.minimal-fetch-btn`);
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>获取中...</span>';
    btn.disabled = true;
    
    try {
      // 调用API的models接口
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const models = data.data || data.models || [];
      
      if (models.length === 0) {
        this.showToast('未获取到模型列表');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
      }
      
      // 显示模型选择弹窗
      this.showModelSelector(type, models);
      
    } catch (error) {
      console.error('获取模型失败:', error);
      this.showToast('获取模型失败，请检查接口地址');
    }
    
    btn.innerHTML = originalText;
    btn.disabled = false;
  },
  
  // 显示模型选择弹窗
  showModelSelector(type, models) {
    // 移除已存在的弹窗
    const existing = document.getElementById('model-selector-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'model-selector-modal';
    modal.className = 'minimal-modal-overlay';
    modal.innerHTML = `
      <div class="minimal-modal">
        <div class="minimal-modal-header">
          <h3 class="minimal-modal-title">选择模型</h3>
          <span class="minimal-modal-count">共 ${models.length} 个</span>
          <button class="minimal-modal-close" onclick="SettingsApp.closeModelSelector()">×</button>
        </div>
        <div class="minimal-modal-search">
          <input type="text" class="minimal-modal-input" id="model-search-input" 
            placeholder="搜索模型..." oninput="SettingsApp.filterModels()">
        </div>
        <div class="minimal-modal-list" id="model-list">
          ${models.map((model, i) => `
            <div class="minimal-modal-item" onclick="SettingsApp.selectModel('${type}', '${model.id || model.name}')">
              <span class="minimal-modal-item-index">${String(i + 1).padStart(2, '0')}</span>
              <span class="minimal-modal-item-name">${model.id || model.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    this.container.appendChild(modal);
    
    // 点击遮罩关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModelSelector();
    });
  },
  
  // 过滤模型
  filterModels() {
    const searchValue = document.getElementById('model-search-input').value.toLowerCase();
    const items = document.querySelectorAll('.minimal-modal-item');
    
    items.forEach(item => {
      const name = item.querySelector('.minimal-modal-item-name').textContent.toLowerCase();
      item.style.display = name.includes(searchValue) ? 'flex' : 'none';
    });
  },
  
  // 选择模型
  selectModel(type, modelId) {
    const modelKey = type === 'voice' ? 'voice' : 'model';
    const input = document.getElementById(`api-${type}-${modelKey}`);
    if (input) {
      input.value = modelId;
    }
    this.closeModelSelector();
    this.showToast('已选择模型: ' + modelId);
  },
  
  // 关闭模型选择弹窗
  closeModelSelector() {
    const modal = document.getElementById('model-selector-modal');
    if (modal) modal.remove();
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

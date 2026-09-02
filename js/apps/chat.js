/**
 * 星绥小手机 - 聊天应用（档案风格）
 * 四个标签页：聊天、联系人、动态、我的
 * 左侧标签像文件夹的标签，点击切换
 */

const ChatApp = {
  container: null,
  currentTab: 'chat', // chat / contacts / moments / me
  
  // ==================== 渲染入口 ====================
  
  render(container, params = {}) {
    this.container = container;
    
    // 如果有指定标签页，就切换到那个
    if (params.tab) {
      this.currentTab = params.tab;
    }
    
    this.renderMain();
    
    console.log('[聊天应用] 渲染完成，当前标签:', this.currentTab);
  },
  
  // ==================== 主框架 ====================
  
  renderMain() {
    const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    
    this.container.innerHTML = `
      <div class="chat-app">
        <!-- 档案头部 -->
        <div class="chat-header">
          <div class="chat-header-top">
            <button class="chat-back-btn" onclick="ChatApp.goBack()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>返回主页</span>
            </button>
            <div class="chat-header-date">${today}</div>
          </div>
          <div class="chat-header-title">
            <h1 class="chat-title">星绥信箱</h1>
            <p class="chat-subtitle">STELLASEI MAILBOX</p>
          </div>
        </div>
        
        <!-- 主体区域：左侧标签 + 右侧内容 -->
        <div class="chat-main">
          <!-- 左侧标签栏（像文件夹的标签） -->
          <div class="chat-tabs">
            <div class="tab-item ${this.currentTab === 'chat' ? 'active' : ''}" onclick="ChatApp.switchTab('chat')">
              <div class="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span class="tab-text">聊天</span>
              <span class="tab-en">CHAT</span>
              <div class="tab-indicator"></div>
            </div>
            
            <div class="tab-item ${this.currentTab === 'contacts' ? 'active' : ''}" onclick="ChatApp.switchTab('contacts')">
              <div class="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span class="tab-text">联系人</span>
              <span class="tab-en">CONTACTS</span>
              <div class="tab-indicator"></div>
            </div>
            
            <div class="tab-item ${this.currentTab === 'moments' ? 'active' : ''}" onclick="ChatApp.switchTab('moments')">
              <div class="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span class="tab-text">动态</span>
              <span class="tab-en">MOMENTS</span>
              <div class="tab-indicator"></div>
            </div>
            
            <div class="tab-item ${this.currentTab === 'me' ? 'active' : ''}" onclick="ChatApp.switchTab('me')">
              <div class="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span class="tab-text">我的</span>
              <span class="tab-en">ME</span>
              <div class="tab-indicator"></div>
            </div>
          </div>
          
          <!-- 右侧内容区域 -->
          <div class="chat-content" id="chat-content">
            ${this.renderTabContent()}
          </div>
        </div>
      </div>
    `;
  },
  
  // ==================== 渲染标签页内容 ====================
  
  renderTabContent() {
    switch (this.currentTab) {
      case 'chat':
        return this.renderChatTab();
      case 'contacts':
        return this.renderContactsTab();
      case 'moments':
        return this.renderMomentsTab();
      case 'me':
        return this.renderMeTab();
      default:
        return this.renderChatTab();
    }
  },
  
  // ==================== 聊天标签页 ====================
  
  renderChatTab() {
    return `
      <div class="tab-page">
        <div class="tab-page-header">
          <h2 class="tab-page-title">聊天记录</h2>
          <span class="tab-page-en">CHAT HISTORY</span>
        </div>
        <div class="tab-page-content">
          <div class="chat-list-placeholder">
            <div class="placeholder-stamp">
              <span>NO MESSAGE</span>
            </div>
            <div class="placeholder-title">暂无聊天记录</div>
            <div class="placeholder-desc">聊天功能开发中<br>敬请期待...</div>
          </div>
        </div>
      </div>
    `;
  },
  
  // ==================== 联系人标签页 ====================
  
  renderContactsTab() {
    return `
      <div class="tab-page">
        <div class="tab-page-header">
          <h2 class="tab-page-title">联系人列表</h2>
          <span class="tab-page-en">CONTACTS</span>
        </div>
        <div class="tab-page-content">
          <div class="chat-list-placeholder">
            <div class="placeholder-stamp">
              <span>NO CONTACT</span>
            </div>
            <div class="placeholder-title">暂无联系人</div>
            <div class="placeholder-desc">联系人功能开发中<br>敬请期待...</div>
          </div>
        </div>
      </div>
    `;
  },
  
  // ==================== 动态标签页 ====================
  
  renderMomentsTab() {
    return `
      <div class="tab-page">
        <div class="tab-page-header">
          <h2 class="tab-page-title">朋友圈</h2>
          <span class="tab-page-en">MOMENTS</span>
        </div>
        <div class="tab-page-content">
          <div class="chat-list-placeholder">
            <div class="placeholder-stamp">
              <span>NO MOMENT</span>
            </div>
            <div class="placeholder-title">暂无动态</div>
            <div class="placeholder-desc">动态功能开发中<br>敬请期待...</div>
          </div>
        </div>
      </div>
    `;
  },
  
  // ==================== 我的标签页 ====================
  
  renderMeTab() {
    return `
      <div class="tab-page">
        <div class="tab-page-header">
          <h2 class="tab-page-title">个人中心</h2>
          <span class="tab-page-en">PROFILE</span>
        </div>
        <div class="tab-page-content">
          <div class="chat-list-placeholder">
            <div class="placeholder-stamp">
              <span>NO PROFILE</span>
            </div>
            <div class="placeholder-title">个人中心</div>
            <div class="placeholder-desc">个人中心功能开发中<br>敬请期待...</div>
          </div>
        </div>
      </div>
    `;
  },
  
  // ==================== 切换标签页 ====================
  
  switchTab(tab) {
    if (this.currentTab === tab) return;
    
    this.currentTab = tab;
    
    // 更新标签状态
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => item.classList.remove('active'));
    
    const activeIndex = ['chat', 'contacts', 'moments', 'me'].indexOf(tab);
    if (tabItems[activeIndex]) {
      tabItems[activeIndex].classList.add('active');
    }
    
    // 更新内容
    const content = document.getElementById('chat-content');
    if (content) {
      content.innerHTML = this.renderTabContent();
    }
    
    console.log('[聊天应用] 切换到标签:', tab);
  },
  
  // ==================== 返回主页 ====================
  
  goBack() {
    if (typeof AppRouter !== 'undefined' && AppRouter.close) {
      AppRouter.close();
    } else {
      console.log('[聊天应用] 返回主页');
      window.dispatchEvent(new CustomEvent('app-close', { detail: { app: 'chat' } }));
    }
  },
  
  // ==================== 关闭应用 ====================
  
  onClose() {
    console.log('[聊天应用] 关闭');
  }
};

window.ChatApp = ChatApp;
console.log('[聊天应用] 模块加载完成（档案风格）');

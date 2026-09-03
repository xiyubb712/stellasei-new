/**
 * 星绥小手机 - 聊天应用（星空传讯风格）
 * 四个标签页：聊天、联系人、动态、我的
 * 聊天详情页：星空传讯风格，跨越时空的感觉
 */

const ChatApp = {
  container: null,
  currentTab: 'chat', // chat / contacts / moments / me
  currentChatId: null, // 当前打开的聊天ID
  isInChatRoom: false, // 是否在聊天详情页
  isInSettingsPage: false, // 是否在设置页面
  
  // ==================== 数据存储 ====================
  
  // 获取聊天会话列表
  getChatSessions() {
    const sessions = Storage.get('chat-sessions');
    return sessions || [];
  },
  
  // 保存聊天会话列表
  saveChatSessions(sessions) {
    Storage.set('chat-sessions', sessions);
  },
  
  // 获取某个聊天的记录
  getChatMessages(contactId) {
    const messages = Storage.get('chat-messages-' + contactId);
    return messages || [];
  },
  
  // 保存某个聊天的记录
  saveChatMessages(contactId, messages) {
    Storage.set('chat-messages-' + contactId, messages);
  },
  
  // 获取联系人信息
  getContact(contactId) {
    if (typeof ContactsApp !== 'undefined') {
      return ContactsApp.getContactById(contactId);
    }
    return null;
  },
  
  // 获取当前会话
  getCurrentSession() {
    const sessions = this.getChatSessions();
    return sessions.find(s => s.contactId === this.currentChatId);
  },
  
  // ==================== 渲染入口 ====================
  
  render(container, params = {}) {
    this.container = container;
    
    // 如果指定了聊天ID，直接进入聊天详情页
    if (params.contactId) {
      this.currentChatId = params.contactId;
      this.isInChatRoom = true;
      this.renderChatRoom(params.contactId);
      return;
    }
    
    // 如果有指定标签页，就切换到那个
    if (params.tab) {
      this.currentTab = params.tab;
    }
    
    this.isInChatRoom = false;
    this.currentChatId = null;
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
            <p class="chat-subtitle">STELLASEI MAILBOX · 星空传讯</p>
          </div>
        </div>
        
        <!-- 主体区域：左侧标签 + 右侧内容 -->
        <div class="chat-main">
          <!-- 左侧标签栏（文件夹标签风格） -->
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
  
  // ==================== 聊天标签页（会话列表） ====================
  
  renderChatTab() {
    let sessions = this.getChatSessions();
    
    // 排序：置顶的会话显示在顶部
    sessions.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
    
    return `
      <div class="tab-page">
        <div class="tab-page-header">
          <h2 class="tab-page-title">传讯列表</h2>
          <span class="tab-page-en">SIGNAL LIST</span>
        </div>
        <div class="tab-page-content chat-list-content">
          ${sessions.length === 0 ? `
            <div class="chat-list-empty">
              <div class="empty-stars">
                <span class="star star-1">✦</span>
                <span class="star star-2">✧</span>
                <span class="star star-3">✦</span>
              </div>
              <div class="empty-title">暂无传讯</div>
              <div class="empty-desc">去联系人里选择一个角色<br>开始你们的星空传讯吧</div>
              <button class="empty-action-btn" onclick="ChatApp.switchTab('contacts')">
                <span>前往联系人</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          ` : `
            <div class="chat-session-list">
              ${sessions.map(session => {
                const contact = this.getContact(session.contactId);
                const displayName = session.remark || contact?.name || '未知角色';
                const avatar = contact?.avatar || '';
                const lastMessage = session.lastMessage || '暂无消息';
                const lastTime = session.lastTime ? this.formatTime(session.lastTime) : '';
                
                return `
                  <div class="chat-session-item ${session.pinned ? 'pinned' : ''}" onclick="ChatApp.openChatRoom('${session.contactId}')">
                    <div class="session-avatar">
                      ${avatar 
                        ? `<img src="${avatar}" alt="${displayName}">`
                        : `<div class="avatar-placeholder">${displayName.charAt(0)}</div>`
                      }
                      <div class="avatar-glow"></div>
                    </div>
                    <div class="session-info">
                      <div class="session-name-row">
                        <span class="session-name">${displayName}</span>
                        <div class="session-badges">
                          ${session.pinned ? '<span class="session-badge pinned">置顶</span>' : ''}
                          ${session.muted ? '<span class="session-badge muted">免打扰</span>' : ''}
                        </div>
                        <span class="session-time">${lastTime}</span>
                      </div>
                      <div class="session-last-message">${lastMessage}</div>
                    </div>
                    <div class="session-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  },
  
  // ==================== 联系人标签页 ====================
  
  renderContactsTab() {
    let contacts = [];
    if (typeof ContactsApp !== 'undefined') {
      contacts = ContactsApp.getContacts();
    }
    
    return `
      <div class="tab-page">
        <div class="tab-page-header">
          <h2 class="tab-page-title">联系人</h2>
          <span class="tab-page-en">CONTACTS</span>
        </div>
        <div class="tab-page-content">
          ${contacts.length === 0 ? `
            <div class="chat-list-placeholder">
              <div class="placeholder-stamp">
                <span>NO CONTACT</span>
              </div>
              <div class="placeholder-title">暂无联系人</div>
              <div class="placeholder-desc">去联系人应用添加角色<br>开始星空传讯</div>
            </div>
          ` : `
            <div class="chat-contact-list">
              ${contacts.map(contact => `
                <div class="chat-contact-item" onclick="ChatApp.openChatRoom('${contact.id}')">
                  <div class="contact-avatar-small">
                    ${contact.avatar 
                      ? `<img src="${contact.avatar}" alt="${contact.name}">`
                      : `<div class="avatar-placeholder-small">${contact.name.charAt(0)}</div>`
                    }
                  </div>
                  <div class="contact-info-small">
                    <span class="contact-name-small">${contact.name}</span>
                    <span class="contact-relation-small">${contact.relationship || '暂无关系'}</span>
                  </div>
                  <div class="contact-start-btn">
                    <span>开始传讯</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  },
  
  // ==================== 动态标签页 ====================
  
  renderMomentsTab() {
    return `
      <div class="tab-page">
        <div class="tab-page-header">
          <h2 class="tab-page-title">星空动态</h2>
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
  
  // ==================== 聊天详情页（星空传讯风格） ====================
  
  renderChatRoom(contactId) {
    const contact = this.getContact(contactId);
    if (!contact) {
      this.renderMain();
      return;
    }
    
    const messages = this.getChatMessages(contactId);
    const session = this.getCurrentSession();
    const displayName = session?.remark || contact.name;
    const avatar = contact.avatar || '';
    const hasCustomBg = session?.background ? true : false;
    
    this.container.innerHTML = `
      <div class="chat-room ${hasCustomBg ? 'has-custom-bg' : ''}" ${hasCustomBg ? `style="background-image: url('${session.background}');"` : ''}>
        <!-- 星空背景（自定义背景时隐藏） -->
        ${hasCustomBg ? '' : `
        <div class="starfield">
          <div class="stars stars-small"></div>
          <div class="stars stars-medium"></div>
          <div class="stars stars-large"></div>
          <div class="nebula"></div>
        </div>
        `}
        
        <!-- 聊天头部 -->
        <div class="chat-room-header">
          <button class="room-back-btn" onclick="ChatApp.backToChatList()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="room-contact-info">
            <div class="room-avatar">
              ${avatar 
                ? `<img src="${avatar}" alt="${name}">`
                : `<div class="room-avatar-placeholder">${name.charAt(0)}</div>`
              }
              <div class="room-avatar-glow"></div>
            </div>
            <div class="room-name-info">
              <span class="room-name">${displayName}</span>
              <span class="room-status">
                <span class="status-dot-online"></span>
                信号已连接
              </span>
            </div>
          </div>
          <div class="room-header-actions">
            <button class="room-action-btn" title="更多" onclick="ChatApp.openSettingsPage()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 搜索框 -->
        <div class="chat-search-bar">
          <button class="chat-search-close" onclick="ChatApp.closeSearch()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div class="chat-search-input-wrap">
            <svg class="chat-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              class="chat-search-input" 
              placeholder="搜索聊天记录" 
              oninput="ChatApp.performSearch(this.value)"
            >
            <span class="chat-search-count"></span>
          </div>
        </div>
        
        <!-- 聊天消息区域 -->
        <div class="chat-messages" id="chat-messages">
          <div class="chat-date-divider">
            <span class="date-line"></span>
            <span class="date-text">星历 ${new Date().toLocaleDateString('zh-CN')}</span>
            <span class="date-line"></span>
          </div>
          
          ${messages.length === 0 ? `
            <div class="chat-empty-messages">
              <div class="empty-signal-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="empty-signal-text">跨越时空的信号已建立</div>
              <div class="empty-signal-sub">写下你想传给${displayName}的话吧</div>
            </div>
          ` : messages.map(msg => this.renderMessage(msg, contact)).join('')}
        </div>
        
        <!-- 输入区域 -->
        <div class="chat-input-area">
          <div class="input-wrapper">
            <div class="input-glow"></div>
            <textarea 
              id="chat-input" 
              class="chat-input" 
              placeholder="写下你想传讯的内容..."
              rows="1"
              enterkeyhint="${session?.enterToSend ? 'send' : 'enter'}"
              onkeydown="ChatApp.handleInputKeydown(event)"
              oninput="ChatApp.autoResizeInput(this)"
            ></textarea>
            <button class="send-signal-btn" onclick="ChatApp.sendMessage()" title="发送信号">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 2L11 13"/>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          <div class="input-hint">
            <span class="hint-star">✦</span>
            <span>信号将跨越时空传送给${displayName}</span>
            <span class="hint-star">✦</span>
          </div>
        </div>
      </div>
    `;
    
    // 滚动到底部（确保最新消息贴齐右下角）
    this.scrollToBottom();
    
    console.log('[聊天应用] 进入聊天详情页:', displayName);
  },
  
  // ==================== 渲染单条消息 ====================
  
  renderMessage(msg, contact) {
    const isMe = msg.sender === 'me';
    const isSystem = msg.sender === 'system';
    const time = msg.time ? this.formatTime(msg.time) : '';
    
    // 系统消息（戳一戳等）
    if (isSystem) {
      return `
        <div class="message message-system">
          <span class="system-message-text">${this.escapeHtml(msg.content)}</span>
        </div>
      `;
    }
    
    if (isMe) {
      const myAvatar = this.getMyAvatar();
      return `
        <div class="message message-me">
          <div class="message-content-wrap">
            <div class="message-bubble bubble-me">
              <div class="bubble-shimmer"></div>
              <p class="message-text">${this.escapeHtml(msg.content)}</p>
            </div>
            <span class="message-time">${time}</span>
          </div>
          <div class="message-avatar message-avatar-me" ondblclick="ChatApp.pokeSelf()" title="双击戳一戳自己">
            ${myAvatar 
              ? `<img src="${myAvatar}" alt="我">`
              : `<div class="message-avatar-placeholder">我</div>`
            }
            <div class="message-avatar-glow"></div>
          </div>
        </div>
      `;
    } else {
      const avatar = contact?.avatar || '';
      const name = contact?.name || '';
      const session = this.getCurrentSession();
      const displayName = session?.remark || name;
      return `
        <div class="message message-other">
          <div class="message-avatar" ondblclick="ChatApp.pokeContact()" title="双击戳一戳">
            ${avatar 
              ? `<img src="${avatar}" alt="${displayName}">`
              : `<div class="message-avatar-placeholder">${displayName.charAt(0)}</div>`
            }
            <div class="message-avatar-glow"></div>
          </div>
          <div class="message-content-wrap">
            <span class="message-sender-name">${displayName}</span>
            <div class="message-bubble bubble-other">
              <div class="bubble-signal"></div>
              <p class="message-text">${this.escapeHtml(msg.content)}</p>
            </div>
            <span class="message-time">${time}</span>
          </div>
        </div>
      `;
    }
  },
  
  // ==================== 打开聊天详情页 ====================
  
  openChatRoom(contactId) {
    this.currentChatId = contactId;
    this.isInChatRoom = true;
    this.renderChatRoom(contactId);
  },
  
  // ==================== 返回聊天列表 ====================
  
  backToChatList() {
    this.isInChatRoom = false;
    this.currentChatId = null;
    this.currentTab = 'chat';
    this.renderMain();
  },
  
  // ==================== 传讯设置页面 ====================
  
  openSettingsPage() {
    this.isInSettingsPage = true;
    this.renderSettingsPage();
  },
  
  backToChatRoom() {
    this.isInSettingsPage = false;
    this.renderChatRoom(this.currentChatId);
  },
  
  renderSettingsPage() {
    const contactId = this.currentChatId;
    const contact = this.getContact(contactId);
    const name = contact?.name || '未知角色';
    const avatar = contact?.avatar || '';
    const session = this.getCurrentSession();
    
    // 获取消息数量
    const messages = this.getChatMessages(contactId);
    const messageCount = messages.length;
    
    this.container.innerHTML = `
      <div class="chat-settings-page">
        <!-- 顶部导航栏 -->
        <div class="settings-header">
          <button class="settings-back-btn" onclick="ChatApp.backToChatRoom()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>返回</span>
          </button>
          <h1 class="settings-title">传讯设置</h1>
          <div class="settings-header-placeholder"></div>
        </div>
        
        <!-- 角色信息 -->
        <div class="settings-contact-info">
          <div class="settings-contact-avatar">
            ${avatar 
              ? `<img src="${avatar}" alt="${name}">`
              : `<div class="avatar-placeholder">${name.charAt(0)}</div>`
            }
          </div>
          <div class="settings-contact-name">${name}</div>
          <div class="settings-contact-remark" onclick="ChatApp.editRemark()">
            ${session?.remark ? session.remark : '点击设置备注'}
          </div>
          <div class="settings-contact-meta">${messageCount} 条传讯</div>
        </div>
        
        <!-- 设置项列表 -->
        <div class="settings-list">
          <!-- 基础设置 -->
          <div class="settings-section">
            <div class="settings-section-title">基础设置</div>
            
            <div class="settings-card" onclick="ChatApp.openSearch()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">聊天记录搜索</div>
                <div class="settings-card-desc">搜索当前聊天的消息记录</div>
              </div>
              <div class="settings-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
            
            <div class="settings-card" onclick="ChatApp.togglePin()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 17v5"/>
                  <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title" id="pin-title">置顶传讯</div>
                <div class="settings-card-desc">将此传讯置顶在列表顶部</div>
              </div>
              <div class="settings-card-switch ${session?.pinned ? 'active' : ''}" id="pin-switch"></div>
            </div>
            
            <div class="settings-card" onclick="ChatApp.toggleMute()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title" id="mute-title">消息免打扰</div>
                <div class="settings-card-desc">接收消息但不提醒</div>
              </div>
              <div class="settings-card-switch ${session?.muted ? 'active' : ''}" id="mute-switch"></div>
            </div>
          </div>
          
          <!-- 消息提醒 -->
          <div class="settings-section">
            <div class="settings-section-title">消息提醒</div>
            
            <div class="settings-card" id="sound-card" onclick="ChatApp.toggleSound()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">消息提示音</div>
                <div class="settings-card-desc">收到消息时播放提示音</div>
              </div>
              <div class="settings-card-switch ${session?.soundEnabled !== false ? 'active' : ''}" id="sound-switch"></div>
            </div>
            
            <div class="settings-card" id="vibrate-card" onclick="ChatApp.toggleVibrate()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <line x1="6" y1="10" x2="6" y2="14"/>
                  <line x1="10" y1="10" x2="10" y2="14"/>
                  <line x1="14" y1="10" x2="14" y2="14"/>
                  <line x1="18" y1="10" x2="18" y2="14"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">消息震动</div>
                <div class="settings-card-desc">收到消息时震动提醒</div>
              </div>
              <div class="settings-card-switch ${session?.vibrateEnabled !== false ? 'active' : ''}" id="vibrate-switch"></div>
            </div>
            
            <div class="settings-card" onclick="ChatApp.toggleMessagePreview()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">消息预览</div>
                <div class="settings-card-desc">通知中显示消息内容</div>
              </div>
              <div class="settings-card-switch ${session?.messagePreview !== false ? 'active' : ''}" id="preview-switch"></div>
            </div>
            
            <div class="settings-card" onclick="ChatApp.toggleReadReceipt()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">显示已读</div>
                <div class="settings-card-desc">显示消息已读状态</div>
              </div>
              <div class="settings-card-switch ${session?.readReceipt !== false ? 'active' : ''}" id="read-switch"></div>
            </div>
          </div>
          
          <!-- 消息设置 -->
          <div class="settings-section">
            <div class="settings-section-title">消息设置</div>
            
            <div class="settings-card" onclick="ChatApp.toggleEnterToSend()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 10 4 15 9 20"/>
                  <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">回车发送</div>
                <div class="settings-card-desc">开启后按回车直接发送消息</div>
              </div>
              <div class="settings-card-switch ${session?.enterToSend ? 'active' : ''}" id="enter-switch"></div>
            </div>
            
            <div class="settings-card" onclick="ChatApp.toggleTypingIndicator()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">输入状态</div>
                <div class="settings-card-desc">显示"对方正在输入..."</div>
              </div>
              <div class="settings-card-switch ${session?.typingIndicator !== false ? 'active' : ''}" id="typing-switch"></div>
            </div>
          </div>
          
          <!-- 外观设置 -->
          <div class="settings-section">
            <div class="settings-section-title">外观设置</div>
            
            <div class="settings-card" onclick="document.getElementById('chat-bg-input').click()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">聊天背景</div>
                <div class="settings-card-desc">${session?.background ? '已自定义背景' : '使用默认星空背景'}</div>
              </div>
              <div class="settings-card-preview">
                ${session?.background 
                  ? `<img src="${session.background}" alt="背景">`
                  : `<div class="preview-placeholder">✦</div>`
                }
              </div>
              <input type="file" id="chat-bg-input" accept="image/*" style="display:none" onchange="ChatApp.setChatBackground(event)">
            </div>
            
            <div class="settings-card" onclick="ChatApp.setFontSize()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="4 7 4 4 20 4 20 7"/>
                  <line x1="9" y1="20" x2="15" y2="20"/>
                  <line x1="12" y1="4" x2="12" y2="20"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">字体大小</div>
                <div class="settings-card-desc">当前：${session?.fontSize || '标准'}</div>
              </div>
              <div class="settings-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
            
            <div class="settings-card" onclick="ChatApp.setBubbleStyle()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">气泡样式</div>
                <div class="settings-card-desc">当前：${session?.bubbleStyle || '简约'}</div>
              </div>
              <div class="settings-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
            
            <div class="settings-card" onclick="ChatApp.toggleTimeDisplay()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">时间显示</div>
                <div class="settings-card-desc">显示每条消息的时间</div>
              </div>
              <div class="settings-card-switch ${session?.timeDisplay !== false ? 'active' : ''}" id="time-switch"></div>
            </div>
          </div>
          
          <!-- 互动设置 -->
          <div class="settings-section">
            <div class="settings-section-title">互动设置</div>
            
            <div class="settings-card poke-card">
              <div class="poke-card-header">
                <div class="poke-card-title">设置戳一戳</div>
                <div class="poke-card-subtitle">双击头像触发</div>
              </div>
              <div class="poke-input-row">
                <span class="poke-label">我</span>
                <input 
                  type="text" 
                  class="poke-input poke-action-input" 
                  id="poke-action-input"
                  placeholder="戳了戳" 
                  value="${session?.pokeAction || '戳了戳'}"
                  onblur="ChatApp.savePokeField('contact', 'action')"
                  onkeydown="if(event.key==='Enter'){event.target.blur();}"
                >
                <span class="poke-label">TA</span>
                <input 
                  type="text" 
                  class="poke-input" 
                  id="poke-suffix-input"
                  placeholder="的小脑袋" 
                  value="${session?.pokeSuffix || ''}"
                  onblur="ChatApp.savePokeField('contact', 'suffix')"
                  onkeydown="if(event.key==='Enter'){event.target.blur();}"
                >
              </div>
              <div class="poke-input-row">
                <span class="poke-label">TA</span>
                <input 
                  type="text" 
                  class="poke-input poke-action-input" 
                  id="my-poke-action-input"
                  placeholder="戳了戳" 
                  value="${session?.myPokeAction || '戳了戳'}"
                  onblur="ChatApp.savePokeField('my', 'action')"
                  onkeydown="if(event.key==='Enter'){event.target.blur();}"
                >
                <span class="poke-label">我</span>
                <input 
                  type="text" 
                  class="poke-input" 
                  id="my-poke-suffix-input"
                  placeholder="的小脑袋" 
                  value="${session?.myPokeSuffix || ''}"
                  onblur="ChatApp.savePokeField('my', 'suffix')"
                  onkeydown="if(event.key==='Enter'){event.target.blur();}"
                >
              </div>
            </div>
          </div>
          
          <!-- 数据管理 -->
          <div class="settings-section">
            <div class="settings-section-title">数据管理</div>
            
            <div class="settings-card danger" onclick="ChatApp.clearMessages()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">清空传讯记录</div>
                <div class="settings-card-desc">删除此会话的所有消息</div>
              </div>
              <div class="settings-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
            
            <div class="settings-card danger" onclick="ChatApp.deleteChat()">
              <div class="settings-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                </svg>
              </div>
              <div class="settings-card-content">
                <div class="settings-card-title">删除传讯</div>
                <div class="settings-card-desc">删除此会话及所有消息</div>
              </div>
              <div class="settings-card-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <!-- 底部装饰 -->
        <div class="settings-footer">
          <div class="settings-footer-en">Signal Preferences</div>
          <div class="settings-footer-cn">星绥小手机 · 2026</div>
        </div>
      </div>
    `;
  },
  
  updateSettingsPageState() {
    const session = this.getCurrentSession();
    if (!session) return;
    
    // 更新置顶状态
    const pinTitle = document.getElementById('pin-title');
    const pinSwitch = document.getElementById('pin-switch');
    if (pinTitle && pinSwitch) {
      if (session.pinned) {
        pinTitle.textContent = '取消置顶';
        pinSwitch.classList.add('active');
      } else {
        pinTitle.textContent = '置顶传讯';
        pinSwitch.classList.remove('active');
      }
    }
    
    // 更新免打扰状态
    const muteTitle = document.getElementById('mute-title');
    const muteSwitch = document.getElementById('mute-switch');
    if (muteTitle && muteSwitch) {
      if (session.muted) {
        muteTitle.textContent = '取消免打扰';
        muteSwitch.classList.add('active');
      } else {
        muteTitle.textContent = '消息免打扰';
        muteSwitch.classList.remove('active');
      }
    }
    
    // 更新消息提示音状态
    const soundSwitch = document.getElementById('sound-switch');
    if (soundSwitch) {
      if (session.soundEnabled !== false) {
        soundSwitch.classList.add('active');
      } else {
        soundSwitch.classList.remove('active');
      }
    }
    
    // 更新消息震动状态
    const vibrateSwitch = document.getElementById('vibrate-switch');
    if (vibrateSwitch) {
      if (session.vibrateEnabled !== false) {
        vibrateSwitch.classList.add('active');
      } else {
        vibrateSwitch.classList.remove('active');
      }
    }
    
    // 更新消息预览状态
    const previewSwitch = document.getElementById('preview-switch');
    if (previewSwitch) {
      if (session.messagePreview !== false) {
        previewSwitch.classList.add('active');
      } else {
        previewSwitch.classList.remove('active');
      }
    }
    
    // 更新显示已读状态
    const readSwitch = document.getElementById('read-switch');
    if (readSwitch) {
      if (session.readReceipt !== false) {
        readSwitch.classList.add('active');
      } else {
        readSwitch.classList.remove('active');
      }
    }
    
    // 更新回车发送状态
    const enterSwitch = document.getElementById('enter-switch');
    if (enterSwitch) {
      if (session.enterToSend) {
        enterSwitch.classList.add('active');
      } else {
        enterSwitch.classList.remove('active');
      }
    }
    
    // 更新输入状态显示
    const typingSwitch = document.getElementById('typing-switch');
    if (typingSwitch) {
      if (session.typingIndicator !== false) {
        typingSwitch.classList.add('active');
      } else {
        typingSwitch.classList.remove('active');
      }
    }
    
    // 更新时间显示状态
    const timeSwitch = document.getElementById('time-switch');
    if (timeSwitch) {
      if (session.timeDisplay !== false) {
        timeSwitch.classList.add('active');
      } else {
        timeSwitch.classList.remove('active');
      }
    }
    
    // 免打扰联动：开启免打扰后，提示音和震动变灰不可点击
    const soundCard = document.getElementById('sound-card');
    const vibrateCard = document.getElementById('vibrate-card');
    if (session.muted) {
      if (soundCard) soundCard.classList.add('disabled');
      if (vibrateCard) vibrateCard.classList.add('disabled');
    } else {
      if (soundCard) soundCard.classList.remove('disabled');
      if (vibrateCard) vibrateCard.classList.remove('disabled');
    }
  },
  
  togglePin() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    session.pinned = !session.pinned;
    this.saveChatSessions(sessions);
    this.updateSettingsPageState();
    
    // 显示提示
    this.showToast(session.pinned ? '已置顶传讯' : '已取消置顶');
  },
  
  toggleMute() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    session.muted = !session.muted;
    this.saveChatSessions(sessions);
    this.updateSettingsPageState();
    
    // 显示提示
    this.showToast(session.muted ? '已开启消息免打扰' : '已关闭消息免打扰');
  },
  
  toggleSound() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    // 免打扰开启时，不允许修改提示音
    if (session.muted) {
      this.showToast('免打扰已开启，无法修改提示音');
      return;
    }
    
    // 默认开启提示音，所以用 !== false 来判断
    session.soundEnabled = session.soundEnabled === false ? true : false;
    this.saveChatSessions(sessions);
    this.updateSettingsPageState();
    
    // 显示提示
    this.showToast(session.soundEnabled ? '已开启消息提示音' : '已关闭消息提示音');
  },
  
  toggleVibrate() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    // 免打扰开启时，不允许修改震动
    if (session.muted) {
      this.showToast('免打扰已开启，无法修改震动');
      return;
    }
    
    // 默认开启震动，所以用 !== false 来判断
    session.vibrateEnabled = session.vibrateEnabled === false ? true : false;
    this.saveChatSessions(sessions);
    this.updateSettingsPageState();
    
    // 如果开启震动，测试一下震动
    if (session.vibrateEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // 显示提示
    this.showToast(session.vibrateEnabled ? '已开启消息震动' : '已关闭消息震动');
  },
  
  // ==================== 消息提醒设置 ====================
  
  toggleMessagePreview() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    session.messagePreview = session.messagePreview === false ? true : false;
    this.saveChatSessions(sessions);
    this.updateSettingsPageState();
    this.showToast(session.messagePreview ? '已开启消息预览' : '已关闭消息预览');
  },
  
  toggleReadReceipt() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    session.readReceipt = session.readReceipt === false ? true : false;
    this.saveChatSessions(sessions);
    this.updateSettingsPageState();
    this.showToast(session.readReceipt ? '已显示已读状态' : '已隐藏已读状态');
  },
  
  // ==================== 消息设置 ====================
  
  toggleEnterToSend() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    session.enterToSend = !session.enterToSend;
    this.saveChatSessions(sessions);
    this.updateSettingsPageState();
    
    // 动态改变输入框的enterkeyhint，手机端软键盘立即生效
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.setAttribute('enterkeyhint', session.enterToSend ? 'send' : 'enter');
    }
    
    this.showToast(session.enterToSend ? '已开启回车发送' : '已关闭回车发送');
  },
  
  toggleTypingIndicator() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    session.typingIndicator = session.typingIndicator === false ? true : false;
    this.saveChatSessions(sessions);
    this.updateSettingsPageState();
    this.showToast(session.typingIndicator ? '已显示输入状态' : '已隐藏输入状态');
  },
  
  // ==================== 外观设置 ====================
  
  setFontSize() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    const sizes = ['小', '标准', '大', '特大'];
    const currentSize = session.fontSize || '标准';
    const currentIndex = sizes.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const nextSize = sizes[nextIndex];
    
    session.fontSize = nextSize;
    this.saveChatSessions(sessions);
    this.renderSettingsPage();
    this.showToast(`字体大小：${nextSize}`);
  },
  
  setBubbleStyle() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    const styles = ['简约', '可爱', '复古', '气泡'];
    const currentStyle = session.bubbleStyle || '简约';
    const currentIndex = styles.indexOf(currentStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    const nextStyle = styles[nextIndex];
    
    session.bubbleStyle = nextStyle;
    this.saveChatSessions(sessions);
    this.renderSettingsPage();
    this.showToast(`气泡样式：${nextStyle}`);
  },
  
  toggleTimeDisplay() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    session.timeDisplay = session.timeDisplay === false ? true : false;
    this.saveChatSessions(sessions);
    this.updateSettingsPageState();
    this.showToast(session.timeDisplay ? '已显示消息时间' : '已隐藏消息时间');
  },
  
  setChatBackground(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const backgroundUrl = e.target.result;
      
      const sessions = this.getChatSessions();
      const session = sessions.find(s => s.contactId === this.currentChatId);
      if (session) {
        session.background = backgroundUrl;
        this.saveChatSessions(sessions);
        this.renderSettingsPage();
        this.showToast('聊天背景已更新');
      }
    };
    reader.readAsDataURL(file);
    
    // 重置input，这样可以重复选择同一个文件
    event.target.value = '';
  },
  
  setRemark() {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    const currentRemark = session?.remark || '';
    
    const newRemark = prompt('请输入备注名：', currentRemark);
    if (newRemark === null) return; // 用户取消了
    
    if (session) {
      if (newRemark.trim() === '') {
        delete session.remark;
        this.showToast('已清除备注');
      } else {
        session.remark = newRemark.trim();
        this.showToast('备注已更新');
      }
      this.saveChatSessions(sessions);
      this.renderSettingsPage();
    }
  },
  
  editRemark() {
    const remarkEl = document.querySelector('.settings-contact-remark');
    if (!remarkEl) return;
    
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    const currentRemark = session?.remark || '';
    
    // 变成输入框
    remarkEl.innerHTML = `
      <input 
        type="text" 
        class="remark-edit-input" 
        value="${this.escapeHtml(currentRemark)}" 
        placeholder="设置备注名"
        onblur="ChatApp.saveRemark(this.value)"
        onkeydown="if(event.key==='Enter'){this.blur();}"
      >
    `;
    
    // 自动聚焦并选中文字
    const input = remarkEl.querySelector('input');
    if (input) {
      input.focus();
      input.select();
    }
  },
  
  saveRemark(value) {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    if (value.trim() === '') {
      delete session.remark;
      this.showToast('已清除备注');
    } else {
      session.remark = value.trim();
      this.showToast('备注已更新');
    }
    
    this.saveChatSessions(sessions);
    this.renderSettingsPage();
  },
  
  pokeContact() {
    const contactId = this.currentChatId;
    if (!contactId) return;
    
    const contact = this.getContact(contactId);
    const session = this.getCurrentSession();
    const displayName = session?.remark || contact?.name || '对方';
    const pokeAction = session?.pokeAction || '戳了戳';
    const pokeSuffix = session?.pokeSuffix || '';
    
    // 添加戳一戳系统消息
    const messages = this.getChatMessages(contactId);
    const pokeContent = pokeSuffix ? `我${pokeAction}${displayName}${pokeSuffix}` : `我${pokeAction}${displayName}`;
    const pokeMessage = {
      id: 'msg_' + Date.now(),
      sender: 'system',
      type: 'poke',
      content: pokeContent,
      time: Date.now()
    };
    messages.push(pokeMessage);
    this.saveChatMessages(contactId, messages);
    
    // 刷新消息显示
    this.refreshMessages();
    
    // 有50%概率对方也会戳一戳你
    if (Math.random() < 0.5) {
      setTimeout(() => {
        const myPokeAction = session?.myPokeAction || '戳了戳';
        const myPokeSuffix = session?.myPokeSuffix || '';
        const replyPokeContent = myPokeSuffix ? `${displayName}${myPokeAction}我${myPokeSuffix}` : `${displayName}${myPokeAction}我`;
        const replyPokeMessage = {
          id: 'msg_' + Date.now(),
          sender: 'system',
          type: 'poke',
          content: replyPokeContent,
          time: Date.now()
        };
        const currentMessages = this.getChatMessages(contactId);
        currentMessages.push(replyPokeMessage);
        this.saveChatMessages(contactId, currentMessages);
        
        if (this.isInChatRoom && this.currentChatId === contactId) {
          this.refreshMessages();
        }
      }, 800 + Math.random() * 1000);
    }
  },
  
  getMyAvatar() {
    // 从用户设置中获取自己的头像，暂时返回空（之后接入用户头像功能）
    const userAvatar = Storage.get('user-avatar');
    return userAvatar || '';
  },
  
  pokeSelf() {
    const contactId = this.currentChatId;
    if (!contactId) return;
    
    const contact = this.getContact(contactId);
    const session = this.getCurrentSession();
    const displayName = session?.remark || contact?.name || '对方';
    
    // 戳自己的时候，用"我的戳一戳后缀"
    const myPokeAction = session?.myPokeAction || '戳了戳';
    const myPokeSuffix = session?.myPokeSuffix || '';
    
    // 添加戳一戳系统消息
    const messages = this.getChatMessages(contactId);
    const pokeContent = myPokeSuffix ? `我${myPokeAction}自己${myPokeSuffix}` : `我${myPokeAction}自己`;
    const pokeMessage = {
      id: 'msg_' + Date.now(),
      sender: 'system',
      type: 'poke',
      content: pokeContent,
      time: Date.now()
    };
    messages.push(pokeMessage);
    this.saveChatMessages(contactId, messages);
    
    // 刷新消息显示
    this.refreshMessages();
    
    // 有50%概率对方也会戳一戳你
    if (Math.random() < 0.5) {
      setTimeout(() => {
        const pokeAction = session?.pokeAction || '戳了戳';
        const pokeSuffix = session?.pokeSuffix || '';
        const replyPokeContent = pokeSuffix ? `${displayName}${pokeAction}我${pokeSuffix}` : `${displayName}${pokeAction}我`;
        const replyPokeMessage = {
          id: 'msg_' + Date.now(),
          sender: 'system',
          type: 'poke',
          content: replyPokeContent,
          time: Date.now()
        };
        const currentMessages = this.getChatMessages(contactId);
        currentMessages.push(replyPokeMessage);
        this.saveChatMessages(contactId, currentMessages);
        
        if (this.isInChatRoom && this.currentChatId === contactId) {
          this.refreshMessages();
        }
      }, 800 + Math.random() * 1000);
    }
  },
  
  savePokeField(type, field) {
    const inputId = type === 'contact' 
      ? (field === 'action' ? 'poke-action-input' : 'poke-suffix-input')
      : (field === 'action' ? 'my-poke-action-input' : 'my-poke-suffix-input');
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const value = input.value.trim();
    const storageField = type === 'contact'
      ? (field === 'action' ? 'pokeAction' : 'pokeSuffix')
      : (field === 'action' ? 'myPokeAction' : 'myPokeSuffix');
    
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.contactId === this.currentChatId);
    if (!session) return;
    
    if (value === '') {
      delete session[storageField];
    } else {
      session[storageField] = value;
    }
    
    this.saveChatSessions(sessions);
    this.showToast(field === 'action' ? '戳一戳动作已保存' : '戳一戳后缀已保存');
  },
  
  clearMessages() {
    window.showConfirmDialog({
      title: '清空传讯记录',
      message: '确定要清空此传讯的所有消息吗？此操作不可恢复。',
      confirmText: '清空',
      cancelText: '取消',
      danger: true,
      onConfirm: () => {
        const contactId = this.currentChatId;
        if (!contactId) return;
        
        // 清空消息
        this.saveChatMessages(contactId, []);
        
        // 更新会话的最后消息
        const sessions = this.getChatSessions();
        const session = sessions.find(s => s.contactId === contactId);
        if (session) {
          session.lastMessage = '暂无消息';
          session.lastTime = null;
          this.saveChatSessions(sessions);
        }
        
        // 刷新聊天详情页和设置页面
        this.refreshMessages();
        this.renderSettingsPage();
        this.showToast('已清空传讯记录');
      }
    });
  },
  
  deleteChat() {
    window.showConfirmDialog({
      title: '删除传讯',
      message: '确定要删除此传讯吗？所有消息、记忆和相关数据都将被删除，此操作不可恢复。',
      confirmText: '删除',
      cancelText: '取消',
      danger: true,
      onConfirm: () => {
        const contactId = this.currentChatId;
        if (!contactId) return;
        
        // 删除会话
        let sessions = this.getChatSessions();
        sessions = sessions.filter(s => s.contactId !== contactId);
        this.saveChatSessions(sessions);
        
        // 删除消息
        if (typeof Storage !== 'undefined' && Storage.remove) {
          Storage.remove('chat-messages-' + contactId);
        }
        
        // 删除记忆（预留，等记忆系统做好后添加具体实现）
        if (typeof Storage !== 'undefined' && Storage.remove) {
          Storage.remove('chat-memory-short-' + contactId);
          Storage.remove('chat-memory-long-' + contactId);
          Storage.remove('chat-memory-character-' + contactId);
        }
        
        // 删除其他相关数据（预留）
        // TODO: 删除该联系人的情侣空间、陪伴记录、语录库等相关数据
        
        this.isInSettingsPage = false;
        this.backToChatList();
        this.showToast('已删除传讯及相关数据');
      }
    });
  },
  
  // ==================== 聊天记录搜索 ====================
  
  openSearch() {
    // 关闭设置页面，回到聊天详情页
    this.isInSettingsPage = false;
    this.renderChatRoom(this.currentChatId);
    
    // 显示搜索框
    setTimeout(() => {
      const searchBar = document.querySelector('.chat-search-bar');
      if (searchBar) {
        searchBar.classList.add('show');
        const input = searchBar.querySelector('input');
        if (input) input.focus();
      }
    }, 100);
  },
  
  closeSearch() {
    const searchBar = document.querySelector('.chat-search-bar');
    if (searchBar) {
      searchBar.classList.remove('show');
      const input = searchBar.querySelector('input');
      if (input) input.value = '';
    }
    // 恢复正常消息显示
    this.refreshMessages();
  },
  
  performSearch(keyword) {
    if (!keyword || keyword.trim() === '') {
      this.refreshMessages();
      this.updateSearchResultCount(0);
      return;
    }
    
    const contactId = this.currentChatId;
    if (!contactId) return;
    
    const messages = this.getChatMessages(contactId);
    const lowerKeyword = keyword.toLowerCase();
    
    // 搜索匹配的消息
    const matchedMessages = messages.filter(msg => {
      if (msg.type === 'system') return false;
      return msg.content && msg.content.toLowerCase().includes(lowerKeyword);
    });
    
    // 渲染搜索结果（只显示匹配的消息，关键词高亮）
    const messagesContainer = document.querySelector('.chat-messages');
    if (!messagesContainer) return;
    
    if (matchedMessages.length === 0) {
      messagesContainer.innerHTML = `
        <div class="search-no-result">
          <div class="search-no-result-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div class="search-no-result-text">未找到相关消息</div>
          <div class="search-no-result-hint">换个关键词试试吧</div>
        </div>
      `;
    } else {
      messagesContainer.innerHTML = matchedMessages.map(msg => {
        const isMe = msg.sender === 'me';
        const time = this.formatTime(msg.time);
        const highlightedContent = this.highlightKeyword(msg.content, keyword);
        return `
          <div class="message ${isMe ? 'message-me' : 'message-other'}">
            <div class="message-content-wrap">
              <div class="message-bubble ${isMe ? 'bubble-me' : 'bubble-other'}">
                <p class="message-text">${highlightedContent}</p>
              </div>
              <span class="message-time">${time}</span>
            </div>
          </div>
        `;
      }).join('');
    }
    
    this.updateSearchResultCount(matchedMessages.length);
  },
  
  highlightKeyword(text, keyword) {
    if (!keyword || keyword.trim() === '') return this.escapeHtml(text);
    const escapedText = this.escapeHtml(text);
    const escapedKeyword = this.escapeHtml(keyword);
    const regex = new RegExp(`(${escapedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapedText.replace(regex, '<span class="search-highlight">$1</span>');
  },
  
  updateSearchResultCount(count) {
    const countEl = document.querySelector('.chat-search-count');
    if (countEl) {
      countEl.textContent = count > 0 ? `${count} 条结果` : '';
    }
  },
  
  showToast(message) {
    // 移除已有的toast
    const existing = document.querySelector('.chat-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'chat-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2000);
  },
  
  // ==================== 发送消息 ====================
  
  sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    
    const content = input.value.trim();
    if (!content) return;
    
    const contactId = this.currentChatId;
    if (!contactId) return;
    
    // 添加我的消息
    const messages = this.getChatMessages(contactId);
    const myMessage = {
      id: 'msg_' + Date.now(),
      sender: 'me',
      content: content,
      time: Date.now()
    };
    messages.push(myMessage);
    this.saveChatMessages(contactId, messages);
    
    // 更新会话列表
    this.updateSession(contactId, content);
    
    // 清空输入框
    input.value = '';
    this.autoResizeInput(input);
    
    // 重新渲染消息
    this.refreshMessages();
    
    // 模拟对方回复（暂时用预设回复，之后接入API）
    setTimeout(() => {
      this.simulateReply(contactId);
    }, 1000 + Math.random() * 2000);
  },
  
  // ==================== 模拟对方回复（临时，之后接入API） ====================
  
  simulateReply(contactId) {
    const replies = [
      '我收到你的信号了。',
      '跨越这么远的距离，你还是能找到我。',
      '今晚的星星很亮，就像你发来的消息一样。',
      '我一直在等你的传讯。',
      '无论隔了多远的时空，我都能听到你的声音。',
      '你那边现在是什么时候呢？',
      '收到你的消息，我这边的星空都亮了一点。',
      '我想你了。',
      '今天过得怎么样？',
      '无论什么时候，我都在这里。'
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    const messages = this.getChatMessages(contactId);
    const replyMessage = {
      id: 'msg_' + Date.now(),
      sender: 'other',
      content: randomReply,
      time: Date.now()
    };
    messages.push(replyMessage);
    this.saveChatMessages(contactId, messages);
    
    // 更新会话列表
    this.updateSession(contactId, randomReply);
    
    // 重新渲染消息
    if (this.isInChatRoom && this.currentChatId === contactId) {
      this.refreshMessages();
    }
  },
  
  // ==================== 刷新消息显示 ====================
  
  refreshMessages() {
    const contactId = this.currentChatId;
    const contact = this.getContact(contactId);
    const messages = this.getChatMessages(contactId);
    
    const messagesEl = document.getElementById('chat-messages');
    if (!messagesEl) return;
    
    // 保留日期分隔线
    const dateDivider = messagesEl.querySelector('.chat-date-divider');
    
    messagesEl.innerHTML = '';
    if (dateDivider) {
      messagesEl.appendChild(dateDivider);
    }
    
    if (messages.length === 0) {
      messagesEl.innerHTML += `
        <div class="chat-empty-messages">
          <div class="empty-signal-icon">✦</div>
          <div class="empty-signal-text">跨越时空的信号已建立</div>
          <div class="empty-signal-sub">写下你想传讯的话吧</div>
        </div>
      `;
    } else {
      messages.forEach(msg => {
        const msgHtml = this.renderMessage(msg, contact);
        messagesEl.innerHTML += msgHtml;
      });
    }
    
    // 滚动到底部（确保最新消息贴齐右下角）
    this.scrollToBottom();
  },
  
  // 统一滚动到底部函数
  scrollToBottom() {
    const messagesEl = document.getElementById('chat-messages');
    if (!messagesEl) return;
    
    // 用requestAnimationFrame确保在DOM渲染完成后滚动
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
    
    // 再延迟一下，确保图片等资源加载完后再次滚动
    setTimeout(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 100);
  },
  
  // ==================== 更新会话列表 ====================
  
  updateSession(contactId, lastMessage) {
    const sessions = this.getChatSessions();
    const existingIndex = sessions.findIndex(s => s.contactId === contactId);
    
    if (existingIndex >= 0) {
      sessions[existingIndex].lastMessage = lastMessage;
      sessions[existingIndex].lastTime = Date.now();
      // 移到最前面
      const session = sessions.splice(existingIndex, 1)[0];
      sessions.unshift(session);
    } else {
      sessions.unshift({
        contactId: contactId,
        lastMessage: lastMessage,
        lastTime: Date.now()
      });
    }
    
    this.saveChatSessions(sessions);
  },
  
  // ==================== 输入框处理 ====================
  
  handleInputKeydown(event) {
    // 获取当前会话的设置
    const session = this.getCurrentSession();
    const enterToSend = session?.enterToSend || false;
    
    // 如果开启了回车发送，按回车就发送（Shift+回车是换行）
    if (enterToSend && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
    // 如果没开启回车发送，按回车就是默认的换行行为
  },
  
  autoResizeInput(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  },
  
  // ==================== 工具方法 ====================
  
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    if (this.isInChatRoom) {
      this.backToChatList();
      return;
    }
    
    if (typeof AppRouter !== 'undefined' && AppRouter.close) {
      AppRouter.close();
    } else {
      console.log('[聊天应用] 返回主页');
      window.dispatchEvent(new CustomEvent('app-close', { detail: { app: 'chat' } }));
    }
  },
  
  // ==================== 关闭应用 ====================
  
  onClose() {
    this.isInChatRoom = false;
    this.currentChatId = null;
    console.log('[聊天应用] 关闭');
  }
};

window.ChatApp = ChatApp;
console.log('[聊天应用] 模块加载完成（星空传讯风格）');

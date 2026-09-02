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
    const sessions = this.getChatSessions();
    
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
                const name = contact?.name || '未知角色';
                const avatar = contact?.avatar || '';
                const lastMessage = session.lastMessage || '暂无消息';
                const lastTime = session.lastTime ? this.formatTime(session.lastTime) : '';
                
                return `
                  <div class="chat-session-item" onclick="ChatApp.openChatRoom('${session.contactId}')">
                    <div class="session-avatar">
                      ${avatar 
                        ? `<img src="${avatar}" alt="${name}">`
                        : `<div class="avatar-placeholder">${name.charAt(0)}</div>`
                      }
                      <div class="avatar-glow"></div>
                    </div>
                    <div class="session-info">
                      <div class="session-name-row">
                        <span class="session-name">${name}</span>
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
    const name = contact.name;
    const avatar = contact.avatar || '';
    
    this.container.innerHTML = `
      <div class="chat-room">
        <!-- 星空背景 -->
        <div class="starfield">
          <div class="stars stars-small"></div>
          <div class="stars stars-medium"></div>
          <div class="stars stars-large"></div>
          <div class="nebula"></div>
        </div>
        
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
              <span class="room-name">${name}</span>
              <span class="room-status">
                <span class="status-dot-online"></span>
                信号已连接
              </span>
            </div>
          </div>
          <div class="room-header-actions">
            <button class="room-action-btn" title="更多">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
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
              <div class="empty-signal-sub">写下你想传给${name}的话吧</div>
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
            <span>信号将跨越时空传送给${name}</span>
            <span class="hint-star">✦</span>
          </div>
        </div>
      </div>
    `;
    
    // 滚动到底部
    setTimeout(() => {
      const messagesEl = document.getElementById('chat-messages');
      if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }, 100);
    
    console.log('[聊天应用] 进入聊天详情页:', name);
  },
  
  // ==================== 渲染单条消息 ====================
  
  renderMessage(msg, contact) {
    const isMe = msg.sender === 'me';
    const time = msg.time ? this.formatTime(msg.time) : '';
    
    if (isMe) {
      return `
        <div class="message message-me">
          <div class="message-bubble bubble-me">
            <div class="bubble-shimmer"></div>
            <p class="message-text">${this.escapeHtml(msg.content)}</p>
          </div>
          <span class="message-time">${time}</span>
        </div>
      `;
    } else {
      const avatar = contact?.avatar || '';
      const name = contact?.name || '';
      return `
        <div class="message message-other">
          <div class="message-avatar">
            ${avatar 
              ? `<img src="${avatar}" alt="${name}">`
              : `<div class="message-avatar-placeholder">${name.charAt(0)}</div>`
            }
            <div class="message-avatar-glow"></div>
          </div>
          <div class="message-content-wrap">
            <span class="message-sender-name">${name}</span>
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
    
    // 滚动到底部
    setTimeout(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 50);
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
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
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

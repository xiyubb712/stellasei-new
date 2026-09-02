/**
 * 星绥小手机 - 联系人应用（档案/卷宗风格）
 * 角色档案管理：档案目录、角色卷宗、档案填写
 * 设计风格：米白纸张质感 + 深灰/黑色文字 + 档案元素装饰
 */

const ContactsApp = {
  container: null,
  currentView: 'list', // list / detail / edit
  currentContactId: null,
  
  // ==================== 数据存储 ====================
  
  getContacts() {
    const contacts = Storage.get('contacts-list');
    return contacts || [];
  },
  
  saveContacts(contacts) {
    Storage.set('contacts-list', contacts);
  },
  
  getContactById(id) {
    const contacts = this.getContacts();
    return contacts.find(c => c.id === id);
  },
  
  // 生成档案编号
  generateArchiveNo() {
    const contacts = this.getContacts();
    const num = String(contacts.length + 1).padStart(3, '0');
    return `NO.${num}`;
  },
  
  addContact(contact) {
    const contacts = this.getContacts();
    const newContact = {
      id: 'contact_' + Date.now(),
      archiveNo: contact.archiveNo || this.generateArchiveNo(),
      name: contact.name || '',
      nameEn: contact.nameEn || '',
      avatar: contact.avatar || '',
      description: contact.description || '',
      personality: contact.personality || '',
      relationship: contact.relationship || '',
      age: contact.age || '',
      birthday: contact.birthday || '',
      height: contact.height || '',
      tags: contact.tags || [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    contacts.push(newContact);
    this.saveContacts(contacts);
    return newContact;
  },
  
  updateContact(id, updates) {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index] = {
        ...contacts[index],
        ...updates,
        updatedAt: Date.now()
      };
      this.saveContacts(contacts);
      return contacts[index];
    }
    return null;
  },
  
  deleteContact(id) {
    const contacts = this.getContacts();
    const newContacts = contacts.filter(c => c.id !== id);
    this.saveContacts(newContacts);
  },
  
  // ==================== 渲染入口 ====================
  
  render(container, params = {}) {
    this.container = container;
    
    if (params.view === 'detail' && params.id) {
      this.currentView = 'detail';
      this.currentContactId = params.id;
      this.renderDetail(params.id);
    } else if (params.view === 'edit') {
      this.currentView = 'edit';
      this.currentContactId = params.id || null;
      this.renderEditForm(params.id || null);
    } else {
      this.currentView = 'list';
      this.currentContactId = null;
      this.renderList();
    }
    
    console.log('[联系人应用] 渲染完成，视图:', this.currentView);
  },
  
  // ==================== 档案目录页（联系人列表） ====================
  
  renderList() {
    const contacts = this.getContacts();
    const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    
    this.container.innerHTML = `
      <div class="archive-app">
        <!-- 档案头部 -->
        <div class="archive-header">
          <!-- 返回按钮 -->
          <div class="list-back-row">
            <button class="list-back-btn" onclick="ContactsApp.goBack()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>返回主页</span>
            </button>
          </div>
          <div class="archive-header-top">
            <div class="archive-classification">
              <span class="classification-label">CLASSIFIED</span>
              <span class="classification-dot"></span>
              <span class="classification-text">机密档案</span>
            </div>
            <div class="archive-date">${today}</div>
          </div>
          <div class="archive-header-title">
            <h1 class="archive-title">角色档案库</h1>
            <p class="archive-subtitle">CHARACTER ARCHIVE DATABASE</p>
          </div>
          <div class="archive-header-info">
            <div class="archive-info-item">
              <span class="info-label">档案总数</span>
              <span class="info-value">${String(contacts.length).padStart(3, '0')}</span>
            </div>
            <div class="archive-info-item">
              <span class="info-label">档案状态</span>
              <span class="info-value status-active">ACTIVE</span>
            </div>
            <div class="archive-barcode">
              <div class="barcode-lines"></div>
              <span class="barcode-text">ARCHIVE-${String(contacts.length).padStart(4, '0')}</span>
            </div>
          </div>
        </div>
        
        <!-- 新增档案按钮 -->
        <div class="archive-actions">
          <button class="archive-new-btn" onclick="ContactsApp.renderEditForm(null)">
            <span class="new-btn-icon">+</span>
            <span class="new-btn-text">建立新档案</span>
            <span class="new-btn-en">NEW ARCHIVE</span>
          </button>
        </div>
        
        <!-- 档案目录 -->
        <div class="archive-directory">
          <div class="directory-header">
            <span class="directory-title">档案目录</span>
            <span class="directory-en">DIRECTORY</span>
          </div>
          
          ${contacts.length === 0 ? `
            <div class="archive-empty">
              <div class="empty-stamp">
                <span>NO ARCHIVE</span>
              </div>
              <div class="empty-title">暂无档案记录</div>
              <div class="empty-desc">点击上方「建立新档案」按钮<br>创建第一份角色档案</div>
            </div>
          ` : `
            <div class="archive-cards">
              ${contacts.map((contact, index) => `
                <div class="archive-card" onclick="ContactsApp.renderDetail('${contact.id}')">
                  <div class="card-corner top-left"></div>
                  <div class="card-corner top-right"></div>
                  <div class="card-corner bottom-left"></div>
                  <div class="card-corner bottom-right"></div>
                  
                  <div class="card-header">
                    <span class="card-no">${contact.archiveNo || 'NO.' + String(index + 1).padStart(3, '0')}</span>
                    <span class="card-status">
                      <span class="status-dot"></span>
                      ACTIVE
                    </span>
                  </div>
                  
                  <div class="card-body">
                    <div class="card-avatar">
                      ${contact.avatar 
                        ? `<img src="${contact.avatar}" alt="${contact.name}">`
                        : `<div class="avatar-placeholder">${contact.name ? contact.name.charAt(0) : '?'}</div>`
                      }
                      <div class="avatar-frame"></div>
                    </div>
                    <div class="card-info">
                      <h3 class="card-name">${contact.name || '未命名'}</h3>
                      <p class="card-name-en">${contact.nameEn || contact.name?.toUpperCase() || 'UNKNOWN'}</p>
                      <div class="card-tags">
                        ${contact.relationship ? `<span class="card-tag">${contact.relationship}</span>` : ''}
                        ${contact.tags?.slice(0, 2).map(tag => `<span class="card-tag">${tag}</span>`).join('') || ''}
                      </div>
                    </div>
                  </div>
                  
                  <div class="card-footer">
                    <div class="card-barcode"></div>
                    <span class="card-date">${new Date(contact.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
        
        <!-- 档案底部装饰 -->
        <div class="archive-footer">
          <div class="footer-line"></div>
          <div class="footer-text">
            <span>星绥小手机 · 角色档案库</span>
            <span>STELLASEI · CHARACTER ARCHIVE</span>
          </div>
          <div class="footer-stamp">
            <span>CONFIDENTIAL</span>
          </div>
        </div>
      </div>
    `;
  },
  
  // ==================== 角色卷宗页（联系人详情） ====================
  
  renderDetail(id) {
    const contact = this.getContactById(id);
    if (!contact) {
      this.renderList();
      return;
    }
    
    const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    
    this.container.innerHTML = `
      <div class="archive-app archive-detail">
        <!-- 卷宗头部 -->
        <div class="detail-header">
          <button class="detail-back-btn" onclick="ContactsApp.renderList()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>返回目录</span>
          </button>
          <div class="detail-header-actions">
            <button class="detail-export-btn" onclick="ContactsApp.exportContact('${contact.id}')" title="导出角色文档">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>导出</span>
            </button>
            <button class="detail-edit-btn" onclick="ContactsApp.renderEditForm('${contact.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
              <span>编辑档案</span>
            </button>
          </div>
        </div>
        
        <!-- 卷宗封面 -->
        <div class="detail-cover">
          <div class="cover-classification">
            <span class="cover-label">TOP SECRET</span>
            <span class="cover-dot"></span>
            <span class="cover-text">最高机密</span>
          </div>
          <div class="cover-no">${contact.archiveNo || 'NO.001'}</div>
          <div class="cover-title">
            <h1 class="cover-name">${contact.name || '未命名'}</h1>
            <p class="cover-name-en">${contact.nameEn || contact.name?.toUpperCase() || 'UNKNOWN'}</p>
          </div>
          <div class="cover-barcode">
            <div class="barcode-lines-large"></div>
            <span class="barcode-text">${contact.id.toUpperCase()}</span>
          </div>
        </div>
        
        <!-- 角色照片区 -->
        <div class="detail-photo-section">
          <div class="photo-frame">
            <div class="photo-inner">
              ${contact.avatar 
                ? `<img src="${contact.avatar}" alt="${contact.name}">`
                : `<div class="photo-placeholder">${contact.name ? contact.name.charAt(0) : '?'}</div>`
              }
            </div>
            <div class="photo-tape tape-top-left"></div>
            <div class="photo-tape tape-top-right"></div>
            <div class="photo-caption">
              <span>${contact.name || '未命名'}</span>
              <span>${new Date(contact.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
          
          <div class="detail-basic-info">
            <div class="info-row">
              <span class="info-label">姓名</span>
              <span class="info-value">${contact.name || '-'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">英文名</span>
              <span class="info-value">${contact.nameEn || '-'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">年龄</span>
              <span class="info-value">${contact.age || '-'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">生日</span>
              <span class="info-value">${contact.birthday || '-'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">身高</span>
              <span class="info-value">${contact.height || '-'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">关系</span>
              <span class="info-value highlight">${contact.relationship || '-'}</span>
            </div>
          </div>
        </div>
        
        <!-- 角色设定区 -->
        <div class="detail-section">
          <div class="section-header">
            <span class="section-no">01</span>
            <span class="section-title">角色设定</span>
            <span class="section-en">PROFILE</span>
            <div class="section-line"></div>
          </div>
          <div class="section-content">
            <p class="profile-text">${contact.description || '暂无角色设定，点击编辑档案添加'}</p>
          </div>
        </div>
        
        <!-- 性格分析区 -->
        <div class="detail-section">
          <div class="section-header">
            <span class="section-no">02</span>
            <span class="section-title">性格分析</span>
            <span class="section-en">PERSONALITY</span>
            <div class="section-line"></div>
          </div>
          <div class="section-content">
            <div class="personality-tags">
              ${contact.tags?.length > 0 
                ? contact.tags.map(tag => `<span class="personality-tag">${tag}</span>`).join('')
                : '<span class="no-tags">暂无性格标签</span>'
              }
            </div>
            <p class="personality-text">${contact.personality || '暂无性格分析，点击编辑档案添加'}</p>
          </div>
        </div>
        
        <!-- 档案签署区 -->
        <div class="detail-signature">
          <div class="signature-left">
            <div class="signature-label">档案建立日期</div>
            <div class="signature-date">${new Date(contact.createdAt).toLocaleDateString('zh-CN')}</div>
          </div>
          <div class="signature-right">
            <div class="signature-label">最后更新</div>
            <div class="signature-date">${new Date(contact.updatedAt).toLocaleDateString('zh-CN')}</div>
          </div>
          <div class="signature-stamp">
            <span>VERIFIED</span>
            <span class="stamp-date">${today}</span>
          </div>
        </div>
        
        <!-- 危险操作区 -->
        <div class="detail-danger-zone">
          <button class="danger-btn" onclick="ContactsApp.confirmDelete('${contact.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
            <span>销毁档案</span>
          </button>
        </div>
      </div>
    `;
  },
  
  // ==================== 档案填写页（新增/编辑表单） ====================
  
  renderEditForm(id = null) {
    const contact = id ? this.getContactById(id) : null;
    const isEdit = !!contact;
    const archiveNo = contact?.archiveNo || this.generateArchiveNo();
    
    this.container.innerHTML = `
      <div class="archive-app archive-edit">
        <!-- 表单头部 -->
        <div class="edit-header">
          <button class="edit-back-btn" onclick="${isEdit ? `ContactsApp.renderDetail('${id}')` : 'ContactsApp.renderList()'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="edit-title">
            <h2>${isEdit ? '编辑档案' : '建立新档案'}</h2>
            <p>${isEdit ? 'EDIT ARCHIVE' : 'NEW ARCHIVE'}</p>
          </div>
          <div class="edit-archive-no">${archiveNo}</div>
        </div>
        
        <!-- 档案表单 -->
        <div class="archive-form">
          <!-- 照片上传区 -->
          <div class="form-section form-photo-section">
            <div class="form-section-title">
              <span class="form-section-no">01</span>
              <span>角色照片</span>
              <span class="form-section-en">PHOTO</span>
            </div>
            <div class="photo-upload-area" onclick="document.getElementById('avatar-input').click()">
              <div id="avatar-preview" class="photo-upload-preview">
                ${contact?.avatar 
                  ? `<img src="${contact.avatar}" alt="头像预览">`
                  : `<div class="upload-placeholder">
                      <div class="upload-icon">+</div>
                      <span>点击上传照片</span>
                      <span class="upload-hint">建议使用正方形照片</span>
                    </div>`
                }
              </div>
              <input type="file" id="avatar-input" accept="image/*" style="display:none" onchange="ContactsApp.handleAvatarUpload(event)">
            </div>
          </div>
          
          <!-- 基本信息区 -->
          <div class="form-section">
            <div class="form-section-title">
              <span class="form-section-no">02</span>
              <span>基本信息</span>
              <span class="form-section-en">BASIC INFO</span>
            </div>
            
            <div class="form-grid">
              <div class="form-item">
                <label class="form-label">姓名 <span class="required">*</span></label>
                <input type="text" class="form-input" id="contact-name" 
                  value="${contact?.name || ''}" placeholder="请输入角色姓名">
              </div>
              
              <div class="form-item">
                <label class="form-label">英文名/拼音</label>
                <input type="text" class="form-input" id="contact-nameEn" 
                  value="${contact?.nameEn || ''}" placeholder="请输入英文名或拼音">
              </div>
              
              <div class="form-item">
                <label class="form-label">年龄</label>
                <input type="text" class="form-input" id="contact-age" 
                  value="${contact?.age || ''}" placeholder="请输入年龄">
              </div>
              
              <div class="form-item">
                <label class="form-label">生日</label>
                <input type="text" class="form-input" id="contact-birthday" 
                  value="${contact?.birthday || ''}" placeholder="例如：01.01">
              </div>
              
              <div class="form-item">
                <label class="form-label">身高</label>
                <input type="text" class="form-input" id="contact-height" 
                  value="${contact?.height || ''}" placeholder="例如：180cm">
              </div>
              
              <div class="form-item">
                <label class="form-label">关系</label>
                <input type="text" class="form-input" id="contact-relationship" 
                  value="${contact?.relationship || ''}" placeholder="例如：情侣、朋友、师生">
              </div>
            </div>
          </div>
          
          <!-- 角色设定区 -->
          <div class="form-section">
            <div class="form-section-title">
              <span class="form-section-no">03</span>
              <span>角色设定</span>
              <span class="form-section-en">PROFILE</span>
              <button class="import-btn" onclick="document.getElementById('profile-import-input').click()" title="导入角色文档">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>导入</span>
              </button>
              <input type="file" id="profile-import-input" accept=".txt,.md,.json,.text,.docx" style="display:none" onchange="ContactsApp.handleProfileImport(event)">
            </div>
            
            <div class="form-item">
              <label class="form-label">角色简介 <span class="form-hint">（导入文档后完整内容会保留在这里）</span></label>
              <textarea class="form-textarea" id="contact-description" 
                placeholder="简单介绍一下这个角色的背景、外貌、特点等...也可以点击右上角导入按钮导入角色文档" rows="4">${contact?.description || ''}</textarea>
            </div>
          </div>
          
          <!-- 性格分析区 -->
          <div class="form-section">
            <div class="form-section-title">
              <span class="form-section-no">04</span>
              <span>性格分析</span>
              <span class="form-section-en">PERSONALITY</span>
            </div>
            
            <div class="form-item">
              <label class="form-label">性格标签（用逗号分隔）</label>
              <input type="text" class="form-input" id="contact-tags" 
                value="${contact?.tags?.join(', ') || ''}" placeholder="例如：温柔, 腹黑, 傲娇">
            </div>
            
            <div class="form-item">
              <label class="form-label">性格详细描述</label>
              <textarea class="form-textarea" id="contact-personality" 
                placeholder="详细描述角色的性格特点、行为习惯、喜好等..." rows="4">${contact?.personality || ''}</textarea>
            </div>
          </div>
          
          <!-- 提交按钮 -->
          <div class="form-submit">
            <button class="submit-btn submit-cancel" onclick="${isEdit ? `ContactsApp.renderDetail('${id}')` : 'ContactsApp.renderList()'}">
              取消
            </button>
            <button class="submit-btn submit-save" onclick="ContactsApp.saveContact('${id || ''}')">
              <span class="save-icon">✓</span>
              <span>${isEdit ? '保存修改' : '建立档案'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },
  
  // ==================== 头像上传处理 ====================
  
  handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarData = e.target.result;
      const preview = document.getElementById('avatar-preview');
      if (preview) {
        preview.innerHTML = `<img src="${avatarData}" alt="头像预览">`;
      }
      this._tempAvatar = avatarData;
    };
    reader.readAsDataURL(file);
  },
  
  // ==================== 角色文档导入 ====================
  
  // 处理角色文档导入
  async handleProfileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileName = file.name.toLowerCase();
    
    try {
      let text = '';
      
      // 检查是否是docx文件
      if (fileName.endsWith('.docx')) {
        console.log('[导入] 检测到docx文件，使用JSZip解析');
        text = await this.parseDocxFile(file);
      } else {
        // 普通文本文件，直接读取
        text = await this.readFileAsText(file);
      }
      
      // 智能解析文档
      const parsedData = this.parseProfileDocument(text, file.name);
      
      // 自动填充表单
      this.fillContactForm(parsedData);
      
      // 提示成功
      this.showImportToast(parsedData);
      
      console.log('[导入] 解析成功:', parsedData);
    } catch (err) {
      console.error('[导入] 解析失败:', err);
      alert('文档解析失败，请检查文件格式是否正确。\n\n支持格式：.txt、.md、.json、.docx');
    }
    
    // 重置input，允许重复导入同一文件
    event.target.value = '';
  },
  
  // 读取文件为文本
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file, 'UTF-8');
    });
  },
  
  // 解析docx文件
  async parseDocxFile(file) {
    if (typeof JSZip === 'undefined') {
      throw new Error('JSZip库未加载，请检查网络连接');
    }
    
    // 读取文件为ArrayBuffer
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsArrayBuffer(file);
    });
    
    // 用JSZip加载docx文件
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // 读取word/document.xml
    const documentXml = await zip.file('word/document.xml').async('string');
    
    // 解析XML，提取文本
    const text = this.extractTextFromDocxXml(documentXml);
    
    console.log('[导入] docx解析完成，文本长度:', text.length);
    return text;
  },
  
  // 从docx的XML中提取文本
  extractTextFromDocxXml(xml) {
    // 创建DOM解析器
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    
    // 提取所有段落
    const paragraphs = xmlDoc.getElementsByTagName('w:p');
    let result = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      // 提取段落中的所有文本
      const texts = paragraph.getElementsByTagName('w:t');
      let paragraphText = '';
      for (let j = 0; j < texts.length; j++) {
        paragraphText += texts[j].textContent;
      }
      if (paragraphText.trim()) {
        result.push(paragraphText);
      }
    }
    
    return result.join('\n\n');
  },
  
  // 智能解析角色文档
  parseProfileDocument(text, fileName = '') {
    const result = {
      name: '',
      nameEn: '',
      age: '',
      birthday: '',
      height: '',
      relationship: '',
      tags: [],
      personality: '',
      description: text.trim()  // 完整内容保留在角色设定中
    };
    
    // 1. 尝试JSON格式解析
    if (fileName.endsWith('.json') || text.trim().startsWith('{')) {
      try {
        const jsonData = JSON.parse(text);
        if (typeof jsonData === 'object') {
          // 映射JSON字段
          if (jsonData.name) result.name = String(jsonData.name);
          if (jsonData.nameEn) result.nameEn = String(jsonData.nameEn);
          if (jsonData.english_name) result.nameEn = String(jsonData.english_name);
          if (jsonData.age) result.age = String(jsonData.age);
          if (jsonData.birthday) result.birthday = String(jsonData.birthday);
          if (jsonData.height) result.height = String(jsonData.height);
          if (jsonData.relationship) result.relationship = String(jsonData.relationship);
          if (jsonData.tags) {
            if (Array.isArray(jsonData.tags)) {
              result.tags = jsonData.tags.map(t => String(t));
            } else if (typeof jsonData.tags === 'string') {
              result.tags = jsonData.tags.split(/[,，]/).map(t => t.trim()).filter(t => t);
            }
          }
          if (jsonData.personality) result.personality = String(jsonData.personality);
          if (jsonData.description) result.description = String(jsonData.description);
          
          // 如果JSON有内容，直接返回
          if (result.name || result.personality || result.description) {
            return result;
          }
        }
      } catch (e) {
        // JSON解析失败，继续用文本方式解析
        console.log('[导入] 非JSON格式，使用文本解析');
      }
    }
    
    // 2. 键值对格式解析（支持中文冒号、英文冒号、等号）
    const lines = text.split(/\r?\n/);
    const kvPattern = /^\s*(姓名|名字|角色名|name|英文名|拼音|英文|nameEn|english_name|年龄|age|生日|出生日期|birthday|身高|height|关系|身份|relationship|标签|性格标签|tags|性格|性格描述|性格特点|personality|简介|角色设定|description)\s*[:：=]\s*(.+?)\s*$/i;
    
    for (const line of lines) {
      const match = line.match(kvPattern);
      if (match) {
        const key = match[1].toLowerCase();
        const value = match[2].trim();
        
        if (['姓名', '名字', '角色名', 'name'].includes(key) && !result.name) {
          result.name = value;
        } else if (['英文名', '拼音', '英文', 'nameen', 'english_name'].includes(key) && !result.nameEn) {
          result.nameEn = value;
        } else if (['年龄', 'age'].includes(key) && !result.age) {
          result.age = value;
        } else if (['生日', '出生日期', 'birthday'].includes(key) && !result.birthday) {
          result.birthday = value;
        } else if (['身高', 'height'].includes(key) && !result.height) {
          result.height = value;
        } else if (['关系', '身份', 'relationship'].includes(key) && !result.relationship) {
          result.relationship = value;
        } else if (['标签', '性格标签', 'tags'].includes(key) && result.tags.length === 0) {
          result.tags = value.split(/[,，、]/).map(t => t.trim()).filter(t => t);
        } else if (['性格', '性格描述', '性格特点', 'personality'].includes(key) && !result.personality) {
          result.personality = value;
        }
      }
    }
    
    // 3. 如果没有解析到姓名，尝试从第一行提取
    if (!result.name && lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine && firstLine.length < 20 && !firstLine.includes(':') && !firstLine.includes('：')) {
        // 检查是否像是一个名字（不包含常见的描述词）
        const notNameKeywords = ['角色', '设定', '简介', '性格', '背景', '故事', '档案', 'profile', 'character'];
        const isLikelyName = !notNameKeywords.some(kw => firstLine.toLowerCase().includes(kw));
        if (isLikelyName) {
          result.name = firstLine;
        }
      }
    }
    
    return result;
  },
  
  // 自动填充表单
  fillContactForm(data) {
    // 填充基本信息
    if (data.name) {
      const nameInput = document.getElementById('contact-name');
      if (nameInput && !nameInput.value) nameInput.value = data.name;
    }
    if (data.nameEn) {
      const nameEnInput = document.getElementById('contact-nameEn');
      if (nameEnInput && !nameEnInput.value) nameEnInput.value = data.nameEn;
    }
    if (data.age) {
      const ageInput = document.getElementById('contact-age');
      if (ageInput && !ageInput.value) ageInput.value = data.age;
    }
    if (data.birthday) {
      const birthdayInput = document.getElementById('contact-birthday');
      if (birthdayInput && !birthdayInput.value) birthdayInput.value = data.birthday;
    }
    if (data.height) {
      const heightInput = document.getElementById('contact-height');
      if (heightInput && !heightInput.value) heightInput.value = data.height;
    }
    if (data.relationship) {
      const relationshipInput = document.getElementById('contact-relationship');
      if (relationshipInput && !relationshipInput.value) relationshipInput.value = data.relationship;
    }
    
    // 填充角色设定（完整内容）
    if (data.description) {
      const descInput = document.getElementById('contact-description');
      if (descInput) {
        // 如果已经有内容，追加；否则直接填充
        descInput.value = descInput.value ? descInput.value + '\n\n' + data.description : data.description;
      }
    }
    
    // 填充性格标签
    if (data.tags && data.tags.length > 0) {
      const tagsInput = document.getElementById('contact-tags');
      if (tagsInput && !tagsInput.value) {
        tagsInput.value = data.tags.join(', ');
      }
    }
    
    // 填充性格描述
    if (data.personality) {
      const personalityInput = document.getElementById('contact-personality');
      if (personalityInput && !personalityInput.value) {
        personalityInput.value = data.personality;
      }
    }
  },
  
  // 显示导入成功提示
  showImportToast(data) {
    const fields = [];
    if (data.name) fields.push('姓名');
    if (data.nameEn) fields.push('英文名');
    if (data.age) fields.push('年龄');
    if (data.birthday) fields.push('生日');
    if (data.height) fields.push('身高');
    if (data.relationship) fields.push('关系');
    if (data.tags.length > 0) fields.push('性格标签');
    if (data.personality) fields.push('性格描述');
    
    let message = '✅ 文档导入成功！\n\n';
    if (fields.length > 0) {
      message += `已自动识别并填充：${fields.join('、')}\n`;
    } else {
      message += '未识别到结构化信息，完整内容已填入角色设定。\n';
    }
    message += '\n完整文档内容已保留在「角色设定」中。';
    
    alert(message);
  },
  
  // ==================== 角色文档导出 ====================
  
  // 导出角色文档
  exportContact(id) {
    const contact = this.getContactById(id);
    if (!contact) {
      alert('未找到该角色档案');
      return;
    }
    
    // 弹出格式选择
    const format = prompt(
      '请选择导出格式：\n\n' +
      '1. 输入 "txt" - 纯文本格式\n' +
      '2. 输入 "md" - Markdown格式（推荐）\n' +
      '3. 输入 "json" - JSON格式\n\n' +
      '请输入格式（txt/md/json）：',
      'md'
    );
    
    if (!format) return;
    
    const formatLower = format.toLowerCase().trim();
    let content = '';
    let fileName = '';
    let mimeType = '';
    
    if (formatLower === 'json') {
      // JSON格式
      const exportData = {
        name: contact.name || '',
        nameEn: contact.nameEn || '',
        age: contact.age || '',
        birthday: contact.birthday || '',
        height: contact.height || '',
        relationship: contact.relationship || '',
        tags: contact.tags || [],
        personality: contact.personality || '',
        description: contact.description || '',
        archiveNo: contact.archiveNo || '',
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
      };
      content = JSON.stringify(exportData, null, 2);
      fileName = `${contact.name || '角色'}_档案.json`;
      mimeType = 'application/json';
    } else if (formatLower === 'txt') {
      // 纯文本格式
      content = this.generateTextExport(contact);
      fileName = `${contact.name || '角色'}_档案.txt`;
      mimeType = 'text/plain';
    } else {
      // Markdown格式（默认）
      content = this.generateMarkdownExport(contact);
      fileName = `${contact.name || '角色'}_档案.md`;
      mimeType = 'text/markdown';
    }
    
    // 创建并下载文件
    this.downloadFile(content, fileName, mimeType);
    
    console.log('[导出] 角色档案已导出:', fileName);
  },
  
  // 生成Markdown格式导出
  generateMarkdownExport(contact) {
    let md = `# ${contact.name || '未命名'} 角色档案\n\n`;
    md += `> 档案编号：${contact.archiveNo || '未知'}\n`;
    md += `> 建立日期：${new Date(contact.createdAt).toLocaleDateString('zh-CN')}\n\n`;
    md += `---\n\n`;
    
    md += `## 基本信息\n\n`;
    md += `- **姓名**：${contact.name || '-'}\n`;
    md += `- **英文名**：${contact.nameEn || '-'}\n`;
    md += `- **年龄**：${contact.age || '-'}\n`;
    md += `- **生日**：${contact.birthday || '-'}\n`;
    md += `- **身高**：${contact.height || '-'}\n`;
    md += `- **关系**：${contact.relationship || '-'}\n\n`;
    
    if (contact.tags && contact.tags.length > 0) {
      md += `## 性格标签\n\n`;
      md += contact.tags.map(tag => `\`${tag}\``).join(' ');
      md += `\n\n`;
    }
    
    if (contact.personality) {
      md += `## 性格描述\n\n`;
      md += `${contact.personality}\n\n`;
    }
    
    if (contact.description) {
      md += `## 角色设定\n\n`;
      md += `${contact.description}\n\n`;
    }
    
    md += `---\n\n`;
    md += `*由星绥小手机导出 · ${new Date().toLocaleString('zh-CN')}*\n`;
    
    return md;
  },
  
  // 生成纯文本格式导出
  generateTextExport(contact) {
    let txt = `========================================\n`;
    txt += `  ${contact.name || '未命名'} 角色档案\n`;
    txt += `========================================\n\n`;
    txt += `档案编号：${contact.archiveNo || '未知'}\n`;
    txt += `建立日期：${new Date(contact.createdAt).toLocaleDateString('zh-CN')}\n\n`;
    txt += `----------------------------------------\n`;
    txt += `【基本信息】\n`;
    txt += `----------------------------------------\n`;
    txt += `姓名：${contact.name || '-'}\n`;
    txt += `英文名：${contact.nameEn || '-'}\n`;
    txt += `年龄：${contact.age || '-'}\n`;
    txt += `生日：${contact.birthday || '-'}\n`;
    txt += `身高：${contact.height || '-'}\n`;
    txt += `关系：${contact.relationship || '-'}\n\n`;
    
    if (contact.tags && contact.tags.length > 0) {
      txt += `----------------------------------------\n`;
      txt += `【性格标签】\n`;
      txt += `----------------------------------------\n`;
      txt += contact.tags.join('、');
      txt += `\n\n`;
    }
    
    if (contact.personality) {
      txt += `----------------------------------------\n`;
      txt += `【性格描述】\n`;
      txt += `----------------------------------------\n`;
      txt += `${contact.personality}\n\n`;
    }
    
    if (contact.description) {
      txt += `----------------------------------------\n`;
      txt += `【角色设定】\n`;
      txt += `----------------------------------------\n`;
      txt += `${contact.description}\n\n`;
    }
    
    txt += `========================================\n`;
    txt += `由星绥小手机导出 · ${new Date().toLocaleString('zh-CN')}\n`;
    txt += `========================================\n`;
    
    return txt;
  },
  
  // 下载文件
  downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
  
  // ==================== 保存档案 ====================
  
  saveContact(id = null) {
    const name = document.getElementById('contact-name').value.trim();
    const nameEn = document.getElementById('contact-nameEn').value.trim();
    const age = document.getElementById('contact-age').value.trim();
    const birthday = document.getElementById('contact-birthday').value.trim();
    const height = document.getElementById('contact-height').value.trim();
    const relationship = document.getElementById('contact-relationship').value.trim();
    const description = document.getElementById('contact-description').value.trim();
    const tagsInput = document.getElementById('contact-tags').value.trim();
    const personality = document.getElementById('contact-personality').value.trim();
    
    // 解析标签
    const tags = tagsInput ? tagsInput.split(/[,，]/).map(t => t.trim()).filter(t => t) : [];
    
    // 获取头像
    let avatar = this._tempAvatar || '';
    if (!avatar && id) {
      const existing = this.getContactById(id);
      avatar = existing?.avatar || '';
    }
    
    if (!name) {
      alert('请输入角色姓名');
      return;
    }
    
    const contactData = {
      name,
      nameEn,
      age,
      birthday,
      height,
      relationship,
      description,
      tags,
      personality,
      avatar
    };
    
    if (id) {
      this.updateContact(id, contactData);
      this._tempAvatar = null;
      this.renderDetail(id);
    } else {
      const newContact = this.addContact(contactData);
      this._tempAvatar = null;
      this.renderDetail(newContact.id);
    }
  },
  
  // ==================== 销毁档案 ====================
  
  confirmDelete(id) {
    const contact = this.getContactById(id);
    if (!contact) return;
    
    if (confirm(`确定要销毁「${contact.name}」的档案吗？销毁后无法恢复。`)) {
      this.deleteContact(id);
      this.renderList();
    }
  },
  
  // ==================== 返回主页 ====================
  
  goBack() {
    if (typeof AppRouter !== 'undefined' && AppRouter.close) {
      AppRouter.close();
    } else {
      console.log('[联系人应用] 返回主页');
      // 尝试触发返回事件
      window.dispatchEvent(new CustomEvent('app-close', { detail: { app: 'contacts' } }));
    }
  },
  
  // ==================== 关闭应用 ====================
  
  onClose() {
    this._tempAvatar = null;
    console.log('[联系人应用] 关闭');
  }
};

window.ContactsApp = ContactsApp;
console.log('[联系人应用] 模块加载完成（档案/卷宗风格）');

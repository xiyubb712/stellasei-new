/**
 * 星绥小手机 - 主屏幕布局系统
 * 
 * 功能：
 * 1. 4×8网格布局（4列，8行）
 * 2. 支持应用图标和小组件
 * 3. 支持多页（左右滑动切换）
 * 4. 支持自定义布局（拖拽移动、删除）
 * 5. 默认布局预设
 */

const LayoutSystem = {
  // 网格配置
  GRID_COLS: 4,
  GRID_ROWS: 8,
  
  // 当前布局数据
  currentLayout: null,
  
  // 默认布局（第一页）
  getDefaultLayout() {
    return {
      pages: [
        {
          // 第一页：默认布局
          items: [
            // 应用图标示例（1×1）
            { type: 'app', id: 'chat', x: 0, y: 0, w: 1, h: 1 },
            { type: 'app', id: 'contacts', x: 1, y: 0, w: 1, h: 1 },
            { type: 'app', id: 'worldbook', x: 2, y: 0, w: 1, h: 1 },
            { type: 'app', id: 'settings', x: 3, y: 0, w: 1, h: 1 },
          ]
        }
      ],
      currentPage: 0
    };
  },

  /**
   * 初始化布局系统
   */
  init() {
    // 从存储中读取布局，如果没有则用默认布局
    this.currentLayout = Storage.get('stellasei-layout', null);
    if (!this.currentLayout) {
      this.currentLayout = this.getDefaultLayout();
      this.save();
    }
    console.log('[布局系统] 初始化完成，当前页数:', this.currentLayout.pages.length);
  },

  /**
   * 保存布局到存储
   */
  save() {
    Storage.set('stellasei-layout', this.currentLayout);
  },

  /**
   * 获取当前页的布局数据
   * @returns {Object} 当前页数据
   */
  getCurrentPage() {
    const pageIndex = this.currentLayout.currentPage || 0;
    return this.currentLayout.pages[pageIndex];
  },

  /**
   * 切换到指定页
   * @param {number} pageIndex - 页索引
   */
  switchPage(pageIndex) {
    if (pageIndex >= 0 && pageIndex < this.currentLayout.pages.length) {
      this.currentLayout.currentPage = pageIndex;
      this.save();
      this.render();
    }
  },

  /**
   * 添加新的一页
   */
  addPage() {
    this.currentLayout.pages.push({ items: [] });
    this.currentLayout.currentPage = this.currentLayout.pages.length - 1;
    this.save();
    this.render();
  },

  /**
   * 删除指定页
   * @param {number} pageIndex - 页索引
   */
  removePage(pageIndex) {
    if (this.currentLayout.pages.length <= 1) {
      console.warn('[布局系统] 至少保留一页');
      return;
    }
    this.currentLayout.pages.splice(pageIndex, 1);
    if (this.currentLayout.currentPage >= this.currentLayout.pages.length) {
      this.currentLayout.currentPage = this.currentLayout.pages.length - 1;
    }
    this.save();
    this.render();
  },

  /**
   * 添加项目到当前页
   * @param {Object} item - 项目数据
   * @returns {boolean} 是否添加成功
   */
  addItem(item) {
    const page = this.getCurrentPage();
    
    // 检查位置是否被占用
    if (this.isPositionOccupied(item.x, item.y, item.w, item.h)) {
      console.warn('[布局系统] 位置已被占用');
      return false;
    }
    
    page.items.push(item);
    this.save();
    this.render();
    return true;
  },

  /**
   * 移除项目
   * @param {string} itemId - 项目ID
   */
  removeItem(itemId) {
    const page = this.getCurrentPage();
    const index = page.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      page.items.splice(index, 1);
      this.save();
      this.render();
    }
  },

  /**
   * 移动项目到新位置
   * @param {string} itemId - 项目ID
   * @param {number} newX - 新的X位置
   * @param {number} newY - 新的Y位置
   * @returns {boolean} 是否移动成功
   */
  moveItem(itemId, newX, newY) {
    const page = this.getCurrentPage();
    const item = page.items.find(i => i.id === itemId);
    if (!item) return false;
    
    // 检查新位置是否被占用（排除自己）
    if (this.isPositionOccupied(newX, newY, item.w, item.h, itemId)) {
      console.warn('[布局系统] 新位置已被占用');
      return false;
    }
    
    item.x = newX;
    item.y = newY;
    this.save();
    this.render();
    return true;
  },

  /**
   * 检查位置是否被占用
   * @param {number} x - X位置
   * @param {number} y - Y位置
   * @param {number} w - 宽度
   * @param {number} h - 高度
   * @param {string} [excludeId] - 排除的项目ID
   * @returns {boolean} 是否被占用
   */
  isPositionOccupied(x, y, w, h, excludeId = null) {
    const page = this.getCurrentPage();
    for (const item of page.items) {
      if (excludeId && item.id === excludeId) continue;
      
      // 检查两个矩形是否重叠
      const overlap = !(
        x + w <= item.x ||
        x >= item.x + item.w ||
        y + h <= item.y ||
        y >= item.y + item.h
      );
      
      if (overlap) return true;
    }
    return false;
  },

  /**
   * 查找第一个空位置
   * @param {number} w - 宽度
   * @param {number} h - 高度
   * @returns {Object|null} 空位置 {x, y} 或 null
   */
  findEmptyPosition(w, h) {
    for (let y = 0; y <= this.GRID_ROWS - h; y++) {
      for (let x = 0; x <= this.GRID_COLS - w; x++) {
        if (!this.isPositionOccupied(x, y, w, h)) {
          return { x, y };
        }
      }
    }
    return null;
  },

  /**
   * 渲染主屏幕
   */
  render() {
    const container = document.getElementById('desktop-container');
    if (!container) return;
    
    const page = this.getCurrentPage();
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建网格背景
    const grid = document.createElement('div');
    grid.className = 'desktop-grid';
    grid.style.gridTemplateColumns = `repeat(${this.GRID_COLS}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${this.GRID_ROWS}, 1fr)`;
    
    // 渲染每个项目
    for (const item of page.items) {
      const element = this.renderItem(item);
      if (element) {
        element.style.gridColumn = `${item.x + 1} / span ${item.w}`;
        element.style.gridRow = `${item.y + 1} / span ${item.h}`;
        grid.appendChild(element);
      }
    }
    
    container.appendChild(grid);
    
    // 渲染页面指示器
    this.renderPageIndicators();
  },

  /**
   * 渲染单个项目
   * @param {Object} item - 项目数据
   * @returns {HTMLElement} 项目元素
   */
  renderItem(item) {
    const element = document.createElement('div');
    element.className = `desktop-item desktop-item-${item.type}`;
    element.dataset.id = item.id;
    
    if (item.type === 'app') {
      // 应用图标
      const appInfo = AppRegistry.getAppInfo(item.id);
      const iconSvg = getIcon(appInfo.icon || 'settings', 'icon-svg');
      element.innerHTML = `
        <div class="app-icon">
          <div class="app-icon-image">${iconSvg}</div>
          <div class="app-icon-name">${appInfo.name || item.id}</div>
        </div>
      `;
      element.addEventListener('click', () => {
        AppRouter.open(item.id);
      });
    } else if (item.type === 'widget') {
      // 小组件
      element.innerHTML = `<div class="widget-placeholder">小组件: ${item.id}</div>`;
    }
    
    return element;
  },

  /**
   * 渲染页面指示器
   */
  renderPageIndicators() {
    const container = document.getElementById('page-indicators');
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < this.currentLayout.pages.length; i++) {
      const dot = document.createElement('div');
      dot.className = `page-dot ${i === this.currentLayout.currentPage ? 'active' : ''}`;
      dot.addEventListener('click', () => this.switchPage(i));
      container.appendChild(dot);
    }
  },

  /**
   * 重置为默认布局
   */
  resetToDefault() {
    this.currentLayout = this.getDefaultLayout();
    this.save();
    this.render();
    console.log('[布局系统] 已重置为默认布局');
  }
};

// 暴露到全局
window.LayoutSystem = LayoutSystem;

console.log('[星绥布局系统] 模块加载完成！');

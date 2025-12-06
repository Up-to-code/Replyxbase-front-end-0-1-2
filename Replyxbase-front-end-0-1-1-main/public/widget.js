(function () {
  const config = window.replyxbaseConfig;
  if (!config) {
    console.error('ReplyXBase: Config not found');
    return;
  }

  const CONTAINER_ID = 'replyxbase-widget-container';
  if (document.getElementById(CONTAINER_ID)) return;

  class ReplyXBaseWidget {
    constructor(config) {
      this.config = config;
      this.isOpen = false;
      this.isRTL = config.language === 'ar';
      this.currentView = 'chat';
      this.bookingData = { date: null, time: null, name: '', email: '', phone: '' };

      this.init();
    }

    init() {
      this.createContainer();
      this.injectStyles();
      this.render();
      this.attachEventListeners();
    }

    createContainer() {
      this.container = document.createElement('div');
      this.container.id = CONTAINER_ID;
      document.body.appendChild(this.container);
      this.shadow = this.container.attachShadow({ mode: 'open' });
      this.shadow.host.style.direction = this.isRTL ? 'rtl' : 'ltr';
    }

    injectStyles() {
      const positionStyles = this.config.position === 'left'
        ? 'bottom: 20px; left: 20px;'
        : 'bottom: 20px; right: 20px;';

      const chatWindowPosition = this.config.position === 'left'
        ? 'bottom: 80px; left: 0; transform-origin: bottom left;'
        : 'bottom: 80px; right: 0; transform-origin: bottom right;';

      const launcherWidth = this.config.launcherStyle === 'pill' ? 'auto' : '60px';
      const launcherRadius = this.config.launcherStyle === 'pill' ? '30px' : '50%';
      const launcherPadding = this.config.launcherStyle === 'pill' ? '0 24px' : '0';

      const styles = `
        :host {
          position: fixed;
          ${positionStyles}
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          --primary-color: ${this.config.color || '#000'};
        }
        .launcher {
          width: ${launcherWidth};
          height: 60px;
          border-radius: ${launcherRadius};
          padding: ${launcherPadding};
          background-color: var(--primary-color);
          border: 1px solid rgba(0,0,0,0.05);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s;
          color: white;
          font-weight: 600;
          font-size: 15px;
        }
        .launcher:hover {
          transform: scale(1.05);
        }
        .launcher svg {
          width: 28px;
          height: 28px;
        }
        .chat-window {
          position: absolute;
          ${chatWindowPosition}
          width: 380px;
          height: 600px;
          max-height: calc(100vh - 100px);
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          pointer-events: none;
          transition: all 0.2s ease-in-out;
        }
        .chat-window.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }
        .header {
          padding: 20px;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .lang-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .lang-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .tabs {
          display: flex;
          border-bottom: 1px solid #eee;
          background: white;
        }
        .tab {
          flex: 1;
          padding: 12px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }
        .tab:hover {
          color: #374151;
        }
        .content-area {
          flex: 1;
          overflow-y: auto;
          background: #f9fafb;
          position: relative;
        }
        .view {
          display: none;
          flex-direction: column;
          min-height: 100%;
        }
        .view.active {
          display: flex;
        }
        .view-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .message.agent {
          background: white;
          border: 1px solid #eee;
          align-self: flex-start;
        }
        .message.user {
          background: var(--primary-color);
          color: white;
          align-self: flex-end;
        }
        .input-area {
          padding: 16px;
          border-top: 1px solid #eee;
          background: white;
        }
        .input-container {
          display: flex;
          gap: 8px;
        }
        input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #eee;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
          background: #f9fafb;
        }
        input:focus {
          border-color: var(--primary-color);
          background: white;
        }
        .send-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--primary-color);
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .action-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          background: white;
          border: 1px solid #eee;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: inherit;
        }
        .action-btn:hover {
          background: #f9fafb;
          transform: translateY(-1px);
        }
        
        /* Rich Components */
        .product-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 12px;
          overflow: hidden;
          width: 240px;
          margin-top: 8px;
        }
        .product-image {
          width: 100%;
          height: 140px;
          object-fit: cover;
          background: #f3f4f6;
        }
        .product-content {
          padding: 12px;
        }
        .product-title {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          color: #111827;
        }
        .product-price {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 12px;
        }
        .product-btn {
          width: 100%;
          padding: 8px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        
        .list-view {
          background: white;
          border: 1px solid #eee;
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          margin-top: 8px;
        }
        .list-item {
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }
        .list-item:last-child {
          border-bottom: none;
        }
        .list-item:hover {
          background: #f9fafb;
        }

        /* FAQ */
        .faq-item {
          background: white;
          border: 1px solid #eee;
          border-radius: 12px;
          overflow: hidden;
        }
        .faq-question {
          padding: 16px;
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .faq-question:hover {
          background: #f9fafb;
        }
        .faq-answer {
          padding: 0 16px 16px;
          font-size: 13px;
          color: #4b5563;
          line-height: 1.5;
          display: none;
        }
        .faq-item.open .faq-answer {
          display: block;
        }
        .footer {
          text-align: center;
          padding: 8px;
          font-size: 10px;
          color: #9ca3af;
          background: white;
          display: ${this.config.removeBranding ? 'none' : 'block'};
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: white;
          border: none;
          border-bottom: 1px solid #eee;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        .back-btn:hover {
          background: #f9fafb;
        }

        /* Calendar Styles */
        .calendar-container {
          padding: 20px;
          background: white;
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .calendar-title {
          font-weight: bold;
          font-size: 16px;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          text-align: center;
        }
        .calendar-day-header {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
          padding-bottom: 8px;
        }
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .calendar-day:hover:not(.disabled) {
          background-color: #f3f4f6;
        }
        .calendar-day.selected {
          background-color: var(--primary-color);
          color: white;
        }
        .calendar-day.disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }
        .time-slots {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }
        .time-slot {
          padding: 10px;
          border: 1px solid #eee;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .time-slot:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
        .time-slot.selected {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: var(--primary-color);
          ring: 2px solid var(--primary-color);
        }
        .primary-btn {
          width: 100%;
          padding: 12px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 20px;
          cursor: pointer;
        }
        .primary-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .success-view {
          text-align: center;
          padding: 40px 20px;
        }
        .success-icon {
          width: 64px;
          height: 64px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        /* RTL Overrides */
        :host([dir="rtl"]) .message.agent {
          border-top-right-radius: 4px;
          border-top-left-radius: 12px;
        }
        :host([dir="rtl"]) .message.user {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 12px;
        }
        :host([dir="rtl"]) .send-btn {
          transform: rotate(180deg);
        }
        :host([dir="rtl"]) .faq-item.open .faq-icon {
          transform: rotate(-90deg);
        }
        :host([dir="rtl"]) .faq-icon {
          transform: rotate(180deg);
        }
        :host([dir="rtl"]) .back-btn svg {
          transform: rotate(180deg);
        }

        /* Mobile Responsiveness */
        @media (max-width: 480px) {
          .chat-window {
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            border-radius: 0 !important;
            transform: translateY(100%);
          }
          .chat-window.open {
            transform: translateY(0);
          }
          .launcher {
            bottom: 20px;
            right: 20px;
          }
        }
      `;

      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      this.shadow.appendChild(styleSheet);
    }

    render() {
      const MSG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
      const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      const SEND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
      const ARROW_LEFT = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`;
      const GLOBE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;

      const avatarContent = this.config.logo
        ? `<img src="${this.config.logo}" alt="Agent" />`
        : MSG_ICON;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div class="chat-window">
          <div class="header">
            <div class="header-content">
              <div class="avatar">${avatarContent}</div>
              <div>
                <div style="font-weight: bold;">Support Agent</div>
                <div style="font-size: 12px; opacity: 0.9;">Online</div>
              </div>
            </div>
            <button class="lang-btn" title="Switch Language">
              ${GLOBE_ICON}
            </button>
          </div>
          
          <div class="tabs" id="main-tabs">
            <div class="tab active" data-tab="chat">${this.isRTL ? 'محادثة' : 'Chat'}</div>
            <div class="tab" data-tab="help">${this.isRTL ? 'مساعدة' : 'Help'}</div>
          </div>

          <div class="content-area">
            <!-- Chat View -->
            <div class="view active" id="view-chat">
              <div class="view-content">
                <div class="messages" id="messages">
                  <div class="message agent">
                    ${this.config.welcomeMessage || 'Hello! How can I help you?'}
                    ${this.renderActions()}
                  </div>
                </div>
              </div>
            </div>

            <!-- Help View -->
            <div class="view" id="view-help">
              <div class="view-content">
                ${this.renderFaqs()}
              </div>
            </div>

            <!-- Booking View -->
            <div class="view" id="view-booking">
              <button class="back-btn" id="back-from-booking">
                ${ARROW_LEFT} ${this.isRTL ? 'رجوع' : 'Back'}
              </button>
              <div class="calendar-container" id="calendar-container">
                <!-- Calendar will be injected here -->
              </div>
            </div>
          </div>

          <div class="input-area" id="input-area">
            <div class="input-container">
              <input type="text" placeholder="${this.isRTL ? '...اكتب رسالة' : 'Type a message...'}" id="chat-input" />
              <button class="send-btn">${SEND_ICON}</button>
            </div>
            <div class="footer">Powered by ReplyXBase</div>
          </div>
        </div>
        <div class="launcher">
          <span class="icon">${MSG_ICON}</span>
          ${this.config.launcherStyle === 'pill' ? `<span class="text">${this.config.launcherText || 'Chat'}</span>` : ''}
        </div>
      `;
      this.shadow.appendChild(wrapper);
    }

    attachEventListeners() {
      // Elements
      const launcher = this.shadow.querySelector('.launcher');
      const chatWindow = this.shadow.querySelector('.chat-window');
      const input = this.shadow.querySelector('#chat-input');
      const sendBtn = this.shadow.querySelector('.send-btn');
      const langBtn = this.shadow.querySelector('.lang-btn');
      const launcherIcon = this.shadow.querySelector('.launcher .icon');
      const launcherText = this.shadow.querySelector('.launcher .text');
      const MSG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
      const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

      // Toggle Widget
      launcher.addEventListener('click', () => {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
          chatWindow.classList.add('open');
          launcherIcon.innerHTML = CLOSE_ICON;
          if (launcherText) launcherText.style.display = 'none';
        } else {
          chatWindow.classList.remove('open');
          launcherIcon.innerHTML = MSG_ICON;
          if (launcherText) launcherText.style.display = 'block';
        }
      });

      // Language Switch
      langBtn.addEventListener('click', () => {
        this.isRTL = !this.isRTL;
        this.shadow.host.style.direction = this.isRTL ? 'rtl' : 'ltr';
        // Re-render content (simplified for now, ideally update text nodes)
        this.shadow.innerHTML = '';
        this.injectStyles();
        this.render();
        this.attachEventListeners();
        this.shadow.querySelector('.chat-window').classList.add('open');
        this.isOpen = true;
      });

      // Tabs
      const tabs = this.shadow.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
      });

      // Actions
      this.shadow.addEventListener('click', (e) => {
        const btn = e.target.closest('.action-btn');
        if (btn) this.handleAction(btn.dataset.type, btn.dataset.value);
      });

      // Send Message
      sendBtn.addEventListener('click', () => this.sendMessage());
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });

      // FAQ
      this.shadow.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
      });

      // Back from Booking
      const backBtn = this.shadow.querySelector('#back-from-booking');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.switchTab('chat'));
      }
    }

    switchTab(tabName) {
      const tabs = this.shadow.querySelectorAll('.tab');
      const views = this.shadow.querySelectorAll('.view');
      const inputArea = this.shadow.querySelector('#input-area');

      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
      views.forEach(v => v.classList.toggle('active', v.id === `view-${tabName}`));

      if (tabName === 'chat') {
        inputArea.style.display = 'block';
      } else {
        inputArea.style.display = 'none';
      }
    }

    handleAction(type, value) {
      if (type === 'booking') {
        this.switchTab('booking');
        this.shadow.querySelector('#main-tabs').style.display = 'none';
        this.shadow.querySelector('#input-area').style.display = 'none';
        this.renderCalendar();
      } else if (type === 'call') {
        window.open(`tel:${value}`, '_self');
      } else if (type === 'link') {
        window.open(value, '_blank');
      }
    }

    async sendMessage() {
      const input = this.shadow.querySelector('#chat-input');
      const text = input.value.trim();
      if (!text) return;

      this.addMessage(text, 'user');
      input.value = '';

      const typingId = this.addTypingIndicator();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, agentId: this.config.agentId })
        });
        const data = await response.json();
        this.removeMessage(typingId);
        this.addMessage(data.response || 'Sorry, something went wrong.', 'agent');
      } catch (err) {
        this.removeMessage(typingId);
        this.addMessage('Error connecting to server.', 'agent');
      }
    }

    addMessage(text, type) {
      const container = this.shadow.querySelector('#messages');
      const div = document.createElement('div');
      div.className = `message ${type}`;
      div.textContent = text;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
      return div;
    }

    addTypingIndicator() {
      const container = this.shadow.querySelector('#messages');
      const div = document.createElement('div');
      div.className = 'message agent';
      div.textContent = '...';
      div.id = 'typing-' + Date.now();
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
      return div.id;
    }

    removeMessage(id) {
      const el = this.shadow.getElementById(id);
      if (el) el.remove();
    }

    // --- Render Helpers ---

    renderActions() {
      if (!this.config.actions || this.config.actions.length === 0) return '';
      return `<div class="actions">
        ${this.config.actions.map(action => `
          <button class="action-btn" data-type="${action.type}" data-value="${action.value}">
            ${this.getIconSvg(action.icon)}
            ${action.label}
          </button>
        `).join('')}
      </div>`;
    }

    renderFaqs() {
      if (!this.config.faqs || this.config.faqs.length === 0) {
        return `<div style="text-align: center; color: #9ca3af; margin-top: 20px;">${this.isRTL ? 'لا توجد أسئلة شائعة' : 'No FAQs available.'}</div>`;
      }
      const CHEVRON_ICON = `<svg class="faq-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
      return this.config.faqs.map(faq => `
        <div class="faq-item">
          <div class="faq-question">
            ${faq.question}
            ${CHEVRON_ICON}
          </div>
          <div class="faq-answer">${faq.answer}</div>
        </div>
      `).join('');
    }

    getIconSvg(name) {
      switch (name) {
        case 'calendar': return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
        case 'phone': return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;
        case 'user': return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>`;
        case 'message': return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
        default: return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
      }
    }

    // --- Booking Logic ---

    renderCalendar() {
      const container = this.shadow.getElementById('calendar-container');
      const today = new Date();
      const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

      let html = `
        <div class="calendar-header">
          <span class="calendar-title">${currentMonth}</span>
        </div>
        <div class="calendar-grid">
          <div class="calendar-day-header">Su</div>
          <div class="calendar-day-header">Mo</div>
          <div class="calendar-day-header">Tu</div>
          <div class="calendar-day-header">We</div>
          <div class="calendar-day-header">Th</div>
          <div class="calendar-day-header">Fr</div>
          <div class="calendar-day-header">Sa</div>
      `;

      for (let i = 0; i < startDay; i++) html += `<div></div>`;

      for (let i = 1; i <= daysInMonth; i++) {
        const isPast = i < today.getDate();
        const disabledClass = isPast ? 'disabled' : '';
        html += `<div class="calendar-day ${disabledClass}" data-day="${i}">${i}</div>`;
      }

      html += `</div><div id="time-slots-container"></div>`;
      container.innerHTML = html;

      const days = this.shadow.querySelectorAll('.calendar-day:not(.disabled)');
      days.forEach(day => {
        day.addEventListener('click', () => {
          days.forEach(d => d.classList.remove('selected'));
          day.classList.add('selected');
          this.bookingData.date = `${day.dataset.day} ${currentMonth}`;
          this.renderTimeSlots();
        });
      });
    }

    renderTimeSlots() {
      const container = this.shadow.getElementById('time-slots-container');
      const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

      let html = `<div class="time-slots">`;
      slots.forEach(slot => html += `<div class="time-slot">${slot}</div>`);
      html += `</div><div id="booking-form-container"></div>`;

      container.innerHTML = html;

      const timeSlots = this.shadow.querySelectorAll('.time-slot');
      timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
          timeSlots.forEach(s => s.classList.remove('selected'));
          slot.classList.add('selected');
          this.bookingData.time = slot.textContent;
          this.renderBookingForm();
        });
      });
    }

    renderBookingForm() {
      const container = this.shadow.getElementById('booking-form-container');
      container.innerHTML = `
        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
          <div class="form-group">
            <label class="form-label">${this.isRTL ? 'الاسم' : 'Name'}</label>
            <input type="text" class="form-input" id="booking-name" placeholder="${this.isRTL ? 'اسمك الكامل' : 'Your full name'}" />
          </div>
          <div class="form-group">
            <label class="form-label">${this.isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
            <input type="email" class="form-input" id="booking-email" placeholder="name@example.com" />
          </div>
          <div class="form-group">
            <label class="form-label">${this.isRTL ? 'رقم الهاتف' : 'Phone'}</label>
            <input type="tel" class="form-input" id="booking-phone" placeholder="+1 234 567 890" />
          </div>
          <button class="primary-btn" id="confirm-booking">${this.isRTL ? 'تأكيد الحجز' : 'Confirm Booking'}</button>
        </div>
      `;

      this.shadow.getElementById('confirm-booking').addEventListener('click', () => {
        const name = this.shadow.getElementById('booking-name').value;
        const email = this.shadow.getElementById('booking-email').value;

        if (!name || !email) {
          alert(this.isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
          return;
        }

        this.bookingData.name = name;
        this.bookingData.email = email;
        this.renderSuccess();
      });
    }

    renderSuccess() {
      const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      const container = this.shadow.getElementById('calendar-container');
      container.innerHTML = `
        <div class="success-view">
          <div class="success-icon">${CHECK_ICON}</div>
          <h3 style="margin: 0 0 10px 0; font-size: 18px;">${this.isRTL ? 'تم تأكيد الحجز!' : 'Booking Confirmed!'}</h3>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
            ${this.isRTL ? 'تم تحديد موعدك في' : 'Your appointment is set for'} <br/>
            <strong>${this.bookingData.date} - ${this.bookingData.time}</strong>
          </p>
          <button class="primary-btn" id="finish-booking">${this.isRTL ? 'العودة للمحادثة' : 'Back to Chat'}</button>
        </div>
      `;

      this.shadow.getElementById('finish-booking').addEventListener('click', () => {
        this.switchTab('chat');
        this.shadow.querySelector('#main-tabs').style.display = 'flex';

        // Inject User Message
        this.addMessage(`${this.isRTL ? 'لقد حجزت موعداً في' : 'I booked an appointment for'} ${this.bookingData.date} ${this.isRTL ? 'الساعة' : 'at'} ${this.bookingData.time}`, 'user');

        // Simulate Agent Response
        const typingId = this.addTypingIndicator();
        setTimeout(() => {
          this.removeMessage(typingId);
          this.addMessage(`${this.isRTL ? 'شكراً لك! لقد استلمنا طلبك وسنتصل بك قريباً.' : 'Great! We have received your booking and will contact you shortly.'}`, 'agent');
        }, 1500);
      });
    }

    // --- Rich Components ---

    renderProductCard(data) {
      const container = this.shadow.querySelector('#messages');
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <img src="${data.image}" class="product-image" />
        <div class="product-content">
          <div class="product-title">${data.title}</div>
          <div class="product-price">${data.price}</div>
          <button class="product-btn">${data.buttonText || 'View Details'}</button>
        </div>
      `;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    renderList(items) {
      const container = this.shadow.querySelector('#messages');
      const div = document.createElement('div');
      div.className = 'list-view';
      div.innerHTML = items.map(item => `
        <div class="list-item">
          <span>${item.label}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      `).join('');
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }
  }

  new ReplyXBaseWidget(window.replyxbaseConfig);
})();

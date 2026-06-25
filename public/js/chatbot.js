(function () {
  'use strict';

  var SYSTEM_PROMPT =
    'You are Aria, a warm and friendly intake advisor at Sleek Academia — premium professional exam prep support. ' +
    'Collect exactly 4 pieces of information ONE AT A TIME through natural, encouraging conversation.\n\n' +
    'Collect in this exact order:\n' +
    '1. The student\'s full name\n' +
    '2. Which professional exam they are preparing for: Nursing/NCLEX, Law Bar Exam, CPA/Finance, IT Certification, or other\n' +
    '3. Their target exam date\n' +
    '4. Their monthly budget range for study support\n\n' +
    'Once all 4 are collected:\n' +
    '- Write a warm 2-3 sentence summary addressing the student by first name\n' +
    '- Briefly recommend the most suitable Sleek Academia service based on their exam and budget:\n' +
    '  Full Service $400/month (study plan + live coaching + materials),\n' +
    '  Partial Service $350/month (study plan + materials),\n' +
    '  Essay & Exam Guidance (targeted written feedback),\n' +
    '  or Hands-off (self-paced materials)\n' +
    '- End with: "How would you like to send this to our team?"\n' +
    '- End your message with exactly: [READY_TO_SEND]\n\n' +
    'Strict rules:\n' +
    '- ONE question per message only\n' +
    '- Keep every reply under 80 words\n' +
    '- Be warm, professional, and encouraging\n' +
    '- Never ask for the student\'s email address\n' +
    '- Never ask the student to sign up, log in, or create an account\n' +
    '- Never mention specific email addresses or phone numbers in your messages';

  var WHATSAPP_NUMBER = '254742836835';

  var chatHistory = [];
  var summaryText = '';
  var readyToSend = false;

  var toggleBtn, popup, messagesEl, inputEl, sendBtn, inputRow;

  /* ── Build DOM ────────────────────────────────────────────────────── */

  function buildWidget() {
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'sa-chatbot-toggle';
    toggleBtn.setAttribute('aria-label', 'Chat with Sleek Academia');
    toggleBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
      '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>' +
      '</svg>';

    popup = document.createElement('div');
    popup.id = 'sa-chatbot-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Sleek Academia Chat');
    popup.innerHTML =
      '<div id="sa-chat-header">' +
        '<div class="sa-chat-avatar">SA</div>' +
        '<div class="sa-chat-header-info">' +
          '<h4>Sleek Academia</h4>' +
          '<p><span class="sa-online-dot"></span>Aria &mdash; Academic Advisor</p>' +
        '</div>' +
        '<button id="sa-chat-close" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div id="sa-chat-messages" role="log" aria-live="polite"></div>' +
      '<div id="sa-chat-input-row">' +
        '<textarea id="sa-chat-input" rows="1" placeholder="Type your message…" aria-label="Chat message"></textarea>' +
        '<button id="sa-chat-send" aria-label="Send message">' +
          '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>' +
          '</svg>' +
        '</button>' +
      '</div>';

    document.body.appendChild(toggleBtn);
    document.body.appendChild(popup);

    messagesEl = document.getElementById('sa-chat-messages');
    inputEl    = document.getElementById('sa-chat-input');
    sendBtn    = document.getElementById('sa-chat-send');
    inputRow   = document.getElementById('sa-chat-input-row');

    toggleBtn.addEventListener('click', toggleChat);
    document.getElementById('sa-chat-close').addEventListener('click', closeChat);
    sendBtn.addEventListener('click', handleSend);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });
    inputEl.addEventListener('input', autoResize);
  }

  function autoResize() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + 'px';
  }

  /* ── Open / close ─────────────────────────────────────────────────── */

  function toggleChat() {
    popup.classList.contains('sa-open') ? closeChat() : openChat();
  }

  function openChat() {
    popup.classList.add('sa-open');
    if (chatHistory.length === 0) {
      greet();
    } else if (!readyToSend) {
      setTimeout(function () { inputEl.focus(); }, 200);
    }
  }

  function closeChat() {
    popup.classList.remove('sa-open');
  }

  /* ── Conversation ─────────────────────────────────────────────────── */

  function greet() {
    var greeting =
      "Hi there! 👋 I'm **Aria**, your academic advisor at Sleek Academia.\n\n" +
      "I'd love to help connect you with the right study support — it only takes a minute. " +
      "What's your full name?";
    appendAI(greeting);
    chatHistory.push({ role: 'assistant', content: greeting });
  }

  function handleSend() {
    if (readyToSend) return;

    var text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    appendUser(text);
    chatHistory.push({ role: 'user', content: text });

    setInputBusy(true);
    var typingEl = showTyping();

    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory, systemPrompt: SYSTEM_PROMPT })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('API ' + res.status);
        return res.json();
      })
      .then(function (data) {
        removeTyping(typingEl);
        var reply = (data.reply || '').trim();
        if (!reply) throw new Error('empty reply');
        chatHistory.push({ role: 'assistant', content: reply });
        appendAI(reply);
      })
      .catch(function () {
        removeTyping(typingEl);
        appendAI("Sorry, I'm having trouble connecting. Please try again in a moment.");
      })
      .finally(function () {
        if (!readyToSend) setInputBusy(false);
      });
  }

  /* ── DOM message helpers ──────────────────────────────────────────── */

  function appendUser(text) {
    var el = document.createElement('div');
    el.className = 'sa-msg sa-msg-user';
    el.textContent = text;
    messagesEl.appendChild(el);
    scrollBottom();
  }

  function appendAI(text) {
    var hasMarker = text.indexOf('[READY_TO_SEND]') !== -1;

    // Fallback: small LLMs sometimes drop the marker — detect by turn count + phrasing
    var userCount = chatHistory.filter(function (m) { return m.role === 'user'; }).length;
    var looksReady = !hasMarker && userCount >= 4 && (
      text.toLowerCase().indexOf('how would you like') !== -1 ||
      text.toLowerCase().indexOf('shall i send') !== -1 ||
      text.toLowerCase().indexOf('send this to our team') !== -1 ||
      text.toLowerCase().indexOf('send your enquiry') !== -1 ||
      text.toLowerCase().indexOf('email or whatsapp') !== -1
    );

    var clean = text.replace(/\[READY_TO_SEND\]/g, '').trim();

    if (hasMarker || looksReady) {
      summaryText = clean;
    }

    var el = document.createElement('div');
    el.className = 'sa-msg sa-msg-ai';
    el.innerHTML = renderMarkdown(clean);
    messagesEl.appendChild(el);

    if (hasMarker || looksReady) {
      transitionToSendMode();
    } else {
      setTimeout(function () { inputEl.focus(); }, 80);
    }

    scrollBottom();
  }

  function appendSystem(text) {
    var el = document.createElement('div');
    el.className = 'sa-msg sa-msg-system';
    el.textContent = text;
    messagesEl.appendChild(el);
    scrollBottom();
  }

  function renderMarkdown(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  /* ── Typing indicator ─────────────────────────────────────────────── */

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'sa-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    scrollBottom();
    return el;
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  /* ── Input state ──────────────────────────────────────────────────── */

  function setInputBusy(busy) {
    inputEl.disabled = busy;
    sendBtn.disabled = busy;
    inputEl.placeholder = busy ? 'Aria is typing…' : 'Type your message…';
  }

  function transitionToSendMode() {
    readyToSend = true;
    inputRow.style.display = 'none';
    showSendActions();
  }

  /* ── Send action buttons ──────────────────────────────────────────── */

  function showSendActions() {
    var wrap = document.createElement('div');
    wrap.className = 'sa-send-actions';
    wrap.id = 'sa-send-actions';

    var emailBtn = document.createElement('button');
    emailBtn.className = 'sa-action-btn';
    emailBtn.textContent = '📧 Email';

    var waBtn = document.createElement('button');
    waBtn.className = 'sa-action-btn';
    waBtn.textContent = '💬 WhatsApp';

    emailBtn.addEventListener('click', function () {
      removeSendActions();
      doEmailSend();
    });

    waBtn.addEventListener('click', function () {
      removeSendActions();
      doWhatsAppSend();
    });

    wrap.appendChild(emailBtn);
    wrap.appendChild(waBtn);
    messagesEl.appendChild(wrap);
    scrollBottom();
  }

  function removeSendActions() {
    var el = document.getElementById('sa-send-actions');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  /* ── Build structured email body from chat history ────────────────── */

  function buildEmailSummary() {
    var userMsgs = chatHistory.filter(function (m) { return m.role === 'user'; });
    var lines = [
      'Name:         ' + (userMsgs[0] ? userMsgs[0].content.trim() : 'N/A'),
      'Exam:         ' + (userMsgs[1] ? userMsgs[1].content.trim() : 'N/A'),
      'Target Date:  ' + (userMsgs[2] ? userMsgs[2].content.trim() : 'N/A'),
      'Budget:       ' + (userMsgs[3] ? userMsgs[3].content.trim() : 'N/A'),
    ];
    return lines.join('\n') + '\n\n' + summaryText;
  }

  /* ── Email send ───────────────────────────────────────────────────── */

  function doEmailSend() {
    var statusEl = document.createElement('div');
    statusEl.className = 'sa-msg sa-msg-system';
    statusEl.textContent = 'Sending your enquiry…';
    messagesEl.appendChild(statusEl);
    scrollBottom();

    fetch('/api/chat/send-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary: buildEmailSummary() })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('failed ' + res.status);
        return res.json();
      })
      .then(function () {
        statusEl.textContent = '✅ Sent! Our team will reach out to you soon.';
        showStartOver();
      })
      .catch(function () {
        statusEl.textContent = '❌ Couldn\'t send via email right now.';
        showSendActions();
      });
  }

  /* ── WhatsApp send ────────────────────────────────────────────────── */

  function doWhatsAppSend() {
    var text = '🎓 Sleek Academia Student Enquiry\n\n' + buildEmailSummary();
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
    appendSystem('✅ Opening WhatsApp!');
    showStartOver();
  }

  /* ── Start over ───────────────────────────────────────────────────── */

  function showStartOver() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'padding: 4px 14px 14px;';
    var btn = document.createElement('button');
    btn.className = 'sa-action-btn';
    btn.style.cssText = 'font-size:12px;padding:6px 14px;opacity:0.75;';
    btn.textContent = '🔄 Start new chat';
    btn.addEventListener('click', resetChat);
    wrap.appendChild(btn);
    messagesEl.appendChild(wrap);
    scrollBottom();
  }

  function resetChat() {
    chatHistory = [];
    summaryText = '';
    readyToSend = false;
    messagesEl.innerHTML = '';
    inputRow.style.display = '';
    setInputBusy(false);
    greet();
  }

  /* ── Utilities ────────────────────────────────────────────────────── */

  function scrollBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /* ── Init ─────────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();

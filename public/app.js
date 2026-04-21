// 配置
const MAX_HISTORY = 5;
let commandHistory = [];

// DOM 元素
const commandInput = document.getElementById('commandInput');
const parseBtn = document.getElementById('parseBtn');
const loadingEl = document.getElementById('loading');
const resultEl = document.getElementById('result');
const outputEl = document.getElementById('output');
const historyEl = document.getElementById('history');
const historyList = document.getElementById('historyList');

// 解析命令
async function parseCommand() {
  const command = commandInput.value.trim();
  if (!command) return;

  setLoading(true);
  hideResult();

  try {
    const response = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });

    const result = await response.json();
    showResult(result);
    addToHistory(command, result);

  } catch (error) {
    showResult({
      intent: 'unknown',
      action: 'network_error',
      parameters: { error: error.message },
      confidence: 0
    });
  } finally {
    setLoading(false);
  }
}

// UI 辅助函数
function setLoading(isLoading) {
  loadingEl.classList.toggle('hidden', !isLoading);
  parseBtn.disabled = isLoading;
}

function hideResult() {
  resultEl.classList.add('hidden');
}

function showResult(result) {
  outputEl.textContent = JSON.stringify(result, null, 2);

  // 更新 intent badge
  const intentBadge = document.getElementById('intentBadge');
  intentBadge.textContent = result.intent;
  intentBadge.className = 'intent-badge ' + result.intent;

  resultEl.classList.remove('hidden');
}

// 历史管理
function addToHistory(command, result) {
  commandHistory.unshift({ command, result, timestamp: Date.now() });

  if (commandHistory.length > MAX_HISTORY) {
    commandHistory.pop();
  }

  renderHistory();
}

function renderHistory() {
  if (commandHistory.length === 0) {
    historyEl.classList.add('hidden');
    return;
  }

  historyEl.classList.remove('hidden');
  historyList.innerHTML = commandHistory.map((item, index) => `
    <li onclick="loadHistory(${index})">
      <span class="command-text">${escapeHtml(item.command)}</span>
      <span class="intent-badge ${item.result.intent}">${item.result.intent}</span>
    </li>
  `).join('');
}

function loadHistory(index) {
  const item = commandHistory[index];
  commandInput.value = item.command;
  showResult(item.result);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 事件绑定
parseBtn.addEventListener('click', parseCommand);

commandInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    parseCommand();
  }
});

// 初始化
commandInput.focus();

const outputEl = document.getElementById('output');
const promptEl = document.getElementById('prompt');
const maxTweetsEl = document.getElementById('maxTweets');
const includeLinksOnlyEl = document.getElementById('includeLinksOnly');
const runBtn = document.getElementById('runBtn');
const advancedSettingsEl = document.getElementById('advancedSettings');
const isDemoMode = new URLSearchParams(window.location.search).get('demo') === '1' || typeof chrome === 'undefined' || !chrome?.runtime;
const demoData = window.DEMO_EXTENSION_DATA || null;

let lastBookmarks = [];

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function sendMessageToTab(tabId, message) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (_err) {
    throw new Error('Open your logged-in X bookmarks page first, e.g. https://x.com/i/bookmarks');
  }
}

async function collectBookmarks() {
  const tab = await getActiveTab();
  if (!tab?.id) {
    throw new Error('No active tab found.');
  }

  const result = await sendMessageToTab(tab.id, {
    type: 'COLLECT_BOOKMARKS',
    maxTweets: Number(maxTweetsEl.value || 100),
    includeLinksOnly: includeLinksOnlyEl.checked
  });

  if (!result?.ok) {
    throw new Error(result?.error || 'Failed to collect bookmarks.');
  }

  lastBookmarks = result.bookmarks || [];
  await chrome.storage.local.set({
    lastBookmarks,
    lastCollectedAt: new Date().toISOString()
  });

  return lastBookmarks;
}

async function summarizeBookmarks(bookmarks) {
  if (!bookmarks.length) {
    throw new Error('No bookmarks collected yet.');
  }

  const response = await chrome.runtime.sendMessage({
    type: 'SUMMARIZE_BOOKMARKS',
    bookmarks,
    userPrompt: promptEl.value
  });

  if (!response?.ok) {
    throw new Error(response?.error || 'Failed to summarize bookmarks.');
  }

  outputEl.value = response.summary;
}

async function runCollectAndSummarize() {
  runBtn.disabled = true;
  runBtn.textContent = 'Working...';
  outputEl.value = 'Collecting bookmarks and generating summary. Your bookmark text is only sent to OpenAI after collection finishes.';

  try {
    const bookmarks = await collectBookmarks();
    await summarizeBookmarks(bookmarks);
  } catch (err) {
    outputEl.value = `Error: ${err.message}`;
    throw err;
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = 'Collect + Summarize';
  }
}

runBtn.addEventListener('click', async () => {
  if (isDemoMode) return;
  try {
    await runCollectAndSummarize();
  } catch (_err) {
    // Error is already shown in output.
  }
});

function initDemo() {
  outputEl.value = demoData?.summary || 'Demo summary preview.';
  promptEl.value = demoData?.prompt || promptEl.value;
  maxTweetsEl.value = String(demoData?.bookmarkCount || 24);
  includeLinksOnlyEl.checked = false;
  advancedSettingsEl.open = true;
  runBtn.disabled = true;
  runBtn.textContent = 'Demo Preview';
}

(async function init() {
  if (isDemoMode) {
    initDemo();
    return;
  }

  const { lastBookmarks: storedBookmarks, summaryPrompt, lastSummary, advancedSettingsOpen } = await chrome.storage.local.get([
    'lastBookmarks',
    'summaryPrompt',
    'lastSummary',
    'advancedSettingsOpen'
  ]);

  if (Array.isArray(storedBookmarks)) {
    lastBookmarks = storedBookmarks;
  }
  if (summaryPrompt) {
    promptEl.value = summaryPrompt;
  }
  if (lastSummary) {
    outputEl.value = lastSummary;
  }
  if (typeof advancedSettingsOpen === 'boolean') {
    advancedSettingsEl.open = advancedSettingsOpen;
  }

  promptEl.addEventListener('change', () => {
    chrome.storage.local.set({ summaryPrompt: promptEl.value });
  });

  advancedSettingsEl.addEventListener('toggle', () => {
    chrome.storage.local.set({ advancedSettingsOpen: advancedSettingsEl.open });
  });
})();

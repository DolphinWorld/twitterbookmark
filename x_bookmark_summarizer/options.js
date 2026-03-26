const statusEl = document.getElementById('status');
const isDemoMode = new URLSearchParams(window.location.search).get('demo') === '1' || typeof chrome === 'undefined' || !chrome?.storage;
const demoData = window.DEMO_EXTENSION_DATA || null;

function setStatus(message) {
  statusEl.textContent = message;
}

async function load() {
  if (isDemoMode) {
    document.getElementById('openaiApiKey').value = demoData?.apiKeyMask || 'sk-demo-xxxxxxxxxxxxxxxx';
    document.getElementById('openaiModel').value = demoData?.model || 'gpt-4.1-mini';
    document.getElementById('systemPrompt').value = demoData?.systemPrompt || '';
    setStatus(`Demo preview. ${demoData?.bookmarkCount || 24} collected bookmarks available for export.`);
    return;
  }

  const { openaiApiKey, openaiModel, systemPrompt, lastBookmarks } = await chrome.storage.local.get([
    'openaiApiKey',
    'openaiModel',
    'systemPrompt',
    'lastBookmarks'
  ]);
  document.getElementById('openaiApiKey').value = openaiApiKey || '';
  document.getElementById('openaiModel').value = openaiModel || 'gpt-4.1-mini';
  document.getElementById('systemPrompt').value = systemPrompt ||
    'You summarize a user\'s saved X bookmarks into a useful, structured digest. Return clear markdown with these sections: TL;DR, Major Themes, Key Links and Resources, Recommended Next Steps, and General Advice. In Recommended Next Steps, give concrete follow-up actions the user can take next. In General Advice, give broader strategic guidance based on the bookmarks, such as what to learn more about, what to validate, and how to turn the information into action. Be concise but specific.';

  if (Array.isArray(lastBookmarks) && lastBookmarks.length) {
    setStatus(`Ready. ${lastBookmarks.length} collected bookmarks available for export.`);
  }
}

async function downloadBookmarks() {
  const { lastBookmarks } = await chrome.storage.local.get(['lastBookmarks']);
  const bookmarks = Array.isArray(lastBookmarks) ? lastBookmarks : [];

  if (!bookmarks.length) {
    throw new Error('No collected bookmarks found yet. Run the popup action first.');
  }

  const blob = new Blob([JSON.stringify(bookmarks, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `x-bookmarks-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  document.body.appendChild(link);

  try {
    link.click();
    setStatus(`Downloaded ${bookmarks.length} bookmarks as JSON.`);
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  if (isDemoMode) {
    setStatus('Demo preview. Settings are not saved in this mode.');
    return;
  }

  await chrome.storage.local.set({
    openaiApiKey: document.getElementById('openaiApiKey').value.trim(),
    openaiModel: document.getElementById('openaiModel').value.trim(),
    systemPrompt: document.getElementById('systemPrompt').value.trim()
  });
  setStatus('Settings saved.');
});

document.getElementById('downloadBtn').addEventListener('click', async () => {
  if (isDemoMode) {
    setStatus(`Demo preview. This would export ${demoData?.bookmarkCount || 24} bookmarks as JSON.`);
    return;
  }

  try {
    await downloadBookmarks();
  } catch (err) {
    setStatus(err.message || String(err));
  }
});

load();

(async function init() {
  const isDemoMode = new URLSearchParams(window.location.search).get('demo') === '1' || typeof chrome === 'undefined' || !chrome?.storage;

  if (isDemoMode) {
    document.getElementById('largeSummary').value =
      window.DEMO_EXTENSION_DATA?.summary || 'Demo summary preview.';
    return;
  }

  const { lastSummary } = await chrome.storage.local.get(['lastSummary']);
  document.getElementById('largeSummary').value = lastSummary || '';
})();

const DEFAULT_MODEL = 'gpt-4.1-mini';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'SUMMARIZE_BOOKMARKS') return;

  (async () => {
    try {
      const result = await summarizeWithLLM(message.bookmarks || [], message.userPrompt || 'Summarize these bookmarks.');
      await chrome.storage.local.set({ lastSummary: result });
      sendResponse({ ok: true, summary: result });
    } catch (err) {
      sendResponse({ ok: false, error: err.message || String(err) });
    }
  })();

  return true;
});

async function summarizeWithLLM(bookmarks, userPrompt) {
  const { openaiApiKey, openaiModel, systemPrompt } = await chrome.storage.local.get([
    'openaiApiKey',
    'openaiModel',
    'systemPrompt'
  ]);

  if (!openaiApiKey) {
    throw new Error('Missing API key. Open Settings and add your OpenAI API key.');
  }

  const compactBookmarks = bookmarks.map((b, index) => ({
    index: index + 1,
    author: b.author,
    text: b.text,
    url: b.permalink,
    timestamp: b.timestamp,
    externalLinks: b.externalLinks
  }));

  const body = {
    model: openaiModel || DEFAULT_MODEL,
    messages: [
      {
        role: 'system',
        content: systemPrompt || 'You summarize a user\'s saved X bookmarks into a useful, structured digest. Return clear markdown with these sections: TL;DR, Major Themes, Key Links and Resources, Recommended Next Steps, and General Advice. In Recommended Next Steps, give concrete follow-up actions the user can take next. In General Advice, give broader strategic guidance based on the bookmarks, such as what to learn more about, what to validate, and how to turn the information into action. Be concise but specific.'
      },
      {
        role: 'user',
        content: `${userPrompt}\n\nBookmarks JSON:\n${JSON.stringify(compactBookmarks)}`
      }
    ],
    temperature: 0.3
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || 'No summary returned.';
}

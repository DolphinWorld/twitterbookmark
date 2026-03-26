function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTweetIdFromAnchor(anchor) {
  const href = anchor?.getAttribute('href') || '';
  const match = href.match(/\/status\/(\d+)/);
  return match ? match[1] : null;
}

function extractTweet(article) {
  const authorAnchor = article.querySelector('a[role="link"][href^="/"][href*="/status/"]');
  const permalink = authorAnchor ? new URL(authorAnchor.getAttribute('href'), location.origin).href : null;
  const tweetId = authorAnchor ? getTweetIdFromAnchor(authorAnchor) : null;

  const displayNameNode = article.querySelector('[data-testid="User-Name"] span');
  const textNode = article.querySelector('[data-testid="tweetText"]');
  const timeNode = article.querySelector('time');
  const linkNodes = Array.from(article.querySelectorAll('a[href]'));
  const externalLinks = linkNodes
    .map(a => a.href)
    .filter(href => /^https?:\/\//.test(href) && !href.includes('x.com/') && !href.includes('twitter.com/'));
  const imageNodes = Array.from(article.querySelectorAll('img[src]'))
    .map(img => img.src)
    .filter(src => src.includes('twimg.com/media') || src.includes('pbs.twimg.com/media'));

  const rawText = textNode ? textNode.innerText.trim() : '';

  return {
    tweetId,
    permalink,
    author: displayNameNode ? displayNameNode.textContent.trim() : '',
    text: rawText,
    timestamp: timeNode ? timeNode.getAttribute('datetime') : null,
    externalLinks: [...new Set(externalLinks)],
    images: [...new Set(imageNodes)]
  };
}

async function autoScrollAndCollect(maxTweets) {
  const seen = new Map();
  let idleLoops = 0;

  while (seen.size < maxTweets && idleLoops < 5) {
    const before = seen.size;
    const articles = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));

    for (const article of articles) {
      const item = extractTweet(article);
      const key = item.tweetId || item.permalink || `${item.author}-${item.text.slice(0, 50)}`;
      if (!seen.has(key) && (item.text || item.externalLinks.length)) {
        seen.set(key, item);
      }
      if (seen.size >= maxTweets) break;
    }

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    await sleep(1800);

    if (seen.size === before) {
      idleLoops += 1;
    } else {
      idleLoops = 0;
    }
  }

  return Array.from(seen.values()).slice(0, maxTweets);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'COLLECT_BOOKMARKS') return;

  (async () => {
    try {
      const items = await autoScrollAndCollect(message.maxTweets || 100);
      const filtered = message.includeLinksOnly
        ? items.filter(item => item.externalLinks && item.externalLinks.length)
        : items;
      sendResponse({ ok: true, bookmarks: filtered });
    } catch (err) {
      sendResponse({ ok: false, error: err.message || String(err) });
    }
  })();

  return true;
});

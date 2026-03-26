# X Bookmark Summarizer Chrome Extension

This Chrome extension reads bookmarks from your currently logged-in X/Twitter bookmarks page, exports them as JSON, and sends them to an LLM for summarization.

## What it does

- Scrapes bookmarks from `https://x.com/i/bookmarks` in your current browser session
- Auto-scrolls the page to gather more bookmarked posts
- Exports collected bookmarks as JSON
- Sends bookmark content to an LLM via the OpenAI Chat Completions API
- Shows the generated summary directly in the popup

## Important limitation

This does **not** use the official X API. It reads the content visible in your browser while you are logged in. That makes it simple to test, but it is fragile because X can change its DOM structure at any time.

## Load the extension

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this project folder

## Usage

1. Log in to X in Chrome
2. Open your bookmarks page: `https://x.com/i/bookmarks`
3. Open the extension popup
4. Click **Collect + Summarize**
5. Open **Settings & export** and enter your OpenAI API key
6. Read the summary directly in the popup, or open **Large Summary View** for easier reading
7. Optionally export the raw bookmarks JSON from Settings

## Permissions and privacy

- The extension stores your OpenAI API key in Chrome extension local storage
- The extension stores your last collected bookmarks and most recent summary in Chrome extension local storage
- Bookmark data is sent to OpenAI only after you click **Collect + Summarize**
- The extension has no backend of its own and does not send data anywhere except OpenAI
- The extension only runs on the X/Twitter bookmarks page and the OpenAI API endpoint

## Security notes

- Review the code before loading it, especially if you plan to modify API behavior
- If you do not want bookmark content sent to OpenAI, do not run the summarization step

## Suggested next improvements

- Add chunking for very large bookmark sets
- Support other LLM endpoints via a configurable base URL
- Add markdown / CSV export
- Preserve thread context for multi-post threads
- Add deduplication by URL and semantic clustering


## v0.1.4 store-readiness improvements

- Reduced permissions to local storage plus the exact required host matches
- Registered the content script in the manifest instead of injecting it dynamically
- Removed the downloads permission by switching export to a standard file download
- Added clearer privacy copy in the popup and settings page

## v0.1.2 improvements

- Larger popup layout for easier reading
- New **Large Summary View** page for comfortable summary review
- Default summary format now includes **Recommended Next Steps** and **General Advice**

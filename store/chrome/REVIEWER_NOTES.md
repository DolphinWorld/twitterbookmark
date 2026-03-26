# Reviewer Notes

## Primary Review Path

1. Sign in to X in Chrome.
2. Open `https://x.com/i/bookmarks`.
3. Click the `X Bookmark Summarizer` extension icon.
4. To test summarization, open `Settings & export`, enter a valid OpenAI API key, then return to the popup.
5. Click `Collect + Summarize`.
6. Verify the summary appears in the popup or the large summary view.

## Alternative Review Path Without API Key

1. Sign in to X in Chrome.
2. Open `https://x.com/i/bookmarks`.
3. Click the extension icon.
4. Run the collection flow.
5. Open `Settings & export`.
6. Click `Download last bookmarks JSON` to verify bookmark collection without OpenAI summarization.

## Notes

- The extension only works on the bookmarks page.
- It does not use the official X API.
- It sends bookmark data to OpenAI only after explicit user action.

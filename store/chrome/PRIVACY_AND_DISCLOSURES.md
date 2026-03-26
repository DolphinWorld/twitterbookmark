# Privacy And Data Disclosures

Complete this in the Chrome Web Store dashboard using the real behavior below.

## What The Extension Handles

- User-provided OpenAI API key
- Bookmark content visible on the logged-in X bookmarks page
- Bookmark metadata:
  - author
  - tweet text
  - permalink
  - timestamp
  - extracted external links
  - extracted image URLs
- User prompt and system prompt text
- Most recent summary output

## Where Data Is Stored

- OpenAI API key: Chrome extension local storage
- Model and prompt settings: Chrome extension local storage
- Last collected bookmarks: Chrome extension local storage
- Last generated summary: Chrome extension local storage

## What Leaves The Browser

When the user clicks `Collect + Summarize`, the extension sends bookmark data and prompt text to:
- `https://api.openai.com/v1/chat/completions`

There is no separate backend owned by this extension.

## Permissions In The Submitted Package

- `storage`

Host permissions:
- `https://x.com/i/bookmarks*`
- `https://twitter.com/i/bookmarks*`
- `https://api.openai.com/*`

## Suggested Dashboard Answers

Collected data:
- `Personal communications` or equivalent bookmark-content bucket: Yes, because bookmark text is processed
- `Authentication information`: Yes, if the dashboard treats API keys as sensitive user-provided credentials

Data usage:
- App functionality: Yes
- Analytics: No
- Advertising: No
- Personalization unrelated to the user request: No

Data sharing:
- Sold to third parties: No
- Used for creditworthiness or lending decisions: No

## Reviewer Risk Notes

- The extension sends bookmark content to OpenAI. This must be disclosed clearly.
- The extension stores an API key locally. This must be disclosed clearly.
- The extension does not use broad all-sites host access anymore; it is limited to the bookmarks page.

## Before Submission

- Reconfirm the exact Chrome Web Store disclosure labels in the dashboard on the day of submission.
- If the dashboard wording differs, answer according to the actual behavior described above.

# Chrome Web Store Release Guide

Use this as the last-mile checklist in the dashboard.

## What To Upload

- Extension ZIP:
  - `/Users/jacksu/projects/twitterbookmark/dist/x_bookmark_summarizer_extension_v0_1_4_store_ready.zip`
- Screenshots:
  - `/Users/jacksu/projects/twitterbookmark/store/chrome/assets/screenshots/screenshot-01-popup.png`
  - `/Users/jacksu/projects/twitterbookmark/store/chrome/assets/screenshots/screenshot-02-settings.png`
  - `/Users/jacksu/projects/twitterbookmark/store/chrome/assets/screenshots/screenshot-03-summary.png`
- Store icon:
  - `/Users/jacksu/projects/twitterbookmark/store/chrome/assets/icon-128.png`

## What To Copy Into The Form

- Name:
  - from `store/chrome/STORE_LISTING.md`
- Short description:
  - from `store/chrome/STORE_LISTING.md`
- Detailed description:
  - from `store/chrome/STORE_LISTING.md`
- Reviewer instructions:
  - from `store/chrome/REVIEWER_NOTES.md`
- Privacy disclosures:
  - from `store/chrome/PRIVACY_AND_DISCLOSURES.md`
- Privacy policy URL:
  - host `store/chrome/PRIVACY_POLICY.html` or `store/chrome/PRIVACY_POLICY.md` at a public URL

## Manual Release Steps

1. Go to the Chrome Web Store developer dashboard.
2. Create a new item.
3. Upload `x_bookmark_summarizer_extension_v0_1_4_store_ready.zip`.
4. Fill in the listing text from `STORE_LISTING.md`.
5. Upload the screenshots and icon from `store/chrome/assets/`.
6. Complete the privacy disclosures using `PRIVACY_AND_DISCLOSURES.md`.
7. Paste the reviewer notes from `REVIEWER_NOTES.md`.
8. Add the public privacy policy URL.
9. Submit for review.

## Manual QA To Do Before Clicking Submit

1. Load the unpacked extension from `/Users/jacksu/projects/twitterbookmark/x_bookmark_summarizer`.
2. Open a real logged-in X bookmarks page.
3. Save a real OpenAI API key in settings.
4. Run `Collect + Summarize`.
5. Verify summary output, settings save, privacy page, and JSON export.

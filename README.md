# Twitter Bookmark Launch Prep

This workspace now contains both the extension source and the Chrome Web Store launch kit.

What is ready:
- Reviewed Manifest V3 extension source in `x_bookmark_summarizer/`
- Reduced permission surface for store review
- Added privacy copy and an in-extension privacy page
- Drafted Chrome Web Store listing, reviewer notes, disclosures, and privacy policy
- Prepared asset and release checklists

What is still blocked:
- Final manual QA in Chrome on a logged-in X bookmarks session
- Screenshot capture from the shipped extension UI
- Publishing the privacy policy to a public URL
- Final upload ZIP generation after the last QA pass

Files:
- `x_bookmark_summarizer/manifest.json`
- `x_bookmark_summarizer/privacy.html`
- `store/chrome/LAUNCH_CHECKLIST.md`
- `store/chrome/STORE_LISTING.md`
- `store/chrome/PRIVACY_AND_DISCLOSURES.md`
- `store/chrome/PRIVACY_POLICY.md`
- `store/chrome/REVIEWER_NOTES.md`
- `store/chrome/REVIEW_AND_RELEASE.md`
- `store/chrome/assets/README.md`

Next step: run one manual test pass in Chrome, capture screenshots, then build the final store ZIP from `x_bookmark_summarizer/`.

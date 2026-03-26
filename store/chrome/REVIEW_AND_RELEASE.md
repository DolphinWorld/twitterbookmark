# Review And Release Plan

## Reviewer Notes

Use this in the Chrome Web Store reviewer instructions field:

`Open https://x.com/i/bookmarks while signed in to X. Click the extension icon. If OpenAI summarization is being tested, open Settings & export, enter an OpenAI API key, then return to the popup and click Collect + Summarize. The extension only works on the bookmarks page and stores settings locally.`

If you do not want to provide a review API key, note this instead:

`The bookmark collection flow can be reviewed without an API key. Open https://x.com/i/bookmarks while signed in to X, click the extension icon, then use Settings & export to download the collected bookmarks JSON after running the collection flow.`

## Release Sequence

1. Final review of `manifest.json`
2. Final privacy disclosure check
3. Capture screenshots from the shipped UI
4. Publish the privacy policy to a public URL
5. Build the final ZIP
6. Upload ZIP, screenshots, and listing copy
7. Paste reviewer notes
8. Submit for review

## Current Release Candidate

- Extension folder: `/Users/jacksu/projects/twitterbookmark/x_bookmark_summarizer`
- Planned store ZIP: `/Users/jacksu/projects/twitterbookmark/dist/x_bookmark_summarizer_extension_v0_1_4_store_ready.zip`

## Final Manual Checks

- Verify collection works on `x.com/i/bookmarks`
- Verify summary works with a valid OpenAI API key
- Verify export still downloads JSON correctly
- Verify popup, settings, and privacy pages open correctly
- Verify no permission warning appears beyond local storage and the declared site access

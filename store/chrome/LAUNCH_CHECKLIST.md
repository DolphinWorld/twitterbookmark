# Chrome Web Store Launch Checklist

This checklist is the shortest path from finished extension code to store submission.

## 1. Package Readiness

- Confirm the extension is Manifest V3.
- Confirm the extension has a clear single purpose.
- Remove unused permissions, host permissions, and optional permissions.
- Verify every requested permission is visible in the UI or necessary for the core flow.
- Verify there is no remotely hosted executable code.
- Bump the extension version in `manifest.json`.
- Prepare a clean upload ZIP that contains only the extension files.
- Add final icons in `16`, `32`, `48`, and `128` sizes.

## 2. Store Listing Inputs

- Final extension name
- Short description
- Detailed description
- Category
- Language
- Support email
- Website URL, if any
- Privacy policy URL, if required
- Reviewer instructions

## 3. Privacy And Disclosure Inputs

- What user data is handled
- Where data is stored: local, sync, backend, third-party service
- Whether data leaves the browser
- Whether data is sold or shared
- Whether data is used for personalization, analytics, or ads
- Whether authentication is required
- Whether the extension works on all sites or only selected domains

## 4. Assets

- Store icon
- At least 3 product screenshots
- Optional promotional tile images
- Optional short demo GIF or video for landing/support pages

## 5. QA Before Submission

- Fresh install test
- Upgrade test from previous version
- Permission prompt test
- Signed-out and signed-in flows, if applicable
- Failure-state test
- Browser restart persistence test
- Works on current stable Chrome
- Works on current stable Edge if you want a second Chromium store later

## 6. Submission Notes

- Add reviewer instructions for any non-obvious flow.
- If the extension uses Twitter/X pages, provide a sample URL and exact clicks.
- If the extension needs login, provide a review account or a no-login demo path.
- If host permissions are broad, explain why they are necessary.

## 7. Current Blocker In This Workspace

Remaining blockers are operational, not structural:

- manual QA in Chrome against a real logged-in X bookmarks session
- final screenshots
- public privacy policy URL
- final upload ZIP after QA

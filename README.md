# Choice Conveyancing – Online Sale Instructions

A single-page online version of Choice Conveyancing's vendor questionnaire.
Vendors only see the questions that apply to them, sign on screen, and the
signed PDF is emailed straight to info@choiceconveyancing.com.au.

Hosted free on GitHub Pages. No database: answers autosave in the vendor's
own browser until they submit.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole form (13 steps, conditional questions, signature pads, PDF). |
| `logo.png` | Choice Conveyancing logo (header and browser tab icon). |
| `email-sender.gs` | Google Apps Script that receives the PDF and emails it to the office. |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is. |

## 1. Publish on GitHub Pages

1. Create a public repository (e.g. `choice-sale-instructions`) and upload these files.
2. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`. Save.
3. After a minute the form is live at `https://<github-user>.github.io/choice-sale-instructions/`.

Add `?demo=1` to the URL to show a "Load example answers" link for testing.

## 2. Turn on emailing (Google Apps Script)

1. Go to <https://script.google.com> signed in to the Google account that should send the emails → **New project**.
2. Delete the sample code, paste in `email-sender.gs`, save.
3. Choose `sendTestEmail` in the toolbar and click **Run**. Approve the permissions prompt. A test email should arrive at info@choiceconveyancing.com.au.
4. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and copy the URL ending in `/exec`.
5. In `index.html`, find `CONFIG` near the top of the script and paste it in:
   ```js
   submitUrl: "https://script.google.com/macros/s/XXXX/exec",
   ```
6. Commit the change. GitHub Pages redeploys automatically.

If `submitUrl` is left blank the form still works: the vendor downloads the
PDF and is asked to email it to the office.

To also email the vendor a copy, set `sendClientCopy: true` in the script
and create a **new version** of the deployment (Deploy → Manage deployments → Edit → New version).

## 3. Changing the logo

Replace `logo.png` with a new file of the same name.

## Notes

- The page is marked `noindex` so it won't show up in Google searches; send vendors the link directly.
- If a vendor closes the page before pressing **Submit**, nothing is sent. Their answers stay saved on their device so they can come back and finish.

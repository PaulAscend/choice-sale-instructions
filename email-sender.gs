/**
 * Choice Conveyancing – Sale Instructions mailer (Google Apps Script)
 *
 * Receives the finished, signed PDF from the online form and emails it
 * to the office. Deploy as a Web app (Execute as: Me, Who has access: Anyone)
 * and paste the /exec URL into CONFIG.submitUrl in index.html.
 */

const SETTINGS = {
  officeEmail: "info@choiceconveyancing.com.au",
  senderName: "Choice Conveyancing – Online Sale Instructions",
  sendClientCopy: false,          // set true to also email the vendor a copy
  maxPdfBytes: 20 * 1024 * 1024   // reject anything unreasonably large
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (!data.pdf) return json_({ ok: false, error: "No PDF received" });

    const bytes = Utilities.base64Decode(data.pdf);
    if (bytes.length > SETTINGS.maxPdfBytes) return json_({ ok: false, error: "PDF too large" });

    const filename = String(data.filename || "Sale-Instructions.pdf").replace(/[^\w.\- ]/g, "");
    const pdf = Utilities.newBlob(bytes, "application/pdf", filename);
    const address = clean_(data.address) || "(no address given)";
    const vendors = clean_(data.vendors) || "(not given)";
    const email = clean_(data.email);
    const phone = clean_(data.phone);

    const body =
      "New Sale Instructions submitted online.\n\n" +
      "Property: " + address + "\n" +
      "Vendor(s): " + vendors + "\n" +
      "Email: " + (email || "-") + "\n" +
      "Mobile: " + (phone || "-") + "\n\n" +
      "The signed instructions are attached as a PDF.\n" +
      "Submitted: " + Utilities.formatDate(new Date(), "Australia/Melbourne", "d MMM yyyy, h:mm a");

    const opts = { name: SETTINGS.senderName, attachments: [pdf] };
    if (isEmail_(email)) opts.replyTo = email;

    MailApp.sendEmail(SETTINGS.officeEmail, "Sale Instructions – " + address, body, opts);

    if (SETTINGS.sendClientCopy && isEmail_(email)) {
      MailApp.sendEmail(email, "Your Sale Instructions – " + address,
        "Thanks for completing your Sale Instructions. A copy is attached for your records.\n\n" +
        "If you have any questions, call us on 03 5246 8700.\n\nChoice Conveyancing",
        { name: "Choice Conveyancing", replyTo: SETTINGS.officeEmail, attachments: [pdf] });
    }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

/** Visiting the URL in a browser confirms the script is live. */
function doGet() {
  return json_({ ok: true, service: "Choice Sale Instructions mailer" });
}

/** Run once from the editor to approve permissions and send a test email. */
function sendTestEmail() {
  MailApp.sendEmail(SETTINGS.officeEmail, "Test – Sale Instructions mailer",
    "If you can read this, the online Sale Instructions form can email you.", { name: SETTINGS.senderName });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function clean_(s) { return String(s || "").replace(/[\r\n]+/g, " ").trim().slice(0, 300); }
function isEmail_(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || ""); }

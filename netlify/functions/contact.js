const nodemailer = require('nodemailer');

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(payload)
  };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateReference() {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `EW-C-${year}-${randomNumber}`;
}

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const password = process.env.EMAIL_APP_PASSWORD;

  if (!user || !password) {
    throw new Error('EMAIL_USER or EMAIL_APP_PASSWORD is not configured in Netlify.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: password
    }
  });
}

function buildBusinessText(data) {
  return `EASYWORK ENTERPRISE (PTY) LTD\nCONTACT ENQUIRY\n\nReference: ${data.reference}\n\nName: ${data.name}\nCompany: ${data.company || 'Not supplied'}\nPhone: ${data.phone}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMESSAGE\n${data.message}\n\nSubmitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}\n`;
}

function buildBusinessEmail(data) {
  const rows = [
    ['Reference', data.reference],
    ['Name', data.name],
    ['Company', data.company || 'Not supplied'],
    ['Phone', data.phone],
    ['Email', data.email],
    ['Subject', data.subject]
  ];

  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #eef1ef;width:32%;color:#64746d;font-size:13px;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eef1ef;color:#17241f;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`).join('');

  const message = escapeHtml(data.message).replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Easywork Contact Enquiry</title></head>
<body style="margin:0;padding:0;background:#f3f5f4;font-family:Arial,Helvetica,sans-serif;color:#17241f;">
  <div style="max-width:680px;margin:30px auto;background:#fff;border:1px solid #dce5e0;border-radius:8px;overflow:hidden;">
    <div style="background:#173d30;color:#fff;padding:22px 26px;">
      <div style="font-size:21px;font-weight:700;">Easywork Enterprise</div>
      <div style="margin-top:5px;color:#d9e5df;font-size:13px;">New Contact Enquiry</div>
    </div>
    <div style="padding:26px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#173d30;margin-bottom:10px;">Enquiry Details</div>
      <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
      <div style="margin-top:22px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#173d30;margin-bottom:9px;">Message</div>
      <div style="background:#fafcfb;border:1px solid #dce5e0;border-radius:6px;padding:14px;font-size:14px;line-height:1.6;">${message}</div>
    </div>
    <div style="background:#f8faf9;border-top:1px solid #dce5e0;padding:17px 26px;color:#64746d;font-size:12px;line-height:1.6;">Easywork Enterprise (Pty) Ltd<br>Materials Supply &amp; Delivery<br>Mpumalanga | South Africa</div>
  </div>
</body></html>`;
}

function buildCustomerEmail(data) {
  const name = escapeHtml(data.name || 'Customer');
  const reference = escapeHtml(data.reference);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Easywork Enquiry Confirmation</title></head>
<body style="margin:0;padding:0;background:#f3f5f4;font-family:Arial,Helvetica,sans-serif;color:#17241f;">
  <div style="max-width:620px;margin:35px auto;background:#fff;border:1px solid #dce5e0;border-radius:8px;overflow:hidden;">
    <div style="background:#173d30;color:#fff;padding:24px 28px;">
      <div style="font-size:21px;font-weight:700;">Easywork Enterprise</div>
      <div style="margin-top:5px;color:#d9e5df;font-size:13px;">Enquiry Confirmation</div>
    </div>
    <div style="padding:28px;line-height:1.7;color:#52635c;">
      <p>Dear ${name},</p>
      <p>Thank you for contacting <strong>Easywork Enterprise (Pty) Ltd</strong>. We have successfully received your enquiry and our team will review it and get back to you.</p>
      <div style="margin:22px 0;padding:15px;background:#eef5f1;border-left:4px solid #173d30;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#61726b;font-weight:700;">Enquiry Reference</div>
        <div style="margin-top:5px;font-size:19px;font-weight:700;color:#173d30;">${reference}</div>
      </div>
      <p>Please keep this reference for future communication.</p>
      <p>Kind regards,<br><strong>Easywork Enterprise (Pty) Ltd</strong><br>Materials Supply &amp; Delivery</p>
    </div>
    <div style="background:#f8faf9;border-top:1px solid #dce5e0;padding:18px 28px;color:#64746d;font-size:12px;">This is an automated confirmation from the Easywork Enterprise website.</div>
  </div>
</body></html>`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {});
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { success: false, message: 'Method not allowed.' });
  }

  try {
    const values = JSON.parse(event.body || '{}');
    const requiredFields = ['name', 'phone', 'email', 'subject', 'message'];
    const missing = requiredFields.filter((field) => !String(values[field] || '').trim());

    if (missing.length) {
      return json(400, {
        success: false,
        message: 'Please complete all required contact fields.',
        missing
      });
    }

    const data = {
      reference: generateReference(),
      name: String(values.name).trim(),
      company: String(values.company || '').trim(),
      phone: String(values.phone).trim(),
      email: String(values.email).trim(),
      subject: String(values.subject).trim(),
      message: String(values.message).trim()
    };

    const transporter = createTransporter();
    const emailUser = process.env.EMAIL_USER;

    await transporter.sendMail({
      from: `"Easywork Enterprise Website" <${emailUser}>`,
      to: emailUser,
      replyTo: data.email,
      subject: `Easywork Contact Enquiry - ${data.subject} - ${data.reference}`,
      text: buildBusinessText(data),
      html: buildBusinessEmail(data)
    });

    try {
      await transporter.sendMail({
        from: `"Easywork Enterprise" <${emailUser}>`,
        to: data.email,
        subject: `Easywork Enterprise - Enquiry Received (${data.reference})`,
        html: buildCustomerEmail(data)
      });
    } catch (customerError) {
      console.error('Customer contact confirmation email failed:', customerError);
    }

    console.log(`Contact enquiry submitted successfully: ${data.reference}`);

    return json(200, {
      success: true,
      message: 'Your enquiry has been successfully submitted.',
      reference: data.reference
    });
  } catch (error) {
    console.error('CONTACT NETLIFY FUNCTION ERROR:', error);

    return json(500, {
      success: false,
      message: 'We could not send your enquiry at this time. Please try again later.'
    });
  }
};

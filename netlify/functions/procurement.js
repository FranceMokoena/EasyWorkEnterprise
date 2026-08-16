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
  return `EW-${year}-${randomNumber}`;
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

function buildBusinessEmail(data) {
  const reference = escapeHtml(data.reference);
  const customer = escapeHtml(data.customer || 'Not supplied');
  const contactPerson = escapeHtml(data.contactPerson || 'Not supplied');
  const phone = escapeHtml(data.phone || 'Not supplied');
  const email = escapeHtml(data.email || 'Not supplied');
  const material = escapeHtml(data.material || 'Not supplied');
  const quantity = escapeHtml(data.quantity || 'Not supplied');
  const location = escapeHtml(data.location || 'Not supplied');
  const date = escapeHtml(data.date || 'Not supplied');
  const additional = escapeHtml(data.additional || 'No additional requirements supplied.').replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{margin:0;padding:0;background:#f3f5f4;font-family:Arial,Helvetica,sans-serif;color:#17241f}
.container{max-width:700px;margin:30px auto;background:#fff;border:1px solid #dce5e0;border-radius:8px;overflow:hidden}
.header{background:#173d30;color:#fff;padding:24px 28px}
.header h1{margin:0;font-size:22px}.header p{margin:6px 0 0;color:#d9e5df;font-size:13px}
.content{padding:28px}.reference{background:#eef5f1;border:1px solid #d7e5dd;border-left:4px solid #173d30;padding:14px 16px;margin-bottom:24px}
.reference strong{display:block;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#61726b}.reference span{display:block;margin-top:5px;font-size:20px;font-weight:700;color:#173d30}
.section{margin-top:24px}.section-title{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#173d30;border-bottom:1px solid #dce5e0;padding-bottom:8px;margin-bottom:10px}
table{width:100%;border-collapse:collapse}td{padding:9px 0;border-bottom:1px solid #eef1ef;vertical-align:top}.label{width:38%;color:#64746d;font-size:13px;font-weight:700}.value{color:#17241f;font-size:14px}
.additional{background:#fafcfb;border:1px solid #dce5e0;border-radius:6px;padding:14px;line-height:1.6;font-size:14px}
.footer{background:#f8faf9;border-top:1px solid #dce5e0;padding:18px 28px;color:#64746d;font-size:12px;line-height:1.6}
</style>
</head>
<body>
<div class="container">
  <div class="header"><h1>Easywork Enterprise</h1><p>New Procurement Request</p></div>
  <div class="content">
    <div class="reference"><strong>Request Reference</strong><span>${reference}</span></div>
    <div class="section"><div class="section-title">Customer Information</div><table>
      <tr><td class="label">Customer / Company</td><td class="value">${customer}</td></tr>
      <tr><td class="label">Contact Person</td><td class="value">${contactPerson}</td></tr>
      <tr><td class="label">Phone</td><td class="value">${phone}</td></tr>
      <tr><td class="label">Email</td><td class="value">${email}</td></tr>
    </table></div>
    <div class="section"><div class="section-title">Material Requirements</div><table>
      <tr><td class="label">Material Required</td><td class="value">${material}</td></tr>
      <tr><td class="label">Quantity</td><td class="value">${quantity}</td></tr>
    </table></div>
    <div class="section"><div class="section-title">Delivery Information</div><table>
      <tr><td class="label">Delivery Location</td><td class="value">${location}</td></tr>
      <tr><td class="label">Required Date</td><td class="value">${date}</td></tr>
    </table></div>
    <div class="section"><div class="section-title">Additional Requirements</div><div class="additional">${additional}</div></div>
  </div>
  <div class="footer"><strong>Easywork Enterprise (Pty) Ltd</strong><br>Materials Supply &amp; Delivery<br>Mpumalanga | South Africa<br><br>This procurement request was submitted through the Easywork Enterprise website.</div>
</div>
</body>
</html>`;
}

function buildBusinessText(data) {
  return `EASYWORK ENTERPRISE (PTY) LTD\nPROCUREMENT REQUEST\n\nRequest Reference: ${data.reference}\n\nCUSTOMER INFORMATION\nCustomer / Company: ${data.customer || 'Not supplied'}\nContact Person: ${data.contactPerson || 'Not supplied'}\nPhone: ${data.phone || 'Not supplied'}\nEmail: ${data.email || 'Not supplied'}\n\nMATERIAL REQUIREMENTS\nMaterial Required: ${data.material || 'Not supplied'}\nQuantity: ${data.quantity || 'Not supplied'}\n\nDELIVERY INFORMATION\nDelivery Location: ${data.location || 'Not supplied'}\nRequired Date: ${data.date || 'Not supplied'}\n\nADDITIONAL REQUIREMENTS\n${data.additional || 'No additional requirements supplied.'}\n\nSubmitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}\n`;
}

function buildCustomerEmail(data) {
  const name = escapeHtml(data.contactPerson || data.customer || 'Customer');
  const reference = escapeHtml(data.reference);

  return `
<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#f3f5f4;font-family:Arial,Helvetica,sans-serif;color:#17241f}.container{max-width:620px;margin:35px auto;background:#fff;border:1px solid #dce5e0;border-radius:8px;overflow:hidden}.header{background:#173d30;color:#fff;padding:25px 30px}.header h1{margin:0;font-size:22px}.header p{margin:6px 0 0;color:#d9e5df}.content{padding:30px}.reference{margin:22px 0;padding:16px;background:#eef5f1;border-left:4px solid #173d30}.reference strong{color:#173d30;font-size:18px}.content p{line-height:1.7;color:#52635c}.footer{background:#f8faf9;padding:20px 30px;border-top:1px solid #dce5e0;color:#64746d;font-size:12px}
</style></head><body><div class="container"><div class="header"><h1>Easywork Enterprise</h1><p>Procurement Request Confirmation</p></div><div class="content"><p>Dear ${name},</p><p>Thank you for submitting your material supply and delivery request to <strong>Easywork Enterprise (Pty) Ltd</strong>.</p><div class="reference">Your request reference is:<br><br><strong>${reference}</strong></div><p>We have successfully received your requirements. Our team will review your request and contact you regarding availability, pricing and delivery arrangements.</p><p>Please keep your request reference for future communication.</p><p>Kind regards,<br><strong>Easywork Enterprise (Pty) Ltd</strong><br>Materials Supply &amp; Delivery<br>Mpumalanga | South Africa</p></div><div class="footer">This is an automated confirmation from the Easywork Enterprise website.</div></div></body></html>`;
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

    const requiredFields = ['customer', 'contactPerson', 'phone', 'email', 'material', 'quantity', 'location'];
    const missing = requiredFields.filter((field) => !String(values[field] || '').trim());

    if (missing.length) {
      return json(400, {
        success: false,
        message: 'Please complete all required procurement fields.',
        missing
      });
    }

    const reference = generateReference();
    const data = {
      reference,
      customer: String(values.customer).trim(),
      contactPerson: String(values.contactPerson).trim(),
      phone: String(values.phone).trim(),
      email: String(values.email).trim(),
      material: String(values.material).trim(),
      quantity: String(values.quantity).trim(),
      location: String(values.location).trim(),
      date: String(values.date || '').trim(),
      additional: String(values.additional || '').trim()
    };

    const transporter = createTransporter();
    const emailUser = process.env.EMAIL_USER;

    await transporter.sendMail({
      from: `"Easywork Enterprise Website" <${emailUser}>`,
      to: emailUser,
      replyTo: data.email,
      subject: `Easywork Procurement Request - ${reference}`,
      text: buildBusinessText(data),
      html: buildBusinessEmail(data)
    });

    if (data.email) {
      try {
        await transporter.sendMail({
          from: `"Easywork Enterprise" <${emailUser}>`,
          to: data.email,
          subject: `Easywork Enterprise - Request Received (${reference})`,
          html: buildCustomerEmail(data)
        });
      } catch (customerError) {
        console.error('Customer confirmation email failed:', customerError);
      }
    }

    console.log(`Procurement request submitted successfully: ${reference}`);

    return json(200, {
      success: true,
      message: 'Procurement request successfully submitted.',
      reference
    });
  } catch (error) {
    console.error('PROCUREMENT NETLIFY FUNCTION ERROR:', error);

    return json(500, {
      success: false,
      message: 'We could not submit your request at this time. Please try again later.'
    });
  }
};

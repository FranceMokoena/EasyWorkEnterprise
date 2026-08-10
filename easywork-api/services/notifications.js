const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD
  }
});


async function sendProcurementNotification(data) {

  const {
    reference,
    customer,
    contactPerson,
    phone,
    email,
    material,
    quantity,
    location,
    date,
    additional
  } = data;


  const mailSubject =
    `Easywork Procurement Request - ${reference}`;


  const mailBody = `
EASYWORK ENTERPRISE (PTY) LTD
PROCUREMENT REQUEST
========================================

Request Reference:
${reference}

CUSTOMER INFORMATION
----------------------------------------
Customer / Company: ${customer || 'Not supplied'}
Contact Person: ${contactPerson || 'Not supplied'}
Phone: ${phone || 'Not supplied'}
Email: ${email || 'Not supplied'}

MATERIAL REQUIREMENTS
----------------------------------------
Material Required: ${material || 'Not supplied'}
Quantity: ${quantity || 'Not supplied'}

DELIVERY INFORMATION
----------------------------------------
Delivery Location: ${location || 'Not supplied'}
Required Date: ${date || 'Not supplied'}

ADDITIONAL REQUIREMENTS
----------------------------------------
${additional || 'Not supplied'}

========================================

Submitted:
${new Date().toLocaleString('en-ZA', {
  timeZone: 'Africa/Johannesburg'
})}

Easywork Enterprise (Pty) Ltd
Materials Supply & Delivery
Mpumalanga | South Africa

This request was submitted through the Easywork Enterprise website.
`;


  const mailHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>

body {
  margin: 0;
  padding: 0;
  background: #f4f6f5;
  font-family: Arial, Helvetica, sans-serif;
  color: #1c2b27;
}

.container {
  max-width: 700px;
  margin: 30px auto;
  background: #ffffff;
  border: 1px solid #dde7e1;
  border-radius: 12px;
  overflow: hidden;
}

.header {
  background: #173d30;
  color: #ffffff;
  padding: 24px 28px;
}

.header h1 {
  margin: 0;
  font-size: 22px;
}

.header p {
  margin: 6px 0 0;
  opacity: 0.8;
  font-size: 13px;
}

.content {
  padding: 28px;
}

.reference {
  background: #edf7f0;
  border-left: 4px solid #173d30;
  padding: 14px 16px;
  margin-bottom: 24px;
}

.reference strong {
  display: block;
  font-size: 12px;
  color: #5e6f67;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.reference span {
  display: block;
  margin-top: 5px;
  font-size: 20px;
  font-weight: bold;
  color: #173d30;
}

.section {
  margin-top: 24px;
}

.section-title {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #173d30;
  border-bottom: 1px solid #dde7e1;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 9px 0;
  vertical-align: top;
  border-bottom: 1px solid #f0f2f1;
}

.label {
  width: 38%;
  color: #5e6f67;
  font-weight: bold;
  font-size: 13px;
}

.value {
  color: #1c2b27;
  font-size: 14px;
}

.additional {
  background: #fafcfb;
  border: 1px solid #dde7e1;
  padding: 15px;
  border-radius: 8px;
  line-height: 1.6;
}

.footer {
  background: #f8faf9;
  border-top: 1px solid #dde7e1;
  padding: 18px 28px;
  color: #5e6f67;
  font-size: 12px;
}

</style>

</head>

<body>

<div class="container">

  <div class="header">
    <h1>Easywork Enterprise</h1>
    <p>New Procurement Request</p>
  </div>

  <div class="content">

    <div class="reference">
      <strong>Request Reference</strong>
      <span>${reference}</span>
    </div>


    <div class="section">

      <div class="section-title">
        Customer Information
      </div>

      <table>

        <tr>
          <td class="label">Customer / Company</td>
          <td class="value">${customer || 'Not supplied'}</td>
        </tr>

        <tr>
          <td class="label">Contact Person</td>
          <td class="value">${contactPerson || 'Not supplied'}</td>
        </tr>

        <tr>
          <td class="label">Phone</td>
          <td class="value">${phone || 'Not supplied'}</td>
        </tr>

        <tr>
          <td class="label">Email</td>
          <td class="value">${email || 'Not supplied'}</td>
        </tr>

      </table>

    </div>


    <div class="section">

      <div class="section-title">
        Material Requirements
      </div>

      <table>

        <tr>
          <td class="label">Material Required</td>
          <td class="value">${material || 'Not supplied'}</td>
        </tr>

        <tr>
          <td class="label">Quantity</td>
          <td class="value">${quantity || 'Not supplied'}</td>
        </tr>

      </table>

    </div>


    <div class="section">

      <div class="section-title">
        Delivery Information
      </div>

      <table>

        <tr>
          <td class="label">Delivery Location</td>
          <td class="value">${location || 'Not supplied'}</td>
        </tr>

        <tr>
          <td class="label">Required Date</td>
          <td class="value">${date || 'Not supplied'}</td>
        </tr>

      </table>

    </div>


    <div class="section">

      <div class="section-title">
        Additional Requirements
      </div>

      <div class="additional">
        ${additional || 'No additional requirements supplied.'}
      </div>

    </div>

  </div>


  <div class="footer">

    <strong>Easywork Enterprise (Pty) Ltd</strong><br>
    Materials Supply & Delivery<br>
    Mpumalanga | South Africa<br><br>

    This procurement request was submitted through the Easywork Enterprise website.

  </div>

</div>

</body>
</html>
`;


  const result = await transporter.sendMail({

    from: `"Easywork Enterprise Website" <${EMAIL_USER}>`,

    to: EMAIL_USER,

    replyTo: email || EMAIL_USER,

    subject: mailSubject,

    text: mailBody,

    html: mailHtml
  });


  console.log(
    `Procurement email sent successfully: ${result.messageId}`
  );


  return result;
}


async function sendCustomerConfirmation(data) {

  const {
    reference,
    customer,
    contactPerson,
    email
  } = data;


  if (!email) {
    return null;
  }


  const subject =
    `Easywork Enterprise - Request Received (${reference})`;


  const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

body {
  margin: 0;
  padding: 0;
  background: #f4f6f5;
  font-family: Arial, Helvetica, sans-serif;
  color: #1c2b27;
}

.container {
  max-width: 620px;
  margin: 35px auto;
  background: #ffffff;
  border: 1px solid #dde7e1;
  border-radius: 12px;
  overflow: hidden;
}

.header {
  background: #173d30;
  color: white;
  padding: 25px 30px;
}

.header h1 {
  margin: 0;
  font-size: 22px;
}

.header p {
  margin: 6px 0 0;
  opacity: .8;
}

.content {
  padding: 30px;
}

.reference {
  margin: 22px 0;
  padding: 16px;
  background: #edf7f0;
  border-left: 4px solid #173d30;
}

.reference strong {
  color: #173d30;
  font-size: 18px;
}

p {
  line-height: 1.7;
  color: #5e6f67;
}

.footer {
  background: #f8faf9;
  padding: 20px 30px;
  border-top: 1px solid #dde7e1;
  color: #5e6f67;
  font-size: 12px;
}

</style>

</head>

<body>

<div class="container">

  <div class="header">

    <h1>Easywork Enterprise</h1>

    <p>Request Confirmation</p>

  </div>


  <div class="content">

    <p>
      Dear ${contactPerson || customer || 'Customer'},
    </p>

    <p>
      Thank you for submitting your material supply and delivery request to
      <strong>Easywork Enterprise (Pty) Ltd</strong>.
    </p>


    <div class="reference">

      Your request reference is:

      <br><br>

      <strong>${reference}</strong>

    </div>


    <p>
      We have successfully received your requirements.
      Our team will review your request and contact you regarding
      availability, pricing and delivery arrangements.
    </p>


    <p>
      Please keep your request reference for future communication.
    </p>


    <p>
      Kind regards,<br>
      <strong>Easywork Enterprise (Pty) Ltd</strong><br>
      Materials Supply & Delivery<br>
      Mpumalanga | South Africa
    </p>

  </div>


  <div class="footer">

    This is an automated confirmation from the Easywork Enterprise website.

  </div>

</div>

</body>

</html>
`;


  return transporter.sendMail({

    from: `"Easywork Enterprise" <${EMAIL_USER}>`,

    to: email,

    subject,

    html

  });

}


module.exports = {
  sendProcurementNotification,
  sendCustomerConfirmation
};
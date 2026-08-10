const WHATSAPP_NUMBER =
    process.env.EASYWORK_WHATSAPP_NUMBER;


/*
|--------------------------------------------------------------------------
| BUILD PROCUREMENT MESSAGE
|--------------------------------------------------------------------------
*/

function buildProcurementMessage(request) {

    return [

        'EASYWORK ENTERPRISE',

        'NEW PROCUREMENT REQUEST',

        '--------------------------------',

        `Reference: ${request.reference}`,

        `Customer / Company: ${request.customer}`,

        `Contact Person: ${request.contactPerson}`,

        `Phone: ${request.phone}`,

        `Email: ${request.email}`,

        '',

        `Material Required: ${request.material}`,

        `Quantity: ${request.quantity}`,

        `Delivery Location: ${request.location}`,

        `Required Date: ${request.date}`,

        '',

        `Additional Requirements: ${request.additional}`,

        '',

        `Submitted: ${request.submittedAt}`,

        '--------------------------------',

        'Easywork Enterprise Procurement System'

    ].join('\n');

}


/*
|--------------------------------------------------------------------------
| BUILD CONTACT MESSAGE
|--------------------------------------------------------------------------
*/

function buildContactMessage(request) {

    return [

        'EASYWORK ENTERPRISE',

        'NEW CONTACT ENQUIRY',

        '--------------------------------',

        `Reference: ${request.reference}`,

        `Name: ${request.name}`,

        `Company: ${request.company}`,

        `Phone: ${request.phone}`,

        `Email: ${request.email}`,

        `Subject: ${request.subject}`,

        '',

        'Message:',

        request.message,

        '',

        `Submitted: ${request.submittedAt}`,

        '--------------------------------',

        'Easywork Enterprise Website'

    ].join('\n');

}


/*
|--------------------------------------------------------------------------
| PROCUREMENT NOTIFICATION
|--------------------------------------------------------------------------
*/

async function sendProcurementNotification(request) {

    const message =
        buildProcurementMessage(request);


    console.log('');
    console.log('WHATSAPP BUSINESS NOTIFICATION');
    console.log('Recipient:', WHATSAPP_NUMBER);
    console.log('');
    console.log(message);
    console.log('');


    /*
    |--------------------------------------------------------------------------
    | FUTURE WHATSAPP API
    |--------------------------------------------------------------------------
    |
    | This is where we will connect the official WhatsApp
    | Business/API provider.
    |
    */


    return {
        success: true,
        message
    };

}


/*
|--------------------------------------------------------------------------
| CONTACT NOTIFICATION
|--------------------------------------------------------------------------
*/

async function sendContactNotification(request) {

    const message =
        buildContactMessage(request);


    console.log('');
    console.log('WHATSAPP BUSINESS NOTIFICATION');
    console.log('Recipient:', WHATSAPP_NUMBER);
    console.log('');
    console.log(message);
    console.log('');


    /*
    |--------------------------------------------------------------------------
    | FUTURE WHATSAPP API
    |--------------------------------------------------------------------------
    */

    return {
        success: true,
        message
    };

}


module.exports = {

    sendProcurementNotification,

    sendContactNotification

};
const express = require('express');

const router = express.Router();

const {
    sendContactNotification
} = require('../services/whatsapp');

const {
    sendContactConfirmation
} = require('../services/notifications');


/*
|--------------------------------------------------------------------------
| CONTACT ENQUIRY
|--------------------------------------------------------------------------
|
| POST /api/contact
|
*/

router.post('/', async (req, res) => {

    try {

        const {
            name,
            company,
            phone,
            email,
            subject,
            message
        } = req.body;


        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        if (
            !name ||
            !phone ||
            !email ||
            !message
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'Please complete all required contact fields.'

            });

        }


        /*
        |--------------------------------------------------------------------------
        | REFERENCE
        |--------------------------------------------------------------------------
        */

        const reference =
            generateReference();


        /*
        |--------------------------------------------------------------------------
        | CONTACT REQUEST
        |--------------------------------------------------------------------------
        */

        const request = {

            reference,

            name,

            company:
                company || 'Not supplied',

            phone,

            email,

            subject:
                subject || 'General Enquiry',

            message,

            submittedAt:
                new Date().toISOString()

        };


        /*
        |--------------------------------------------------------------------------
        | SERVER LOG
        |--------------------------------------------------------------------------
        */

        console.log('');
        console.log('==============================================');
        console.log('NEW CONTACT ENQUIRY');
        console.log('==============================================');
        console.log(request);
        console.log('==============================================');
        console.log('');


        /*
        |--------------------------------------------------------------------------
        | BUSINESS NOTIFICATION
        |--------------------------------------------------------------------------
        */

        await sendContactNotification(request);


        /*
        |--------------------------------------------------------------------------
        | CLIENT CONFIRMATION
        |--------------------------------------------------------------------------
        */

        await sendContactConfirmation(request);


        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return res.status(201).json({

            success: true,

            reference,

            message:
                'Your enquiry has been successfully submitted.'

        });


    } catch (error) {

        console.error(
            'Contact submission error:',
            error
        );


        return res.status(500).json({

            success: false,

            message:
                'We could not process your enquiry at this time.'

        });

    }

});


/*
|--------------------------------------------------------------------------
| REFERENCE GENERATOR
|--------------------------------------------------------------------------
*/

function generateReference() {

    const year =
        new Date().getFullYear();

    const randomNumber =
        Math.floor(
            10000 + Math.random() * 90000
        );

    return `EW-CON-${year}-${randomNumber}`;

}


module.exports = router;
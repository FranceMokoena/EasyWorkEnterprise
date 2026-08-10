const express = require('express');

const router = express.Router();

const {
  sendProcurementNotification,
  sendCustomerConfirmation
} = require('../services/notifications');


function generateReference() {

  const year = new Date().getFullYear();

  const randomNumber =
    Math.floor(10000 + Math.random() * 90000);

  return `EW-${year}-${randomNumber}`;

}


router.post('/', async (req, res) => {

  try {

    const values = req.body || {};


    const reference = generateReference();


    const procurementData = {

      reference,

      customer: values.customer,

      contactPerson: values.contactPerson,

      phone: values.phone,

      email: values.email,

      material: values.material,

      quantity: values.quantity,

      location: values.location,

      date: values.date,

      additional: values.additional

    };


    /*
     * Send request to Easywork Enterprise
     */

    await sendProcurementNotification(
      procurementData
    );


    /*
     * Send confirmation to customer
     */

    if (values.email) {

      try {

        await sendCustomerConfirmation(
          procurementData
        );

      } catch (customerEmailError) {

        console.error(
          'Customer confirmation email failed:',
          customerEmailError.message
        );

      }

    }


    res.status(200).json({

      success: true,

      message:
        'Procurement request successfully submitted.',

      reference

    });


  } catch (error) {

    console.error(
      'PROCUREMENT SUBMISSION ERROR:',
      error
    );


    res.status(500).json({

      success: false,

      message:
        'We could not submit your request at this time. Please try again later.'

    });

  }

});


module.exports = router;
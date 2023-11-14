require('dotenv').config()
const express = require('express');
const app = express();
const sgMail = require('@sendgrid/mail');
const PORT = process.env.PORT;
const Joi = require('joi');
const bodyParser = require('body-parser');
const SENDGRID_API_KEY = process.env.SENDGRID_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

app.use(bodyParser.json());

app.post('/user/details', (req, res) => { 
        
        const { firstname, surname, email, phone } = req.body;
        const schema = Joi.object({
            firstname: Joi.string().min(3).required(),
            surname: Joi.string().min(3),
            email: Joi.string().email().required(),
            phone: Joi.string().min(11).max(15)
        })

        const { value, error } = schema.validate(req.body);
        if (error !== undefined) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        const msg = {
            to: email,
            from: process.env.SENDER_EMAIL, // Use the email address or domain you verified above
            subject: "Testiing SendGrid's Node.js Library",
            text: `Hello ${firstname} ${surname ?? ''}, Thank you for registering with us. We will get back to you shortly.`,
          };

        sgMail.send(msg)
        .then(() => {
            console.log('Email sent')
            res.status(200).json({
                status: 'success',
                message: 'User details created successfully',
            })
         })
        .catch((error) => {
            console.error(error)
             
        res.status(500).json({
            status: 'error',
            message: 'Apologies, we could not send your email at this time. Please try again later.',
        })
         });


      

  

});

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}.`);
});
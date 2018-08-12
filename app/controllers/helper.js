'use strict';

var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    mandrillTransport = require('nodemailer-mandrill-transport'),
    mailGun = require('nodemailer-mailgun-transport'),
	hbs = require('hbs'),
	mongoose = require('mongoose'),
	fs = require('fs');

//
var auth = {
	auth: {
		api_key: 'key-d4939995babe9604c0b0fa19e0ad87c3',
		domain: 'jumpstartfund.com'
	}
}

var transport = nodemailer.createTransport(mailGun(auth));



/**
 *
 */
exports.sendEmail = function(mailObj) {
	transport.sendMail(mailObj, function(err, response) {

		if (err) {
			return response;
		}
	});
}



/**
 *
 */
exports.sendMail = (mailOptions, cb) => {
	const transport = nodemailer.createTransport(smtpTransport({
		secure: true,
		service: "gmail",
		host: 'smtp.gmail.com',
		port: 465,
		auth: {
			user: 'shyam.lightwebs@gmail.com',
			pass: 'goodLife009'
		}
	}));

	transport.sendMail(mailOptions, (err, response) => {
		if (err) {
			return cb(err, null);
		}
		return cb(null, response);
	});
};



/**
 *
 */
exports.sendHTMLEmail = function(view, dynamicFields, mailOptions) {
    fs.readFile(__dirname + '/../views/email-templates/' + view, 'utf8', function(err, htmlData) {
        var template = hbs.compile(htmlData);
        var compiledHTML = template(dynamicFields || {});
        mailOptions.html = compiledHTML;
        exports.sendEmail(mailOptions);
    });
};

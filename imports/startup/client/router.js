import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import '/imports/ui/main.js';
import '/imports/ui/contacts/contacts.js';

Router.configure({
	layoutTemplate: 'main'
});

Router.route('/offline-contacts', function () {
	this.render('contacts');
	}, {
		name: 'contacts'
});

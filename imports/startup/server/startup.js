import { Contacts } from '/imports/api/collections/contacts.js';

Meteor.startup(function () {
	Meteor.publish('contacts', function() {
		return Contacts.find();
	});
});
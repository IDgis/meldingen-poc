import './contacts.html';
import { Contacts, ContactsSchema } from '/imports/api/collections/contacts.js';
 
Template.contacts.helpers({
	'contacts': function() {
		return Contacts.find({});
	}
});

Template.contacts.events({
  'submit .new-contact'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const name = target.name.value;
	const email = target.email.value;
 
    // Insert a contact into the collection
    Contacts.insert({
		name: name,
		email: email
	});
 
    // Clear form
    target.name.value = '';
	target.email.value = '';
  }
});

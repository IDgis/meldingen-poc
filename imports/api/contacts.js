/*
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check';
import { Contacts } from '/import/collections/contacts.js';

Meteor.methods({
  'contacts.insert'(name, email) {
    check(name, String);
	check(email, String);
 
    Contacts.insert({
      name,
	  email,
	  createdAt: new Date(),
      lastUpdated: new Date(),
    });
  },
});
*/
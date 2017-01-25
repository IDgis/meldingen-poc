import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ContactsSchema = new SimpleSchema({
  name: {
    type: String,
    min: 3,
    max: 20
  },
  email: {
    type: String
  },
  createdAt: {
    type: Date,
    optional: true
  },
  lastUpdated: {
    type: Date,
    optional: true
  }
});

export const Contacts = new Mongo.Collection('Contacts');

Contacts.attachSchema(ContactsSchema);

Contacts.allow({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	}
});
 
if (Meteor.isCordova) {
  Ground.Collection(Contacts);
}
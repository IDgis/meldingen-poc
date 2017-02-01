import { Message } from '/imports/api/collections/message.js';

Meteor.startup(function() {
	Meteor.publish('message', function() {
		return Message.find();
	});
});
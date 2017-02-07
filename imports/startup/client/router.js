import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import '/imports/ui/main.js';
import '/imports/ui/message/message.js';

Router.configure({
	layoutTemplate: 'main'
});

Router.route('/', function () {
	this.render('message');
	}, {
		name: 'message'
});

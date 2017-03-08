import { Meteor } from 'meteor/meteor';

Meteor.startup(function() {
	Meteor.subscribe('message');
	Meteor.subscribe('afdelingen');
	Meteor.subscribe('contracten');
});
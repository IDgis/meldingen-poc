import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import '/imports/ui/main.js';
import '/imports/ui/map/map.js';

Router.configure({
	layoutTemplate: 'main'
});

Router.route('/', function () {
	Router.go('mapTemplate');
});

Router.route('/meldingen', function () {
	this.render('mapTemplate');
	}, {
		name: 'mapTemplate'
});
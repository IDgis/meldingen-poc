import { Meteor } from 'meteor/meteor';
import { Afdelingen } from '/imports/api/collections/afdelingen.js';
import { Contracten } from '/imports/api/collections/contracten.js';
import { Message } from '/imports/api/collections/message.js';

Meteor.startup(function() {
	Afdelingen.remove({});
	Contracten.remove({});
	
	populate(Afdelingen, 'json/afdelingen.geojson');
	populate(Contracten, 'json/contracten.geojson');
	
	Meteor.publish('afdelingen', function() {
		return Afdelingen.find();
	});
	
	Meteor.publish('contracten', function() {
		return Contracten.find();
	});
	
	Meteor.publish('message', function() {
		return Message.find();
	});
});

function populate(collection, source) {
	JSON.parse(Assets.getText(source)).features.forEach(function (doc) {
		collection.insert(doc);
	});
};

import { Mongo } from 'meteor/mongo';

export const Contracten = new Mongo.Collection('contracten');

Contracten.allow({
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

Ground.Collection(Contracten);
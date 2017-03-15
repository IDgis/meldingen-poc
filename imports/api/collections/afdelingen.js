import { Mongo } from 'meteor/mongo';

export const Afdelingen = new Mongo.Collection('afdelingen');

Afdelingen.allow({
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

Ground.Collection(Afdelingen);

// Afdelingen._ensureIndex({geometry : '2dsphere'});
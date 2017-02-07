import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const MessageSchema = new SimpleSchema({
  coordinates: {
    type: [String]
  },
  type: {
    type: String,
    label: 'Type',
    allowedValues: ["waarneming", "controle_nodig"],
    
    autoform: {
    	options: [
    		{label: 'waarneming', value: 'waarneming'},
    		{label: 'controle nodig', value: 'controle_nodig'}
    	]
    }
  },
  date: {
    type: Date,
    label: 'Datum'
  },
  description: {
    type: String,
    label: 'Beschrijving',
    
    autoform: {
    	rows: 4
    }
  },
  status: {
    type: String,
    label: 'Status',
    allowedValues: ['controle', 'afgehandeld', 'ter_goedkeuring'],
    
    autoform: {
    	options: [
    		{label: 'controle', value: 'controle'},
    		{label: 'afgehandeld', value: 'afgehandeld'},
    		{label: 'ter goedkeuring', value: 'ter_goedkeuring'}
    	]
    }
  }
});

export const Message = new Mongo.Collection('message');
Message.attachSchema(MessageSchema);

Message.allow({
	insert: function() {return true;},
	update: function() {return true;},
	remove: function() {return true;}
});
 
Ground.Collection(Message);
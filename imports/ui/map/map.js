import { Afdelingen } from '/imports/api/collections/afdelingen.js';
import { Message, MessageSchema } from '/imports/api/collections/message.js';

import './map.html';
import './map.css';

Template.mapTemplate.onRendered(function () {
	const markers = new Array();
	const map = L.map('map').setView([52.2, 5.3], 9);
	const geoJsonLayer = L.geoJson();
	
	map.on('click', onMapClick);

	L.tileLayer('maps/{z}/{x}/{y}.png').addTo(map);
	
	geoJsonLayer.setStyle({
			style: function (feature) {
				return {
					fillColor: 'red'
				};
			},
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.afdeling);
			}
		});
	
	geoJsonLayer.addTo(map);

	var initializing = true;
	Afdelingen.find().observeChanges({
		added: function (id, fields) {
			if (!initializing) {
				map.spin(true);
				updateLayer(geoJsonLayer, Afdelingen.find());
				map.spin(false);
			}
		},
		changed: function (id, fields) {
			if (!initializing) {
				map.spin(true);
				updateLayer(geoJsonLayer, Afdelingen.find());
				map.spin(false);
			}
		},
		removed: function (id) {
			if (!initializing) {
				map.spin(true);
				updateLayer(geoJsonLayer, Afdelingen.find());
				map.spin(false);
			}
		}
	});
	initializing = false;
	
	Message.find().observeChanges({
		added: function (id, fields) {
			addMarker(markers, fields.coordinates, fields.description);
		},
		removed: function (id) {
			removeMarker('someID');
		}
	});
	
	/*
	Tracker.autorun(function () {
		console.log('collection changed, clearing layer');
		
		geoJsonLayer.clearLayers();
		
		geoJsonLayer.eachLayer(function (layer) {
			console.log('not cleared');
		});
		
		console.log('adding ' + Afdelingen.find().count() + ' features');

		Afdelingen.find().forEach(function (feature) {
			geoJsonLayer.addData(feature);
		});
	});
	*/
});

function updateLayer(geoJsonLayer, features) {
	console.log('collection changed, clearing layer');
	
	geoJsonLayer.clearLayers();
	
	console.log('adding ' + Afdelingen.find().count() + ' features');

	features.forEach(function (feature) {
		geoJsonLayer.addData(feature);
	});
}

function addMarker(markers, coordinates, info) {
	var marker = new L.marker(coordinates[0], coordinates[1]);
	marker.bindPopup(info);
	markers.push(marker);
	map.addLayer(marker);
}

function removeMarker(id) {
	// TODO
	console.log('removing marker is not implemented');
}

function onMapClick(e) {
	const latlng = e.latlng;
	$('#message-input-modal').modal();
	$('#js-form-message-coordinates').attr('value', latlng.lat + ',' + latlng.lng);
}

Template.mapTemplate.events({
	'click #js-message-submit': function() {
		$('#message-input-modal').modal('hide');
	}
});

Template.mapTemplate.helpers({
	messageDoc: function() {
		return null;
	},
	message: function() {
		return Message;
	},
	messageSchema: function() {
		return MessageSchema;
	},
	messageLayers: function() {
		Message.find().fetch();
	}
});

AutoForm.addHooks('messageform', {
	onSubmit: function (insertDoc, updateDoc, currentDoc) {
			Message.insert(insertDoc);
			this.done();
			return false;
		},
	postsForm: {
		docToForm: function (doc) {
			if (_.isArray(doc.coordinates)) {
				doc.coordinates = doc.coordinates.join(", ");
			}
			return doc;
		},
		formToDoc: function(doc) {
			if(typeof doc.coordinates === "string") {
				doc.coordinates = doc.coordinates.split(",");
			}
			
			return doc;
		}
	}
});

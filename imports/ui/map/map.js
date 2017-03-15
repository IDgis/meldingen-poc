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

	var self = this;
	
	self.autorun(function() {
		if (Meteor.status().connected) {
			var initialized = false;
			
			Meteor.subscribe('afdelingen', function() {
				console.log('afdelingen subscription finished');
				
				updateLayer(geoJsonLayer, Afdelingen.find());
				/*
				Afdelingen.find().observe({
					added: function (doc) {
						if (initialized) {
							updateLayer(geoJsonLayer, Afdelingen.find());
						}
					},
					changed: function (doc) {
						if (initialized) {
							updateLayer(geoJsonLayer, Afdelingen.find());
						}
					},
					removed: function (doc) {
						if (initialized) {
							updateLayer(geoJsonLayer, Afdelingen.find());
						}
					}
				});
				*/
			});
			
			initialized = true;
			
			Meteor.subscribe('message', function() {
				console.log('message subscription finished');
				
				Message.find().observeChanges({
					added: function (id, fields) {
						addMarker(markers, fields.coordinates, fields.description, map);
					},
					removed: function (id) {
						removeMarker('someID');
					}
				});
			});
			
			Meteor.subscribe('contracten');
		};
	});
});

function updateLayer(geoJsonLayer, features) {
	console.log('collection changed, clearing layer');
	
	geoJsonLayer.clearLayers();
	
	console.log('adding ' + Afdelingen.find().count() + ' features');

	features.forEach(function (feature) {
		geoJsonLayer.addData(feature);
	});
}

function addMarker(markers, coordinates, info, map) {
	console.log('adding marker at [' + coordinates[0] + ', ' + coordinates[1] + ']');
	
	var defaultIcon = L.icon({
		iconUrl: 'images/location.svg',
		iconSize:     [32, 32], // size of the icon
		iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
		popupAnchor:  [0, -4] // point from which the popup should open relative to the iconAnchor
	});
	
	// const iconStyle = new ol.style.Style({
		// image: new ol.style.Icon(({
			// anchor: [0.5, 32],
			// anchorXUnits: 'fraction',
			// anchorYUnits: 'pixels',
			// opacity: 0.75,
			// src: 'images/location.svg',
			// size: [32, 32]
		// }));
	// });
	
	var marker = new L.marker([coordinates[0], coordinates[1]], {icon: defaultIcon});
	marker.bindPopup(info);
	markers.push(marker);
	marker.addTo(map);
}

function removeMarker(id) {
	// TODO
	console.log('removing marker is not implemented');
}

function onMapClick(e) {
	const latlng = e.latlng;
	console.log('map clicked at [' + latlng.lat + ', ' + latlng.lng + ']');
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
			console.log('inserting doc');
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

import './message.html';
import './message.css';

import { Message, MessageSchema } from '/imports/api/collections/message.js';

var map;

const iconStyle = new ol.style.Style({
		image: new ol.style.Icon(({
		anchor: [0.5, 32],
		anchorXUnits: 'fraction',
		anchorYUnits: 'pixels',
		opacity: 0.75,
		src: 'images/location.svg',
		size: [32, 32]
	}))
});

Template.message.onRendered(function () {
	var projection = new ol.proj.Projection({
		code: 'EPSG:3857',
		extent: [-20026376.39, -20048966.10, 20026376.39, 20048966.10]
	});

	var view = new ol.View({
		projection: projection,
		center: [638402.060238, 6729515.970227],
		zoom: 8
	});

	var zoomControl = new ol.control.Zoom();
	
	var achtergrond = new ol.layer.Tile({
	    source: new ol.source.OSM({
	    	url: 'maps/{z}/{x}/{y}.png'
	    })
	});
	
	var afdelingen = new ol.layer.Vector({
		source: new ol.source.Vector({
			url: 'geojson/test.geojson',
			format: new ol.format.GeoJSON()
		})
	});

	map = new ol.Map({
		layers: [achtergrond, afdelingen],
		control: zoomControl,
		interactions: ol.interaction.defaults({doubleClickZoom :false}),
		target: 'map',
		view: view
	});
	
	map.on('singleclick', function(e) {
		$('#message-input-modal').modal();
		
		$('#js-form-message-coordinates').attr('value', e.coordinate[0] + ',' + e.coordinate[1]);
	});
	
	map.on('dblclick', function(e) {
		var features = afdelingen.getSource().getFeaturesAtCoordinate(e.coordinate);
		
		var elements = [$('#js-afdelingen-zero-found'), $('#js-afdelingen-afdeling'),
			$('#js-afdelingen-afdelingsopp'), $('#js-afdelingen-beheerregio'),
			$('#js-afdelingen-beheertype'), $('#js-afdelingen-beheertypecode'),
			$('#js-afdelingen-functie')];
		
		for(var i = 0; i < features.length;) {
			var props = features[i].getProperties();
			
			cleanElements(elements);
			
			$('#js-afdelingen-afdeling').append('<b>Afdeling</b>: ' + props.afdeling);
			$('#js-afdelingen-afdelingsopp').append('<b>Afdelingsoppervlakte</b>: ' + props.afdelingsopp);
			$('#js-afdelingen-beheerregio').append('<b>Beheerregio</b>: ' + props.beheerregio);
			$('#js-afdelingen-beheertype').append('<b>Beheertype</b>: ' + props.beheertype);
			$('#js-afdelingen-beheertypecode').append('<b>Beheertypecode</b>: ' + props.beheertypecode);
			$('#js-afdelingen-functie').append('<b>Functie</b>: ' + props.functie);
			
			break;
		}
		
		if(features.length === 0) {
			cleanElements(elements);
			
			$('#js-afdelingen-zero-found').append('Niets gevonden.');
		}
		
		$('#afdelingen-info-modal').modal();
	});
	
	// The subscription of messages and addition of icon layers is called here because the map object must be initialized first
	var self = this;
	self.autorun(function () {
		if (Meteor.status().connected) {
			Meteor.subscribe('message');
		};
	});

	Message.find().observeChanges({
		added: function (id, fields) {
			// console.log("doc changed with id " + id + " and coordinates (" + fields.coordinates[0] + ", " + fields.coordinates[1] + ")");
			addIconLayer(id, fields.coordinates, iconStyle);
		},
		changed: function (id, fields) {
			// console.log("doc changed with id " + id + " and coordinates (" + fields.coordinates[0] + ", " + fields.coordinates[1] + ")");
			removeIconLayer(id);
			addIconLayer(id, fields.coordinates, iconStyle);
		},
		removed: function (id) {
			// console.log("doc removed with id " + id);
			removeIconLayer(id);
		}
	});
});

function addIconLayer(id, coordinates, iconStyle) {
	var coordinateX = parseInt(coordinates[0], 10);
	var coordinateY = parseInt(coordinates[1], 10);

	var iconFeature = new ol.Feature({
			geometry: new ol.geom.Point(coordinates)
		});

	var vectorLayer = new ol.layer.Vector({
			id: id,
			source: new ol.source.Vector({
				features: [iconFeature]
			})
		});

	iconFeature.setStyle(iconStyle);
	map.addLayer(vectorLayer);
};

function removeIconLayer(id) {
	console.log("remove " + id);
	var mapLayers = map.getLayers();
	
	console.log(mapLayers.length + " layers");
	
	for(var i = 0; i < mapLayers.length; i++) {
		var mapLayer = mapLayers[i];
		if (mapLayer.id === id) {
			map.removeLayer(mapLayer);
		}
	}
}

Template.message.helpers({
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

function cleanElements(array) {
	array.forEach(function(item) {
		item.empty();
	});
}

Template.message.events({
	'click #js-message-submit': function() {
		$('#message-input-modal').modal('hide');
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
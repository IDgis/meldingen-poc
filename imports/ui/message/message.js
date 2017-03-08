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
		code: 'EPSG:28992',
		extent: [170000, 300000, 213000, 412000]
	});

	var view = new ol.View({
		projection: projection,
		center: [191500, 356000],
		zoom: 2
	});

	var zoomControl = new ol.control.Zoom();
	
	var resolutions = 
		[3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21];
	var matrixIds0 = $.map(resolutions, function(resolution) {
		var indexResolution = resolutions.indexOf(resolution);
		return 'EPSG:28992' + ':' + indexResolution;
	});
	
	var tileExtent = [-285401.920000, 22598.080000, 595401.920000, 903401.920000];
	var tileOrigin = [-285401.920000, 22598.080000]
	
	var tileGrid0 = new ol.tilegrid.WMTS({
		origin: tileOrigin,
		resolutions: resolutions,
		matrixIds: matrixIds0
	});

	var achtergrond = new ol.layer.Tile({
		preload: 1,
		source: new ol.source.TileImage({
			crossOrigin: null,
			extent: tileExtent,
			projection: new ol.proj.Projection({
				code: 'EPSG:28992',
				extent: tileExtent
			}),
			tileGrid: tileGrid0,
			tileUrlFunction: function(coordinate) {
				if(coordinate === null) {
					return undefined;
				}

                var z = coordinate[0];
                var x = coordinate[1];
                var y = coordinate[2];
                var url = 'maps/' + z + '/' + x + '/' + y + '.png';
                return url;
            }
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
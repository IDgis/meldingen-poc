import './message.html';
import './message.css';

import { Message, MessageSchema } from '/imports/api/collections/message.js';
 
Template.message.onRendered(function() {
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
	var matrixIds0 = [];
	matrixIds0 = $.map(resolutions, function(resolution) {
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
		target: 'map',
		view: view
	});
	
	map.on('singleclick', function(e) {
		$('#message-input-modal').modal();
		
		$('#js-form-message-coordinates').attr('value', e.coordinate[0] + ',' + e.coordinate[1]);
	});
});

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
		var messages = Message.find().fetch();
	}
});

AutoForm.addHooks('messageform', {
	postsForm: {
		docToForm: function(doc) {
			if(_.isArray(doc.coordinates)) {
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
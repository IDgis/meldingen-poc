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

	var tileGrid0 = new ol.tilegrid.WMTS({
		origin: [-285401.920, 903401.920],
		resolutions: resolutions,
		matrixIds: matrixIds0
	});

	var achtergrond = new ol.layer.Tile({
		opacity: 0.8,
		extent: [-285401.92, 22598.08, 595401.9199999999, 903401.9199999999],
		source : new ol.source.WMTS({
			attributions: [],
			url: '//geodata.nationaalgeoregister.nl/wmts',
			layer: 'brtachtergrondkaartgrijs',
			matrixSet: 'EPSG:28992',
			format: 'image/png',
			tileGrid: tileGrid0,
			style: 'default'
		}),
		visible: true
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
});

Template.message.helpers({
	'message': function() {
		return Message.find();
	}
});

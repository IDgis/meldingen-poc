import './message.html';
import './message.css';

import { Message, MessageSchema } from '/imports/api/collections/message.js';
 
Template.message.onRendered(function() {
	var projection = new ol.proj.Projection({
		code: 'EPSG:28992',
		extent: [185130.30300000, 331786.35260000, 186691.93210000, 333634.55600000]
	});

	var view = new ol.View({
		projection: projection,
		center: [185911, 332710],
		zoom: 1
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

	map = new ol.Map({
		layers: [achtergrond],
		control: zoomControl,
		target: 'map',
		view: view
	});
});

Template.message.helpers({
	'contacts': function() {
		return Contacts.find({});
	}
});

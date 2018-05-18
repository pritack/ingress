// ==UserScript==
// @id             iitc-plugin-basemap-yahoo
// @name           IITC plugin: Yahoo map
// @category       Map Tiles
// @version        0.0.1.@@DATETIMEVERSION@@
// @namespace      https://github.com/pritack/ingress
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Add a blank map layer - no roads or other features.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==

//@@PLUGINSTART@@

// PLUGIN START ////////////////////////////////////////////////////////


L.YahooLayer = L.TileLayer.extend({

    getTileUrl: function (tilePoint) {
        //lat
        var coordy = (tilePoint.y / Math.pow(2, tilePoint.z)) * 2 * Math.PI - Math.PI;
        var _lat1 = 2 * Math.atan(Math.pow(Math.E, -coordy)) * 180 / Math.PI - 90;
        var coordy2 = ((tilePoint.y + 1) / Math.pow(2, tilePoint.z)) * 2 * Math.PI - Math.PI;
        var _lat2 = 2 * Math.atan(Math.pow(Math.E, -coordy2)) * 180 / Math.PI - 90;
        var _lat = _lat1 + (_lat2 - _lat1) / 2;

        //lng
        var _lng1 = (tilePoint.x / Math.pow(2, tilePoint.z)) * 360 - 180;
        var _lng2 = ((tilePoint.x + 1) / Math.pow(2, tilePoint.z)) * 360 - 180;
        var _lng = _lng1 + (_lng2 - _lng1) / 2;

        //zoom
        var _z = tilePoint.z + 1;

        return L.Util.template(this._url, L.extend({
            z: _z,
            x: _lat,
            y: _lng
        }, this.options));
    }
});

function wrapper(plugin_info) {
    if (typeof window.plugin !== 'function') window.plugin = function () { };

    plugin_info.buildName = 'yahoo-japan-map';
    plugin_info.dateTimeVersion = '201805171800';
    plugin_info.pluginId = 'yahoo-japan-map';

    var setup = function () {
		//API Key
        var yahooApiKey = 'dj0zaiZpPVVNaHJ0MElNSVJ3dSZzPWNvbnN1bWVyc2VjcmV0Jng9YmQ-';
		
		//Base URL
		var yahooBaseURL = 'https://map.yahooapis.jp/map/V1/static?appid=';
		
		//lat,lon,size URL
		var fixedParamURL = '&lat={x}&lon={y}&z={z}&width=256&height=256';

		//Yahoo Rainfall Map
        var yahooRainOpt = { attribution: 'Yahoo Rainfall Map', maxNativeZoom: 18, maxZoom: 21 };
        var yahooRainfall = new L.YahooLayer(yahooBaseURL + yahooApiKey +  fixedParamURL + '&scalebar=off&overlay=type:rainfall|datelabel:off', yahooRainOpt);
        layerChooser.addBaseLayer(yahooRainfall, 'Yahoo Rainfall Map');

		//Yahoo Map
        var yahooOpt = { attribution: 'Yahoo Map', maxNativeZoom: 18, maxZoom: 21 };
        var yahoo = new L.YahooLayer(yahooBaseURL + yahooApiKey +  fixedParamURL + '&scalebar=off', yahooOpt);
        layerChooser.addBaseLayer(yahoo, 'Yahoo Map');

		//Yahoo Photo Map
        var yahooPhotoOpt = { attribution: 'Yahoo Photo Map', maxNativeZoom: 18, maxZoom: 21 };
        var yahooPhoto = new L.YahooLayer(yahooBaseURL + yahooApiKey +  fixedParamURL + '&mode=photo&scalebar=off', yahooPhotoOpt);
        layerChooser.addBaseLayer(yahooPhoto, 'Yahoo Photo Map');
		
		//Yahoo Hybrid Map
        var yahooHybridOpt = { attribution: 'Yahoo Hybrid Map', maxNativeZoom: 18, maxZoom: 21 };
        var yahooHybrid = new L.YahooLayer(yahooBaseURL + yahooApiKey +  fixedParamURL + '&mode=hybrid&scalebar=off', yahooHybridOpt);
        layerChooser.addBaseLayer(yahooHybrid, 'Yahoo Hybrid Map');
		
		//Yahoo HD Map
        var yahooHDOpt = { attribution: 'Yahoo HD Map', maxNativeZoom: 18, maxZoom: 21 };
        var yahooHD = new L.YahooLayer(yahooBaseURL + yahooApiKey +  fixedParamURL + '&mode=hd&scalebar=off', yahooHDOpt);
        layerChooser.addBaseLayer(yahooHD, 'Yahoo HD Map');
    };

    setup.info = plugin_info; //add the script info data to the function as a property
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);

    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();

};

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);

// PLUGIN END //////////////////////////////////////////////////////////

//@@PLUGINEND@@

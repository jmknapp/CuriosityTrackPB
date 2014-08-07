var map, layer;
var mapBounds_full = new OpenLayers.Bounds(-180.000000, -90.0, 180.0, 90.0);
var mapBounds_crop1 = new OpenLayers.Bounds(-180.000000, 59.998822, 179.996920, 85.051129);
var mapBounds_crop2 = new OpenLayers.Bounds(-180.000000, 30.001135, 179.996611, 60.000000);
var mapBounds_crop3 = new OpenLayers.Bounds(-180.000000, 0.001074, 179.999825, 30.000000);
var mapBounds_crop4 = new OpenLayers.Bounds(-180.000000, -29.999070, 179.999825, 0.000000);
var mapBounds_crop5 = new OpenLayers.Bounds(-180.000000, -59.999344, 179.996611, -30.000000);
var mapBounds_crop6 = new OpenLayers.Bounds(-180.000000, -85.051129, 179.996920, -60.000000);
var mapBounds_ctx = new OpenLayers.Bounds(136.696260, -5.333154, 137.862717, -4.132530);
var mapBoundsBASE = new OpenLayers.Bounds( 137.380794, -4.64535890429, 137.465011675, -4.53738741241);
var mapBoundsLR018854 = new OpenLayers.Bounds( 137.359362, -4.679285, 137.401471, -4.637177);
var mapBoundsLR09650 = new OpenLayers.Bounds(137.252440, -4.801559, 137.377471, -4.665560);
var mapBoundsLR09149 = new OpenLayers.Bounds(137.348560, -4.789745, 137.469506, -4.654738);

var mapMinZoom = 8;
var mapMaxZoom = 8;
var mapMinZoomCTX = 8;
var mapMaxZoomCTX = 14;
var mapMinZoomHiRISE = 11;
var mapMaxZoomHiRISE = 18;
var mapMinZoomHiRISE09650 = 11;
var mapMaxZoomHiRISE09650 = 18;
var mapMinZoomHiRISE09149 = 11;
var mapMaxZoomHiRISE09149 = 18;
var mapMinZoomHiRISE18854 = 13;
var mapMaxZoomHiRISE18854 = 18;
var defaultzoom = 18 ;
var urlzoom ;
var urlcenterlon ;
var urlcenterlat ;
var xmarker = 15297848 ;
var ymarker = -511657 ;
var landingxoffset = 1860 ;
var landingyoffset = -47 ;
var landingx=landingxoffset+xmarker ;
var landingy=landingyoffset+ymarker ;
var lonlat ;
var toastbusy = 0;
var showtools = 0 ;
var scaleline ;

var mvnzoom = 8 ;

// load overall track
function getlastdrive() {
  $.ajax({
     type: "GET",
     url: "http://curiosityrover.com/tracking/ajax/lastdrive.php",
     dataType: "html",
     success: function(data) {
        $('#driveBtn').html(data) ;
      },
     error: function(xhr, status, error) {
       alert('getlastdrive ' + status);
     }
  });
}

// load overall track
function driveinfotoast() {
  traverse = new Array() ;
  var scale = 1.88/4 ;
  if (toastbusy != 1) {
    toastbusy = 1 ;
    $.ajax({
       type: "GET",
       url: "http://curiosityrover.com/tracking/ajax/driveinfotoast.php",
       dataType: "html",
       success: function(data) {
	  $().toastmessage({stayTime : 10000});
	  $().toastmessage({close : function(){toastbusy = 0}});
	  $().toastmessage('showNoticeToast', data);
        },
       error: function(xhr, status, error) {
         alert('getdriveinfo ' + status);
         }
         });
    };
}

// load overall track
function gettrack() {
  traverse = new Array() ;
  var scale = 1.88/4 ;
  $.ajax({
     type: "GET",
     url: "http://curiosityrover.com/tracking/json/odom.json",
     dataType: "json",
     success: function(data) {
       $.each(data, function(){
       traverse.push(new OpenLayers.Geometry.Point(landingx+scale*this.x,landingy-scale*this.y));
       });
       getdrive();
      },
     error: function(xhr, status, error) {
       alert('gettrack ' + status);
     }
  });
}

function getdrive() {
drive = new Array() ;
var scale = 1.88/4 ;
$.ajax({
   type: "GET",
   url: "http://curiosityrover.com/tracking/json/lastdrive.json",
   dataType: "json",
   success: function(data) {
     $.each(data, function(){
     drive.push(new OpenLayers.Geometry.Point(landingx+scale*this.x,landingy-scale*this.y));
     });
     init() ;
    },
   error: function(xhr, status, error) {
     alert('getdrive ' + status);
   }
  });
}

function tend() {
	scaleline.update() ;
}

function init() {
	var mapdiv = document.getElementById("mapdiv") ;
	var slmax = mapdiv.offsetWidth/5 ;
	if (slmax > 100)
		slmax = 100 ;
	scaleline = new OpenLayers.Control.ScaleLine({maxWidth: slmax}) ;
  var options = {
    controls: [
      new OpenLayers.Control.Navigation(),
      //new OpenLayers.Control.PanPanel(),
      //new OpenLayers.Control.ZoomPanel(),
      //new OpenLayers.Control.LayerSwitcher({'ascending':false}),
      scaleline,
      new OpenLayers.Control.KeyboardDefaults()
    ],
eventListeners: {
        "zoomend": tend
    },
    projection: "EPSG:900913",
    displayProjection: "EPSG:4326",
    units: "m",
    numZoomLevels: 19,
    maxResolution: 156543.0339,
    maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34)
  };

  this.urlzoom = $.urlParam('zoom') ;
  this.urlcenterlat = $.urlParam('lat') ;
  this.urlcenterlon = $.urlParam('lon') ;

  map = new OpenLayers.Map('mapdiv', options);

  crop1 = new OpenLayers.Layer.TMS("Mars_Viking_90N_60N", "https://s3.amazonaws.com/GaleMap1/MV1TMS/${z}/${x}/${y}.png", {
    transitionEffect: 'resize',
    numZoomLevels: mvnzoom,
    type: 'png', getURL: overlay_getTileURLmv1,
    isBaseLayer: false
  });

  crop2 = new OpenLayers.Layer.TMS("Mars_Viking_60N_30N", "https://s3.amazonaws.com/GaleMap1/MV2TMS/${z}/${x}/${y}.png", {
    transitionEffect: 'resize',
    kkmZoomLevels: mvnzoom,
    type: 'png', getURL: overlay_getTileURLmv2,
    isBaseLayer: false
  });

  crop3 = new OpenLayers.Layer.TMS("Mars_Viking_30N_0", "https://s3.amazonaws.com/GaleMap1/MV3TMS/${z}/${x}/${y}.png", {
    transitionEffect: 'resize',
    numZoomLevels: mvnzoom,
    type: 'png', getURL: overlay_getTileURLmv3,
    isBaseLayer: false
  });

  crop4 = new OpenLayers.Layer.TMS("Mars_Viking_0_30S", "https://s3.amazonaws.com/GaleMap1/MV4TMS/${z}/${x}/${y}.png", {
    transitionEffect: 'resize',
    numZoomLevels: mvnzoom,
    type: 'png', getURL: overlay_getTileURLmv4,
    isBaseLayer: false
  });

  crop5 = new OpenLayers.Layer.TMS("Mars_Viking_30S_60S", "https://s3.amazonaws.com/GaleMap1/MV5TMS/${z}/${x}/${y}.png", {
    transitionEffect: 'resize',
    numZoomLevels: mvnzoom,
    type: 'png', getURL: overlay_getTileURLmv5,
    isBaseLayer: false
  });

  crop6 = new OpenLayers.Layer.TMS("Mars_Viking_60S_90S", "https://s3.amazonaws.com/GaleMap1/MV6TMS/${z}/${x}/${y}.png", {
    transitionEffect: 'resize',
    numZoomLevels: mvnzoom,
    type: 'png', getURL: overlay_getTileURLmv6,
    isBaseLayer: false
  });

  ctx = new OpenLayers.Layer.XYZ("MRO CTX", "https://s3.amazonaws.com/GaleMap1/GaleCTXadj4/${z}/${x}/${y}.png", {
    transitionEffect: 'resize',
    type: 'png',
    alpha: false,
    isBaseLayer: false,
    minZoomLevel: 8,
    maxZoomLevel: 14,
    numZoomLevels: 19,
    getURL: ctxTileURL
  });

  var tmsoverlay = new OpenLayers.Layer.TMS( "HiRISE", "https://s3.amazonaws.com/GaleMap1/trans/",
	{   // url: '', serviceVersion: '.', layername: '.',
	                        type: 'png', getURL: overlay_getTileURL, alpha: false,
	                        isBaseLayer: false
	});

  var tmsoverlayLR018854 = new OpenLayers.Layer.TMS( "HiRISE ESP018854", "https://s3.amazonaws.com/GaleMap1/LR018854test/",
    {   // url: '', serviceVersion: '.', layername: '.',
                            type: 'png', getURL: overlay_getTileURL_LR018854, alpha: false,
                            isBaseLayer: false
    });

  var tmsoverlayLR09149 = new OpenLayers.Layer.TMS( "HiRISE ESP09149", "https://s3.amazonaws.com/GaleMap1/hirise09149b/",
    {   // url: '', serviceVersion: '.', layername: '.',
                            type: 'png', getURL: overlay_getTileURL_LR09149, alpha: false,
                            isBaseLayer: false
    });

  var tmsoverlayLR09650 = new OpenLayers.Layer.TMS( "HiRISE ESP09650", "https://s3.amazonaws.com/GaleMap1/hirise09650i/",
    {   // url: '', serviceVersion: '.', layername: '.',
                            type: 'png', getURL: overlay_getTileURL_LR09650, alpha: false,
                            isBaseLayer: false
    });


  var osm = new OpenLayers.Layer.OSM();
  var baseLayer = new OpenLayers.Layer("Blank",{isBaseLayer: true});


  var size = new OpenLayers.Size(24,30);
  var offset = new OpenLayers.Pixel(-(size.w)-1, -size.h/2);
  var mslsize = new OpenLayers.Size(32,32);
  var msloffset = new OpenLayers.Pixel(-(mslsize.w/2), -mslsize.h + 5);
  var icon1 = new OpenLayers.Icon('http://curiosityrover.com/rayb24.png', size, offset);
  var mslicon = new OpenLayers.Icon('http://curiosityrover.com/mslicon.png', mslsize, msloffset);
  var siteicon = new OpenLayers.Icon('http://curiosityrover.com/siteicon.png', mslsize, msloffset);

  var markers = new OpenLayers.Layer.Markers( "Markers" );
  var landingmarker = new OpenLayers.Marker(new OpenLayers.LonLat(landingx,landingy),icon1);
  landingmarker.events.register('mousedown', landingmarker, function(evt) { alert("Bradbury Landing"); OpenLayers.Event.stop(evt); });
  markers.addMarker(landingmarker);
  //var marker = new OpenLayers.Marker(new OpenLayers.LonLat(landingx-6488.975,landingy-7772.826160),mslicon);
  var marker = new OpenLayers.Marker(new OpenLayers.LonLat(traverse[traverse.length-1].x,traverse[traverse.length-1].y),mslicon);
  marker.events.register('mousedown', marker, function(evt) { alert("Curiosity"); OpenLayers.Event.stop(evt); });
  markers.addMarker(marker);

  var site4marker = new OpenLayers.Marker(new OpenLayers.LonLat(landingx,landingy),siteicon);
  site4marker.events.register('mousedown', site4marker, function(evt) { alert("MSL Site 4"); OpenLayers.Event.stop(evt); });

  var mtsharpmarker = new OpenLayers.Marker(new OpenLayers.LonLat(landingx-10550.3,landingy-10615.0),siteicon);
  mtsharpmarker.events.register('mousedown', mtsharpmarker, function(evt) { alert("Mt. Sharp entrance"); OpenLayers.Event.stop(evt); });
  markers.addMarker(mtsharpmarker);

  var start_point = new OpenLayers.Geometry.Point(landingx,landingy);
  var end_point = new OpenLayers.Geometry.Point(landingx+100,landingy+100);

  var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
        {fill: true, fillColor: "black", fillOpacity: 1.0, strokeDashstyle: "solid", strokeOpacity: 0.6, strokeColor: "yellow", strokeWidth: 1},
        OpenLayers.Feature.Vector.style["default"]));

  var styleMapBk = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
        {fill: true, fillColor: "black", fillOpacity: 1.0, strokeDashstyle: "solid", strokeOpacity: 0.6, strokeColor: "black", strokeWidth: 5},
        OpenLayers.Feature.Vector.style["default"]));

  var styleDrive = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
        {fill: true, fillColor: "blue", fillOpacity: 1.0, strokeDashstyle: "solid", strokeOpacity: 1.0, strokeColor: "blue", strokeWidth: 8},
        OpenLayers.Feature.Vector.style["default"]));

  var vector = new OpenLayers.Layer.Vector("Track", {styleMap: styleMap});
  var vectorbk = new OpenLayers.Layer.Vector("Track", {styleMap: styleMapBk});
  var vectordrive = new OpenLayers.Layer.Vector("Drive 219", {styleMap: styleDrive});
  vector.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(traverse))]);
  vectorbk.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(traverse))]);
  vectordrive.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(drive))]);

  map.addLayers([
      baseLayer,crop1,crop2,crop3,crop4,crop5,crop6,ctx,tmsoverlayLR09149,tmsoverlayLR018854,tmsoverlayLR09650,tmsoverlay,vectorbk,vector,vectordrive,markers
  ]);

  map.zoomToExtent( mapBoundsBASE.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBoundsLR018854.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBoundsLR09149.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBoundsLR09650.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBounds_crop1.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBounds_crop2.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBounds_crop3.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBounds_crop4.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBounds_crop5.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBounds_crop6.transform(map.displayProjection, map.projection ) );
  map.zoomToExtent( mapBounds_ctx.transform(map.displayProjection, map.projection ) );

  OpenLayers.Util.onImageLoadError = function () {
      this.src = "notile.png";
  } ;

  var projWGS84 = new OpenLayers.Projection("EPSG:4326");
  var proj900913 = new OpenLayers.Projection("EPSG:900913");

  if ((urlcenterlon != null) && (urlcenterlat != null)) {
  	centerlonlat = new OpenLayers.LonLat(urlcenterlon,urlcenterlat);
  	lonlat =  centerlonlat.transform(projWGS84,proj900913);
  }
  else
  	lonlat = new OpenLayers.LonLat(landingx+-6440.45,landingy+-7592.89);

  //lonlat = new OpenLayers.LonLat(landingx-6488.975,landingy-7772.826160);
  lonlat = new OpenLayers.LonLat(traverse[traverse.length-1].x,traverse[traverse.length-1].y) ;
  if (urlzoom != null)
  	map.setCenter(lonlat,urlzoom) ;
  else
  	map.setCenter(lonlat,18) ;

  //navigator.splashscreen.hide();
  $("#buttons").hide() ;
}

function recenter() {
  if (urlzoom != null)
  	map.setCenter(lonlat,urlzoom) ;
  else
  	map.setCenter(lonlat,18) ;
}

function ctxTileURL(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (this.map.baseLayer.name == 'Virtual Earth Roads' || this.map.baseLayer.name == 'Virtual Earth Aerial' || this.map.baseLayer.name == 'Virtual Earth Hybrid') {
       z = z + 1;
    }
	if (mapBounds_ctx.intersectsBounds( bounds ) && z >= mapMinZoomCTX && z <= mapMaxZoomCTX ) {
       //console.log( this.url + z + "/" + x + "/" + y + "." + this.type);
       return "https://s3.amazonaws.com/GaleMap1/GaleCTXadj4/"  + z + "/" + x + "/" + y + "." + this.type;
	} else {
		return "http://www.maptiler.org/img/none.png";
	}
}

function overlay_getTileURL_LR09149(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (this.map.baseLayer.name == 'Virtual Earth Roads' || this.map.baseLayer.name == 'Virtual Earth Aerial' || this.map.baseLayer.name == 'Virtual Earth Hybrid') {
       z = z + 1;
    }
	if (mapBoundsLR09149.intersectsBounds( bounds ) && z >= mapMinZoomHiRISE09149 && z <= mapMaxZoomHiRISE09149 ) {
       //console.log( this.url + z + "/" + x + "/" + y + "." + this.type);
       return this.url + z + "/" + x + "/" + y + "." + this.type;
	} else {
		return "http://www.maptiler.org/img/none.png";
	}
}

function overlay_getTileURL_LR09650(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (this.map.baseLayer.name == 'Virtual Earth Roads' || this.map.baseLayer.name == 'Virtual Earth Aerial' || this.map.baseLayer.name == 'Virtual Earth Hybrid') {
       z = z + 1;
    }
    if (mapBoundsLR09650.intersectsBounds( bounds ) && z >= mapMinZoomHiRISE09650 && z <= mapMaxZoomHiRISE09650 ) {
		//console.log( this.url + z + "/" + x + "/" + y + "." + this.type);
		return this.url + z + "/" + x + "/" + y + "." + this.type;
	} else {
		return "http://www.maptiler.org/img/none.png";
	}
}

function overlay_getTileURL(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (this.map.baseLayer.name == 'Virtual Earth Roads' || this.map.baseLayer.name == 'Virtual Earth Aerial' || this.map.baseLayer.name == 'Virtual Earth Hybrid') {
       z = z + 1;
    }
    if (mapBoundsBASE.intersectsBounds( bounds ) && z >= mapMinZoomHiRISE && z <= mapMaxZoomHiRISE ) {
		//console.log( this.url + z + "/" + x + "/" + y + "." + this.type);
		return this.url + z + "/" + x + "/" + y + "." + this.type;
	} else {
	   return "http://www.maptiler.org/img/none.png";
	}
}
	
function overlay_getTileURL_LR018854(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (this.map.baseLayer.name == 'Virtual Earth Roads' || this.map.baseLayer.name == 'Virtual Earth Aerial' || this.map.baseLayer.name == 'Virtual Earth Hybrid') {
       z = z + 1;
    }
    if (mapBoundsLR018854.intersectsBounds( bounds ) && z >= mapMinZoomHiRISE18854 && z <= mapMaxZoomHiRISE18854 ) {
   		//console.log( this.url + z + "/" + x + "/" + y + "." + this.type);
		return this.url + z + "/" + x + "/" + y + "." + this.type;
	} else {
		return "http://www.maptiler.org/img/none.png";
	}
}

function overlay_getTileURLmv1(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (z <= 8 && mapBounds_crop1.intersectsBounds( bounds )) {
        return "https://s3.amazonaws.com/GaleMap1/MV1TMS/" + z + "/" + x + "/" + y + "." + this.type;
    }
}
function overlay_getTileURLmv2(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (z <= 8 && mapBounds_crop2.intersectsBounds( bounds )) {
        return "https://s3.amazonaws.com/GaleMap1/MV2TMS/" + z + "/" + x + "/" + y + "." + this.type;
    }
}
function overlay_getTileURLmv3(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (z <= 8 && mapBounds_crop3.intersectsBounds( bounds )) {
        return "https://s3.amazonaws.com/GaleMap1/MV3TMS/" + z + "/" + x + "/" + y + "." + this.type;
    }
}
function overlay_getTileURLmv4(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (z <= 8 && mapBounds_crop4.intersectsBounds( bounds )) {
        return "https://s3.amazonaws.com/GaleMap1/MV4TMS/" + z + "/" + x + "/" + y + "." + this.type;
    }
}
function overlay_getTileURLmv5(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (z <= 8 && mapBounds_crop5.intersectsBounds( bounds )) {
        return "https://s3.amazonaws.com/GaleMap1/MV5TMS/" + z + "/" + x + "/" + y + "." + this.type;
    }
}
function overlay_getTileURLmv6(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    if (z <= 8 && mapBounds_crop6.intersectsBounds( bounds )) {
        return "https://s3.amazonaws.com/GaleMap1/MV6TMS/" + z + "/" + x + "/" + y + "." + this.type;
    }
}

function getWindowHeight() {
    if (self.innerHeight) return self.innerHeight;
    if (document.documentElement && document.documentElement.clientHeight)
        return document.documentElement.clientHeight;
    if (document.body) return document.body.clientHeight;
            return 0;
}

function getWindowWidth() {
        if (self.innerWidth) return self.innerWidth;
        if (document.documentElement && document.documentElement.clientWidth)
            return document.documentElement.clientWidth;
        if (document.body) return document.body.clientWidth;
            return 0;
}

function resize() {
        var map = document.getElementById("mapdiv");
        map.style.height = (getWindowHeight()-127) + "px";
        map.style.width = (getWindowWidth()-20) + "px";
        if (map.updateSize) { map.updateSize(); };
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function toolsBtnAction() {
    if (showtools == 1) {
	$("#buttons").hide() ;
	showtools = 0 ;
    }
    else {
	$("#buttons").show() ;
	showtools = 1 ;
    }
 }

function infoBtnAction() {
    recenter() ;
    driveinfotoast() ;
}

function shareBtnAction() {
    window.plugins.socialsharing.share('A cool Mars rover tracking app', 'Mars Rover tracking app', null, 'https://play.google.com/store/apps/details?id=com.curiositytrack')
}

function logBtnAction() {
    var ref = window.open(encodeURI('http://curiositylog.com'), '_system', 'location=yes');
}

function imgBtnAction() {
    var ref = window.open(encodeURI('http://curiosityrover.com'), '_system', 'location=yes');
}

function logGCMregistration(uuid,platform,model,version,regid) {
 $.ajax({
     type: "GET",
     url: "http://curiosityrover.com/tracking/ajax/logGCMregistration.php?regid="+regid+"&uuid="+uuid+"&platform="+platform+"&model="+model+"&version="+version,
     dataType: "html",
     success: function(data) {
        console.log("logged GCM reg id with server, ret=" + data) ;
      },
     error: function(xhr, status, error) {
        console.log("ERROR: couldn't log GCM reg id with server") ;
     }
  });
}

// result contains any message sent from the plugin call
function successHandler (result) {
    alert('result = ' + result);
}

// result contains any error description text returned from the plugin call
function errorHandler (error) {
    alert('error = ' + error);
}

// Android and Amazon Fire OS
function onNotification(e) {
    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
            $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            console.log("regID = " + e.regid);
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if ( e.foreground )
        {
            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

            // on Android soundname is outside the payload. 
            // On Amazon FireOS all custom attributes are contained within payload
            var soundfile = e.soundname || e.payload.sound;
            // if the notification contains a soundname, play it.
            var my_media = new Media("/android_asset/www/"+ soundfile);
            my_media.play();
        }
        else
        {  // otherwise we were launched because the user touched a notification in the notification tray.
            if ( e.coldstart )
            {
                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
            }
            else
            {
                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
            }
        }

       $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
           //Only works for GCM
       $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
       //Only works on Amazon Fire OS
       $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
    break;

    case 'error':
        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
    break;

    default:
        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
    break;
  }
}

onresize=function(){ resize(); };

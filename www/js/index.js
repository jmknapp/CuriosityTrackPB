/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
	if (device.platform == 'Android' || device.platform == 'android' ) {
		var pushNotification = window.plugins.pushNotification;
		pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"206191599947","ecb":"app.onNotificationGCM"});
	}
	else if (device.platform == 'iOS' || device.platform == 'ios' ) {
		var pushNotification = window.plugins.pushNotification;
		pushNotification.register(
                    app.tokenHandler,
                    app.errorHandler, {
                    "badge":"true",
                    "sound":"true",
                    "alert":"true",
                    "ecb":"app.onNotificationAPN"
                });
	}
	else if (device.platform == 'WinCE' || device.platform == 'Win32NT' ) {
alert("attempting WPN registration") ;
		pushNotification.register(
        		channelHandler,
        		errorHandler,
        		{
            		"channelName": channelName,
            		"ecb": "app.onNotificationWP8",
            		"uccb": "app.channelHandler",
            		"errcb": "app.jsonErrorHandler"
        	});
	}

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

// result contains any message sent from the plugin call
successHandler: function(result) {
    console.log('Callback Success! Result = '+result)
},

errorHandler:function(error) {
alert("in errorHandler") ;
    console.log(error);
},

tokenHandler:function(result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    //alert('device token = ' + result);
    if ( result.length > 0 )
    {
        console.log("APN Regid " + result);
        console.log('registration id = '+ result);
	logAPNregistration(device.uuid,device.platform,device.model,device.version,result) ;
    }
},

WPNuriHandler:function(uri) {
    alert('WPNuri = ' + uri);
    if ( uri.length > 0 )
    {
        console.log('WPN uri = '+ uri);
	logWPNregistration(device.uuid,device.platform,device.model,device.version,uri) ;
    }
},

onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("GCM Regid " + e.regid);
                    console.log('registration id = '+e.regid);
		    logGCMregistration(device.uuid,device.platform,device.model,device.version,e.regid) ;
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              console.log('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
 
            case 'error':
              console.log('GCM error = '+e.msg);
            break;
 
            default:
              console.log('An unknown GCM event has occurred');
              break;
        }
    },
    onNotificationWP8(e) {
alert("in onNotification") ;

        if (e.type == "toast" && e.jsonContent) {
            pushNotification.showToastNotification(successHandler, errorHandler,
            {
                "Title": e.jsonContent["wp:Text1"], "Subtitle": e.jsonContent["wp:Text2"], "NavigationUri": e.jsonContent["wp:Param"]
            });
        }

        if (e.type == "raw" && e.jsonContent) {
            alert(e.jsonContent.Body);
        }
    },

    jsonErrorHandler(error) {
alert("in jsonErrorHandler") ;
        $("#app-status-ul").append('<li style="color:red;">error:' + error.code + '</li>');
        $("#app-status-ul").append('<li style="color:red;">error:' + error.message + '</li>');
    },

    channelHandler(e) {
	alert("in channelHandler") ;
    }
};

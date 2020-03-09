// BBC Raven

var rest_client   = require('node-rest-client').Client;
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	return self;
}

/* --- public methods --- */

instance.prototype.init = function() {
	var self = this;

	// init vars
	debug = self.debug;
	log = self.log;
	self.states = {
		"portstates": {}
	}
	self.lastnotificationid = 0;

	// other init methods
	self.init_colors();
	self.init_connection();
	self.init_feedbacks();
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	debug = self.debug;
	log = self.log;

	// save passed config
	self.config = config;

	// other init methods
	self.init_colors();
	self.init_connection();
	self.init_feedbacks();
}

instance.prototype.init_colors = function() {
	const self = this;
	self.color_red = self.rgb(255, 0, 0);
	self.color_white = self.rgb(255, 255, 255);
	self.color_black = self.rgb(0, 0, 0);
	self.color_green = self.rgb(0, 255, 0);
	self.color_blue = self.rgb(0, 0, 255);
}

instance.prototype.init_poller = function() {
	const self = this;

	// get the last notification id
	let url = `http://${self.config.host}/api/notifications/getlastid`

    self.client.get(url, function (data, response) {
		if(data != null) {
			self.lastnotificationid = data["id"];
			self.do_poll();
		} 
		else {
			debug.error("Could not retrieve last notification id from web api");
		}
	});
}

instance.prototype.destroy = function() {
	var self = this;
	self.states = {}
	debug("destroy", self.id);
}

/* --- init --- */

instance.prototype.init_ports = function() {
	var self = this;

	// fetches a list of ports to use in configuration
	let url = `http://${self.config.host}/api/portlist/getall?addfriendlymachinenames=1`

	// we have to do this at the moment as there's a bug in companion which doesn't let you 
	//   save a single value in a dropdown
	self.PORTLIST_ALL = [{"id": "0", "label": "none"}];
	self.PORTLIST_PLAY = [{"id": "0", "label": "none"}];
	self.PORTLIST_REC = [{"id": "0", "label": "none"}];

    self.client.get(url, function (data, response) {
		if(data != null) {
			for(var i in data) {
				// put it in the all-ports list
				self.PORTLIST_ALL.push({
					"id": data[i]["port"],
					"label": data[i]["portfriendlyname"]
				});

				if(data[i]["portmode"] == "play") {
					// add it to the playout list
					self.PORTLIST_PLAY.push({
						"id": data[i]["port"],
						"label": data[i]["portfriendlyname"]
					});
				}

				else if(data[i]["portmode"] == "rec") {
					// add it to the record list
					self.PORTLIST_REC.push({
						"id": data[i]["port"],
						"label": data[i]["portfriendlyname"]
					});
				}
			}
		}
		self.init_actions();
	});
}

instance.prototype.init_connection = function() {
	var self = this;
    self.client = new rest_client();
	
	// try to log in - make sure the raven is there
	let url = `http://${self.config.host}/api/hello`;
 
    self.client.get(url, function (data, response) {
        if(data == "Hello, world") {
            self.status(self.STATE_OK);
			self.init_ports();
			self.init_poller();
		}
        else {
        	self.status(self.STATUS_ERROR, 'Cannot connect');
        }
    });

	debug = self.debug;
	log = self.log;
}

/* --- notification polling --- */

instance.prototype.do_poll = function() {
	var self = this;

	let url = `http://${self.config.host}/api/notifications/get?timeout=20&id=${self.lastnotificationid}`;
	self.client.get(url, function (data, response) {
		console.log("poll ... ");
		for(index in data) {
			if(data[index]["type"] == "portstatuschanged") {
				var port = data[index]["payload"]["port"];
				var portmode = data[index]["payload"]["portmode"];
				if(portmode == "play") {
					var state = data[index]["payload"]["properties"]["playportstate"];
				}
				else if(portmode == "rec") {
					var state = data[index]["payload"]["properties"]["recordportstate"];
				}
				self.states['portstates'][port] = state;

				if(portmode == "play") {
					self.checkFeedbacks('is_playing');
					self.checkFeedbacks('is_paused');
					self.checkFeedbacks('is_idle');
				}
				else if(portmode == "rec") {
					self.checkFeedbacks('is_recording');
					self.checkFeedbacks('is_monitoring');
					self.checkFeedbacks('is_idle');
				}
			}

			// store result of poll time for next call
			if(data[index]["_id"] > self.lastnotificationid) {
				self.lastnotificationid = parseInt(data[index]["_id"]);
			}
		}
		console.log("saved states:", self.states);
		setTimeout(self.do_poll.bind(self), 100);
	});
}

/* --- feedback --- */

instance.prototype.feedback = function (feedback) {
	var self = this;
	var options = feedback.options;

	// if configured port has a value in the states array
	if(self.states['portstates'][options.port] !== undefined) {

		// fetch state
		var portstate = self.states['portstates'][options.port];

		// match type
		if (feedback.type == 'is_playing') {

			// calculate result
			if(portstate == "PLAYINGP" || portstate == "LININGUPP") {
				return { color: self.color_black, bgcolor: self.color_green }
			}
			else {
				return {}
			}
		}

		// match type
		if (feedback.type == 'is_paused') {

			// calculate result
			if(portstate == "ALLOCATEDP" || portstate == "LOADEDP") {
				return { color: self.color_black, bgcolor: self.color_green }
			}
			else {
				return {}
			}
		}

		// match type
		if (feedback.type == 'is_idle') {

			// calculate result
			if(portstate == "IDLEP") {
				return { color: self.color_black, bgcolor: self.color_blue }
			}
			else {
				return {}
			}
		}

		// match type
		if (feedback.type == 'is_recording') {

			// calculate result
			if(portstate == "RECORDINGP") {
				return { color: self.color_black, bgcolor: self.color_red }
			}
			else {
				return {}
			}
		}

		// match type
		if (feedback.type == 'is_monitoring') {

			// calculate result
			if(portstate == "RECORDINGP") {
				return { color: self.color_black, bgcolor: self.color_blue }
			}
			else {
				return {}
			}
		}
		
	}

	return {}
}

instance.prototype.init_feedbacks = function() {
	var self = this;

	// feedbacks
	var feedbacks = {
		'is_playing': {
			label: 'Port is playing out',
			description: 'If currently playing out, highlight button',
			options: [
				{
					type: 'textinput',
					label: "Port ID",
					id: 'port',
					required: true,
					default: 'bmplay0'
				}
			]
		},
		'is_paused': {
			label: 'Port is paused',
			description: 'If currently paused, highlight button',
			options: [
				{
					type: 'textinput',
					label: "Port ID",
					id: 'port',
					required: true,
					default: 'bmplay0'
				}
			]
		},
		'is_recording': {
			label: 'Port is recording',
			description: 'If currently recording, highlight button',
			options: [
				{
					type: 'textinput',
					label: "Port ID",
					id: 'port',
					required: true,
					default: 'bmplay0'
				}
			]
		},
		'is_monitoring': {
			label: 'Port is monitoring (E-E)',
			description: 'If currently in monitor mode, highlight button',
			options: [
				{
					type: 'textinput',
					label: "Port ID",
					id: 'port',
					required: true,
					default: 'bmplay0'
				}
			]
		},
		'is_idle': {
			label: 'Port is idle',
			description: 'If currently idle, highlight button',
			options: [
				{
					type: 'textinput',
					label: "Port ID",
					id: 'port',
					required: true,
					default: 'bmplay0'
				}
			]
		}
	};

	self.setFeedbackDefinitions(feedbacks);
};

/* --- config --- */

instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module allows you to control a BBC Raven video server. Sadly this is an internal product and not yet released outside the BBC.'
		},
		{
			type: 'text',
			id: 'info-compat',
			width: 12,
			label: 'Compatibility',
			value: 'This module will only control a Raven v4 server.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			width: 6,
			default: '192.168.32.2',
			regex: self.REGEX_IP
		}
	]
};

instance.prototype.init_actions = function() {
	var self = this;
    var portLabel = "Port ID";

	console.log("port dropdown:", self.PORTLIST_PLAY);
    self.system.emit('instance_actions', self.id, {
        // beep
		'beep_startup': {
			label: 'Play the startup tune',
			options: []
		},

        // config
        'config_set': {
			label: 'Set configuration properties',
			options: [
				{
					type: 'textinput',
					label: 'Name',
					id: 'configname',
                    required: true,
					default: ''
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'configvalue',
                    required: true,
					default: ''
				}

            ]
		},

        // notifications
        'notification_message': {
			label: 'Send a message to all users',
			options: [
				{
					type: 'textinput',
					label: "Message to send",
					id: 'message',
                    required: true,
					default: ''
				}
			]
		},

        // record
        'record_monitor': {
			label: 'Monitor Port (E-E)',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_REC
				}
			]
		},
		'record_stop': {
			label: 'Stop Recording',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_REC
				}
			]
		},
		'record_start': {
			label: 'Start Recording',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_REC
				}
			]
		},
		'record_chunknow': {
			label: 'Chunk recording now',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_REC
				}
			]
		},
		'record_keyframe': {
			label: 'Add keyframe while recording',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_REC
				}
			]
		},
		'record_grabstill': {
			label: 'Grab still while recording',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_REC
				}
			]
		},

        // port
		'port_togglelock': {
			label: 'Toggle the port lock',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_ALL
				}
			]
		},
		'port_setlock': {
			label: 'Set the port lock',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_ALL
				},
				{
					type: 'checkbox',
					label: 'Locked',
					id: 'lockstate',
					default: true
				}
			]
		},
		'portsettings_togglemodetype': {
			label: 'Toggle the port mode (HD/SD)',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_ALL
				}
			]
		},

        // playout
		'playout_eject': {
			label: 'Eject the currently playing clip and clear the playlist',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_repeatframes': {
			label: 'Repeat the specified number of frames during playout',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				},
				{
                    type: 'number',
					label: 'Number of frames',
					id: 'framecount',
                    required: true,
                    min: 1,
                    max: 9999,
                    default: 25,
				}
			]
		},
		'playout_dropframes': {
			label: 'Drop the specified number of frames during playout',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				},
				{
                    type: 'number',
					label: 'Number of frames',
					id: 'framecount',
                    required: true,
                    min: 1,
                    max: 9999,
                    default: 25,
				}
			]
		},
		'playout_removeall': {
			label: 'Remove all items from the playlist',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_keyframe': {
			label: 'Create a user keyframe from the currently playing clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_play': {
			label: 'Start playout. If clip is not loaded, load and play it.',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_pause': {
			label: 'Pause playout. If clip is not loaded, load and pause it on the first frame',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_previous': {
			label: 'Load the previous clip in the playlist. If playing, go back to start of current clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_previousstep': {
			label: 'Skip back 10 frames in the currently loaded clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_previousframe': {
			label: 'Skip back 1 frame in the currently loaded clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_next': {
			label: 'Load the next clip in the playlist',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_nextstep': {
			label: 'Skip forward 10 frames in the currently loaded clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_nextframe': {
			label: 'Skip forward 1 frame in the currently loaded clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_add': {
			label: 'Add the specified clips to the playlist',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				},
				{
					type: 'textinput',
					label: 'Clip IDs (comma separated)',
					id: 'clipids',
                    required: true,
					default: ''
				}
			]
		},
		'playout_loadnow': {
			label: 'Replace playlist with specified clips and hold on the first frame of first clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				},
				{
					type: 'textinput',
					label: 'Clip IDs (comma separated)',
					id: 'clipids',
                    required: true,
					default: ''
				}
			]
		},
		'playout_playnow': {
			label: 'Replace playlist with specified clips and play first clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				},
				{
					type: 'textinput',
					label: 'Clip IDs (comma separated)',
					id: 'clipids',
                    required: true,
					default: ''
				}
			]
		},
		'playout_load': {
			label: 'Load the specified clip index ready for playout',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				},
				{
					type: 'number',
					label: 'Playlist Index to load',
                    id: 'index',
                    min: 0,
                    max: 9999,
                    default: 0,
                    required: true
				}
			]
		},
		'playout_seek': {
			label: 'Seek to the specified frame in the current clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				},
				{
					type: 'number',
					label: 'Frame',
					id: 'frame',
                    required: true,
                    default: 0,
                    min: 0,
                    max: 999999999
				}
			]
		},
		'playout_stop': {
			label: 'Stop playout',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_togglefield': {
			label: 'Toggle field dominance for currently playling clip',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_pauseafter': {
			label: 'Toggle \'pauseafter\' mode for the port',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				}
			]
		},
		'playout_loop': {
			label: 'Set \'loop\' mode for the port',
			options: [
				{
					type: 'dropdown',
					label: portLabel,
					id: 'port',
                    choices: self.PORTLIST_PLAY
				},
				{
					type: 'checkbox',
					label: 'Loop enabled',
					id: 'loopflag',
					default: true
				}
			]
		}
    });

}

instance.prototype.action = function(action) {
	var self = this;
	var cmd;
    var options = action.options;
console.log("options:", options);
	switch(action.action) {

        // beep
        case "beep_startup":
            cmd = '/api/beep/startup?port=' + encodeURIComponent(options.port);
            break;

        // config
        case "config_set":
            config_data = {};
            config_data[options.configname] = options.configvalue;
            cmd = '/api/config/set?properties=' + JSON.stringify(config_data);
            break;

        // notifications
		case 'notification_message':
			cmd = '/api/notifications/message?text=' + encodeURIComponent(options.message);
			break;

        // record
		case 'record_monitor':
			cmd = '/api/record/monitor?port=' + encodeURIComponent(options.port);
			break;
		case 'record_stop':
			cmd = '/api/record/stop?port=' + encodeURIComponent(options.port);
			break;
        case 'record_start':
            cmd = '/api/record/start?port=' + encodeURIComponent(options.port);
            break;
        case 'record_chunknow':
            cmd = '/api/record/chunknow?port=' + encodeURIComponent(options.port);
            break;
        case 'record_keyframe':
            cmd = '/api/record/keyframe?port=' + encodeURIComponent(options.port);
            break;
        case 'record_grabstill':
            cmd = '/api/record/grabstill?port=' + encodeURIComponent(options.port);
            break;

        // port 
        case 'port_togglelock':
            cmd = '/api/port/toggleportlockstate?port=' + encodeURIComponent(options.port);
            break;
        case 'port_setlock':
            cmd = '/api/port/setlockstate?port=' + encodeURIComponent(options.port) + "&state=" + (encodeURIComponent(options.lockstate ? "1" : "0"));
            break;

        // port settings
        case 'portsettings_togglemodetype':
            cmd = '/api/portsettings/togglemodetype?port=' + encodeURIComponent(options.port);
            break;
        
        // playout
        case 'playout_eject':
            cmd = '/api/playout/eject?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_repeatframes':
            cmd = '/api/playout/repeatframes?port=' + encodeURIComponent(options.port) + "&framecount=" + encodeURIComponent(options.framecount);
            break;
        case 'playout_dropframes':
            cmd = '/api/playout/dropframes?port=' + encodeURIComponent(options.port) + "&framecount=" + encodeURIComponent(options.framecount);
            break;
        case 'playout_removeall':
            cmd = '/api/playout/removeall?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_keyframe':
            cmd = '/api/playout/keyframe?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_play':
            cmd = '/api/playout/play?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_pause':
            cmd = '/api/playout/pause?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_previous':
            cmd = '/api/playout/previous?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_previousstep':
            cmd = '/api/playout/previousstep?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_previousframe':
            cmd = '/api/playout/previousframe?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_next':
            cmd = '/api/playout/next?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_nextstep':
            cmd = '/api/playout/nextstep?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_nextframe':
            cmd = '/api/playout/nextframe?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_add':
            cmd = '/api/playout/add?port=' + encodeURIComponent(options.port) + "&clipids=" + encodeURIComponent(options.clipids);
            break;
        case 'playout_loadnow':
            cmd = '/api/playout/loadnow?port=' + encodeURIComponent(options.port) + "&clipids=" + encodeURIComponent(options.clipids);
            break;
        case 'playout_playnow':
            cmd = '/api/playout/playnow?port=' + encodeURIComponent(options.port) + "&clipids=" + encodeURIComponent(options.clipids);
            break;
        case 'playout_load':
            cmd = '/api/playout/load?port=' + encodeURIComponent(options.port) + "&index=" + encodeURIComponent(options.index);
            break;
        case 'playout_seek':
            cmd = '/api/playout/seek?port=' + encodeURIComponent(options.port) + "&frame=" + encodeURIComponent(options.frame);
            break;
        case 'playout_stop':
            cmd = '/api/playout/stop?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_togglefield':
            cmd = '/api/playout/togglefield?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_pauseafter':
            cmd = '/api/playout/pauseafter?port=' + encodeURIComponent(options.port);
            break;
        case 'playout_loop':
            cmd = '/api/playout/loop?port=' + encodeURIComponent(options.port) +"&loopflag=" + (encodeURIComponent(options.loopflag ? "1" : "0"));
            break;
        }

    if(self.client !== undefined) {
		let url = 'http://' + self.config.host + cmd;
        console.log("url", url);
        self.client.get(url, function (data, response) {
            console.log(data);
        });
    }

}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
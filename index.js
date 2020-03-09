// BBC Raven

var rest_client   = require('node-rest-client').Client;
var udp           = require('../../udp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

var request = require('request');
var cookieJar = request.jar();
var sessionID = null;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.init_http();
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_http();
}

instance.prototype.init_http = function() {
	var self = this;
    self.client = new rest_client();
	
	// try to log in - make sure the raven is there
	let url = `http://${self.config.host}/api/hello`;
 
    self.client.get(url, function (data, response) {
        if(data == "Hello, world") {
            self.status(self.STATE_OK);
        }
        else {
        	self.status(self.STATUS_ERROR, 'Cannot connect');
        }
    });

	debug = self.debug;
	log = self.log;
}

// Return config fields for web config
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

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	debug("destroy", self.id);
}

instance.prototype.actions = function() {
	var self = this;
    var portLabel = "Port ID";

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
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmrec0'
				}
			]
		},
		'record_stop': {
			label: 'Stop Recording',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmrec0'
				}
			]
		},
		'record_start': {
			label: 'Start Recording',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmrec0'
				}
			]
		},
		'record_chunknow': {
			label: 'Chunk recording now',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmrec0'
				}
			]
		},
		'record_keyframe': {
			label: 'Add keyframe while recording',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmrec0'
				}
			]
		},
		'record_grabstill': {
			label: 'Grab still while recording',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmrec0'
				}
			]
		},

        // port
		'port_togglelock': {
			label: 'Toggle the port lock',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmrec0'
				}
			]
		},
		'port_setlock': {
			label: 'Set the port lock',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmrec0'
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
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmrec0'
				}
			]
		},

        // playout
		'playout_eject': {
			label: 'Eject the currently playing clip and clear the playlist',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_repeatframes': {
			label: 'Repeat the specified number of frames during playout',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
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
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
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
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_keyframe': {
			label: 'Create a user keyframe from the currently playing clip',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_play': {
			label: 'Start playout. If clip is not loaded, load and play it.',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_pause': {
			label: 'Pause playout. If clip is not loaded, load and pause it on the first frame',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_previous': {
			label: 'Load the previous clip in the playlist. If playing, go back to start of current clip',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_previousstep': {
			label: 'Skip back 10 frames in the currently loaded clip',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_previousframe': {
			label: 'Skip back 1 frame in the currently loaded clip',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_next': {
			label: 'Load the next clip in the playlist',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_nextstep': {
			label: 'Skip forward 10 frames in the currently loaded clip',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_nextframe': {
			label: 'Skip forward 1 frame in the currently loaded clip',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_add': {
			label: 'Add the specified clips to the playlist',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
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
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
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
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
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
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
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
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
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
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_togglefield': {
			label: 'Toggle field dominance for currently playling clip',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_pauseafter': {
			label: 'Toggle \'pauseafter\' mode for the port',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
				}
			]
		},
		'playout_loop': {
			label: 'Set \'loop\' mode for the port',
			options: [
				{
					type: 'textinput',
					label: portLabel,
					id: 'port',
                    required: true,
					default: 'bmplay0'
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
    console.log(options);
    var opt  = action.options;
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
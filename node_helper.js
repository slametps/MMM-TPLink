/* Magic Mirror
 * Node Helper: MMM-TPLink
 *
 * By Slamet PS/slametps@gmail.com
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var { Client, ResponseError, Util } = require('tplink-smarthome-api');
let logLevel;
let client;
let arrDevices;
let arrDevicesItem;

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Starting node_helper.js for MMM-TPLink.");
	},

  dump: function(v, s) {
    s = s || 1;
    var t = '';
    switch (typeof v) {
      case "object":
        t += "\n";
        for (var i in v) {
          t += Array(s).join(" ")+i+": ";
          t += this.dump(v[i], s+3);
        }
        break;
      default: //number, string, boolean, null, undefined
        t += v+" ("+typeof v+")\n";
        break;
    }
    return t;
  },

  outputError: function (err) {
    if (err instanceof ResponseError) {
      console.log(err.response);
    } else {
      console.error(err);
    }
  },

  setupClient: function (config) {
    let defaultSendOptions = {};
    if (config.udp) defaultSendOptions.transport = 'udp';
    if (config.timeout) defaultSendOptions.timeout = config.timeout;
    let client = new Client({ logLevel, defaultSendOptions });
    return client;
  },

  // params in JSON object
  search: function (config, params) {
    try {
      console.log('Searching...');
      client = this.setupClient(config);
      arrDevices = [];
      let commandParams = Object.assign({}, {discoveryInterval: config.discoveryInterval || 2000, discoveryTimeout: config.timeout || 5000 }, params); // {discoveryInterval: 2000, discoveryTimeout: timeout, ...params};
      //console.log(`startDiscovery(${Util.inspect(commandParams)})`);
      //console.log('startDiscovery()');
      client.startDiscovery(commandParams)
        .on('device-new', (device) => {
          //console.log(`${device.model} ${device.deviceType} ${device.type} ${device.host} ${device.port} ${device.deviceId} ${device.alias}`);
          let stateDevice = 0;
          switch (device.deviceType)
          {
            case "bulb":
              stateDevice = device.lighting.lightState.on_off;
              break;
            case "plug":
              stateDevice = device.sysInfo.relay_state;
              break;
            default: stateDevice = 0;
          }

          arrDevicesItem = {alias:device.alias, type:device.deviceType, ip:device.host, port:device.port, on_off:stateDevice};
          arrDevices.push(arrDevicesItem);
          //console.log(">> stateDevice = " + stateDevice);
          //console.log(">> arrDevices  = " + arrDevices.length);
        });
    } catch (err) {
      this.outputError(err);
    }
  },

	socketNotificationReceived: function(notification, payload) {
    console.log(this.name + " node helper received a socket notification: " + notification + " - Payload: " + payload);
    if (notification == "TPLINK_NETWORK_SEARCH") {
      //console.log("TPLink SEARCH BEGIN");
      this.search(payload.config, {});
      var that = this;

      function funcDummy() {
        // nothing to do
        //console.log("in funcDummy");
        if (arrDevices.length > 1) {
          //console.log("1-PRINT OUTPUT LENGTH = " + arrDevices.length);
          arrDevices.sort(function(a, b) {
            var x = a.alias.toLowerCase();
            var y = b.alias.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
          });
          //console.log("arrDevices = [" + this.dump(arrDevices) + "]");
          //console.log("2-PRINT OUTPUT LENGTH = " + arrDevices.length);
          that.sendSocketNotification('TPLINK_NETWORK_SEARCH_RESULT', {devices: arrDevices});
        }
      }

      setTimeout(funcDummy, payload.config.timeout + 500);
      //console.log(payload.config.timeout + " ms -> CHECK arrDevices-" + arrDevices.length);
      //console.log("TPLink SEARCH END");
    }
	},
});

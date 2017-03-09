/**
 * @fileoverview API for MCP415x SPI Digital POT
 * @author felixgalindo91@gmail.com (Felix A. Galindo)
 */

var spiDevice = require('spi-device');

//MCP415x class
function MCP415x() {
	console.log("Initializing MCP415x");

	var MCP415x = this;
	MCP415x.data = {};
	var data = MCP415x.data;
	var string;

	//Open SPI
	MCP415x.spi = spiDevice.open(0, 0, function(err) {
		if (err) {
			console.log("MCP415x Error:", err);
			return;
		} else {
			console.log("MCP415x SPI now open");
		}
	});
}

//Function sets output of MCP415x to specified resistance (within ~195 ohms of error due to 8 bit resolution) 
const stepsPerOhm = 256 / 50000;
const resOffset = 150;
MCP415x.prototype.setResistance = function(resistance) {
	var value = (resistance - resOffset) * stepsPerOhm;
	value = value > 0 ? value : 0;
	this.write(0x00, value.toFixed(0));
}

//Function writes a value to specified address to the MCP415x
MCP415x.prototype.write = function(address, value) {
	// An SPI message is an array of one or more read+write transfers 
	var message = [{
		sendBuffer: new Buffer([address, value]), // Sent to read channel 5  
		byteLength: 2,
		speedHz: 20000 // Use a low bus speed to get a good reading from the TMP36 
	}];

	console.log("Sending value to MCP415x:", value);

	this.spi.transfer(message, function(error, message) {
		if (error) {
			console.log("MCP415x Error:", error);
		} else {
			console.log("SPI Message Sent");
		}
	});
};

module.exports =  MCP415x;
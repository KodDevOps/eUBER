//route.js - all server function is in this file

var formidable = require('formidable'),
    util = require('util'),
    fs   = require('fs-extra');
	
var mdnsocket = new Object(); //Mapping between rider's MDN and it's socket.io's socket id. 
var mdnname = new Object();   //Mapping between rider's MDN and his/her name.
var driversMap = new Object();
var driverrider = new Object();
var riderdriver = new Object();
var favourites = new Object();
var counter = 0;



var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream('/home/kodiak/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
}; 

// redirect stdout / stderr
function finddriverMDNfromSocket(socketid){
for (var key in driversMap) {
  if (driversMap.hasOwnProperty(key)) {
		if(driversMap[key].socketid==socketid){
			
			return key;
		}
  }
}
	return;


}
function returnRandomDriver() {
	var tmp = [];
	var isAvailable = false;
	console.log(driversMap);
	for (var key in driversMap) {
	if (driversMap.hasOwnProperty(key)) {
			if(driversMap[key].presense=='Available'){
				isAvailable = true;
				tmp.push(driversMap[key]);
			}
	}
	}
	if(!isAvailable){
		console.log(tmp);
		console.log('There are no drivers available');
	}
	else{
		var x = Math.floor((Math.random() * tmp.length) + 1)-1;
		return tmp[x];

	}
}

function findDriverSocket(MDN){
	var info = driversMap[MDN];
	console.log('Socket ID:'+info);
	return info;
}
function updateDriverStatus(mdn,presense){
	console.log(presense);
	
	driversMap[mdn].presense = presense;

}
module.exports = function(app,io){
	app.get('/', function(req, res){
		// Render views/chat.html
		//res.render('sample');
		res.render('googlemaps');
	});
	app.get('/home', function(req, res){
		// Render views/chat.html
		//res.render('sample');
		res.render('UI/index');
	});	
	app.get('/driver/:mdn', function(req, res){
		// Render views/chat.html
		//res.render('sample');
		res.render('UI/driverScreen');
	});		
	app.get('/riderScreen/:mdn', function(req, res){
		// Render views/chat.html
		//res.render('sample');
		res.render('UI/riderScreen');
	});			
	app.get('/video', function(req, res){
		// Render views/chat.html
		//res.render('sample');
		res.render('UI/video');
	});			
	
	app.get('/basic', function(req, res){
		// Render views/chat.html
		//res.render('sample');
		res.render('basic');
	});	
	app.get('/camera', function(req, res){
		// Render views/chat.html
		//res.render('sample');
		res.render('UI/camera');
	});		
	app.get('/index', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		res.render('index');
	});
	app.get('/info', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		res.render('UI/info');
	});	
	app.get('/info_1', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		res.render('UI/info_1');
	});	

	app.get('/mainApp', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		var mdn = req.param('mdn');
		var type = req.param('type');
		if(type=="driver"){
			console.log('MDN PASSED IS:'+mdn);
			res.redirect('/driver/'+mdn);		
		}else{
			console.log('MDN PASSED IS:'+mdn);
			res.redirect('/rider/'+mdn);
		}
	});
	app.get('/rider/:mdn', function(req,res){

		// Render the chant.html view
		res.render('mainApp');
	});		
	app.get('/mainApp_Driver', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		var mdn = req.param('mdn');

		
	});	

	
		app.get('/fullScreenVideo', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		
		res.render('fullScreenVideo',{    });
	});	
	app.get('/We', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		
		res.render('WebRTC_ Still photo capture demo',{    });
	});
	app.get('/uberdemo', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		
		res.render('uberdemo',{    });
	});	
	app.get('/PTTWidget', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		
		res.render('UI/PTTWidget',{    });
	});
	app.get('/HelloPTT', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		
		res.render('UI/HelloPTT',{    });
	});
		app.get('/sample', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		
		res.render('sample',{    });
	});
		app.get('/sample1', function(req,res){
		
		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));
		// Redirect to the random room
		
		res.render('sample1',{    });
	});
	var chat = io.on('connection', function (socket) {
		function removeMapping(mdn){
			console.log('Updating mapping');
			console.log(driverrider);
			console.log(riderdriver);
			if(riderdriver[mdn]!=undefined){
				delete driverrider[riderdriver[mdn]];
				delete riderdriver[mdn];
			}
			else{
				var ridermdn = driverrider[mdn];
				console.log(ridermdn);
				delete riderdriver[ridermdn];
				delete driverrider[mdn];
				
			
			}
			
			
			

			console.log(driverrider);
			console.log(riderdriver);
			
		}
		function updateClients(){
		for(key in mdnsocket) {
				if(mdnsocket.hasOwnProperty(key)) {
					var value = mdnsocket[key];
					//console.log(value);
					if (io.sockets.connected[value]) {
					}
					else{
						console.log('Updating Riders...');
						//console.log(value+' is not connected now so removing this rider....');
						//console.log('Before Delete:'+JSON.stringify(mdnsocket));
						delete mdnsocket[key]
						delete mdnname[key]
						removeMapping(key);
						//console.log('After Delete:'+JSON.stringify(mdnsocket));
					}
					
					
				}
			}
			
			
		
			for (var key in driversMap) {
				if (driversMap.hasOwnProperty(key)) {
					
					if(io.sockets.connected[driversMap[key].socketid]){
					
					}
					else{
						console.log('Updating drivers list');
						removeMapping(key);
						console.log(driversMap);
						delete driversMap[key];
						console.log(driversMap);
					}
				}
			}
		
		}
		//console.log('new client joined with socket id:'+socket.id);
		//updateClients();
		//window.setInterval(updateClients(), 1000);
		// Handle the sending of messages
		socket.on('msg', function(data){
			
			updateClients();
			var MDNlist = data.mdn;
			//console.log(data.mdn)
			if(data.type=='openinfowindow'){
				console.log('From MDN: open info window'+socket.mdn);
				var riderMDN = driverrider[socket.mdn];
				
				if(riderMDN!=undefined){
					console.log('to rider:'+riderMDN);
					var ridersocketid = mdnsocket[riderMDN];
					console.log(ridersocketid);
					io.sockets.connected[ridersocketid].emit('receive',data);
				
				}else{
					
					var driverMDN = riderdriver[socket.mdn];
					console.log('to driver:'+driverMDN);
					var info = driversMap[driverMDN];
					console.log(info);
					io.sockets.connected[info.socketid].emit('receive',data);
				
				}
			
			}else if(data.type=='endRide'){
				var riderMDN = driverrider[socket.mdn];
				delete driverrider[socket.mdn];
				delete riderdriver[riderMDN];
				updateDriverStatus(socket.mdn,'Available');
				console.log(driverrider);
				console.log(riderdriver);
			
			}
			else if(data.type=='favorite'){
				console.log(socket.mdn);
				var driverMDN = riderdriver[socket.mdn];
				if(favourites[socket.mdn]==undefined){
				
					var drivers = [];
					drivers.push(driverMDN);
					favourites[socket.mdn] = drivers;
				}
				else{
				
					var drivers = favourites[socket.mdn];
					drivers.push(driverMDN);
					favourites[socket.mdn] = drivers;
				}
				console.log('Rider '+socket.mdn+' is making this driver: '+driverMDN+' as favourite')
			
			}
			else if(data.type=='accepted'){
				//create a rider to driver mapping
			
				var riderMDN = data.mdn[0];
				console.log('Driver Accepted the request');
				console.log('Rider MDN:'+riderMDN);
				console.log(socket.id);
				var driverMDN = finddriverMDNfromSocket(socket.id);
				console.log(driversMap);
				driverrider[driverMDN] = riderMDN.toString();
				riderdriver[riderMDN] = driverMDN.toString();
				console.log(driverrider);
				console.log(riderdriver);
				data.fromMDN = socket.mdn;
				updateDriverStatus(socket.mdn,'InRide');
				data.mdn = data.mdn[0];
				
				io.sockets.connected[mdnsocket[riderMDN]].emit('receive',data);	
			}
			
			else if(data.type=='UpdateStatus'){
				updateDriverStatus(socket.id,data.msg);
			
			}
			else if(data.type=='RequestDriverInfo'){			
			
				var driverMDN = riderdriver[socket.mdn];
				/*
				if(driverMDN!=undefined){
				
					console.log('You already requested a driver and  your ride is accepted');
					return;
				}*/
				console.log('Rider requested drivers info');
				var driverDetails = returnRandomDriver();
				if(driverDetails!=undefined){
					data.type ='RequestDriverInfo';
				data.fromMDN = socket.mdn;
				data.mdn = driverDetails.mdn;
				
				
				
				console.log('-------------Drivers details-------------');
				console.log(driverDetails.socketid);
				console.log(driverDetails.name);
				console.log(driverDetails.mdn);
				
				io.sockets.connected[driverDetails.socketid].emit('receive',data);
				console.log(data);
				
				}
				else{
					data = {};
					data.type = 'sorry';
					data.module = 'uber';
					data.msg = 'Sorry no drivers are available right now';
					socket.emit('receive',data);
					//console.log('Sorry no drivers are available right now');
				
				}
				
				
			}
			else{
			
			
				var driverMDN = riderdriver[socket.mdn];
				console.log('RECEIVED A MESSAGE');
				//console.log(data);

				if(driverMDN!=undefined){
				
						//console.log(riderdriver);
						
						console.log('From Rider');
						var socketid = findDriverSocket(driverMDN);
						//console.log(socketid);
					if (io.sockets.connected[socketid.socketid]) {
							console.log('Got Drivers info');
							console.log('Socket MDN'+socket.mdn);
							data.fromMDN = socket.mdn;
							//data.mdn = mdnumber;
							io.sockets.connected[socketid.socketid].emit('receive',data);	
					}
				}
				else{
				// From Driver Message
					var riderMDN = driverrider[socket.mdn];
					var socketid = mdnsocket[riderMDN];
					console.log(driverrider);
					if (io.sockets.connected[socketid]) {
							console.log('From Driver');
							data.fromMDN = socket.mdn;
							//data.mdn = mdnumber;
							io.sockets.connected[socketid].emit('receive',data);	
					}
					else{
					
						console.log('No mapping exists');
					}
				
				
				}
		
			
			}

			
		});
		
		// Handle the MDN registration
		socket.on('register', function(data){
			updateClients();
			socket.mdn = data.mdn.toString();
			socket.name = data.name;
			//console.log(socket.mdn);
			
			if(data.Type=="driver"){
				var info = {};
				info.socketid = socket.id;
				info.name = data.name;
				info.mdn = data.mdn.toString();
				info.presense = 'Available';
				driversMap[info.mdn] = info;
				console.log('------List of Drivers------');
				console.log(driversMap);
			
			}
			else{
				mdnsocket[data.mdn.toString()] = socket.id;
				mdnname[data.mdn.toString()] = data.name;
				console.log('------List of Riders------');
				console.log(mdnsocket);				
				console.log('Rider registered to socket '+mdnsocket[data.mdn]+ 'with MDN '+data.mdn+' and name '+mdnname[data.mdn]);
			}

			
		});				
		socket.on('deregisterClient', function(data){
			delete mdnsocket[data.mdn.toString()];
			console.log(mdnsocket);
			//mdnsocket[data.mdn] = socket.id;
			console.log('client is successfully deregistered');
		});			
	});
};





var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

var logger = require('./logger');
app.use(logger);

app.get('/',function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/pic.png', function (req, res) {
	res.sendFile(__dirname + '/public/pic.png');
});

var blocksRoute = app.route('/blocks');

	var blocks = {
		'Fixed':'Fastened securely in position',
		'Movable':'Capable of being moved',
		'Rotating':'Moving in a circle around ite center'
	};

	app.delete('/blocks/:name', function(request,response){
		if(blocks[request.params.name]!==undefined){
		delete blocks[request.params.name];
		response.sendStatus(200);
		}else{
			response.sendStatus(404);
		}
	});

	app.post('/blocks',parseUrlencoded, function(request, response){
		console.log("---- name="+request.body.name);
		console.log("---- description="+request.body.description);
  		var newBlock = createBlock(request.body.name, request.body.description);
		console.log("---- blocks="+blocks[request.body.name]);
    	response.status(201).json(newBlock);
		// var newBlock = createBlock(request.body.name, request.body.description);
		// //blocks[newBlock.name]=newBlock.description;
		// response.status(201).json(newBlock);
	});

	var createBlock = function(name, description){
  		blocks[name.toString()] = description.toString();
  		return name; 
	};



	var locations = {
		'Fixed':'First floor', 'Movable':'Second floor', 'Rotating':'Penthouse'
	};
	app.param('name', function(request, response, next){
		var name = request.params.name;
		var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
		request.blockName = block;
		next();
	});
	app.get('/blocks', function(request, response){
		response.json(Object.keys(blocks));
	});
	app.get('/blocks/:name',function(request, response){
		//var description=blocks[request.blockName];
		var description=blocks[request.params.name];
		if(!description){
			response.status(404).json("No description found for block "+request.params.name);
		}else{
			response.json(description);
		}
	});

	app.get('/locations/:name',function(request, response){
		var description=locations[request.blockName];
		
		if(!description){
			response.status(404).json("No description found for location "+request.params.name);
		}else{
			response.json(description);
		}
	});
  var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening on 3000 \n');
});


var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index');
});


router.post('/', function (req, res) {
	var db = req.db;
	var rentals = db.get('rentals');
	var returns = db.get('returns');
	
	// Parameters
	var name = req.body.name;
	var pennid = req.body.pennid;
	var email = req.body.email;
	var rental = req.body.rental;
	var formaldate = req.body.formaldate;
	var date = req.body.date;


	if (name != "" && pennid != "" && email != "" && rental != "" && formaldate != "") {	
		var new_rental = {
			"name": name,
			"pennid": pennid,
			"email": email,
			"rental": rental,
			"formaldate": formaldate,
			"startdate": date,
			"formalend":"",
			"enddate": ""
		};
		
		rentals.insert(new_rental, function (err, doc) {
			if (err)
				res.send("Error: " + err);
			else {
				returns.insert(new_rental, function (err, doc) {
					if (err)
						res.send("Error: " + err);
					else {
						res.redirect("return");
					}
				});
			}
		});

		

	}

	else {
		alert("Missing Fields");
	}


	
});


router.get('/return', function (req, res) {
	var db = req.db;
	var returns = db.get('returns');
	
	var array = [];
	// Retrieve all the documents in the collection
	var documents = returns.find({},function(err, docs) {
		if (err)
			console.log("Error: " + err);
		else {
			var size = docs.length;
			for (var i = docs.length-1; i >= 0; i--) {

				var strJson = '{"name":"' + docs[i].name +'","pennid":"' + 
		 					docs[i].pennid + '","email":"' + docs[i].email + '","rental":"' + 
		 					docs[i].rental + '","startdate":"' + docs[i].startdate + 
		 					'","enddate":""}';
		 		
		 		array.push(strJson);
		 	}
		 	

			res.render('return', {
				docs: array
			});
		}
		
	});

});


router.get('/rentals', function (req, res) {
	var db = req.db;
	var rentals = db.get('rentals');
	
	var array = [];
	// Retrieve all the documents in the collection
	var documents = rentals.find({},function(err, docs) {
		if (err)
			console.log("Error: " + err);
		else {
			var size = docs.length;
			for (var i = docs.length-1; i >= 0; i--) {

				var strJson = '{"name":"' + docs[i].name +'","pennid":"' + 
		 					docs[i].pennid + '","email":"' + docs[i].email + '","rental":"' + 
		 					docs[i].rental + '","startdate":"' + docs[i].startdate + 
		 					'","enddate":"' + docs[i].enddate + '"}';
		 		
		 		array.push(strJson);
		 	}
		 	

			res.render('rentals', {
				docs: array
			});
		}
		
	});

});

router.post('/returnRental', function (req, res) {
	var db = req.db;
	var rentals = db.get('rentals');
	var returns = db.get('returns');

	console.log("HERE");
	var today = new Date();
	var formal = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 
	if(mm<10) {
	    mm='0'+mm
	} 
	today = mm+'/'+dd+'/'+yyyy;

	var id = req.body.pennid;

	returns.remove({pennid : id}, function(err, result) {
	    if (err) {
	        console.log(err);
	    }
	});
	
	rentals.update({pennid : id}, {$set : {enddate : today}});

	console.log("REDIRECT");
	res.redirect("rentals");
	// rentals.findOne({pennid : id},function(err, docs) {
	// 	if (err)
	// 		console.log("Error: " + err);
	// 	else {
	// 		rentals.update({pennid : id}, 
	// 			{ name : docs.name,
	// 			  pennid : docs.pennid,
	// 			  email : docs.email,
	// 			  rental : docs.rental,
	// 			  startdate : docs.startdate,
	// 			  enddate : today }, function(err, result) {
	// 			if (err)
	// 				console.log(err);
	// 			else {
	// 				res.redirect("rentals");
	// 			}
	// 		});
	// 	}
		
	// });

});

module.exports = router;
	var bearer_Token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsicHJvZmlsZSIsImhpc3RvcnlfbGl0ZSIsImhpc3RvcnkiLCJyZXF1ZXN0Il0sInN1YiI6IjkwMDU4YjM1LWJkN2MtNGNiMy1iN2RiLWIzMTQzZThkNWNiNCIsImlzcyI6InViZXItdXMxIiwianRpIjoiZDNmYTQxZTUtZmJjNS00ZmYzLTgxOWYtZmJkYmE0MzA4ODM4IiwiZXhwIjoxNDUzNDk0MzIwLCJpYXQiOjE0NTA5MDIzMjAsInVhY3QiOiJsQVZkNmlqY0Y2UnM1RUdCOUV6UEpDNGI0ejRiazAiLCJuYmYiOjE0NTA5MDIyMzAsImF1ZCI6IjVJZEtVRWZqVG9XUklReDN2OTNOUFpoYjljRmNBMEdrIn0.Qk6zQkBvzR40LMUc3xZ92w6Jmkode21xY-04jE5gnvtPzXXpm5FdBMcvCidtuRXt63lTNExmQt0pd3_h-94E8JE3J9O_lQUUwsRb9y9scQKcyo-3YUohPKSL7xn8WJRYu78_PXSifcijZOHVXN-04LwieCZRHK0EUP4UQOqHDKo3YWvgp771tQvyN8fBhxz9hW0m6LtG0rUHFiPrdGNVnrLyjGfIF_TxpPiC123ILI4haCMfZkSv78NB_bhYqPi9atemMHw_oez7bvaKKridK0-PSJRu9NWTmPMIaHVmlbEy1RojfFj9VwdVB-fBRA9TaqAmCDq4zO3bbU0Kp82flw';
	var User_no, User_pic, User_name, User_uuid, User_loc; 
	var from_Lat="", from_Long="", to_Lat="", to_Long=""; 
	var prod_List = new Array(); 
	var driver_details; 
	var selected_model, selected_desc, selected_capacity, selected_prod_id; 
	var product_Image={}; 
	var map, source_place;
	var selected_req_id; 
	var Ntf_req_Status_from_driver = {}; 
	var driversLocation;
	var riderMDN = Number(window.location.pathname.match(/\/rider\/(\d+)$/)[1]);
	var pass_Details= {}; 
	
	console.log("MDN PASSED IS:"+riderMDN);

	function receive_CallBacks(data)
	{
		console.log('RECEIVED MSG  :' + JSON.stringify(data));

		if(data.module=='uber')
		{
			if(data.type=='Check_Req_id_status')
			{
				to = [];
				to.push(data.fromMDN);
				Ntf_req_Status_from_driver[data.msg.split('$')[1]]=data.msg.split('$')[2];
				pole_status(data.msg.split('$')[1]);
			}
			else if(data.type=='driverRequest')
			{
				pass_Details[data.msg.split('$')[0]] = {location : data.msg.split('$')[1], name: data.msg.split('$')[2], number: data.fromMDN, req_id:data.msg.split('$')[4]}; 
				set_user_location(data.msg.split('$')[0], data.msg.split('$')[1], data.msg.split('$')[2]);
			}
	
		}	
		if(data.module=='uber' && data.type=='sorry')
		{
			//document.getElementById(selected_model).src = product_Image[selected_model]; 
			alert(data.msg);
		}
	}
	function pushtoXCallback(data)
	{
			console.log(' RECEIVED MSG	:' + JSON.stringify(data));

	}

	makeConnection(receive_CallBacks, 'uber'); 
	setTimeout(registerCallback(pushtoXCallback, 'pushtoX'), 1000);
	//registerCallback(pushtoXCallback, 'pushtoX'); 
	get_User_details();
	connect_for_chat(); 


	function deselect(e) {
		$('.pop').slideFadeToggle(function() {
			e.removeClass('selected');
		});    
	}
		
	$(function() {
		$('#ride_Btn').on('click', function() {
			if($(this).hasClass('selected')) {
			deselect($(this));               
			} else {
			$(this).addClass('selected');
			$('.pop').slideFadeToggle();
			}
			return false;
	});
		
	$('.close').on('click', function() {
			deselect($('#ride_Btn '));
			return false;
		});
	});
		
	$.fn.slideFadeToggle = function(easing, callback) {
		return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
	};

	//**********************************
		
	function deselect(e) {
		$('.pop1').slideFadeToggle(function() {
			e.removeClass('selected');
		});    
	}
		
	$(function() {
		$('#driver_sel_Btn').on('click', function() {
			if($(this).hasClass('selected')) {
			deselect($(this));               
			} else {
			$(this).addClass('selected');
			$('.pop1').slideFadeToggle();
			}
			return false;
		});
		
		$('.close').on('click', function() {
			deselect($('#driver_sel_Btn'));
			return false;
		});
	});
		
	$.fn.slideFadeToggle = function(easing, callback) {
		return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
	};

	//**********************************

	function get_User_details()
	{		
		$.ajax({
			type 	: 'GET',
			url	: 'https://sandbox-api.uber.com/v1/me',
			headers: 
			{
				Authorization: "Bearer " + bearer_Token
			},
			
			success: function(result)
			{
				console.log('UUID	:' + result.uuid);	
				//console.log('PICTURE 	:' + result.picture);	
				console.log('FIRST Name	:' + result.first_name);	
				console.log('LAST NAME	:' + result.last_name);
				console.log('E-MAIL	:' + result.email);	
		
				User_no 	= result.uuid.replace(/[^0-9]/g, '').substring(0,10);
				User_name 	= result.first_name + ' ' + result.last_name; 
				User_uuid 	= result.uuid; 
		
				console.log('PHONE		:'	+ User_no);
		
				registerClient(riderMDN,result.first_name + ' ' + result.last_name);
			}
		})

	}
	
	function getProducts() 
	{

		var userLatLng = new google.maps.LatLng(from_Lat, from_Long);
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(userLatLng);
		map.fitBounds(bounds);
		map.setZoom(17);
		$.ajax({
			url: "https://sandbox-api.uber.com/v1/products?latitude=" + from_Lat + "&" + "longitude=" + from_Long,
			headers: {
				Authorization: "Bearer " + bearer_Token
			},
			success: function(result) {
					console.log(result);	
					for(i=0; i< result.products.length ; i++)
					{
						//images.push(result.products[i].image);
						console.log(result.products[i].display_name);	
						document.getElementById(result.products[i].display_name).src = result.products[i].image;
						document.getElementById(result.products[i].display_name).className = "bright"; 
						product_Image[result.products[i].display_name] = result.products[i].image; 
		
						prod_List[result.products[i].display_name] =  result.products[i]; 
						//console.log(prod_List[result.products[i].display_name]); 
					}
			}
		});
	}

	function loadDesc(selectedProd)
	{
	if (confirm('Confirm '+ prod_List[selectedProd].display_name + '?')) 
	{
		User_loc 	= document.getElementById('pac-input-1').value; 

		console.log("LOC	: "+ User_loc);

		document.getElementById("driver_name").innerHTML = "Driver	:";
		document.getElementById("ride").innerHTML = "Ride	:"	;
		document.getElementById("driver_no").innerHTML = "Number	:";
		document.getElementById("driver_img").src = "";	

		selected_model = prod_List[selectedProd].display_name;  
		selected_desc = prod_List[selectedProd].description; 
		selected_capacity = prod_List[selectedProd].capacity; 
		selected_prod_id = prod_List[selectedProd].product_id; 

		var desc_Str = "<br/>" + "MODEL 	: " + selected_model + "<br/>" + "DESCRIPTION 	: " + selected_desc + "<br />" + "CAPACITY 	: " + selected_capacity + "<br/>" + "PRODUCT_ID 	: " + selected_prod_id ; 


		console.log(desc_Str);

		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: "https://sandbox-api.uber.com/v1/requests",
			data: JSON.stringify({"start_latitude" : (from_Lat), "start_longitude" : (from_Long) , "end_latitude" : (to_Lat) , "end_longitude" : (to_Long) , "product_id" : selected_prod_id}),
			headers: { 	
				Authorization: "Bearer " + bearer_Token
			},
			success: function(result) {
				console.log(result);
				selected_req_id =  result.request_id;
				request_Status(result, result.request_id);
			}
		});

	} 
	else 
	{
		alert(prod_List[selectedProd].display_name + ' Cancelled');
	}
	}

	/*function wait_for_driver(id)
	{
		if(id=='accept')
		{
			console.log('Driver Accepted');
			$.ajax({	 
				type: "PUT",						
				contentType: 'application/json',						
				url: "https://sandbox-api.uber.com/v1/sandbox/requests/"+ selected_req_id,
				headers: { 	
					Authorization: "Bearer " + bearer_Token
				},
				data: JSON.stringify({"status" : "accepted"}),
				success: function(result) 
				{
					console.log('Request update sent...');	
					pole_status(selected_req_id);
				}
			});
	
		}
	
		if(id=='cancel')
		{
		
		}
	}*/

	function wait_for_driver(id)
	{
		if(id=='accept')
		{
		 	//$('#accept').disable(true);
		 	//$("#driver_name").prop('disabled', true);
		 	$("#driver_name").html("Accepted");
		 	console.log('Driver Accepted');
		 	setStatus('InRide');
		 	$.ajax({	 
				type: "PUT",	
				contentType: 'application/json',						
				url: "https://sandbox-api.uber.com/v1/sandbox/requests/"+ pass_Details[selected_pass_uuid].req_id,
				headers: { 	
						Authorization: "Bearer " + bearer_Token
				},
				data: JSON.stringify({"status" : "accepted"}),
				success: function(result) 
				{
					console.log('Request update sent...');	
					var to=[];
					to.push(selected_pass_No);
					sendMessage('uber', 'Check_Req_id_status'+'$'+ pass_Details[selected_pass_uuid].req_id + '$'+'accepted', 'accepted', to);
				}
			});
				
		}
		if(id=='cancel')
		{
				
		}
	}



	function request_Status(req_status, req_id)
	{

		console.log('Request status : '+ req_status.status);
		req_status.status="processing"; 
		if(req_status.status=='processing')
		{
			Ntf_req_Status_from_driver[req_id] = "processing"; 
			document.getElementById(selected_model).src="images/uber_processing.gif";
			//alert(' Waiting for Driver '); 

			//4698038689
			var to=[]; 
			//to.push('4698038689');
			sendMessage('uber', User_uuid+'$'+User_loc+'$'+User_name+'$'+User_no+'$'+req_id, 'RequestDriverInfo', to);

			//Check with Mourya.
			//pole_status_Req(req_id);
			return;
		}

		if(req_status.status=='accepted')
		{
			document.getElementById(selected_model).src = product_Image[selected_model]; 
			console.log(req_status); 
			console.log('Driver Accepted == Name : ' + req_status.driver.name + " Number : " + req_status.driver.phone_number + " Location : " + req_status.location); 

			$('#ride_Btn').removeAttr('disabled');
			document.getElementById("driver_img_src").src = req_status.driver.picture_url;
			$('#ride_Btn').css('background-color', 'black');
			document.getElementById("driver_name").innerHTML = document.getElementById("driver_name").innerHTML + "	" + req_status.driver.name;
			document.getElementById("ride").innerHTML = document.getElementById("ride").innerHTML + "	" + selected_model;		
			document.getElementById("driver_no").innerHTML = document.getElementById("driver_no").innerHTML + "	" + req_status.driver.phone_number;


			driversLocation = new google.maps.LatLng(req_status.location.latitude, req_status.location.longitude);
		
			// Do whatever you want with userLatLng.
			var marker = new google.maps.Marker({
				position: driversLocation,
				title: 'Driver Location',
				map: map,
				icon: 'images/'+selected_model+'_small.png'
			});
    
			marker.setMap(map);
			return;
		}
	}
	function pole_status_Req(req_id)
	{
		if(Ntf_req_Status_from_driver[req_id]!="accepted")
			pole_status_Req(req_id);
		else	
		{
			Ntf_req_Status_from_driver[req_id]="accepted";
			pole_status(req_id);
		}
	}


	function pole_status(req_id)
	{		

		$.ajax({
			type: "GET",
			contentType: 'application/json',
			url: "https://sandbox-api.uber.com/v1/requests/"+ req_id,
			headers: { 	
				Authorization: "Bearer " + bearer_Token
			},
					
			success: function(result) 
			{
				
				console.log(' Request status : ' + result);
				if(result.status=='accepted')
				{
						document.getElementById(selected_model).src = product_Image[selected_model];
						console.log('Driver Accepted == Name : ' + result.driver.name + " Number : " + result.driver.phone_number + " Location : " + result.location); 
						//to = [];
						//to.push(result.driver.phone_number);
						$('#ride_Btn').removeAttr('disabled');
			document.getElementById("driver_img_src").src = result.driver.picture_url;
			$('#ride_Btn').css('background-color', 'black');
						document.getElementById("driver_name").innerHTML = document.getElementById("driver_name").innerHTML + "	" + result.driver.name; 
						document.getElementById("driver_no").innerHTML = document.getElementById("driver_no").innerHTML + "	" + result.driver.phone_number;
						document.getElementById("ride").innerHTML = document.getElementById("ride").innerHTML + "	" + selected_model;	
						
						 var userLatLng = new google.maps.LatLng(result.location.latitude, result.location.longitude);
		 // Do whatever you want with userLatLng.
						var marker = new google.maps.Marker({
							position: userLatLng,
							title: 'Driver Location',
							map: map,
							icon: 'images/'+selected_model+'_small.png'
						});
		     
						marker.setMap(map);
		
						return;
				}
				else
				{
					//Need to check with Mourya why this function is required.
					pole_status(req_id); 
				}				
			}
		});

	}
	function getUrlVars() 
	{
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	}

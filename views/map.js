function initAutocomplete() 
{
		map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 33.013087, lng: -96.691817},
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		});


		if (navigator.geolocation) 
		{
			navigator.geolocation.getCurrentPosition(setPosition);
		} 
		else 
		{	 
			x.innerHTML = "Geolocation is not supported by this browser.";
		}

		function setPosition(position) 
		{
			var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			// Do whatever you want with userLatLng.
			var marker = new google.maps.Marker({
				position: userLatLng,
				title: 'Your Location',
				map: map,
				icon: 'images/Pin.png',
				opacity: 0.5
			});
			marker.setMap(map);
		}

		  var input_1 = document.getElementById('pac-input-1');
		  var input_2 = document.getElementById('pac-input-2');

		  var searchBox_1 = new google.maps.places.SearchBox(input_1);
		  var searchBox_2 = new google.maps.places.SearchBox(input_2);
		  
		  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input_1);
		  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input_2);

		  // Bias the SearchBox results towards current map's viewport.
		  map.addListener('bounds_changed', function() {
		    searchBox_1.setBounds(map.getBounds());
		  });

		    map.addListener('bounds_changed', function() {
		    searchBox_2.setBounds(map.getBounds());
		  });
		  
		var markers = [];
		// [START region_getplaces]
		// Listen for the event fired when the user selects a prediction and retrieve
		// more details for that place.
		searchBox_1.addListener('places_changed', function() {
			var places = searchBox_1.getPlaces();

			if (places.length == 0) {
				return;
			}

			// Clear out the old markers.
			markers.forEach(function(marker) {
			marker.setMap(null);
			});
			markers = [];

			// For each place, get the icon, name and location.
			var bounds = new google.maps.LatLngBounds();
			places.forEach(function(place) {
				var icon = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
				};

				// Create a marker for each place.
				var marker = new google.maps.Marker({
					map: map,
					icon: icon,
					title: place.name,
					zoom: 9,
					position: place.geometry.location,
					icon: 'images/Pin.png',
					opacity: 0.3
				});
  
				from_Lat = place.geometry.location.lat(); 
				from_Long = place.geometry.location.lng(); 
  
				console.log(from_Lat + " " + from_Long );
  
				markers.push(marker);

				if (place.geometry.viewport) {
					// Only geocodes have viewport.
					bounds.union(place.geometry.viewport);
				} else {
					bounds.extend(place.geometry.location);
				}
			});
			map.fitBounds(bounds);
			map.setZoom(17);
		});




		searchBox_2.addListener('places_changed', function() {
			var places = searchBox_2.getPlaces();
			if (places.length == 0) {
				return;
			}


			// For each place, get the icon, name and location.
			var bounds = new google.maps.LatLngBounds();
			places.forEach(function(place) {
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			var marker = new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				zoom: 9,
				position: place.geometry.location,
				icon: 'images/Pin.png',
				opacity: 0.3
			});
  
			to_Lat = place.geometry.location.lat(); 
			to_Long = place.geometry.location.lng(); 
  
			console.log(to_Lat + " " + to_Long );
  
			markers.push(marker);

			if (place.geometry.viewport) 
			{
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} 
			else 
			{
				bounds.extend(place.geometry.location);
			}
			});
			map.fitBounds(bounds);
			map.setZoom(17);
		});
// [END region_getplaces]
}

function set_user_location(user_uuid, user_location, user_name)
{

	var geocoder = new google.maps.Geocoder();
	var address = user_location;

	geocoder.geocode( { 'address': address}, function(results, status) {

	if (status == google.maps.GeocoderStatus.OK) {
		var latitude = results[0].geometry.location.lat();
		var longitude = results[0].geometry.location.lng();
		//alert(latitude);
		
			var userLatLng = new google.maps.LatLng(latitude, longitude);
			// Do whatever you want with userLatLng.
			var marker = new google.maps.Marker({
				position: userLatLng,
				title: user_uuid,
				map: map,
				icon: 'images/Pin.png',
				opacity: 0.5
    			});
	
		marker.setMap(map);
		
		maker_List[user_uuid] = marker; 
				
	
			google.maps.event.addListener(marker,'click', function() {
				selected_pass_uuid 		= marker.title; 
				selected_pass_Location		= pass_Details[selected_pass_uuid].location; 
				selected_pass_Name 		= pass_Details[selected_pass_uuid].name; 
				selected_pass_No		= pass_Details[selected_pass_uuid].number; 
				selected_req_id			= pass_Details[selected_pass_uuid].req_id;
				
				console.log(selected_pass_uuid);
				console.log(selected_pass_Location);
				console.log(selected_pass_Name);
				console.log(selected_pass_No);
				console.log(selected_req_id);
				
				
				document.getElementById("pasngr_name").innerHTML = "Passenger Name	:" + selected_pass_Name; 
				document.getElementById("pasngr_no").innerHTML = "Passenger Number	:" + selected_pass_No; 
				document.getElementById("pasngr_loc").innerHTML = "Passenger Location	:" + selected_pass_Location; 
			
				to = [];
				to.push(selected_pass_No);


				var infowindow = new google.maps.InfoWindow({
				content: document.getElementById('popup_passenger').innerHTML});
								
				infowindow.open(map,marker);
			
			});
			
	} 
	});
}



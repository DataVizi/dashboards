var client = new Keen({
  projectId: "5368fa5436bf5a5623000000",
  readKey: "3f324dcb5636316d6865ab0ebbbbc725224c7f8f3e8899c7733439965d6d4a2c7f13bf7765458790bd50ec76b4361687f51cf626314585dc246bb51aeb455c0a1dd6ce77a993d9c953c5fc554d1d3530ca5d17bdc6d1333ef3d8146a990c79435bb2c7d936f259a22647a75407921056"
});

var geoProject = new Keen({
  projectId: "53eab6e12481962467000000",
  readKey: "d1b97982ce67ad4b411af30e53dd75be6cf610213c35f3bd3dd2ef62eaeac14632164890413e2cc2df2e489da88e87430af43628b0c9e0b2870d0a70580d5f5fe8d9ba2a6d56f9448a3b6f62a5e6cdd1be435c227253fbe3fab27beb0d14f91b710d9a6e657ecf47775281abc17ec455"
});

Keen.ready(function(){




  // ----------------------------------------
  // New Users Timeline
  // ----------------------------------------
  var new_users = new Keen.Query("count", {
    eventCollection: "new_users",
    interval: "monthly",
    timeframe: "this_year"
  });
  client.draw(new_users, document.getElementById("chart-01"), {
    chartType: "columnchart",
    title: false,
    height: 295,
    width: "auto",
    chartOptions: {
      legend: { position: "none" },
      chartArea: {
        height: "75%",
        left: "5%",
        top: "5%",
        width: "90%"
      },
      bar: {
        groupWidth: "85%"
      },
      isStacked: true
    }
  });

  // ----------------------------------------
  // Users
  // ----------------------------------------


  var users = new Keen.Query("count_unique", {
  eventCollection: "activations",
  targetProperty: "user.id"
  });

  geoProject.run(users, function(res){
    $(".users").val(res.result).trigger('change');  
    $(".users").knob({
      'angleArc':250,
      'angleOffset':-125,
      'readOnly':true,
      'min':40,
      'max':500,
      'fgColor': "#8383c6",
      'width':290,
      'height':290
    });
  });


  // ----------------------------------------
  // Errors Detected
  // ----------------------------------------


  var errors = new Keen.Query("count", {
  eventCollection: "user_action",
  filters: [{"property_name":"error_detected","operator":"eq","property_value":true}]
  });

  geoProject.run(errors, function(res){
    $(".errors").val(res.result).trigger('change');  
    $(".errors").knob({
      'angleArc':250,
      'angleOffset':-125,
      'readOnly':true,
      'min':0,
      'max':100,
      'fgColor': "#f35757",
      'width': 290,
      'height': 290
    });
  });

  // ----------------------------------------
  // Funnel
  // ----------------------------------------

  var funnel = new Keen.Query('funnel', {
    steps: [
      {
         event_collection: "account_setup",
         actor_property: "user.id"
      },
      {
        event_collection: "device_activated",
        actor_property: "user.id"
      },
      {
        event_collection: "first_data_sent_to_cloud",
        actor_property: "user.id"
      },
      {
        event_collection: "first_mobile_app_view",
        actor_property: "user.id"
      }
    ]
  });

  client.draw(funnel, document.getElementById("chart-05"), {
    chartType: "barchart",    
    title: false,
    width: "auto",
    chartOptions: {
      legend: { position: "none" }
    },
    labelMapping: {
      "account_setup": "Account Set-up",
      "device_activated": "Device Activated",
      "first_data_sent_to_cloud": "First Data to Cloud",
      "first_mobile_app_view": "First App View"
    }
  });

  // ----------------------------------------
  // Mapbox - Active Users
  // ----------------------------------------
  L.mapbox.accessToken = 'pk.eyJ1Ijoicml0Y2hpZWxlZWFubiIsImEiOiJsd3VLdFl3In0.lwvdUU2VGB9VGDw7ulA4jA';
  var map = L.mapbox.map('map', 'ritchieleeann.j7bc1dpl', {
    attributionControl: true
  });
  map.setView([37.61, -122.357], 9);
  map.attributionControl
  .addAttribution('<a href="https://keen.io/">Custom Analytics by Keen IO</a>');
  // .addAttribution('<a href="https://foursquare.com/">Places data from Foursquare</a>');
  var keenMapData = L.layerGroup().addTo(map);

  var users_active = new Keen.Query("count", {
    eventCollection: "users_active",
    interval: "hourly",
    groupBy: "user.device_info.browser.family",
    timeframe: {
      start: "2014-05-04T00:00:00.000Z",
      end: "2014-05-05T00:00:00.000Z"
    }
  });
  client.run(users_active, function(res){
    console.log(res);

     // Transform each venue result into a marker on the map.
    // for (var i = 0; i < result.response.venues.length; i++) {
    //   var venue = result.response.venues[i];
    //   var latlng = L.latLng(venue.location.lat, venue.location.lng);
    //   var marker = L.marker(latlng)
    //     .bindPopup('<h2><a href="https://foursquare.com/v/' + venue.id + '">' +
    //         venue.name + '</a></h2>')
    //     .addTo(foursquarePlaces);
    // }

  });


});
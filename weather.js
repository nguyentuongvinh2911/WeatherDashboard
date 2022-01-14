$(document).ready(function () { // do searches whenever page loaded
  $("input").change(function() { // do searches whenever page user change input
    // Store unit whenever input changed
    storeUnit();
    // do two parallel searches
    // for City1
    var CityName = $("#City1NameTextbox").val();
    var Outputbox = $("#City1");
    SearchWeather(CityName, Outputbox);
    if (xhttp.readyState == 4){
      // Clear error message
      $("#errorMessage").empty();
    }

    // for City2
    var CityName = $("#City2NameTextbox").val();
    var Outputbox = $("#City2");
    SearchWeather(CityName, Outputbox);
    if (xhttp.readyState == 4){
      // Clear error message
      $("#errorMessage").empty();
    }
  });
  // Display Date
  var dateToDisplay = new Date().toLocaleDateString();
  $("#DateTextbox").val(dateToDisplay);

   // Load data
   loadUnit();
   loadCity();

  // do two parallel searches
  // for City1
  var CityName = $("#City1NameTextbox").val();
  var Outputbox = $("#City1");
  SearchWeather(CityName, Outputbox);

  // for City2
  var CityName = $("#City2NameTextbox").val();
  var Outputbox = $("#City2");
  SearchWeather(CityName, Outputbox);
  function SearchWeather(CityName, Outputbox) {
    // (1) create the AJAX object
    var xhttp = new XMLHttpRequest();

    
    // attach the onreadystatechange call-back
    // to process the response
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // only do this is we have a valid response

        // the response data is a JSON in the responseText property of the XMLHttpRequest
        var SearchResponse = this.responseText;

        // now process the responseText into an object and use the properties of the object
        var obj = JSON.parse(SearchResponse);

        // now obj is now an JavaScript object with the properties etc from the api.openweathermap.org API
        // create a javascript date object from the UNIX time seconds * 1000 miliseconds
        //var city_name = obj.name;
        var lat = obj.coord.lat;
        var lon = obj.coord.lon;
        var CurrentTime = new Date((obj.dt) * 1000);
        var Sunrise = new Date((obj.sys.sunrise) * 1000);
        var Sunset = new Date((obj.sys.sunset) * 1000);
        var temp = obj.main.temp;
        var pressure = obj.main.pressure;
        var wind_speed = obj.wind.speed;
        var wind_direction = obj.wind.deg;
        var weather_description = obj.weather[0].description;
        var weather_icon = obj.weather[0].icon;
        // Temperature convert
        var tempFinal;
        var tempC = temp - 273.15
        var tempF = 9/5*(temp - 273.15)+32;
        if ($("#Unit1").prop("checked")) {
          tempFinal = Math.round(tempC) + "°C";
        }
        else if ($("#Unit2").prop("checked")){
          tempFinal = Math.round(tempF) + "°F";
        }

        // Output the Current Weather
        var SearchResultsHTML =
          "Latitude: " +
          lat +
          "<br />" +
          "Longitude: " +
          lon +
          "<br />" +
          "Current Time: " +
          CurrentTime.toLocaleTimeString() +
          "<br />" +
          "Sunrise: " +
          Sunrise.toLocaleTimeString() +
          "<br />" +
          "Sunset: " +
          Sunset.toLocaleTimeString() +
          "<br />" +
          "Temperature: " +
          tempFinal +
          "<br />" +
          "Pressure: " +
          pressure +
          "<br />" +
          "Wind Speed: " +
          wind_speed +
          "<br />" +
          "Wind Direction: " +
          wind_direction +
          "<br />" +
          "Weather: " +
          weather_description +
          "<br />" +
          '<img src="http://openweathermap.org/img/wn/' +
          weather_icon +
          '@2x.png" /><br /><br />';

        // Store unit only when valid input
        storeCity();
        // display output to the user
        $(Outputbox).find(".Current").html(SearchResultsHTML);

        // For Hourly Weather
        var xhttp2 = new XMLHttpRequest();

        // attach the onreadystatechange call-back
        // to process the response
        //(2)
        xhttp2.onreadystatechange = function () {
          // process the nested search based on lat/lon (One Call API)
          if (this.readyState == 4 && this.status == 200) {
            // one output at the end whole process
            var SearchResponse2 = this.responseText;

            var obj2 = JSON.parse(SearchResponse2);

            // get array of 48 hourly forecast results
            var hourly = obj2.hourly;
            // get array of 3 hours forecast results
            var threeHours = hourly.slice(1, 4);
            // Output the forecast: loop over the hours array 3 times
            var SearchResultsHTML2 = "";
            //for (var index = 0; index < 3; index++) {
            $.each(threeHours, function (index, hour){
              // Convert Temperature
              var tempFinalHourly;
              var tempCHourly =hour.temp - 273.15;
              var tempFHourly = 9/5*(hour.temp - 273.15)+32;
              if ($("#Unit1").prop("checked")) {
                tempFinalHourly = Math.round(tempCHourly) + "°C";
              }
              else if ($("#Unit2").prop("checked")){
                tempFinalHourly = Math.round(tempFHourly) + "°F";
              }
              // Convert time
              var Time = new Date(hour.dt * 1000);
              // Build String
              SearchResultsHTML2 +=
                "Time: " +
                Time.toLocaleTimeString() +
                "<br />" +
                "Temperature: " +
                tempFinalHourly +
                "<br />" +
                "Pressure: " +
                hour.pressure +
                "<br />" +
                "Wind Speed: " +
                hour.wind_speed +
                "<br />" +
                "Wind Direction: " +
                hour.wind_deg +
                "<br />" +
                "Probability of Precipitation  " +
                hour.pop +
                "<br />" +
                'icon: <img src="http://openweathermap.org/img/wn/' +
                hour.weather[0].icon +
                '@2x.png" /><br /><br />';
            });
              // display output to the user
              $(Outputbox).find(".Hourly").html(SearchResultsHTML2);
              // Clear error message
              $("#errorMessage").empty();
          }
          else if(this.readyState == 4 && this.status == 404){
            $("#errorMessage").text("Weather forecast unavailable - please retry");
            // Clear the results
            $(Outputbox).find(".Hourly").empty();
          }
        };
        //(3)
        // note the API key
        var apiKey = "89576513acfa93b1cc8acf98b35d068e";
        // build the search string for the request
        var SearchString2 =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          apiKey;

        // (4) open a connection (we use get here)
        xhttp2.open("GET", SearchString2, true); // true = means Async request
        // (5) send the request and wait for the response (triigers the callback)
        xhttp2.send();
      }
      else if(this.readyState == 4 && this.status == 404){
        $("#errorMessage").text("City name not found");
        // Clear the results
        $(Outputbox).find(".Current").empty();
        $(Outputbox).find(".Hourly").empty();
      }
    };

    // (3) compose the request
    // get inputs from the user
    //var CityName = $("#CityNameTextbox").val();

    // note the API key
    var apiKey = "89576513acfa93b1cc8acf98b35d068e";
    // build the search string for the request
    SearchString =
      "https://api.openweathermap.org/data/2.5/weather" +
      "?q=" +
      CityName +
      "&APPID=" +
      apiKey;

    // (4) open a connection (we use get here)
    xhttp.open("GET", SearchString, true); // true = means Async request
    // (5) send the request and wait for the response (triggers the callback)
    xhttp.send();
  }

  // Loading data:
  function loadUnit(){
    // get anything stored under the key "temperatureUnit" as JSON data
    var unitStored = localStorage.getItem('temperatureUnit'); // JSON String
    if (unitStored) { // check if there is something stored
      var unit = String(JSON.parse(unitStored)); // then parse / convert it to string
    }
    // Check what is the unit
    if(unit == "c"){
      // Set radio button as Celsius
      $("#Unit1").prop("checked", true);
    }
    else if(unit == "f") {
      // Set radio button as Fahrenheit
      $("#Unit2").prop("checked", true);
    }
  }
  function loadCity(){
    // get anything stored under the key "unit" as JSON data
    var cityStored = localStorage.getItem('cities'); // JSON String
    if (cityStored) { // check if there is something stored
      // if we have data (in JSON) , then parse back into an array of data objects = "records"
      var cities = JSON.parse(cityStored); 
      // set the cities stored into textbox
      $("#City1NameTextbox").val(String(cities[0]));
      $("#City2NameTextbox").val(String(cities[1]));
    }
  }
  // Storing data
  function storeUnit() {
    var unitToStore = "";
    if ($("#Unit1").prop("checked")) {
      localStorage.setItem("temperatureUnit", JSON.stringify("c"));
    }
    else if ($("#Unit2").prop("checked")){
      localStorage.setItem("temperatureUnit", JSON.stringify("f"));
    }
  }
  function storeCity() {
    var citiesToStore = [];
    citiesToStore[0] = $("#City1NameTextbox").val();
    citiesToStore[1] = $("#City2NameTextbox").val();
    localStorage.setItem("cities", JSON.stringify(citiesToStore));
  }
});
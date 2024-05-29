$(document).ready(function () {
  // ... (your existing code)

  // Function to append weather data dynamically to the page
  function appendWeatherToPage(cityName, temperatureData, weatherIcon, perciptation) {
    // Create a new div to hold the weather data
    var weatherDiv = $("<div>");
  
    // Create and append the city name element
    var cityNameElem = $("<h2>").text(cityName);
    weatherDiv.append(cityNameElem);
  
    // Create and append the temperature data element
    var temperatureElem = $("<p>").text(temperatureData);
    weatherDiv.append(temperatureElem);
  
    // Create and append the weather icon element
    var iconElem = $("<img>").attr("src", `path/to/icons/${weatherIcon}.png`); // Assuming you have weather icons stored locally
    weatherDiv.append(iconElem);
  
    // Create and append the precipitation data element
    var percipitationElem = $("<p>").text(perciptation ? "There will be precipitation." : "There will be no precipitation.");
    weatherDiv.append(percipitationElem);
  
    // Append the weather div to the page
    $("#forecast").append(weatherDiv); // Assuming you have a div with id "weatherContainer" to hold the weather data
  }
  function forecast(locationKey) {
    var key = "QFHiIoVVbCLzbrruqyMqB2TAF35USXGN";
    var queryURL =`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${key}`;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then((data) => {
      console.log(data);
      data.DailyForecasts.forEach((forecast) => {
        var cityName = data.Headline.Text;
        var temperatureData = forecast.Temperature.Minimum.Value + "°F" + " / " + forecast.Temperature.Maximum.Value + "°F";
        var weatherIcon = forecast.Day.Icon;
        var perciptation = forecast.Day.hasPrecipitation;
        appendWeatherToPage(cityName, temperatureData, weatherIcon, perciptation);
      });
    }).catch((error) => {
      console.error("Error getting forecast data:", error);
    });
  }
  // Function to get current location and fetch weather
  var getCurrentLocationWeather = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          var key = "QFHiIoVVbCLzbrruqyMqB2TAF35USXGN";

          $.ajax({
            type: "GET",
            url: `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${key}&q=${latitude}%2C${longitude}`,
            dataType: "json",
          }).then((data) => {
            appendWeatherToPage(data, data.name, true);
            console.log(data.name);
            forecast(data.name);
          });
        },
        function (error) {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Trigger getCurrentLocationWeather when the page loads
  getCurrentLocationWeather();

  // Search button click event
  $(".search").on("click", function (event) {
    event.preventDefault();
    var cityInput = $(".search-input").val();
    var key = "	QFHiIoVVbCLzbrruqyMqB2TAF35USXGN";
    if (cityInput.trim() !== "") {
      $.ajax({
        type: "GET",
        url: `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key}&q=${cityInput}`,
        dataType: "json",
      }).then((data) => {
        console.log(data)
        console.log(data[0].LocalizedName)
        console.log(data[0].Key)
        forecast(data[0].Key);
        $(".card-deck").empty();
        
        console.log(data[0].LocalizedName);
      });
    } else {
      console.error("Please enter a valid city.");
    }
  });
});

$(document).ready(function () {
  function appendWeatherToPage(
    cityName,
    dateData,
    temperatureData,
    weatherIcon,
    rain,
    wind, 
    humidity,
    message
  ) {
    var weatherDiv = $("<div>");
    if (dateData === "Current Weather") {
      var mainDisplay = $("<div>").addClass("main-display-container");
      var cityNameElem = $("<h2>").text(cityName);
      var cityNameDiv = $("<div>").append(cityNameElem).addClass("city-name-container");
      mainDisplay.append(cityNameDiv);
  
      var dateElem = $("<p>").text(dateData);
      var dateDiv = $("<div>").append(dateElem).addClass("date");
      cityNameDiv.append(dateDiv);

      var temperatureElem = $("<p>").text(temperatureData);
      var tempAndMessageDiv = $("<div>").append(temperatureElem).addClass("tempAndMessage");
      var temperatureDiv = $("<div>").append(tempAndMessageDiv).addClass("temp-container");
      mainDisplay.append(temperatureDiv); 

      var messageData = $("<p>").text(message);
      tempAndMessageDiv.append(messageData);
      
      var iconNumber = String(weatherIcon).padStart(2, "0");
      // var iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;
      var iconElem = $("<img>").attr("src", `icons/${weatherIcon}.svg`);    
      var iconContainer = $("<div>").append(iconElem).addClass("icon-container");
      temperatureDiv.append(iconContainer);
       
  
      var rainElem = $("<p>").text("Rain: " + rain);
      var rainDiv = $("<div>").append(rainElem).addClass("rain");
      $("#todayCard").append(rainDiv);
      var windElem = $("<p>").text("Wind: " + wind);
      var windDiv = $("<div>").append(windElem).addClass("wind");
      $("#todayCard").append(windDiv); 
  
      var humidityElem = $("<p>").text("Humidity: " + humidity);
      var humidityDiv = $("<div>").append(humidityElem).addClass("humidity");
      $("#todayCard").append(mainDisplay);
      $("#todayCard").append(humidityDiv); 
      
    }
    var dateElement = $("<p>").text(dateData).addClass("date");
    weatherDiv.append(dateElement);

    var temperatureElem = $("<p>").text(temperatureData).addClass("temp");
    weatherDiv.append(temperatureElem);

    var iconNumber = String(weatherIcon).padStart(2, "0");
    var iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;
    var iconElem = $("<img>").attr("src", iconUrl);

    weatherDiv.append(iconElem);

    $("#forecast").append(weatherDiv)
  }
  // This function pull the forecast for 5 days
  function forecast(locationKey, cityName) {
    var key = "QFHiIoVVbCLzbrruqyMqB2TAF35USXGN";
    var queryURL = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${key}&details=true`;
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .then((data) => {
        data.DailyForecasts.forEach((forecast) => {
          var date = new Date(forecast.Date).toDateString(); // Get the date string
          var temperatureData = "L: " +
            forecast.Temperature.Minimum.Value +
            "°F" +
            " / " + "H: " +
            forecast.Temperature.Maximum.Value +
            "°F";
          var weatherIcon = forecast.Day.Icon;
          var message = forecast.Day.IconPhrase
          console.log(data);
          appendWeatherToPage(
            cityName,
            date,
            temperatureData,
            weatherIcon,
            message
          );
        });
      })
      .catch((error) => {
        console.error("Error getting forecast data:", error);
      });
  }

  // function to get current weather
  function currentWeather(locationKey, cityName) {
    var key = "QFHiIoVVbCLzbrruqyMqB2TAF35USXGN";
    var queryURL = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${key}&details=true`;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then((weatherData) => {
      console.log(weatherData);
      var temperatureData = weatherData[0].Temperature.Imperial.Value + "°F";
      var weatherIcon = weatherData[0].WeatherIcon;
      var rain = weatherData[0].Precip1hr.Imperial.Value + " In";
      var wind = weatherData[0].Wind.Speed.Imperial.Value + " mph"; 
      var humidity = weatherData[0].RelativeHumidity + "%"; 
      var message = weatherData[0].WeatherText;
      appendWeatherToPage(
        cityName,
        "Current Weather",
        temperatureData,
        weatherIcon,
        rain,
        wind,
        humidity,
        message
      );
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
            var city = data.LocalizedName;
            var key = data.Key;
            console.log(key);
            currentWeather(key, city);
            forecast(key, city);
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
        var city = data[0].EnglishName;
        $("#forecast").empty();
        $("#todayCard").empty();
        currentWeather(data[0].Key, city);
        forecast(data[0].Key, city);

        // console.log(data[0].LocalizedName);
      });
    } else {
      console.error("Please enter a valid city.");
    }
  });
});

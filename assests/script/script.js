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
    // Convert dateData to a Date object
    var dateDat = new Date(dateData);

    // Get the hours from the date
    var hours = dateDat.getHours();
    if (dateData === "Current Weather") {
      var mainDisplay = $("<div>").addClass("main-display-container");

      var cityNameDiv = $("<div>")
        .addClass("city-name-container")
        .append($("<h2>").text(cityName))
        .append($("<div>").addClass("date").append($("<p>").text(dateData)));

      mainDisplay.append(cityNameDiv);

      var tempAndMessageDiv = $("<div>")
        .addClass("tempAndMessage")
        .append($("<p>").text(temperatureData).attr("id", "temp"))
        .append($("<p>").text(message).attr("id", "message"));

      var todayDataContainer = $("<div>")
        .addClass("today-data-container")
        .append(
          $("<div>")
            .addClass("rain")
            .append($("<p>").text("Rain: " + rain))
        )
        .append(
          $("<div>")
            .addClass("wind")
            .append($("<p>").text("Wind: " + wind))
        )
        .append(
          $("<div>")
            .addClass("humidity")
            .append($("<p>").text("Humidity: " + humidity))
        );
      var temperatureDiv = $("<div>")
        .addClass("temp-container")
        .append(todayDataContainer)
        .append(tempAndMessageDiv)
        .append(
          $("<div>")
            .addClass("icon-container")
            .append($("<img>").attr("src", `icons/${String(weatherIcon)}.svg`))
        );

      mainDisplay.append(temperatureDiv);

      $("#todayCard").append(mainDisplay);

      return;
    }

    weatherDiv
      .addClass("hourly-weather-container")
      .append($("<p>").addClass("date").text(dateData))
      .append($("<p>").addClass("temp").text(temperatureData))
      .append($("<img>").attr("src", `icons/${String(weatherIcon)}.svg`));

    if (dateData.includes(":")) {
      // Append to a different div
      $("#hourly").append(weatherDiv);
    } else {
      // Append to the original div
      $("#forecast").append(weatherDiv);
    }
    $("#hourly-text").text("Hourly Forecast");
    $("#forecast-text").text("5 Day Forecast");
  }
  // This function pull the forecast for 5 days
  function forecast(locationKey, cityName) {
    var key = "QFHiIoVVbCLzbrruqyMqB2TAF35USXGN";
    var queryURL = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${key}&details=true`;
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .then((data) => {
        data.DailyForecasts.forEach((forecast) => {
          var dateObject = new Date(forecast.Date);
          var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          var date = days[dateObject.getDay()];
          var temperatureData =
            "L: " +
            forecast.Temperature.Minimum.Value +
            "°F" +
            " / " +
            "H: " +
            forecast.Temperature.Maximum.Value +
            "°F";
          var weatherIcon = forecast.Day.Icon;
          var message = forecast.Day.IconPhrase;
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
    var queryURL = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${key}&details=true`;
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
  // Returns the hourly weather for the selected area
  function hourlyWeather(locationKey, cityName) {
    var key = "QFHiIoVVbCLzbrruqyMqB2TAF35USXGN";
    var queryURL = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${key}&details=true`;
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .then((data) => {
        var limit = 8;
        for (var i = 0; i < Math.min(data.length, limit); i++) {
          var forecast = data[i];
          var date = new Date(forecast.DateTime).toLocaleTimeString([], {
            timeStyle: "short",
          });
          var temperatureData = forecast.Temperature.Value + "°F";
          var weatherIcon = forecast.WeatherIcon;
          var message = forecast.IconPhrase;
          console.log(forecast);
          appendWeatherToPage(
            cityName,
            date,
            temperatureData,
            weatherIcon,
            message
          );
        }
      })
      .catch((error) => {
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
            url: `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${key}&q=${latitude}%2C${longitude}`,
            dataType: "json",
          }).then((data) => {
            var city = data.LocalizedName;
            var key = data.Key;
            console.log(key);
            hourlyWeather(key, city);
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
        $("#hourly").empty();
        currentWeather(data[0].Key, city);
        forecast(data[0].Key, city);
        hourlyWeather(data[0].Key, city);
        // console.log(data[0].LocalizedName);
      });
    } else {
      console.error("Please enter a valid city.");
    }
  });
});

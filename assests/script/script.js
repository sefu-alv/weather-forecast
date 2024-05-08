$(document).ready(function () {
  // ... (your existing code)

  // Function to append weather data dynamically to the page
  var appendWeatherToPage = function (
    data,
    cityName,
    isCurrentWeather = false
  ) {
    var iconCode = data.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

    var weatherIcon = $("<img>")
      .addClass("weather-icon ")
      .attr("src", iconUrl)
      .attr("alt", data.weather[0].description);

    // Convert the timestamp to a Date object
    var date = new Date(data.dt * 1000);

    // Format the date
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are zero-based
    var year = date.getFullYear();

    var formattedDate = month + "/" + day + "/" + year;

    var cardTitle = $("<h2>")
      .addClass("fw-bold card-title  mb-2 mt-2")
      .text(cityName + " " + "(" + formattedDate + ")");

    var temperatureInKelvin = data.main.temp;
    var temperatureInCelsius = temperatureInKelvin - 273.15;
    var temperatureInFahrenheit = (temperatureInCelsius * 9) / 5 + 32;
    var temp = $("<p>")
      .addClass("")
      .text("Temperature: " + temperatureInFahrenheit.toFixed(2) + " °F");

    var wind = $("<p>")
      .addClass("card-text text-black ")
      .text("Wind: " + data.wind.speed + " MPH");
    var humidity = $("<p>")
      .addClass("card-text  mb-2")
      .text("Humidity: " + data.main.humidity + " %");

    var cardBody = $("<div>").addClass("card-body ");
    cardBody.append(cardTitle, weatherIcon, temp, wind, humidity);

    if (isCurrentWeather) {
      // Append to current weather card
      $("#todayCard").empty().append(cardBody);
    } else {
      // Append to forecast card
      var card = $("<div>").addClass("card");
      var cardBodyForecast = $("<div>").addClass("card-body");
      var cardSection = $("<div>").addClass("card-section  text-black");
      cardSection.append(weatherIcon, temp, wind, humidity);
      cardBodyForecast.append(cardTitle, cardSection);
      card.append(cardBodyForecast);
      $(".card-deck").append(card);
    }
    console.log(data);
  };
  function forecast(city) {
    var key = "QFHiIoVVbCLzbrruqyMqB2TAF35USXGN";
    var queryURL = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${city}&appid=${key}`;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var cityName = response.city.name;
      // Filter the list of forecasts to get one forecast for each day
      var dailyForecasts = response.list.filter(function (forecast) {
        return forecast.dt_txt.endsWith("12:00:00");
      });

      // For each filtered forecast, create a card and append it to the page
      dailyForecasts.forEach(function (forecast) {
        appendWeatherToPage(forecast, cityName);
      });
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
        url: `https://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${key}&q=${cityInput}`,
        dataType: "json",
      }).then((data) => {
        console.log(data)
        console.log(data.LocalizedName)
        appendWeatherToPage(data, data.EnglishName, true); 
        $(".card-deck").empty();
        forecast(data.EnglishName);
      });
    } else {
      console.error("Please enter a valid city.");
    }
  });
});

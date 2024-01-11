$(document).ready(function () {
  // ... (your existing code)

  // Function to append weather data dynamically to the page
  var appendWeatherToPage = function (data, isCurrentWeather = false) {
    var iconCode = data.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
  
    var weatherIcon = $("<img>")
      .addClass("weather-icon custom-left-margin")
      .attr("src", iconUrl)
      .attr("alt", data.weather[0].description);
  
    // Convert the timestamp to a Date object
    var date = new Date(data.dt * 1000);
  
    // Format the date
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are zero-based
    var year = date.getFullYear();
  
    var formattedDate = month + '/' + day + '/' + year;
  
    var cardTitle = $("<h2>")
      .addClass("fw-bold card-title custom-left-margin mb-2 mt-2")
      .text(data.name + " " + "(" + formattedDate + ")");
  
    var temperatureInKelvin = data.main.temp;
    var temperatureInCelsius = temperatureInKelvin - 273.15;
    var temperatureInFahrenheit = (temperatureInCelsius * 9) / 5 + 32;
    var temp = $("<p>")
      .addClass('custom-left-margin')
      .text("Temperature: " + temperatureInFahrenheit.toFixed(2) + " °F");
  
    var wind = $("<p>")
      .addClass("card-text text-white custom-left-margin")
      .text("Wind: " + data.wind.speed + " MPH");
    var humidity = $("<p>")
      .addClass("card-text custom-left-margin mb-2")
      .text("Humidity: " + data.main.humidity + " %");

    var cardBody = $("<div>").addClass("card-body border border-black");
    cardBody.append(cardTitle, weatherIcon, temp, wind, humidity);

    if (isCurrentWeather) {
      // Append to current weather card
      $("#todayCard").empty().append(cardBody);
    } else {
      // Append to forecast card
      var card = $("<div>").addClass("card bg-white");
      var cardSection = $("<div>").addClass("card-section custom-left-margin text-black");
      cardSection.append(weatherIcon, temp, wind, humidity);
      card.append(cardTitle, cardSection);
      cardBody.append(card);
      $(".card-deck").append(cardBody);
    }
  };
  function forecast(city) {
    var key = "a6b192a96b840ed8a0ce76098bebce52";
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`;
  
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // Filter the list of forecasts to get one forecast for each day
      var dailyForecasts = response.list.filter(function(forecast) {
        return forecast.dt_txt.endsWith("12:00:00");
      });
  
      // For each filtered forecast, create a card and append it to the page
      dailyForecasts.forEach(function(forecast) {
        appendWeatherToPage(forecast);
      });
    });
  }
  // Function to get current location and fetch weather
  var getCurrentLocationWeather = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var key = "a6b192a96b840ed8a0ce76098bebce52";

        $.ajax({
          type: "GET",
          url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`,
          dataType: "json",
        }).then((data) => {
          appendWeatherToPage(data, true); // Append current location weather
          forecast(data.name);
          console.log(data);
        });
      }, function (error) {
        console.error("Error getting current location:", error);
      });
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
    var key = "a6b192a96b840ed8a0ce76098bebce52";
    if (cityInput.trim() !== "") {
      $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${key}`,
        dataType: "json",
      }).then((data) => {
        appendWeatherToPage(data, true); // Append searched location weather
        forecast(data.name);
      });
    } else {
      console.error("Please enter a valid city.");
    }
  });
});

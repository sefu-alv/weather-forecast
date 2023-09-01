$(document).ready(function () {
  // incorporates date
  var currentDate = new Date();

  var formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  //  this function retrieves the stored history from local storage
  var getStoredHistory = function () {
    return JSON.parse(localStorage.getItem("history")) || [];
  };

  // this function stores history in local storage
  var storeHistory = function (cityInput) {
    var history = getStoredHistory();
    history.push(cityInput);
    localStorage.setItem("history", JSON.stringify(history));
  };

  // this function displays history
  var displayHistory = function () {
    var storedHistory = getStoredHistory();
    var historyList = $(".history");
    for (var i = 0; i < storedHistory.length; i++) {
      var listItem = $("<li>")
        .addClass("list-group-item btn text-black-50 mb-3 ")
        .text(storedHistory[i]);
      historyList.append(listItem);
    }
  };

  var currentWeather = function (cityInput) {
    var key = "a6b192a96b840ed8a0ce76098bebce52";
    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${key}`,
      dataType: "json",
    })
      .then((data) => {
        console.log(data);

        // fetches the weather icons
        var iconCode = data.weather[0].icon;
        var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        //  dynamically adding elements to the index.html
        var weatherIcon = $("<img>")
          .addClass("weather-icon custom-left-margin")
          .attr("src", iconUrl)
          .attr("alt", data.weather[0].description);

        var cardTitle = $("<h2>")
          .addClass("fw-bold card-title custom-left-margin mb-2 mt-2")
          .text(data.name + " " + "(" + formattedDate + ")");
        var temp = $("<p>")
          .addClass("card-text custom-left-margin")
          .text("Temp: " + data.main.temp + " C");

        var wind = $("<p>")
          .addClass("card-text custom-left-margin")
          .text("Wind: " + data.wind.speed + " MPH");

        var humidity = $("<p>")
          .addClass("card-text custom-left-margin mb-2")
          .text("Humidity: " + data.main.humidity + " %");

        // appending the created elements and classes
        var cardBody = $("<div>").addClass("card-body border custom-left-margin border-black");
        cardBody.append(cardTitle, weatherIcon, temp, wind, humidity);

        // Clear the previous content and append the card body to the card
        $("#todayCard").empty().append(cardBody);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  };

  // this functions shows the forcast for the next 5 days
  var forecast = function (cityInput) {

    var key = "a6b192a96b840ed8a0ce76098bebce52";
    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${key}`,
      dataType: "json",
    }).then((data) => {
      console.log(data);

      // creating a card grid class using bootstrap
      var cardGrid = $(".card-deck");
      var currentDate = new Date(data.list[0].dt_txt);

// loop will determine how long the forecast needs to be
      for (var i = 0; i < 5; i++) {
        var forecastData = data.list[i];
        var cardBody = $("<div>").addClass("card-body ");
        var card = $("<div>").addClass("card bg-dark");
        var formattedDate = currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
    
        // adds the title to each card
        var cardTitle = $("<h2>")
          .addClass("fw-bold card-title text-white mb-2 mt-2 custom-left-margin")
          .text(formattedDate);

          var iconCode = forecastData.weather[0].icon; 
          var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
          
          // Dynamically adding elements to the index.html
          var forecastIcon = $("<img>")
            .addClass("weather-icon")
            .attr("src", iconUrl)
            .attr("alt", forecastData.weather[0].description);


        var cardSection = $("<div>").addClass("card-section custom-left-margin text-white");
        var temperature = $("<p>").text(
          "Temperature: " + forecastData.main.temp + "°C"
        );


        var wind = $("<p>").text("Wind: " + forecastData.wind.speed + " MPH");
        var humid = $("<p>").text(
          "Humidity: " + forecastData.main.humidity + " %"
        );

        // Appending the card components
        cardSection.append(forecastIcon);
        cardSection.append(temperature);
        cardSection.append(wind);
        cardSection.append(humid);
        card.append(cardTitle);
        card.append(cardSection);
        cardBody.append(card);
        cardGrid.append(cardBody);

        // increments the date
        currentDate.setDate(currentDate.getDate() + 1);

      }
    });
  };

  
  // Search button click event
  $(".search").on("click", function (event) {
    event.preventDefault();
    var cityInput = $(".search-input").val();
    currentWeather(cityInput);
    storeHistory(cityInput);
    displayHistory();
    forecast(cityInput);
  });
});

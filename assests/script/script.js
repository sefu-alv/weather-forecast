$(document).ready(function () {
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
        var currentDate = new Date();
        var formattedDate = currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        var iconCode = data.weather[0].icon;
        var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        var weatherIcon = $("<img>")
          .addClass("weather-icon")
          .attr("src", iconUrl)
          .attr("alt", data.weather[0].description);

  
        var cardTitle = $("<h2>")
          .addClass("fw-bold card-title mb-2 mt-2")
          .text(data.name + " " + "(" + formattedDate + ")");
        var temp = $("<p>")
          .addClass("card-text")
          .text("Temp: " + data.main.temp + " C");
        var wind = $("<p>")
          .addClass("card-text")
          .text("Wind: " + data.wind.speed + " MPH");
        var humidity = $("<p>")
          .addClass("card-text mb-2")
          .text("Humidity: " + data.main.humidity + " %");

        var cardBody = $("<div>").addClass("card-body border border-black");
        cardBody.append(cardTitle, weatherIcon, temp, wind, humidity);

        // Clear the previous content and append the card body to the card
        $("#todayCard").empty().append(cardBody);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  };
var forcast = function(cityInput){

}
  // Search button click event
  $(".search").on("click", function (event) {
    event.preventDefault();
    var cityInput = $(".search-input").val();
    currentWeather(cityInput);
    storeHistory(cityInput);
    displayHistory();
  });
});

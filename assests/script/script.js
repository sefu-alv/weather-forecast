
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
        var listItem = $("<li>").addClass("list-group-item btn text-black-50 mb-3 ").text(storedHistory[i]);
        historyList.append(listItem);

    }
};
    
  
    //this function displays current weather
    var currentWeather = function (cityInput) {
      var key = "a6b192a96b840ed8a0ce76098bebce52";
      $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${key}`,
        dataType: "json",
      })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    };
  
    // Search button click event
    $(".search").on("click", function (event) {
      event.preventDefault();
      var cityInput = $(".search-input").val();
      currentWeather(cityInput);
      storeHistory(cityInput);
      displayHistory();
    });
  
  });
  
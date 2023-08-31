$(document).ready(function(){
    // This function listens for when the search button is pressed then it calls the current weather function
    $('.search').on('click', function (event) {
        event.preventDefault();
        var cityInput = $(".search-input").val();
        currentWeather(cityInput);
        storeHistory(cityInput);
    });

    // Stores user history
    var storeHistory = function (cityInput){
        var history = JSON.parse(localStorage.getItem("history")) || [];
        history.push(cityInput);
        localStorage.setItem("history", JSON.stringify(history));
        displayHistory();
    };

    // Displays history on the main page
    var displayHistory = function() {
       var storedHistory = JSON.parse(localStorage.getItem("history"));
       for (var i = 0; i < storedHistory.length; i++) {
        $(".history").append(`<li>${storedHistory[i]}</li>`);
       }
       console.log(storedHistory);
    }
    //the current weather function pulls in the city input and search for it then displays it on the console log 
    var currentWeather = function(cityInput) {
        var key = "a6b192a96b840ed8a0ce76098bebce52";
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${key}`
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
    };
    
});


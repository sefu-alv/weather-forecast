$(document).ready(function(){
    // This function listens for when the search button is pressed then it shows then it calls the current weather funtion
    $('.search').on('click', function (event) {
        event.preventDefault();
        var cityInput = $(".search-input").val();
        currentWeather(cityInput);
        
    });
    
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
    
})


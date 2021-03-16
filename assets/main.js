// u06-weather-dashboard main.js created by Erickson Powell for UW-SEA-FSF Coding Bootcamp

//API WIZARDRY
const APIKey = "a3b4f18c52ad53eb1775853a7b8fe0c0";
const APIKeyName = "homework";

//get previously searched cities, or empty array (fresh localstorage/search)
let storedCities = JSON.parse(localStorage.getItem("storedCities")) || [];

// GIVEN a weather dashboard with form inputs

//Initializes vars to use later (kinda sloppy, kinda not)
let cityName, cityTemp, cityHumidity, windSpeed, uvIndex;

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// API CALLLLLLLLL
function getWeatherByCity() {
  // let city = "seattle"     //test line
  //first call is to grab lat&lon
  let cityQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=${APIKey}`

  //API
  $.ajax({
    url: cityQueryURL,
    method: "GET"
  }).then(function(cityLatLonRes) {
    console.log(cityLatLonRes);
    let lat = cityLatLonRes.coord.lat;
    let lon = cityLatLonRes.coord.lon;
    //second call is to get all weather data needed for application
    let weatherQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}`
    $.ajax({
      url: weatherQueryURL,
      method: "GET"
    }).then(function(weatherRes) {
      console.log(weatherRes);
    }).catch((error) => console.log("Second API call error: ", error))
    
  }).catch((error) => console.log("First API call error: ", error))
}

//init var & search click handler
let cityToSearch = "";

$("#searchCity").click(function(e) {
  e.preventDefault();
  cityToSearch = $(this).parent().find("input").val();
  console.log(cityToSearch);
  //passes city into API call function
  getWeatherByCity(cityToSearch);
});

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index







// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

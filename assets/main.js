// u06-weather-dashboard main.js created by Erickson Powell for UW-SEA-FSF Coding Bootcamp

//API WIZARDRY
const API_KEY = "a3b4f18c52ad53eb1775853a7b8fe0c0";

// function Kelvin to F
function kelvTF(tempInKelvin) {
  return (parseFloat(((tempInKelvin) - 273.15) * (9/5) + 32).toPrecision(4) + " °F");
}

//get previously searched cities, or empty array (fresh localstorage/search)
let storedCities = JSON.parse(localStorage.getItem("storedCities")) || [];

// GIVEN a weather dashboard with form inputs

//Initializes vars to use later (kinda sloppy, kinda not)
let cityName, cityTemp, cityHumidity, windSpeed, uvIndex;

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// API CALLLLLLLLL
function getWeatherByCity(cityToSearch) {
  // let city = "seattle"     //test line
  //first call is to grab lat&lon
  let cityQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=${API_KEY}`

  //API
  $.ajax({
    url: cityQueryURL,
    method: "GET"
  }).then(function(cityLatLonRes) {
    //log the response
    console.log(cityLatLonRes);
    //set lat/lon for detailed api call
    let lat = cityLatLonRes.coord.lat;
    let lon = cityLatLonRes.coord.lon;
    //second call is to get all weather data needed for application
    let weatherQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_KEY}`
    $.ajax({
      url: weatherQueryURL,
      method: "GET"
    }).then(function(weatherRes) {
      //log response
      console.log(weatherRes);
      //this is where i will fill vars from response
      let ccTemp = kelvTF(weatherRes.current.temp);
      let ccHumid = (weatherRes.current.humidity) + "%";
      let ccWindSpeed = weatherRes.current.wind_speed;
      let ccUVIndex = weatherRes.current.uvi;
      let ccDate = moment().format("dddd, MMMM Do YYYY");
      console.log(`Temp: ${ccTemp}, Humidity: ${ccHumid}, Wind Speed: ${ccWindSpeed}, UV Index: ${ccUVIndex}`);
      
      $("#ccHeader").text(cityToSearch);
      $("#ccDate").text(ccDate);
      $("#ccTemp").text(`Temp: ${ccTemp}`);
      $("#ccHumid").text(`Humidity: ${ccHumid}`);
      $("#ccWindSpeed").text(`Wind Speed: ${ccWindSpeed} MPH`);
      $("#ccUVIndex").text(`UV Index: ${ccUVIndex}`);

      //5day loop start
      let fiveDayForcast = weatherRes.daily;

      for(let i = 1; i <= 5; i++) {
        $(`#day${i}date`).text(moment().add(i, "days").format("MM/DD/YY"));
        $(`#day${i}icon`).attr("src", `http://openweathermap.org/img/w/${fiveDayForcast[i].weather[0].icon}.png`);
        $(`#day${i}temp`).text(kelvTF(fiveDayForcast[i].temp.day));
        $(`#day${i}humid`).text(`${fiveDayForcast[i].humidity}%`);
      }


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
  detailedSearchRes = getWeatherByCity(cityToSearch);
  
  displayCurrentSearch(detailedSearchRes);
  
});

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

function displayCurrentSearch(detailedSearchRes) {
}





// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

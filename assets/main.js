// u06-weather-dashboard main.js created by Erickson Powell for UW-SEA-FSF Coding Bootcamp

//API WIZARDRY
const API_KEY = "a3b4f18c52ad53eb1775853a7b8fe0c0";

// function Kelvin to F
function kelvTF(tempInKelvin) {
  return (parseFloat(((tempInKelvin) - 273.15) * (9/5) + 32).toPrecision(4) + " °F");
}

//set date
let ccDate = moment().format("dddd, MMMM Do YYYY");
$("#ccDate").text(ccDate);

//get previously searched cities, or empty array (fresh localstorage/search)
let mostRecentSearch = localStorage.getItem("city") || "";
let storedCities = JSON.parse(localStorage.getItem("storedCities")) || [];

// GIVEN a weather dashboard with form inputs

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

      console.log(`Temp: ${ccTemp}, Humidity: ${ccHumid}, Wind Speed: ${ccWindSpeed}, UV Index: ${ccUVIndex}`);
      
      $("#ccHeader").text(cityToSearch);
      $("#ccTemp").text(`Temp: ${ccTemp}`);
      $("#ccHumid").text(`Humidity: ${ccHumid}`);
      $("#ccWindSpeed").text(`Wind Speed: ${ccWindSpeed} MPH`);
      $("#ccUVIndex").text(`UV Index: ${ccUVIndex}`);

      //UV Index Color function
      //colors and ranges from https://www.epa.gov/sunsafety/uv-index-scale-0
      function uvColor() {
        if (ccUVIndex >= 11) {
          $("#ccUVIndex").css({"backgroundColor": "hsl(303, 100%, 18%)", "color":"white"});
        } else if (ccUVIndex < 11 && ccUVIndex > 7) {
          $("#ccUVIndex").css({"backgroundColor": "darkred", "color":"white"});
        } else if (ccUVIndex < 8 && ccUVIndex >= 6) {
          $("#ccUVIndex").css({"backgroundColor": "darkorange"});
        } else if (ccUVIndex < 6 && ccUVIndex >= 3) {
          $("#ccUVIndex").css({"backgroundColor": "yellow"});
        } else
          $("#ccUVIndex").css({"backgroundColor": "green", "color":"white"});
      }
      uvColor();

      //5day loop start
      let fiveDayForcast = weatherRes.daily;

      for(let i = 1; i <= 5; i++) {
        $(`#day${i}date`).text(moment().add(i, "days").format("MM/DD/YY"));
        $(`#day${i}icon`).attr("src", `https://openweathermap.org/img/w/${fiveDayForcast[i].weather[0].icon}.png`);
        $(`#day${i}temp`).text(kelvTF(fiveDayForcast[i].temp.day));
        $(`#day${i}humid`).text(`Humidity: ${fiveDayForcast[i].humidity}%`);
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
  getWeatherByCity(cityToSearch);
  //adds city to searched list
  addCityToList(cityToSearch);
});

//store city
function addCityToList(city) {
  localStorage.setItem("city", city);
  //if city isnt stored, store it
  if(!(storedCities.includes(localStorage.getItem("city")))) {
    storedCities.push(localStorage.getItem("city"));
  }
  if(storedCities.length > 7) {
    storedCities.splice(storedCities[0], 1);
  }
  localStorage.setItem("storedCities", JSON.stringify(storedCities));

  //render city list
  renderCityList();
}

//rendercity list function
function renderCityList() {
  let cityList = $("#searchedCityList");
  cityList.empty();
  if(storedCities.length > 0){
    for(let i = 0; i < storedCities.length; i++) {
      let searchedCity = storedCities[i];
      let cityByLine = $("<li>").text(searchedCity).addClass(`list-group-item li-hover border`).attr("city", searchedCity);
      cityList.prepend(cityByLine);
    }
  }
}
renderCityList();

$("#searchedCityList").on("click", ".li-hover", function() {
  cityToSearch = $(this).attr("city");
  console.log(cityToSearch);
  //passes city into API call function
  getWeatherByCity(cityToSearch);
});


// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

function loadRecentSearch(searchCity) {
  if(searchCity !== "") {
    getWeatherByCity(searchCity);
  }
}
loadRecentSearch(mostRecentSearch);

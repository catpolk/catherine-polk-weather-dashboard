var fetchButton = document.getElementById('fetch-button');
const apiKey = "fd4520c83ce363d53b2477e844a3ab5f";

displaySearchHistory();

//entering city name 
document.getElementById("fetch-button").onclick = enterCity;

function enterCity(){
  var cityName = document.getElementById("enter-city").value;
  //checks if a user entered a city name, if not - displays alert message
  if (cityName == "") {
    alert("Please enter a city name")
  }else{
    getApi(cityName);
  }
}

//gets API fetchign geolocation
function getApi(cityName) {
  var geoRequestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
  
  fetch(geoRequestUrl)
    .then(function (response) { //promise 
      return response.json();
    })
    .then(function (data){ //fetching forecast, .then promise
      var weatherRequestUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${data[0].lat}&lon=${data[0].lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;

      fetch(weatherRequestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data){
        
          saveToLocalStorage(cityName);
          displaySearchHistory();
          
          var cityCurrent = document.getElementById("city-none"); 
          cityCurrent.style.display = "none";
          document.getElementById("current-day-city-name").textContent = cityName;//display city name entered by a user to the search box 
          document.getElementById("current-date").textContent = new Date(data.current.dt*1000).toLocaleDateString('en-US'); //using unix time stamp converter to display date 
          document.getElementById("temp-current").textContent = data.current.temp; //current temperature 
          document.getElementById("wind-current").textContent = data.current.wind_speed; //current wind speed
          document.getElementById("humidity-current").textContent = data.current.humidity; //current humidity 
          document.getElementById("uv-current").textContent = data.current.uvi; // current uv
          document.getElementById("current-weather-icon").setAttribute('src', `https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`) //displays icons from openweather data 

          for (var i = 1; i < 6; i++) { //loop that takes only 5 future days to show the weather
            var weatherData = data.daily[i];
            document.getElementById(`temp-${i}`).textContent = weatherData.temp.day;
            document.getElementById(`wind-${i}`).textContent = weatherData.wind_speed;
            document.getElementById(`humidity-${i}`).textContent = weatherData.humidity;
            document.getElementById(`currentDate-${i}`).textContent = new Date(weatherData.dt*1000).toLocaleDateString('en-US'); 
            document.getElementById(`icon-${i}`).setAttribute(`src`, `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`)
          }
          document.getElementById('display-temp').style.display = "block";
        });
    })
    .catch(function(){ //promise prototype .catch deals with rejected cases only, in this case it deals with incorrectly entered city into the search box
      alert('City entered incorrectly, please try again'); //window alert meassage 
    });     
}  
//function taht saves entered city to the local storage 
function saveToLocalStorage(cityName) {
  var lastCity = [cityName]
  var searchHistory = JSON.parse(window.localStorage.getItem("city")) || [];//storing everithing in the local storage 
  if (!searchHistory.includes(cityName)){ //this condition stops from regenerating a button for the seame searched city. The includes() method determines whether an array includes a certain value among its entries, returning true or false as appropriate.
    window.localStorage.setItem("city", JSON.stringify(lastCity.concat(searchHistory))); //storing entered cities into the local storage and creating an array 
}};

//this function parses stored data and displays it in the window 
function displaySearchHistory() { 
  var searchHistory = JSON.parse(window.localStorage.getItem("city")) || []; 
  var searchHistoryBox = document.getElementById("search-history-box");
  searchHistoryBox.innerHTML = "";
  
//this loop goes through the search history and 
  for (var i = 0; i < searchHistory.length; i++) {
    let btnSearch = document.createElement('button'); //creating a button element for searched city
    btnSearch.textContent = searchHistory[i];
    btnSearch.classList.add("btn", "btn-secondary", "btn-lg", "btn-block");
    //when a user clicks on the saved button element with the city name from previous search, the new weather forecast returns 
    btnSearch.addEventListener("click", function(event) { 
      getApi(event.target.innerText);
    });

    searchHistoryBox.append(btnSearch);
  }

}


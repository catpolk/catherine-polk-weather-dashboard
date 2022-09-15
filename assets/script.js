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


function getApi(cityName) {
  var geoRequestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
  
  fetch(geoRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data){
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
          document.getElementById("current-day-city-name").textContent = cityName;
          document.getElementById("current-date").textContent = new Date(data.current.dt*1000).toLocaleDateString('en-US');
          document.getElementById("temp-current").textContent = data.current.temp;
          document.getElementById("wind-current").textContent = data.current.wind_speed;
          document.getElementById("humidity-current").textContent = data.current.humidity;
          document.getElementById("uv-current").textContent = data.current.uvi;
          document.getElementById("current-weather-icon").setAttribute('src', `https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`)

          for (var i = 1; i < 6; i++) {
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
    .catch(function(){
      alert('City entered incorrectly, please try again');
    }); 


    
}  
// function capitalizeFirstLetter(str) {
//   const capitalizedCity = str.charAt(0).toUpperCase() + str.slice(1);

//     return capitalized;
// }


function saveToLocalStorage(cityName) {
  var lastCity = [cityName]
  var searchHistory = JSON.parse(window.localStorage.getItem("city")) || [];//putting everithing in the local storage 
  window.localStorage.setItem("city", JSON.stringify(lastCity.concat(searchHistory)));
}



function displaySearchHistory() {
  var searchHistory = JSON.parse(window.localStorage.getItem("city")) || []; //reading what we have in the local storage 
  var searchHistoryBox = document.getElementById("search-history-box");
  searchHistoryBox.innerHTML = "";
  

  for (var i = 0; i < searchHistory.length; i++) {
    let btnSearch = document.createElement('button');
    btnSearch.textContent = searchHistory[i];
    btnSearch.classList.add("btn", "btn-secondary", "btn-lg", "btn-block");
    
    btnSearch.addEventListener("click", function(event) { 
      getApi(event.target.innerText);
    });

    searchHistoryBox.append(btnSearch);
  }

}


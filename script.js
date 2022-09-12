var fetchButton = document.getElementById('fetch-button');

const apiKey = "fd4520c83ce363d53b2477e844a3ab5f";

function getApi() {
  var geoRequestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=Austin&appid=${apiKey}`;
  
  fetch(geoRequestUrl)
    .then(function (response) {
      return response.json();
    }).then(function (data){
      var weatherRequestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&cnt=6&appid=${apiKey}`;
      
      fetch(weatherRequestUrl)
      .then(function (response) {
        return response.json();
      }).then(function (data){
        console.log(data);
      });
      
    }); 
    
}  

fetchButton.addEventListener('click', getApi);
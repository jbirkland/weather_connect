

var apiKey = "702dea6c4abd18dcd53720b81e5b872e";
var citySearchBtn = $("#srchBtn");
var { lat } = location;
var { lon } = location;
var ulDiv = document.getElementById("list");
var todaysForecast = document.getElementById("currentforecast");
var uvIndex;
var cityStorage = JSON.parse(localStorage.getItem("cityNames")) || [];


var newButton;

function getCityBtns(storedButtons) {
  if (typeof Storage !== "undefined") {
    let storedButtons = JSON.parse(localStorage.getItem("cityNames"));
    if (storedButtons) {
      for (let btnName of storedButtons) {
        let newButton = $(
          `<button id= '${btnName}' class='cityNames'>${btnName}</button>`
        );
        $("#btnsection").append(newButton);

        document.getElementById("btnsection").onclick = function (e) {
          event.preventDefault();
          var buttonName = [storedButtons];
          // getUvIndex(cityName)
          getLatAndLon(buttonName);

          if ((ulDiv.length = 1)) {
            ulDiv.replaceChildren();
          } else {
            ulDiv.append();
          }
        };
      }
    }
  }
}
getCityBtns();

// function getUvIndex(city){
// var fiveDaysUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon=' +lon+ '&appid=702dea6c4abd18dcd53720b81e5b872e&units=imperial';
// fetch(fiveDaysUrl)
// .then(function(response){
// return response.json();
// }) .then(function(data){
//     uvIndex = data.daily[0].uvi;
// console.log ("")
// })
// }
function getLatAndLon(cityName) {
  var requestUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=` +apiKey +"&units=imperial";
  
      fetch(requestUrl)

      .then(function (response) {
        return response.json();
      })
        .then(function (data) {

          console.log(data);
          lat = data.coord.lat;
          lon = data.coord.lon;
          console.log(lat);
          console.log(lon);
          // getUvIndex();
          var day = moment().format("MM/DD/YYYY");
          var header1 = document.getElementById("cityTitle");
          var createElemUl = document.createElement("ul");
          var createElemLi0 = document.createElement("li");

          var createElemLi1 = document.createElement("li");
          var image = document.createElement("img");
          image.src =
           "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

          var createElemLi2 = document.createElement("li");
          var createElemLi3 = document.createElement("li");
          var createElemLi4 = document.createElement("li");
          var createElemLi5 = document.createElement("li");

          header1.textContent = data.name;
          createElemLi0.textContent = day;
          createElemLi1.textContent;
          createElemLi2.textContent = "Temp: " + data.main.temp;
          createElemLi3.textContent = "Humidity: " + data.main.humidity;
          createElemLi4.textContent = "Wind: " + data.wind.speed;
          createElemLi5.textContent = "UV Index: " + uvIndex;
         
          createElemUl.appendChild(createElemLi0);
          createElemUl.appendChild(image);
          createElemUl.appendChild(createElemLi2);
          createElemUl.appendChild(createElemLi3);
          createElemUl.appendChild(createElemLi4);
          createElemUl.appendChild(createElemLi5);
          ulDiv.appendChild(createElemUl);

          getWeather(lat, lon);
    });
}

function getWeather(lat, lon) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=702dea6c4abd18dcd53720b81e5b872e`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var slicedArr = data.daily.slice(0, 6);
      console.log(slicedArr);
      for (var i = 0; i < slicedArr.length; i++) {
        var currentDay = slicedArr[i];
      }
      futureForecast(lat, lon);
    });
}


function addCityButton(cityName) {
      var newCityButton = document.createElement("button");
      newCityButton.setAttribute("type", "button");
      newCityButton.setAttribute("value", cityName);
      newCityButton.textContent = cityName;
       newCityButton.style.width = "200px";
      newCityButton.style.height = "50px";
      newCityButton.style.marginTop = "20px";
      document.getElementById("btnsection").appendChild(newCityButton);

      newCityButton.onclick = function () {
      event.preventDefault();

        getLatAndLon(cityName);

        if ((ulDiv.length = 1)) {
          ulDiv.replaceChildren();
      } else ulDiv.append();

  };
}

citySearchBtn.on("click", function (event) {
  event.preventDefault();
  var cityName = $("#cityTyped").val();
  // getUvIndex(cityName)
  getLatAndLon(cityName);

      if ((ulDiv.length = 1)) {
         ulDiv.replaceChildren();
      } else {
          ulDiv.append();
      }

 
        cityStorage.push(cityName);
        localStorage.setItem("cityNames", JSON.stringify(cityStorage));


          addCityButton(cityName);

  
});


function futureForecast(lat, lon) {
  var fiveDaysUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=702dea6c4abd18dcd53720b81e5b872e&units=imperial";
    
  fetch(fiveDaysUrl).then(function (response) {
    return response.json().then(function (data) {
      for (var i = 0; i < 5; i++) {
        $("#date" + i).html(
          moment.unix(data.daily[i].dt, "x").format("MM/DD/YYYY") +
            "<img src='http://openweathermap.org/img/w/" +
            data.daily[i].weather[0].icon +
            ".png'/>"
        );
        $("#temp" + i).text("Temp: " + data.daily[i].temp.day + "F");
        $("#wind" + i).text("Wind: " + data.daily[i].wind_speed + "MPH");
        $("#humidity" + i).text("Hum:" + data.daily[i].humidity + "%");
        uvIndex = data.daily[i].uvi;
      }
      uvIndex = data.daily[0].uvi;
      console.log(uvIndex);
    });
  });
}

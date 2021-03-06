//variables
var city = "";
var citiesArray = [];
var queryURL = "";
var listItemNum = 0;

//current date
var d = new Date();
//returns day as number 1 to 31
var date = d.getDate();
//returns month as number 0 to 11
var monthIndex = d.getMonth();
//returns year
var year = d.getFullYear();

//on click search
$(".btn").on("click", function () {
  event.preventDefault();
  console.log(listItemNum);
  city = $("#searchItm").val();
  console.log(city);
  citiesArray.unshift(city);
  console.log(citiesArray);
  localStorage.setItem("current", city);
  localStorage.setItem("citiesLocalStore", citiesArray);
  appendList(city);
  getCoords(city);
});

//on click list of cities
$(".buttons").on("click", function () {
  
  alert("ypu clicked: "+this.value);
  getCoords(this.value);
});

function appendList(name) {

  var listItem = $("<li>");
  var button = $("<button>");
  var listGroup = $(".list-group");
  listItem.attr("id", listItemNum)
  button.text(name);
  button.attr("class", "list-group-item list-group-item-action buttons");
  button.attr("value", name);
  button.attr("id", "city" + listItemNum);
  listItem.append(button);
  if (listItemNum === 0) {
    listGroup.append(listItem);
  }
  else {
    var prev = listItemNum - 1;
    console.log(prev);
    $(".nav").prepend(listItem);
  }
  listItemNum++;
}

function getCoords(name) {
  queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&appid=2d651d973073a30ce5cf8e74013d0663";
  console.log(queryURL);
  console.log(name);
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response) {
      console.log(response);
      //necessary parameters
      var lat = response.coord.lat;
      var long = response.coord.lon;
      findWeather(lat, long, name);
    });
}


function findWeather(lattitude, longittude, city) {
  //building url to query database
  queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longittude + "&appid=2d651d973073a30ce5cf8e74013d0663";

  //run AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response2) {

      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(response2);

      // Transfer content to HTML
      $(".city").html("<h1>" + city + " " + date + "/" + (monthIndex + 1) + "/" + year);
      $(".wind").text("Wind Speed: " + response2.current.wind_speed + " m/s");
      $(".humidity").text("Humidity: " + response2.current.humidity + " %");
      $(".UV").text("UX Index: ");
      var UVbutton = $("<button>");
      if (response2.current.uvi <= 4) {
        UVbutton.attr("class", "btn btn-success");
      }
      else if ((response2.current.uvi < 9) && (response2.current.uvi > 4)) {
        UVbutton.attr("class", "btn btn-warning");
      }
      else {
        UVbutton.attr("class", "btn btn-danger");
      }
      $(".UV").append(UVbutton);
      UVbutton.text(response2.current.uvi);
      //weather icon object
      var iDiv=$("<div>");
      var iconHead = $("<i>");

      var iconCode = (response2.current.weather[0].icon);

      var iconurl = "https://openweathermap.org/img/wn/" + iconCode+".png";
      iconHead.attr("src", iconurl);
      iconHead.attr("alt", "Header Icon");
      iconHead.attr("class", "weather");
      iDiv.append(iconHead);
      $(".city").append(iDiv);
      // Convert the temp to fahrenheit
      var tempF = (response2.current.temp - 273.15) * 1.80 + 32;

      // add temp content to html
      $(".temp").text("Temperature: " + response2.current.temp + " °K");
      $(".tempF").text("Temperature: " + tempF.toFixed(2) + " °F");
      forecast(response2);
    });

}

function forecast(response2) {
  //main card div
  for (var k = 0; k < 5; k++) {
    var dates =[];
    dates[k] = new Date();
    dates[k].setDate(dates[k].getDate() + k+1);
    
    //returns day as number 1 to 31
var date = dates[k].getDate();
//returns month as number 0 to 11
var monthIndex = dates[k].getMonth();
//returns year
var year = dates[k].getFullYear();
    var heading = $("#day" + k);
    heading.text(date + "/" + (monthIndex+1)  + "/" + year);
  }
  
  for (var i = 0; i < 5; i++) {
    

      
      //weather icon for forecast
    var icon = $("#icon" + i);
    var dailyIconCode = (response2.daily[i].weather[0].icon);
    var dailyIconurl = "https://openweathermap.org/img/wn/" + dailyIconCode + "@2x.png";
    icon.attr("src", dailyIconurl);

    icon.attr("alt", "Forecast Icon");
    icon.attr("class", "weather");
    //variables to points in HTML
    var temp_i = $(".temp" + i);
    var tempF_i = $(".tempF" + i);
    var humidity_i = $(".humidity" + i);
    //card words
    var dayTK = response2.daily[i].temp.day;
    var dayTF = ((response2.daily[i].temp.day - 273.15) * 1.80 + 32).toFixed(2);
    var dayHumidity = response2.daily[i].humidity;
    //combined
    temp_i.text("Temperature: " + dayTK + " °K");
    tempF_i.text("Temperature: " + dayTF + " °F");
    humidity_i.text("Humidity: " + dayHumidity + " %");
    }
}
    function createSearchList(){
       var storedCity =localStorage.getItem("current");
       var array =localStorage.getItem("citiesLocalStore");
       var storedCities =array.split(",");
       console.log(storedCities);
       console.log(storedCity);
       if(storedCity!==null&&storedCities!==null){
      console.log("1");
      getCoords(storedCity);
      for(var i =0;i<storedCities.length;i++){
       appendList(storedCities[i]);
     }
   }  
   else if(storedCity!==null&&storedCities===null){
    console.log("2");
    getCoords(storedCity);
   }
   else if(storedCity===null&storedCities!==null){
    console.log("3");
    for(var i =0;i<storedCities.length;i++){
      appendList(storedCities[i]);
     }
   }
   else{
    console.log("4");
    for(var j=0;j<7;j++){
      $("#city"+j).text(citiesArray[j]);
       $("#city"+j).attr("value",citiesArray[j]);
}
  }
  }
  createSearchList();
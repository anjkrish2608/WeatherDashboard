//variables
var APIkey = "2d651d973073a30ce5cf8e74013d0663";
var city = "";
var citiesArray = ["Adelaide","Sydney","Alice Springs","Perth","Tasmania","Darwin","Brisbane"];
var queryURL = "";
var listItemNum=0;

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
   city = $("#searchItm").val();
  console.log(city);
  citiesArray.unshift(city);
  console.log(citiesArray);
  localStorage.setItem("cityLocalStore", city);
  localStorage.setItem("citiesLocalStore",citiesArray);
  appendList();
  getCoords();
});

$(".buttons").on("click", function () {
   city = this.value;
   getCoords();
});

function appendList(){
  
  var listItem =$("<li>");
  var button =$("<button>");
  var listGroup =$(".list-group");
  listItem.text(city);
  button.attr("class","list-group-item list-group-item-action buttons");
  button.attr("value", city);
  button.attr("id","city"+listItemNum);
  listItem.append(button);
  listGroup.append(listItem);
listItemNum++;
}

function getCoords() {
   queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response) {
      console.log(response);
      //necessary parameters
      var lattitude = response.coord.lat;
      var longittude = response.coord.lon;
      //building url to query database
      queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longittude + "&appid=" + APIkey;
           findWeather(lattitude,longittude);
    });
  }
 function findWeather(lattitude,longittude) {
        //building url to query database
        queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longittude + "&appid=" + APIkey;

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
            var UVbutton =$("<button>");
            if(response2.current.uvi<=4){
              UVbutton.attr("class","btn btn-success");
            }
            else if((response2.current.uvi<9)&&(response2.current.uvi>4) ){
              UVbutton.attr("class","btn btn-warning");
            }
            else{
              UVbutton.attr("class","btn btn-danger");
            }
            $(".UV").append(UVbutton);
            UVbutton.text(response2.current.uvi);
            //weather icon object
            var iconHead = $("<i>");

            var iconCode = (response2.current.weather[0].icon);

            var iconurl = "https://openweathermap.org/img/wn/" + iconCode;
            iconHead.attr("src", iconurl);
            iconHead.attr("alt", "Header Icon");
            iconHead.attr("class", "weather");
            $(".city").append(iconHead);
            // Convert the temp to fahrenheit
            var tempF = (response2.current.temp - 273.15) * 1.80 + 32;

            // add temp content to html
            $(".temp").text("Temperature: " + response2.current.temp + " °K");
            $(".tempF").text("Temperature: " + tempF.toFixed(2) + " °F");
          forecast(response2);
        });
          
      };

    function forecast(response2){
      for (var i = 0; i < 6; i++) {

                    //main card div
                    var heading = $("#" + i);
                    heading.text((date + i + 1) + "/" + (monthIndex + 1) + "/" + year);
                    //weather icon for forecast
                    var icon = $("#icon" + i);
                    var dailyIconCode = (response2.daily[i].weather[0].icon);
                    var dailyIconurl = "https://openweathermap.org/img/wn/" + dailyIconCode+"@2x.png" ;
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
      var storedCity =localStorage.getItem("cityLocalStore");
      var storedCities =localStorage.getItem("citiesLocalStore");
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
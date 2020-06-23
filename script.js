//this is my APIKEY
var APIkey = "2d651d973073a30ce5cf8e74013d0663";

//on click event to determine location
$(".buttons").on("click", function () {
  var city = this.value;
  var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL1,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response) {
      console.log(response);
      //necessary parameters
      var lattitude = response.coord.lat;
      var longittude = response.coord.lon;
      //building url to query database
      var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longittude + "&appid=" + APIkey;

      //run AJAX call to the OpenWeatherMap API
      $.ajax({
        url: queryURL2,
        method: "GET"
      })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response2) {

          // Log the queryURL
          console.log(queryURL2);

          // Log the resulting object
          console.log(response2);

            //current date
            var d = new Date();
            //returns day as number 1 to 31
            var date = d.getDate();
            //returns month as number 0 to 11
            var monthIndex = d.getMonth();
            //returns year
            var year = d.getFullYear();

          // Transfer content to HTML
          $(".city").html("<h1>" + city + " "+date + "/" + (monthIndex + 1) + "/" + year);
          $(".wind").text("Wind Speed: " + response2.current.wind_speed+" m/s");
          $(".humidity").text("Humidity: " + response2.current.humidity+" %");

          // Convert the temp to fahrenheit
          var tempF = (response2.current.temp - 273.15) * 1.80 + 32;

          // add temp content to html
          $(".temp").text("Temperature: " + response2.current.temp+" °K");
          $(".tempF").text("Temperature: " + tempF.toFixed(2)+" °F");
          
          //creating 5day forecast
          for (var i = 0; i < 6; i++) {
          
            //main card div
            var heading = $("#"+i);
            heading.text((date+i+1) + "/" + (monthIndex + 1) + "/" + year);
            //weather icon object
            var icon=$("#icon"+i);
            var weatherIcon ={
                "Rain":"fas fa-cloud-rain",
                "Thunderstorm":"fas fa-bolt",
                "Clouds":"fas fa-cloud",
                "Clear":"fas fa-cloud-sun"
            }
            var weatherType=(response2.daily[i].weather[0].main);
           
            var iconClass =weatherIcon[weatherType];
            icon.attr("class",iconClass);
           
            //variables to points in HTML
            var temp_i =$(".temp"+i);
            var tempF_i=$(".tempF"+i);
            var humidity_i=$(".humidity"+i);
            //card words
            var dayTK =response2.daily[i].temp.day;
            var dayTF =((response2.daily[i].temp.day - 273.15) * 1.80 + 32).toFixed(2);
            var dayHumidity=response2.daily[i].humidity;
            //combined
            temp_i.text("Temperature: "+dayTK+" °K");
            tempF_i.text("Temperature: "+dayTF+" °F");
            humidity_i.text("Humidity: "+dayHumidity+" %");

          }

        });

    });

});


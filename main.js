document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const searchButton = document.querySelector(".search-box button");
  const searchInput = document.getElementById("city-input");
  const weatherBox = document.querySelector(".weather-box");
  const weatherDetails = document.querySelector(".weather-details");
  const error404 = document.querySelector(".not-found");
  let userCountry = "";

  function detectCountry() {
    const geolocationKey = config.GEOLOCATION_API_KEY;
    fetch(`https://ipinfo.io/json?token=${geolocationKey}`)
      .then((response) => response.json())
      .then((data) => {
        userCountry = data.country;
      })
      .catch((error) => console.error("Geolocation API error:", error));
  }

  function getWeather(city, country) {
    const APIKey = config.WEATHER_API_KEY;
    const location = country ? `${city},${country}` : city; // Use city, country if available

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIKey}`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.cod === "404") {
          container.style.height = "400px";
          weatherBox.style.display = "none";
          weatherDetails.style.display = "none";
          error404.style.display = "block";
          error404.classList.add("fadeIn");
          return;
        }

        error404.style.display = "none";
        error404.classList.remove("fadeIn");

        const cityCountryElement = document.querySelector(".city-country");
        const image = document.querySelector(".weather-box img");
        const temperature = document.querySelector(".weather-box .temperature");
        const description = document.querySelector(".weather-box .description");
        const humidity = document.querySelector(
          ".weather-details .humidity span"
        );
        const wind = document.querySelector(".weather-details .wind span");

        switch (json.weather[0].main) {
          case "Clear":
            image.src = "images/clear.png";
            break;
          case "Rain":
            image.src = "images/rain.png";
            break;
          case "Snow":
            image.src = "images/snow.png";
            break;
          case "Clouds":
            image.src = "images/cloud.png";
            break;
          case "Haze":
            image.src = "images/mist.png";
            break;
          default:
            image.src = "";
        }

        cityCountryElement.textContent = `${json.name}, ${json.sys.country}`;
        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML = `${json.weather[0].description}`;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

        weatherBox.style.display = "";
        weatherDetails.style.display = "";
        weatherBox.classList.add("fadeIn");
        weatherDetails.classList.add("fadeIn");
        container.style.height = "590px";
      });
  }

  detectCountry();

  searchButton.addEventListener("click", () => {
    const city = searchInput.value;

    if (city === "") return;
    getWeather(city, userCountry);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const city = searchInput.value;

      if (city === "") return;
      getWeather(city, userCountry);
    }
  });
});

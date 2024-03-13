import openWeatherApiKey from "./apikey.js";
const apiKey=openWeatherApiKey;

// Function to determine whether it is day or night based on sunrise and sunset timestamps
function isDayOrNight(sunriseTimestamp, sunsetTimestamp) {
    let currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp >= sunriseTimestamp && currentTimestamp <= sunsetTimestamp) {
        return "day";
    } else {
        return "night";
    }
}

// Function to display weather icons based on time of day and weather type
function displayWeatherIcon(res, weatherType, image) {
    // Display different weather icons based on time of day and weather type
    const iconMappings = {
        day: {
            Clear: 'clear sky day.png',
            Clouds: 'cloudy day.png',
            Smoke: 'smoke.png',
            Haze: 'haze day.png',
            Fog: 'haze day.png',
            Drizzle: 'shower rain.png',
            Rain: 'rain day.png',
            Thunderstorm: 'storm.png',
            Snow: 'snow day.png',
            Mist: 'mist.png',
            Dust: 'dust.png',
            Sand: 'dust.png',
            Squall: 'tornado.png',
            Tornado: 'tornado.png'
        },
        night: {
            Clear: 'clear sky night.png',
            Clouds: 'cloudy night.png',
            Smoke: 'smoke.png',
            Haze: 'haze night.png',
            Fog: 'haze night.png',
            Drizzle: 'shower rain.png',
            Rain: 'rain night.png',
            Thunderstorm: 'storm.png',
            Snow: 'snow night.png',
            Mist: 'mist.png',
            Dust: 'dust.png',
            Sand: 'dust.png',
            Squall: 'tornado.png',
            Tornado: 'tornado.png'
        }
    };

    const iconMap = res === 'day' ? iconMappings.day : iconMappings.night;
    const icon = iconMap[weatherType] || 'default.png';
    image.style.backgroundImage = `url("./icons/${icon}")`;
}

// Function to create and display the current weather information
function displayCurrentWeather(data) {
    const container = document.querySelector(".weather-data");
    container.style.backgroundColor = "rgba(245, 245, 245, 0.250)";

    const leftDiv = document.createElement("div");
    leftDiv.className = "left-box";

    const imgDiv = document.createElement("div");
    imgDiv.className = "image";

    const p = document.createElement("p");
    p.innerText = `${data.weather[0].main}- ${data.weather[0].description}`;

    const weather = data.weather[0].main;
    const result = isDayOrNight(data.sys.sunrise, data.sys.sunset);
    displayWeatherIcon(result, weather, imgDiv);

    leftDiv.append(imgDiv);
    leftDiv.append(p);
    container.append(leftDiv);

    const rightDiv = document.createElement("div");
    rightDiv.className = "right-box";

    const time = document.createElement("p");
    const currentDate = new Date();
    let hours = currentDate.getHours();
    if (hours > 12) hours = hours - 12;
    const mins = currentDate.getMinutes();
    time.innerText = `Time: ${hours}:${mins} PM`;

    const cityname = document.createElement("p");
    cityname.innerText = `City: ${data.name}`;

    const temperature = document.createElement("p");
    temperature.innerText = `Temperature: ${data.main.feels_like}°C`;

    const wind = document.createElement("p");
    wind.innerText = `Wind Speed: ${data.wind.speed} km/h`;

    const humidity = document.createElement("p");
    humidity.innerText = `Humidity: ${data.main.humidity}%`;

    rightDiv.append(time);
    rightDiv.append(cityname);
    rightDiv.append(temperature);
    rightDiv.append(wind);
    rightDiv.append(humidity);
    container.append(rightDiv);
}

// Function to create temperature chart
function createTemperatureChart(temperatures) {
    const ctx = document.getElementById('temperatureChart');
    ctx.style.backgroundColor = "rgba(245, 245, 245, 0.250)";
    ctx.getContext('2d');

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: temperatures.map((_, i) => `Day ${i}`),
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(255, 0, 0, 0.5)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            maintainAspectRatio: false
        }
    });
}

// Function to create and display the 7-day weather forecast
function displaySevenDayForecast(data) {
    const container = document.querySelector(".weather-forecast");
    container.style.backgroundColor = "rgba(245, 245, 245, 0.250)";
    document.querySelector(".heading").innerText = "Weather for the next 7-days";

    for (let i = 1; i <= 7; i++) {
        const listDiv = document.createElement("div");
        const listHeading = document.createElement("h3");
        listHeading.className = "listheading";
        listHeading.innerText = `Day- ${i}`;
        listDiv.append(listHeading);

        const list = document.createElement("ul");
        list.style.marginTop = "7px";

        const weather = data[i].weather[0];
        const temperature = data[i].main;
        const wind = data[i].wind;

        const listItem1 = document.createElement("li");
        listItem1.innerText = `${weather.main}- ${weather.description}`;
        list.append(listItem1);

        const listItem2 = document.createElement("li");
        listItem2.innerText = `Temperature: ${temperature.feels_like}°C`;
        list.append(listItem2);

        const listItem3 = document.createElement("li");
        listItem3.innerText = `Wind Speed: ${wind.speed} km/h`;
        list.append(listItem3);

        const listItem4 = document.createElement("li");
        listItem4.innerText = `Humidity: ${temperature.humidity}%`;
        list.append(listItem4);

        listDiv.append(list);
        container.append(listDiv);
    }
}

// Asynchronous function to fetch and display weather information based on the provided URL
async function getWeatherInfo(url, spinner) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            document.querySelector(".weather-data").innerHTML = "";
            document.querySelector(".weather-data").style.backgroundColor = "";
            displayCurrentWeather(data);
        } else {
            console.error('Failed to fetch data. Status:', response.status);
            document.querySelector(".weather-data").innerHTML = "";
            document.querySelector(".weather-data").style.backgroundColor = "";
        }
    } catch (error) {
        console.log(error);
        document.querySelector(".weather-data").innerHTML = "";
        document.querySelector(".weather-data").style.backgroundColor = "";
        let e = document.querySelector("#error");
        e.innerText = "Please enter a valid location.";
    } finally {
        spinner.style.display = "none";
    }
}

// Asynchronous function to fetch and display the 7-day weather forecast based on the provided URL
async function getFutureForecast(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const temperatures = data.list.map(item => item.main.feels_like);
            createTemperatureChart(temperatures);
            document.querySelector(".weather-forecast").innerHTML = "";
            document.querySelector(".heading").innerText = "";
            document.querySelector(".weather-forecast").style.backgroundColor = "";
            displaySevenDayForecast(data.list);
        } else {
            console.error('Failed to fetch data. Status:', response.status);
            const ctx = document.getElementById('temperatureChart').getContext('2d');
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            document.querySelector('#temperatureChart').style.backgroundColor = "";
            document.querySelector(".heading").innerText = "";
            document.querySelector(".weather-forecast").innerHTML = "";
            document.querySelector(".weather-forecast").style.backgroundColor = "";
        }
    } catch (e) {
        console.log(e);
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        document.querySelector('#temperatureChart').style.backgroundColor = "";
        document.querySelector(".weather-forecast").innerHTML = "";
        document.querySelector(".heading").innerText = "";
        document.querySelector(".weather-forecast").style.backgroundColor = "";
    }
}

// Event listener for the button click to get weather information
document.querySelector("button").addEventListener("click", async () => {
    const city = document.querySelector(".city").value;
    const state = document.querySelector(".state").value;
    const country = document.querySelector(".country").value;
    const spinner = document.querySelector(".spinner");
    spinner.style.display = "block";
    document.querySelector(".weather-data").innerHTML = "";
    document.querySelector(".weather-data").style.backgroundColor = "";
    document.querySelector(".heading").innerText = "";
    document.querySelector(".weather-forecast").innerHTML = "";
    document.querySelector(".weather-forecast").style.backgroundColor = "";
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    document.querySelector('#temperatureChart').style.backgroundColor = "";
    if (navigator.onLine) {
        if (!city && !state && !country) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const url1 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
                const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&cnt=8&appid=${apiKey}`;
                await getWeatherInfo(url1, spinner);
                await getFutureForecast(url2);
            } catch (error) {
                let errorMessage = "Error getting location or fetching weather data.";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Geolocation permission denied by the user.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Geolocation information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Geolocation request timed out.";
                        break;
                    default:
                        console.error('Error:', error.message);
                }
                const ctx = document.getElementById('temperatureChart').getContext('2d');
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                document.querySelector('#temperatureChart').style.backgroundColor = "";
                let e = document.querySelector("#error");
                e.innerText = errorMessage;
            } finally {
                spinner.style.display = "none";
            }
        } else {
            const url1 = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=metric&appid=${apiKey}`;
            const url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${state},${country}&units=metric&cnt=8&appid=${apiKey}`;
            await getWeatherInfo(url1, spinner);
            await getFutureForecast(url2);
        }
    } else {
        let e = document.querySelector("#error");
        e.innerText = "Please check your internet connection and try again.";
        spinner.style.display = "none";
    }
});

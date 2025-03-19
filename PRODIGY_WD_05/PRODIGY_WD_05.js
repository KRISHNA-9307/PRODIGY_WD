const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function () {
    // Fetch weather for default city or user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                weatherFnByCoords(lat, lon);
            },
            (error) => {
                console.error('Error getting location:', error);
                weatherFn('Pune'); // Fallback to default city
            }
        );
    } else {
        weatherFn('Pune'); // Fallback if geolocation is not supported
    }
});

async function weatherFn(cName) {
    $('#loading').show();
    $('#weather-info').hide();
    const temp = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('An error occurred while fetching weather data. Please try again.');
    } finally {
        $('#loading').hide();
    }
}

async function weatherFnByCoords(lat, lon) {
    const temp = `${url}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
        } else {
            alert('Unable to fetch weather data for your location.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src',
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    $('#weather-info').addClass('animate__fadeIn').fadeIn();
}
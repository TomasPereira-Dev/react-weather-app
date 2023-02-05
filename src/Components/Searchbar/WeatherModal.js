import {useEffect, useState} from "react";

function WeatherModal({isOpen, lat, lon, tempUnits}){
    
    const regex = /12:00:00/;

    let weatherFetchUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f583d2e3612de8b62a858c176aa37575&units=${tempUnits}`;
    let forecastFetchUrl =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f583d2e3612de8b62a858c176aa37575&cnt=24&units=${tempUnits}`;

    const [fetchedData, setFetchedData] = useState({
        city: "",
        time: "",
        weather: "",
        maxMin: "",
        temp: "",
        icon: "",
    });

    const [fetchedForecastData, setFetchedForecastData] = useState({
        forecastIcon: "",
        forecastWeather: "",
        maxMin: [null, null],
        forecast: [],
    });

    const iconUrl = `https://openweathermap.org/img/wn/${fetchedData.icon}@2x.png`;
    const forecastIconUrl = `https://openweathermap.org/img/wn/${fetchedForecastData.forecastIcon}@2x.png`;

    let threeDayForecast = []; //this array is nesesary to use the map method

    const today = new Date();
    const utcTimeHours = today.getUTCHours();
    let utcTimeMinutes =  today.getUTCMinutes(); //universal time doesn´t change the minutes, only hours
    let hours = utcTimeHours + (fetchedData.time / 3600);

    async function weatherFetch(){
        try{
            await fetch(weatherFetchUrl)
            .then((response) => response.json())
            .then((data) => {
                setFetchedData({
                    city: `${data.name}, ${data.sys.country}`,
                    time: data.timezone,
                    weather: data.weather[0].main,
                    temp: Math.round(data.main.temp),
                    icon: data.weather[0].icon,
                })
            })
        }
        catch(error){
            console.log(error);
        };
    };
    
    async function forecastFetch(){
        try{
            await fetch (forecastFetchUrl)
            .then((response) => response.json())
            .then ((data) => {
                setFetchedForecastData({
                    forecastIcon: data.list[0].weather[0].icon,
                    forecastWeather: data.list[0].weather[0].main,
                    maxMin: [Math.round(data.list[0].main.temp_max), Math.round(data.list[0].main.temp_min)],
                    forecast: data.list,
                });
            });

        }
        catch(error){
            console.log(error);
        };
    };
    
    if(hours < 0){
      hours = (hours + fetchedData.time) * -1;
    };

    if(hours > 24){
        hours = hours - 24;
    };

    if(hours < 10){
        hours = `0` + hours;
    };

    if(utcTimeMinutes < 10){
        utcTimeMinutes = `0` + utcTimeMinutes;
    };

    useEffect(() => {
        weatherFetch();
        forecastFetch();
    }, [lat]);

    if(fetchedForecastData.forecast){
        for(let i = 0; i < fetchedForecastData.forecast.length; i++){
            if(regex.test(fetchedForecastData.forecast[i].dt_txt)){
                threeDayForecast.push(fetchedForecastData.forecast[i]);
                i++
            }else if(!fetchedForecastData.forecast[i].dt_txt){
                i++
            };
        };
    };

    if(!isOpen){ 
        return <>
        <div className="modal-wrapper">
            <div className="current-weather-container">
                <div className="text-container">
                    <h2>Please search a city for the weather to show up</h2>
                </div>
            </div>
        </div>
        </>
    };

    return( 
        <>
        <div className="modal-wrapper">
            <div className="current-weather-container">
                <div className="text-container">
                    <h2>Current weather in: </h2>
                    <h2>{fetchedData.city} | {`${hours}:${utcTimeMinutes}`}</h2>
                </div>
                <div className="icon-and-temp">
                    <img className="current-icon" src={iconUrl} alt={fetchedData.weather}/>
                    <h2>{fetchedData.weather} {fetchedData.temp}º</h2>
                </div>
            </div>
            <div className="three-hours-forecast-container">
                <div className="forecast-icon-and-temp ">
                    <h2>weather for the next 3 hours</h2>
                    <img src={forecastIconUrl} alt="weather for the next 3 hours"/>
                    <h2>{fetchedForecastData.forecastWeather} {fetchedForecastData.maxMin[0]}º max | {fetchedForecastData.maxMin[1]}º min</h2>
                </div>
            </div>
            <div className="three-days-forecast-container">
                <h2>forecast for the next 3 days</h2>
                {threeDayForecast.map((renderedWeather, index) => {
                    return(
                    (<div className="three-day-forecast-item" key={index}>
                        <h2>{renderedWeather.dt_txt.split(regex)}</h2>
                        <img src={`https://openweathermap.org/img/wn/${renderedWeather.weather[0].icon}@2x.png`} alt="forecastA"/>
                        <h2>{renderedWeather.weather[0].main} {Math.round(renderedWeather.main.temp)}º</h2>
                    </div>)
                    )
                })}
            </div>
        </div>
        </>
    );
};

export default WeatherModal;
import forecastStyles from "./forecastStyles.module.css";
import {React, useState, useCallback, useEffect} from "react";
import axios from "axios";

const Forecast = ({lat, lon, tempUnits}) => {

    const regex = /12:00:00/;

    let weatherFetchUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f583d2e3612de8b62a858c176aa37575&units=${tempUnits}`;
    let forecastFetchUrl =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f583d2e3612de8b62a858c176aa37575&cnt=24&units=${tempUnits}`;

    const [fetchedData, setFetchedData] = useState({
        city: "",
        time: "",
        weather: "",
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


    let threeDayForecast = []; //this array is nesesary to use the map method

    const today = new Date();
    const utcTimeHours = today.getUTCHours();
    let utcTimeMinutes =  today.getUTCMinutes(); //universal time doesn´t change the minutes, only hours
    let hours = utcTimeHours + (fetchedData.time / 3600);

    
    const weatherFetch = useCallback(async () => {
        try{
            const response = await axios.get(weatherFetchUrl);
            setFetchedData({
                city: `${response.data.name}, ${response.data.sys.country}`,
                time: response.data.timezone,
                weather: response.data.weather[0].main,
                temp: Math.round(response.data.main.temp),
                icon: response.data.weather[0].icon
            })
        }
        catch(error){
            console.log(error);
        };
    }, [weatherFetchUrl])

    
    const forecastFetch = useCallback(async () => {
        try{
            const response = await axios.get(forecastFetchUrl);
            setFetchedForecastData({
                forecastIcon: response.data.list[0].weather[0].icon,
                forecastWeather: response.data.list[0].weather[0].main,
                maxMin: [Math.round(response.data.list[0].main.temp_max), Math.round(response.data.list[0].main.temp_min)],
                forecast: response.data.list
            });
        }
        catch(error){
            console.log(error);
        };
    }, [forecastFetchUrl]);

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
    }, [weatherFetch, forecastFetch]);

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

    if(threeDayForecast[0]){
        return(
            <div className={forecastStyles.forecastWrapper}>
                <div className={forecastStyles.forecastContainer}>
                    <div className={forecastStyles.currentWeather}>
                        <h2>current weather in {fetchedData.city}</h2>
                        <p>{hours}:{utcTimeMinutes}</p>
                        <div className={forecastStyles.currentWeatherIconAndTempContainer}>
                            <img src={iconUrl} alt="current weather icon"/>
                            <h2>{fetchedData.temp}º</h2>
                        </div>
                        <p>{fetchedData.weather}</p>
                    </div>
                    <div className={`${forecastStyles.futureForecast} ${forecastStyles.day1}`}>
                        <h2>{threeDayForecast[0].dt_txt.split(regex)}</h2>
                        <img src={`https://openweathermap.org/img/wn/${threeDayForecast[0].weather[0].icon}@2x.png`} alt=""/>
                        <h2>{threeDayForecast[0].weather[0].main}</h2>
                    </div>
                    <div className={`${forecastStyles.futureForecast} ${forecastStyles.day2}`}>
                        <h2>{threeDayForecast[1].dt_txt.split(regex)}</h2>
                        <img src={`https://openweathermap.org/img/wn/${threeDayForecast[1].weather[0].icon}@2x.png`} alt=""/>
                        <h2>{threeDayForecast[1].weather[0].main}</h2>
                    </div>
                    <div className={`${forecastStyles.futureForecast} ${forecastStyles.day3}`}>
                        <h2>{threeDayForecast[2].dt_txt.split(regex)}</h2>
                        <img src={`https://openweathermap.org/img/wn/${threeDayForecast[2].weather[0].icon}@2x.png`} alt=""/>
                        <h2>{threeDayForecast[2].weather[0].main}</h2>
                    </div>
                </div>
            </div>
        )
    }
} 

export default Forecast;
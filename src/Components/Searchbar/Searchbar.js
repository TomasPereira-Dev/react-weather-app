import {React, useState, useEffect, useRef} from "react";
import WeatherModal from "./WeatherModal";

function Searchbar(){

    const [isOpen, setIsOpen] = useState(false); 
    const [result, setResult] = useState("");
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const searchRef = useRef(null);
    const [tempUnits, setTempUnits] = useState("metric");
    const searchButtonRef = useRef(null);
    
    function searchbarHandler(){
        const inputValue = searchRef.current.value;
        setResult(inputValue);
    };

    function tempSwitchHandler(){
        if(tempUnits === "metric"){
            setTempUnits("imperial");
        }else if(tempUnits === "imperial"){
            setTempUnits("metric");
        } 
    };

    async function searchButtonHandler(){
        try{
            await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${result}&appid=f583d2e3612de8b62a858c176aa37575`)
            .then((response) => response.json())
            .then((data) => {
                setLat(data[0].lat);
                setLon(data[0].lon);
                console.log(lat, lon)
                setIsOpen(true);
                console.log(isOpen)
            });
        }
        catch(error){
            console.log(error);
        };
        setResult("");
    };

    useEffect(() => {
        searchButtonHandler();
    }, []);

    return(
        <>
            <div className="input-wrapper">
                <div className="header-input-container">
                    <div className="app-title">
                            <div className="title-text">
                                <h1>Tomas Pereira's</h1>
                            </div>
                            <div className="title-text">
                                <h1>Weather App</h1>    
                            </div> 
                    </div>
                    <div className="input-container">
                        <input placeholder="Write a city" className="searchbar-input" ref={searchRef} onChange={searchbarHandler}/>
                        <button type="button" ref={searchButtonRef} onClick={searchButtonHandler}>Search</button>
                        <button onClick={tempSwitchHandler}>{tempUnits === "metric" ? "switch to Fahrenheit" : "Switch to Celsius"}</button>
                    </div>
                </div> 

            </div>
             <WeatherModal isOpen={isOpen} lat={lat} lon={lon} tempUnits={tempUnits}/>
        </>
    );
};

export default Searchbar;

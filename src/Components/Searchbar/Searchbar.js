import {React, useState, useRef} from "react";
import axios from "axios";
import WeatherModal from "./WeatherModal";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

function Searchbar(){

    const [isOpen, setIsOpen] = useState(false); 
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const searchRef = useRef(null);
    const [tempUnits, setTempUnits] = useState("metric");
    const searchButtonRef = useRef(null);

    function tempSwitchHandler(){
        if(tempUnits === "metric"){
            setTempUnits("imperial");
        }else if(tempUnits === "imperial"){
            setTempUnits("metric");
        } 
    };

    const searchButtonHandler = async () =>{
        try{
            const response  = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${searchRef.current.value}&appid=f583d2e3612de8b62a858c176aa37575`);
            setLat(response.data[0].lat);
            setLon(response.data[0].lon);
            setIsOpen(true);
        }
        catch(error){
            alert(error)
        }
        searchRef.current.value = "";
    }

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
                        <input placeholder="Write a city" className="searchbar-input" ref={searchRef}/>
                        <button className="search-btn" type="button" ref={searchButtonRef} onClick={searchButtonHandler}><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
                        <div className="switch-container">
                            <h2 className="switch-text">switch to Fahrenheit</h2>
                            <input type="checkbox" className="switch-checkbox" onClick={tempSwitchHandler}/>
                        </div>
                    </div>
                </div> 
            </div>
             <WeatherModal isOpen={isOpen} lat={lat} lon={lon} tempUnits={tempUnits}/>
        </>
    );
};

export default Searchbar;

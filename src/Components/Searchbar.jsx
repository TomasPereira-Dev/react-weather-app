import { useState, useRef } from "react";
import axios from "axios";
import searchbarStyles from "./searchbarStyles.module.css";
import Forecast from "./Forecast/Forecast";
const Searchbar = () => {
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
        }
        catch(error){
            alert(error)
        }
        searchRef.current.value = "";
    }

    return(
        <>
            <div className={searchbarStyles.searchbarWrapper}>
                <div className={searchbarStyles.searchbarContainer}>
                    <div className={searchbarStyles.searchbarTitle}>
                        <h1>Weather</h1>
                    </div>
                    <div className={searchbarStyles.searchbarAndButtonsContainer}>
                        <input type="text" ref={searchRef}/>
                        <div className={searchbarStyles.searchButtonContainer}>
                            <button ref={searchButtonRef} onClick={searchButtonHandler}>Search</button>
                        </div>
                    </div>
                    <div className={searchbarStyles.farenheightButtonContainer}>
                       <input type={"checkbox"} className={searchbarStyles.switchCheckbox} onClick={tempSwitchHandler}/>
                    </div>
                </div>
                <Forecast lat={lat} lon={lon} tempUnits={tempUnits}/>
            </div>
        </>
    )
}

export default Searchbar;

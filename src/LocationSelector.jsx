import React from "react";
import { useState,useEffect } from "react";

const LocationSelector=()=>{
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(""); // State to track selection
  const [states,setStates]=useState([]);
  const [selectedState,setSelectedState]=useState("");
  const [city,setCity]=useState([]);
  const [selectedCity,setSelectedCity]=useState("");
  useEffect(() => {
    sessionStorage.clear(); 
  }, []);
  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then((response) => response.json())
      .then((data) => 
        {
          setCountries(data); // If structure is correct
        })
      .catch((error) => console.error("Error fetching countries:", error));
      
  }, []);
  
  useEffect(() => {
    if (!selectedCountry) return; // Ensure we only fetch states when there's a selected country
    fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
      .then((response) => response.json())
      .then((data) => 
        {
          setStates(data); // If structure is correct
          setSelectedState(""); // Reset state selection
          setCity([]); // Clear cities
          setSelectedCity(""); // Reset city selection
        })
      .catch((error) => console.error("Error fetching countries:", error));
      
  }, [selectedCountry]);
  useEffect(() => {
    if (!selectedCountry || !selectedState) return; 
      fetch(
          ` https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
        )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched Cities Data:", data); // Debugging output
          setCity(data);
          setSelectedCity(""); // Reset city selection
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }, [selectedCountry, selectedState]);
    return(
        <div>

            <h1 style={{textAlign:"center"}}>Select Location</h1>
            <div className="selectOptions" style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} style={{padding:"10px"}}>
            <option value="" disabled>
            Select Country
          </option>
          {countries.map((country, index) => (
            <option key={index} value={country} style={{padding:"10px"}}>
              {country}
            </option>
          ))}
          </select>
          <select value={selectedState} disabled={!selectedCountry} onChange={(e) => setSelectedState(e.target.value)} style={{padding:"10px"}}>
            <option value="">
            Select State
          </option>
          {states.map((state,index)=>(
          <option key={index} value={state} style={{padding:"10px"}}>{state}</option>
          ))}
          
          </select>
          <select disabled={!selectedState} value={selectedCity} onChange={(e)=>setSelectedCity(e.target.value)} style={{padding:"10px"}}>
            <option value="" >
            Select City
          </option>
          {city.map((city,index)=>(
            <option key={index} value={city} style={{padding:"10px"}}>{city}</option>
          ))}
          </select>
            </div>
            {selectedCity && (
        <h2 style={{textAlign:"center",fontSize:"20px"} }>
          You selected <span>{selectedCity}</span>,
          <span style={{color:"#888"}}>
            {" "}
            {selectedState}, {selectedCountry}
          </span>
        </h2>
      )}
        </div>
    );
}

export default LocationSelector;
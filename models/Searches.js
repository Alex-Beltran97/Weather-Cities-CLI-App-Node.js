const fs = require("fs");

const axios = require("axios");
require("dotenv").config();


class Searches {

  historical = [];
  dbPath = "./db/database.json";

  constructor(){
    //TODO Read DB wether exists
    this.readDB();
  };

  get capitalizedHistorical(){
    return this.historical.map( place =>{
      const letters = place.split("");

      const capitalized = letters.map( (letter, index) =>{
        if(index===0) return letter.toUpperCase();
        return letter;
      })

      return capitalized.join("");
    });
  }

  paramsOpenweather(lat,lon){
    return {
        "lat": lat,
        "lon": lon,
        "appid": process.env.OPENWEATHER_KEY
    }
  };
  
  get paramsMapbox (){
    return {
      "access_token": process.env.MAPBOX_KEY,
      "limit": 5,
      "language": "en"
    }
  };

  async searchCity(place = ""){
    try{
      // HTTP Request
      const instance = () =>axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
        params: this.paramsMapbox
      });

      const res = await instance().get();

      return res.data.features.map( place =>({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1]
      }));
    }catch(error){
      return error;
    };
  };

  async weatherPerPlace( lat, lon ){
    try{
      // Axios Insance 
      const instance = () =>axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: this.paramsOpenweather(lat, lon)
      });

      // Response.data
      const { data } = await instance().get();
      const { weather, main } = data;

      // Object return
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      };
    }catch(error){
      console.log(error);
    };
  };

  addHistorical(place){
    // TODO: Prevent duplicated
    if(this.historical?.includes( place.toLowerCase() )){
      return
    }

    this.historical = this.historical.slice(0,4);
    
    this.historical.unshift(place.toLowerCase());

    // Save in DB
    this.saveDB();
  };

  saveDB(){
    const payload = {
      historical: this.historical
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  };

  readDB(){
    if(!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historical = data.historical;      
  };

};

module.exports = Searches;
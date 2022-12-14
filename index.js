const { inquirerMenu, pause, readInput, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/Searches");
const colors = require("colors");

const main = async () =>{
  const searches = new Searches();
  let opt;

  do{
    opt = await inquirerMenu();

    switch(opt){
      case 1:
        // Show message
        const term = await readInput("City: ");
        
        // Search places
        const places = await searches.searchCity(term);
        const id = await listPlaces(places);
        
        if(id!==0){
          
          const {
            name,
            lat,
            lng
          } = places.find( place => place.id === id);
  
          // Save in DB
          searches.addHistorical( name );

          // Weather
          const { desc, min, max, temp } = await searches.weatherPerPlace(lat, lng);
          // Show results
          console.clear();
          console.log("\nPlace information\n".green);
          console.log("City:", name);
          console.log("Lat:", lat);
          console.log("Lng:", lng);
          console.log("Weather:", temp);
          console.log("Min:", min);
          console.log("Max:", max);
          console.log("Weather looks like:", desc);
        };
      break;
      case 2:
        searches.capitalizedHistorical.forEach( (place,index) =>{
          const idx = `${ index+1 }.`.green;
          console.log(`${ idx } ${ place }`);
        });
      break;
    };
    if(opt!==0) await pause();

  }while(opt!==0);
};

main();
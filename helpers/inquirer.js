const inquirer = require("inquirer");

const colors = require("colors");

const menuOpts = [
  {
    type:"list",
    name: "option",
    message: "What do you want to",
    choices: [
      {
        value: 1,
        name: `${"1.".green } Search City`
      },
      {
        value: 2,
        name: `${"2.".green } Historical`
      },
      {
        value: 0,
        name: `${"0.".green } Quit`
      },
    ]
  }
];

const inquirerMenu = async () =>{
  console.clear();
  console.log("================".green);
  console.log("Choose an option");
  console.log("================\n".green);

  const { option } = await inquirer.prompt(menuOpts);

  return option;
};

const pause = async () =>{

  const result = await inquirer.prompt([
    {
      type: "input",
      name: "pause",
      message: `Push ${ "ENTER".green } to continue`,
    }
  ]);

  return result.pause;
};

const readInput = async ( message ) =>{
  const { desc } = await inquirer.prompt([
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if(value.length === 0 ){
          return "Please enter a value.";
        };
        return true;
      }
    }
  ]);

  return desc;
};

const listPlaces = async (places = []) =>{
  const choices = places.map((place, index)=>{
    const idx = colors.green(index+1);

    return {
      value: place.id,
      name: `${ idx }. ${ place.name }`,
    }
  });

  const { id } = await inquirer.prompt([
    {
      type:"list",
      name: "id",
      message: "Select place:",
      choices: [...choices, { value: 0, name: "0.".green+" Cancel"}]
    }
  ]);

  return id;
};

const confirm = async (message) =>{
  
  const question = [
    {
      type: "confirm",
      name: "ok",
      message
    }
  ];

  const { ok } = await inquirer.prompt(question);

  return ok;
};

const showChecklist = async (tasks = []) =>{
  const choices = tasks.map((task, index)=>{
    const idx = colors.green(index+1);

    console.log();

    return {
      value: task.id,
      name: `${ idx }. ${ task.desc }`,
      checked: (task?.completedIn) ?? false
    }
  });

  const { ids } = await inquirer.prompt([
    {
      type:"checkbox",
      name: "ids",
      message: "selections",
      choices
    }
  ]);

  return ids;
};

module.exports = { inquirerMenu, pause, readInput, listPlaces, confirm, showChecklist };
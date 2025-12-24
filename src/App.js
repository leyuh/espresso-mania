import { useRef, useEffect, useState } from 'react';

import cupsIcon from './icons/cups.png';
import waterIcon from "./icons/water.png";
import iceIcon from "./icons/ice.png";
import milkIcon from "./icons/milk.png";
import trashIcon from "./icons/trash.png";
import espressoIcon from "./icons/espresso.png";
import blenderIcon from "./icons/blender.png";

import chocolateIcon from "./icons/pumps/chocolate.png";
import caramelIcon from "./icons/pumps/caramel.png";
import vanillaIcon from "./icons/pumps/vanilla.png";

import cupIcon from './icons/cup.png';

import Orders from './components/Orders';
import Customize from './components/Customize';
import Recipes from './components/Recipes';
import Floors from './components/Floors';

import { RECIPES, STOCK, FLOORS } from './components/data.js';
import Stock from './components/Stock';


const getItemFromIngredients = (ingredients) => {
  let item = null;

  Object.entries(RECIPES).forEach(([key, value], index) => {
    if (arraysAreEqual(ingredients.sort(), value)) item = key;
  });

  return item;
}

const APPLIANCES = [
  {
    name: "espresso machine",
    defaultLocation: [0, 0],
    ingredientToAdd: "shot",
    requiredItem: "beans",
    duration: 8,
    sound: "/music/espresso.mp3",
    volume: 1,
    startAudioAt: 3,
    icon: espressoIcon
  },
  {
    name: "steamer",
    defaultLocation: [0, 1],
    ingredientToAdd: "heat",
    duration: 5,
    sound: "/music/steam.mp3",
    volume: .5,
    startAudioAt: .5
  },
  {
    name: "frother",
    defaultLocation: [0, 2],
    ingredientToAdd: "froth",
    duration: 5,
    sound: "/music/froth.mp3",
    volume: .3,
  },
  {
    name: "ice dispenser",
    defaultLocation: [2, 0],
    ingredientToAdd: "ice",
    icon: iceIcon
  },
  {
    name: "water dispenser",
    defaultLocation: [2, 1],
    ingredientToAdd: "water",
    icon: waterIcon
  },
  {
    name: "milk maker",
    defaultLocation: [2, 2],
    ingredientToAdd: "milk",
    requiredItem: "milk",
    icon: milkIcon
  },
  {
    name: "blender",
    defaultLocation: [0, 3],
    ingredientToAdd: "blend",
    duration: 5,
    sound: "/music/blender.mp3",
    volume: 1,
    startAudioAt: 1,
    icon: blenderIcon
  },
  {
    name: "cup stack",
    defaultLocation: [0, 5],
    ingredientToAdd: "cup",
    icon: cupsIcon
  },
  {
    name: "trash",
    defaultLocation: [0, 6],
    sound: "/music/trash.mp3",
    volume: .5,
    startAudioAt: 0.5,
    icon: trashIcon
  },

  {
    name: "chocolate pump",
    defaultLocation: [2, 5],
    ingredientToAdd: "chocolate",
    requiredItem: "chocolate",
    icon: chocolateIcon
  },
  {
    name: "caramel pump",
    defaultLocation: [2, 6],
    ingredientToAdd: "caramel",
    requiredItem: "caramel",
    icon: caramelIcon
  },
  {
    name: "vanilla pump",
    defaultLocation: [2, 4],
    ingredientToAdd: "vanilla",
    requiredItem: "vanilla",
    icon: vanillaIcon
  },
]

function arraysAreEqual(arr1, arr2) {
  // remove duplicates
  let arrA = [...new Set(arr1)];
  let arrB = [...new Set(arr2)];

  // First check length
  if (arrA.length !== arrB.length) return false;

  // Then check each element
  return arrA.every((element, index) => element === arrB[index]);
}

const BackgroundMusic = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Optional: Auto-play after first user interaction (e.g., click anywhere)
    const handleFirstInteraction = () => {
      audioRef.current.volume = 0.1;
      audioRef.current.play();
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/music/background.mp3"  // Place file in public/music
      loop
      autoPlay={false}  // Set to false to avoid block; trigger manually
    />
  );
};


const Appliance = ({ r, c, app, currIngredients, setCurrIngredients, tileData, setTileData, open, rearranging, coordsOfRearrangingApp, setCoordsOfRearrangingApp, stock, setStock, runningAppliances, setRunningAppliances }) => {
  const incorrectSound = useRef(new Audio('/music/wrong.mp3'));

  return <button
    className={`flex relative text-center flex-col justify-center size-full md:font-bold ${coordsOfRearrangingApp && coordsOfRearrangingApp[0] == r && coordsOfRearrangingApp[1] == c ? "bg-zinc-100" : ""}`}
    onClick={() => {

      if (!open && rearranging) {
        // PICK UP APPLIANCE
        if (coordsOfRearrangingApp == null) {
          setCoordsOfRearrangingApp([r, c]);
        } else if (coordsOfRearrangingApp[0] == r && coordsOfRearrangingApp[1] == c) {
          setCoordsOfRearrangingApp(null);
        }
        return;
      }
    
      if (app.name == "trash") {
        // USE TRASH
        setCurrIngredients([]);

        if (app.sound) {
          console.log("play audio");
          
          let soundEffect = new Audio(app.sound);
          !app.startAudioAt ? (soundEffect.currentTime = 0) : (soundEffect.currentTime = app.startAudioAt);
          soundEffect.volume = app.volume;
          soundEffect.play();

          setTimeout(() => {
            soundEffect.pause();
          }, 1000);
        }

        return;
      }

      let runningApp = runningAppliances.find(runningApp => runningApp.name == app.name);

      if (!currIngredients.length && app.name != "cup stack" && (!runningApp || runningApp.timeLeft != 0)) return;
      let newItemExists = false;

      Object.entries(RECIPES).forEach(([key, value]) => {
        if (arraysAreEqual([...currIngredients, app.ingredientToAdd].sort(), value.sort())) {
          newItemExists = true;
        }
      })


      if (app.duration) {
        if (!runningApp) {
          if (!newItemExists) return;
          
          if (app.requiredItem && stock[app.requiredItem] == 0) {
            incorrectSound.current.currentTime = 0; // Rewind to start
            incorrectSound.current.volume = 0.5;
            incorrectSound.current.play();
            return;
          };

          // start appliance timer
          if (app.sound) {
            console.log("play audio");
            let soundEffect = new Audio(app.sound);
            !app.startAudioAt ? (soundEffect.currentTime = 0) : (soundEffect.currentTime = app.startAudioAt);
            soundEffect.volume = app.volume;
            soundEffect.play();

            setTimeout(() => {
              soundEffect.pause();
            }, app.duration*1000);
          }

          let newTileData = [...tileData];
          newTileData[r][c].ingredientsIn = currIngredients;
          setTileData(newTileData);

          setRunningAppliances(prev => [...prev, {
            name: app.name,
            timeLeft: app.duration
          }]);
          

          if (app.requiredItem) {
            let newStock = {...stock};
            newStock[app.requiredItem]--;
            setStock(newStock);
          }
  
          setCurrIngredients([]);
        } else if (runningApp && runningApp.timeLeft == 0) {
          // pick up item, timer is done

          console.log("!!!");
          setCurrIngredients([...tileData[r][c].ingredientsIn, app.ingredientToAdd]);

          let newTileData = [...tileData];
          delete newTileData[r][c].ingredientsIn;
          setTileData(newTileData);

          let newRunningApps = [...runningAppliances].filter(a => a.name != runningApp.name);
          setRunningAppliances(newRunningApps);

        }
      } else {
        console.log("!!");
        if (!newItemExists) return;
        if (app.requiredItem && stock[app.requiredItem] == 0) {
          incorrectSound.current.currentTime = 0; // Rewind to start
          incorrectSound.current.volume = 0.5;
          incorrectSound.current.play();
          return;
        };

        if (app.requiredItem) {
          let newStock = {...stock};
          newStock[app.requiredItem]--;
          setStock(newStock);
        }

        setCurrIngredients(prev => [...prev, app.ingredientToAdd])
      }
    }}
  >
    {app.requiredItem && <p className=" absolute top-0 w-full text-black text-sm">{stock[app.requiredItem] > 0 ? `${stock[app.requiredItem]} serving(s) ${app.requiredItem}` : "!!!"}</p>}
    {app.icon && <div className="flex items-center justify-center my-2 h-[70%] "><img className="object-contain w-full h-full relative" src={app.icon} /></div>}
    <p className="px-1 text-sm lg:text-lg z-5 h-6 -mt-3 md:mt-0">{app.name}</p>
    {(app.duration && runningAppliances.filter(runningApp => runningApp.name == app.name).length) ? (<div className="w-[90%] mx-2 h-4 top-[65%] absolute bg-black border-black border-2 rounded-lg">
      <div className="bg-green-500 h-full border-2 border-black rounded-lg" style={{
        width: `${(app.duration - runningAppliances.find(runningApp => runningApp.name == app.name).timeLeft)/app.duration * 100}%`
      }} />
      <p className="font-normal mt-1">{getItemFromIngredients([...tileData[r][c].ingredientsIn, app.ingredientToAdd])}</p>
    </div>) : (<></>)}
  </button>
}

const getTile = (r, c, currItem, currIngredients, setCurrIngredients, tileData, setTileData, open, rearranging, coordsOfRearrangingApp, setCoordsOfRearrangingApp, stock, setStock, runningAppliances, setRunningAppliances ) => {
  if (!tileData) return null;
  if (!tileData[r][c]) return null;

  let tileItem = tileData[r][c];

  if (tileItem.type == "appliance") return <Appliance r={r} c={c} app={APPLIANCES.filter(a => a.name == tileItem.name)[0]} currIngredients={currIngredients} setCurrIngredients={setCurrIngredients} tileData={tileData} setTileData={setTileData} open={open} rearranging={rearranging} coordsOfRearrangingApp={coordsOfRearrangingApp} setCoordsOfRearrangingApp={setCoordsOfRearrangingApp} stock={stock} setStock={setStock} runningAppliances={runningAppliances} setRunningAppliances={setRunningAppliances} />
  else if (tileItem.type == "item") return <button
    className="text-center flex-col cursor-grab size-full z-30 items-center flex justify-center"
    onClick={() => {
      if (currItem) {
        console.log("combining", currItem, tileItem.name);

        let ings = [...new Set([...RECIPES[currItem], ...RECIPES[tileItem.name]])].sort();

        let newItem = null;

        Object.entries(RECIPES).forEach(([key, value]) => {
          if (arraysAreEqual(ings, value.sort())) {
            newItem = key;
          }
        });

        if (!newItem) return;

        console.log(newItem);
        let newItems = tileData;
        newItems[r][c] = {type: "item", name: newItem};
        setTileData(prev => newItems);

        setCurrIngredients([]);
        
      } else if (!currItem) {
        console.log("picking up item");
        console.log(RECIPES[tileItem.name]);
        setCurrIngredients(RECIPES[tileItem.name]);

        let newItems = tileData.map(r => [...r]);  
        newItems[r] = [...newItems[r]];
        newItems[r][c] = null;

        console.log(newItems);
        setTileData(newItems);
      }
      
    }}
  >
    <img className="z-50 size-[55%]" src={cupIcon} />
    <p className="z-50">{tileItem.name}</p>
  </button>
  return null;
}

const Floor = ({ currItem, currIngredients, setCurrIngredients, tileData, setTileData, selectedFloor, open, rearranging, coordsOfRearrangingApp, setCoordsOfRearrangingApp, stock, setStock, runningAppliances, setRunningAppliances }) => {
  return <div className="flex flex-row w-full h-full bg-[#574e46] border-[3px] border-[#574e46] rounded-md">
    {[...Array(7)].map((col, c) => <div className="flex flex-col w-full">
      {[...Array(5)].map((row, r) => <div
        className={`w-[100%] h-[100%] ${!rearranging ? "border-[#574e46]" : "border-green-600"} rounded-md overflow-hidden border-[3px]`}
        style={((!(r % 2) && !(c % 2)) || ((r % 2) && (c % 2))) ? {
          backgroundColor: `${FLOORS[selectedFloor].colors[0]}`
        } : {
          backgroundColor: `${FLOORS[selectedFloor].colors[1]}`
        }}
        onClick={() => {
          let isApplianceOnTile = false;

          for (let r2 = 0; r2 < tileData.length; r2++) {
            for (let c2 = 0; c2 < tileData[r2].length; c2++) {
              if (r2 == r && c2 == c && tileData[r2][c2] && tileData[r2][c2].type == "appliance") isApplianceOnTile = true;
            }
          }

          if (!currItem && rearranging && coordsOfRearrangingApp != null) {
            if (isApplianceOnTile) return;
            // PLACE APPLIANCE
            let appToMove = tileData[coordsOfRearrangingApp[0]][coordsOfRearrangingApp[1]];

            let newTileData = [...tileData];
            newTileData[r][c] = appToMove;
            newTileData[coordsOfRearrangingApp[0]][coordsOfRearrangingApp[1]] = null;
            setTileData(newTileData);

            setCoordsOfRearrangingApp(null);
          }
          if (tileData[r][c]) return;
          if (isApplianceOnTile) return;
          if (currIngredients.length == 0) return;

          console.log("placing");
          let newTileData = [...tileData];
          newTileData[r][c] = {type: "item", name: currItem};
          setTileData(newTileData);
          console.log("!!");

          setCurrIngredients([]);
        }}
      >
        {getTile(r, c, currItem, currIngredients, setCurrIngredients, tileData, setTileData, open, rearranging, coordsOfRearrangingApp, setCoordsOfRearrangingApp, stock, setStock, runningAppliances, setRunningAppliances)}
      </div>)}
    </div>)}
  </div>
}

function App() {

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [currIngredients, setCurrIngredients] = useState([]);
  const [currItem, setCurrItem] = useState(null);

  const [orders, setOrders] = useState([]);

  const [money, setMoney] = useState(1000);
  const [rating, setRating] = useState(3);

  const [open, setOpen] = useState(false);

  const [rearranging, setRearranging] = useState(false);
  const [coordsOfRearrangingApp, setCoordsOfRearrangingApp] = useState(null);

  const [showRecipes, setShowRecipes] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [showFloors, setShowFloors] = useState(false);

  const [stock, setStock] = useState({});

  const [floorsOwned, setFloorsOwned] = useState(["default"]);
  const [selectedFloor, setSelectedFloor] = useState("default");

  const [runningAppliances, setRunningAppliances] = useState([]);

  let emptyTiles = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]
  ];

  const [tileData, setTileData] = useState(emptyTiles);


  useEffect(() => {
    if (!rearranging) return;

    let newTileData = tileData.map(r => [...r]);  

    for (let r = 0; r < tileData.length; r++) {
      newTileData[r] = [...newTileData[r]];
      for (let c = 0; c < tileData[r].length; c++) {
        if (!newTileData[r][c] || newTileData[r][c].type == "item") newTileData[r][c] = null;
      }
    }
    setTileData(newTileData);

  }, [rearranging])


  // global clock
  useEffect(() => {
    const interval = setInterval(() => {
      setRunningAppliances(prev => 
        prev.map(app => ({
          ...app,
          timeLeft: Math.max(0, app.timeLeft - 1)
        }))
      );
    }, 1000);
  
    return () => clearInterval(interval);
  }, []); // Only run once

  useEffect(() => {
    console.log(currIngredients);

    if (!currIngredients.length) {
      setCurrItem(null);
      return;
    }

    Object.entries(RECIPES).forEach(([key, value]) => {
      if (arraysAreEqual(value.sort(), currIngredients.sort())) {
        console.log(key);
        setCurrItem(key);
        return;
      }
    });

  }, [currIngredients])


  useEffect(() => {
    if (open) {
      setShowStock(false);
      setRearranging(false);
      setCoordsOfRearrangingApp(null);
    }

    setOrders([]);
  }, [open])

  //useEffect(() => {console.log(tileData)}, [tileData]);

  useEffect(() => {
    // SET STOCK
    let newStock = {};
    Object.entries(STOCK).forEach(([key, value]) => {
      newStock[key] = value.defaultStock;
    });

    setStock(newStock);

    // SET TILES
    let newTiles = tileData;
    for (let i = 0; i < APPLIANCES.length; i++) {
      let app = APPLIANCES[i];
      newTiles[app.defaultLocation[0]][app.defaultLocation[1]] = { type: "appliance", name: app.name};
    }

    console.log(newTiles);
    setTileData(newTiles);
  }, []);

  if (currItem || coordsOfRearrangingApp != null) {
    document.body.style.cursor = "grabbing";
    document.body.classList.add('custom-cursor-mode');
  } else {
    document.body.style.cursor = 'auto';
    document.body.classList.remove('custom-cursor-mode');
  }

  return (
    <div className="App flex items-center relative justify-center h-[100vh]" style={{
      backgroundColor: FLOORS[selectedFloor].colors[2]
    }}>
      <BackgroundMusic />

      <div className="p-2 text-2xl font-bold absolute top-0 right-0 flex flex-col gap-4">
        <button className={`${open ? "bg-green-600" : "bg-red-600"} text-zinc-100 px-6 py-2 border-4 border-black rounded-md font-bold text-lg`} onClick={() => {
          setOrders([]);
          setOpen(prev => !prev);

          setRearranging(false);
          setCoordsOfRearrangingApp(null);
          
        }}>{open ? "OPEN" : "CLOSED"}</button>

        <button className="bg-[#574e46] text-zinc-100 px-6 -mt-2 py-2 border-4 border-black rounded-md font-bold text-lg" onClick={() => setShowRecipes(prev => !prev)}>Recipes</button>
        
        <h1 className="text-right px-2">{Math.round(rating*10)/10} / 5</h1>
        <h1 className="text-right px-2">${money}</h1>
      </div>

      {open ? <Orders
        orders={orders}
        setOrders={setOrders}
        currItem={currItem}
        setCurrIngredients={setCurrIngredients}
        setMoney={setMoney}
        setRating={setRating}
        open={open}
      /> : <Customize
        rearranging={rearranging}
        setRearranging={setRearranging}
        setCoordsOfRearrangingApp={setCoordsOfRearrangingApp}
        setShowStock={setShowStock}
        setShowFloors={setShowFloors}
      />}

      <div id="kitchen" className="w-[500px] h-[300px] mt-12">
        <Floor
          currItem={currItem}
          currIngredients={currIngredients}
          setCurrIngredients={setCurrIngredients}
          tileData={tileData}
          setTileData={setTileData}
          selectedFloor={selectedFloor}
          open={open}
          rearranging={rearranging}
          coordsOfRearrangingApp={coordsOfRearrangingApp}
          setCoordsOfRearrangingApp={setCoordsOfRearrangingApp}
          stock={stock}
          setStock={setStock}
          runningAppliances={runningAppliances}
          setRunningAppliances={setRunningAppliances}
        />
      </div>


      {showRecipes && <Recipes 
        showRecipes={showRecipes}
        setShowRecipes={setShowRecipes}
      />}

      {showStock && <Stock
        showStock={showStock}
        setShowStock={setShowStock}
        stock={stock}
        setStock={setStock}
        money={money}
        setMoney={setMoney}
      />}

      {showFloors && <Floors 
        showFloors={showFloors}
        setShowFloors={setShowFloors}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
        floorsOwned={floorsOwned}
        setFloorsOwned={setFloorsOwned}
        money={money}
        setMoney={setMoney}
      />}

      {currItem && <h1 className="absolute font-bold text-xl text-center top-[95px]">In hand: {currItem}</h1>}

    </div>
  );
}

export default App;

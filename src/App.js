import { useRef, useEffect, useState } from 'react';

import cupsIcon from './icons/cups.png';
import waterIcon from "./icons/water.png";
import iceIcon from "./icons/ice.png";
import milkIcon from "./icons/milk.png";

import cupIcon from './icons/cup.png';

import Orders from './components/Orders';
import Customize from './components/Customize';


const FLOORS = {
  default: ["#ab9685", "#e0d5cc"],
  red: ["#9c3333", "#e3e3e3"]
}

const RECIPES = {
  cup: ["cup"],

  milk: ["cup", "milk"],
  water: ["cup", "water"],
  shot: ["cup", "shot"],

  "cup w/ chocolate": ["cup", "chocolate"],
  "cup w/ caramel": ["cup", "caramel"],
  "cup w/ carm, choc": ["cup", "caramel", "chocolate"],

  "ice cup": ["cup", "ice"],
  "ice water": ["cup", "ice", "water"],
  "iced milk": ["cup", "ice", "milk"],

  "chocolate milk": ["cup", "milk", "chocolate"],
  "caramel milk": ["cup", "milk", "caramel"],
  "caramel chocolate milk": ["cup", "milk", "caramel", "chocolate"],

  "iced chocolate milk": ["cup", "milk", "chocolate", "ice"],
  "iced caramel milk": ["cup", "milk", "caramel", "ice"],
  "iced caramel chocolate milk": ["cup", "milk", "caramel", "chocolate", "ice"],

  "chocolate shot": ["cup", "shot", "chocolate"],
  "caramel shot": ["cup", "shot", "caramel"],
  "choc caramel shot": ["cup", "shot", "caramel", "chocolate"],

  americano: ["cup", "shot", "water"],
  latte: ["cup", "shot", "milk"],
  mocha: ["cup", "shot", "milk", "chocolate"],

  "latte frap": ["cup", "shot", "milk", "ice", "blend"],
  "mocha frap": ["cup", "shot", "milk", "chocolate", "ice", "blend"],

  "hot chocolate": ["cup", "milk", "chocolate", "heat"],

  "caramel latte": ["cup", "shot", "milk", "caramel"],
  "caramel mocha": ["cup", "shot", "milk", "chocolate", "caramel"],

  "iced water": ["cup", "water", "ice"],
  "iced milk": ["cup", "milk", "ice"],
  "iced americano": ["cup", "shot", "water", "ice"],
  "iced latte": ["cup", "shot", "milk", "ice"],
  "iced mocha": ["cup", "shot", "milk", "chocolate", "ice"],
  "iced caramel latte": ["cup", "shot", "milk", "caramel", "ice"],
  "iced caramel mocha": ["cup", "shot", "milk", "chocolate", "caramel", "ice"],

  "hot water": ["cup", "water", "heat"],
  "hot milk": ["cup", "milk", "heat"],
  "hot americano": ["cup", "shot", "water", "heat"],
  "hot latte": ["cup", "shot", "milk", "heat"],
  "hot mocha": ["cup", "shot", "milk", "chocolate", "heat"],
  "hot caramel latte": ["cup", "shot", "milk", "caramel", "heat"],
  "hot caramel mocha": ["cup", "shot", "milk", "chocolate", "caramel", "heat"],

  "frothed milk": ["cup", "milk", "froth"],

  "cappuccino": ["cup", "froth", "milk", "shot"]

}

const APPLIANCES = [
  {
    name: "espresso machine",
    defaultLocation: [0, 0],
    ingredientToAdd: "shot",
    duration: 6,
    sound: "/music/espresso.mp3",
    volume: 1,
    startAudioAt: 3
  },
  {
    name: "steamer",
    defaultLocation: [0, 1],
    ingredientToAdd: "heat",
    duration: 3,
    sound: "/music/steam.mp3",
    volume: .5,
    startAudioAt: .5
  },
  {
    name: "frother",
    defaultLocation: [0, 2],
    ingredientToAdd: "froth",
    duration: 2,
    sound: "/music/froth.mp3",
    volume: .3,
  },
  {
    name: "ice dispenser",
    defaultLocation: [0, 4],
    ingredientToAdd: "ice",
    icon: iceIcon
  },
  {
    name: "water dispenser",
    defaultLocation: [0, 5],
    ingredientToAdd: "water",
    icon: waterIcon
  },
  {
    name: "milk maker",
    defaultLocation: [0, 6],
    ingredientToAdd: "milk",
    icon: milkIcon
  },
  {
    name: "blender",
    defaultLocation: [2, 0],
    ingredientToAdd: "blend",
    duration: 3,
    sound: "/music/blender.mp3",
    volume: 1,
    startAudioAt: 1
  },
  {
    name: "cup stack",
    defaultLocation: [0, 8],
    ingredientToAdd: "cup",
    icon: cupsIcon
  },
  {
    name: "trash",
    defaultLocation: [0, 9],
  },

  {
    name: "chocolate pump",
    defaultLocation: [2, 5],
    ingredientToAdd: "chocolate"
  },
  {
    name: "caramel pump",
    defaultLocation: [2, 6],
    ingredientToAdd: "caramel"
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


const Appliance = ({ r, c, app, currIngredients, setCurrIngredients, tileData, setTileData }) => {
  return <button
    className="flex text-center flex-col justify-center size-full font-bold"
    onClick={() => {
      if (app.name == "trash") {
        setCurrIngredients([]);
        return;
      }

      if (!currIngredients.length && app.name != "cup stack" && tileData[r][c].timeLeft != 0) return;
      let newItemExists = false;

      Object.entries(RECIPES).forEach(([key, value]) => {
        if (arraysAreEqual([...currIngredients, app.ingredientToAdd].sort(), value.sort())) {
          newItemExists = true;
        }
      })


      if (app.duration) {
        if (!tileData[r][c].hasOwnProperty("timeLeft")) {
          if (!newItemExists) return;

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
          newTileData[r][c].timeLeft = app.duration;
          setTileData(newTileData);
  
          setCurrIngredients([]);
        } else if (tileData[r][c].timeLeft === 0) {
          // pick up item, timer is done

          console.log("!!!");
          setCurrIngredients([...tileData[r][c].ingredientsIn, app.ingredientToAdd]);

          let newTileData = [...tileData];
          delete newTileData[r][c].timeLeft;
          delete newTileData[r][c].ingredientsIn;
          setTileData(newTileData);

        }
      } else {
        console.log("!!");
        if (!newItemExists) return;
        setCurrIngredients(prev => [...prev, app.ingredientToAdd])
      }
    }}
  >
    {app.icon && <div className="flex items-center justify-center my-2 h-[70%]"><img className="object-contain" src={app.icon} /></div>}
    <p className="px-1 text-lg z-5 h-6">{app.name}</p>
    {app.duration && tileData[r][c].timeLeft >= 0 && (<div className="w-[90%] mx-2 h-4 mt-10 relative bg-black border-black border-2 rounded-lg">
      <div className="bg-green-500 h-full border-2 border-black rounded-lg" style={{
        width: `${(app.duration - tileData[r][c].timeLeft)/app.duration * 100}%`
      }} />
    </div>)}
  </button>
}

const getTile = (r, c, currItem, currIngredients, setCurrIngredients, tileData, setTileData) => {
  if (!tileData) return null;
  if (!tileData[r][c]) return null;

  let tileItem = tileData[r][c];

  if (tileItem.type == "appliance") return <Appliance r={r} c={c} app={APPLIANCES.filter(a => a.name == tileItem.name)[0]} currIngredients={currIngredients} setCurrIngredients={setCurrIngredients} tileData={tileData} setTileData={setTileData} />
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
        setCurrIngredients(RECIPES[tileItem.name]);
        let newItems = tileData;
        newItems[r][c] = null;
        setTileData(newItems);
      }
      
    }}
  >
    <img className="z-50 size-[55%]" src={cupIcon} />
    <p className="z-50">{tileItem.name}</p>
  </button>
  return null;
}

const Floor = ({ currItem, currIngredients, setCurrIngredients, tileData, setTileData, selectedFloor }) => {
  return <div className="flex flex-row w-full h-full bg-[#574e46] border-[3px] border-[#574e46] rounded-md">
    {[...Array(10)].map((col, c) => <div className="flex flex-col w-full">
      {[...Array(6)].map((row, r) => <div
        className={`w-[100%] h-[100%] border-[#574e46] rounded-md overflow-hidden border-[3px]`}
        style={((!(r % 2) && !(c % 2)) || ((r % 2) && (c % 2))) ? {
          backgroundColor: `${FLOORS[selectedFloor][0]}`
        } : {
          backgroundColor: `${FLOORS[selectedFloor][1]}`
        }}
        onClick={() => {
          if (!currItem) return;
          if (tileData[r][c]) return;

          let isAppliancesOnTile = APPLIANCES.filter(app => app.location == [r, c]).length;
          if (isAppliancesOnTile) return;

          let newTileData = [...tileData];
          newTileData[r][c] = {type: "item", name: currItem};
          setTileData(newTileData);
          console.log("!!");

          setCurrIngredients([]);
        }}
      >
        {getTile(r, c, currItem, currIngredients, setCurrIngredients, tileData, setTileData)}
      </div>)}
    </div>)}
  </div>
}

function App() {

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [currIngredients, setCurrIngredients] = useState([]);
  const [currItem, setCurrItem] = useState(null);

  const [orders, setOrders] = useState([]);

  const [money, setMoney] = useState(0);
  const [rating, setRating] = useState(3);

  const [open, setOpen] = useState(false);

  const [selectedFloor, setSelectedFloor] = useState("default");

  // global clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTileData((prev) =>
        prev.map((row) =>
          row.map((cell) => ((cell && cell.type == "appliance" && cell.hasOwnProperty("timeLeft")) ? {
            ...cell,
            timeLeft: Math.max(0, cell.timeLeft - 1)
          } : cell))
        )
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
    setOrders([]);
  }, [open])

  useEffect(() => {
    let newTiles = tileData;
    for (let i = 0; i < APPLIANCES.length; i++) {
      let app = APPLIANCES[i];
      newTiles[app.defaultLocation[0]][app.defaultLocation[1]] = { type: "appliance", name: app.name};
    }

    console.log(newTiles);
    setTileData(newTiles);
  }, []);


  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (currItem) document.body.style.cursor = 'grab';
    if (!currItem) document.body.style.cursor = 'default';
  }, [currItem])

  return (
    <div className="App flex items-center relative justify-center h-[100vh]">
      <BackgroundMusic />

      <div className="p-2 text-2xl font-bold absolute top-0 right-0 flex flex-col gap-4">
        <button onClick={() => {
          if (!open) setOpen(true);
          if (open && !orders.length) setOpen(false);
        }}>{open ? "OPEN" : "CLOSED"}</button>
        <h1 className="">{Math.round(rating*10)/10} / 5</h1>
        <h1 className="">${money}</h1>
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
      
      />}

      <div id="kitchen" className="w-[500px] h-[300px]">
        <Floor
          currItem={currItem}
          currIngredients={currIngredients}
          setCurrIngredients={setCurrIngredients}
          tileData={tileData}
          setTileData={setTileData}
          selectedFloor={selectedFloor}
        />
      </div>

      {currItem && <div className="flex flex-col items-center justify-center text-center absolute cursor-grab pointer-events-none" style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)', // Centers the text on the cursor
      }}>
        <img src={cupIcon} />
        <p>{currItem}</p>
      </div>}

    </div>
  );
}

export default App;

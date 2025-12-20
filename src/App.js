import { useRef, useEffect, useState } from 'react';

import cupsIcon from './icons/cups.png';
import cupIcon from './icons/cup.png';

function arraysAreEqual(arr1, arr2) {
  // remove duplicates
  let arrA = [...new Set(arr1)];
  let arrB = [...new Set(arr2)];

  // First check length
  if (arrA.length !== arrB.length) return false;

  // Then check each element
  return arrA.every((element, index) => element === arrB[index]);
}

const RECIPES = {
  cup: ["cup"],

  milk: ["cup", "milk"],
  water: ["cup", "water"],
  shot: ["cup", "shot"],

  americano: ["cup", "shot", "water"],
  latte: ["cup", "shot", "milk"],
  mocha: ["cup", "shot", "milk", "chocolate"],

  "iced water": ["cup", "water", "ice"],
  "iced milk": ["cup", "milk", "ice"],
  "iced americano": ["cup", "shot", "water", "ice"],
  "iced latte": ["cup", "shot", "milk", "ice"],
  "iced mocha": ["cup", "shot", "milk", "chocolate", "ice"],

  "hot water": ["cup", "water", "heat"],
  "hot milk": ["cup", "milk", "heat"],
  "hot americano": ["cup", "shot", "water", "heat"],
  "hot latte": ["cup", "shot", "milk", "heat"],
  "hot mocha": ["cup", "shot", "milk", "chocolate", "heat"],

  "frothed milk": ["cup", "milk", "froth"],

  "cappuccino": ["cup", "froth", "milk", "shot"]

}

const APPLIANCES = [
  {
    name: "espresso machine",
    defaultLocation: [0, 0],
    ingredientToAdd: "shot"
  },
  {
    name: "steamer",
    defaultLocation: [0, 1],
    ingredientToAdd: "heat"
  },
  {
    name: "frother",
    defaultLocation: [0, 2],
    ingredientToAdd: "froth"
  },
  {
    name: "ice dispenser",
    defaultLocation: [0, 4],
    ingredientToAdd: "ice"
  },
  {
    name: "water dispenser",
    defaultLocation: [0, 5],
    ingredientToAdd: "water"
  },
  {
    name: "milk maker",
    defaultLocation: [0, 6],
    ingredientToAdd: "milk"
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
    defaultLocation: [3, 5],
    ingredientToAdd: "chocolate"
  },
]

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


const Appliance = ({ app, currIngredients, setCurrIngredients }) => {
  return <button
    className="flex text-center flex-col justify-center size-full font-bold"
    onClick={() => {
      if (app.name == "trash") {
        setCurrIngredients([]);
        return;
      }

      if (!currIngredients.length && app.name != "cup stack") return;
      let newItemExists = false;

      Object.entries(RECIPES).forEach(([key, value]) => {
        if (arraysAreEqual([...currIngredients, app.ingredientToAdd].sort(), value.sort())) {
          newItemExists = true;
        }
      })

      if (!newItemExists) return;

      setCurrIngredients(prev => [...prev, app.ingredientToAdd])
    }}
  >
    {app.icon && <div className="flex items-center justify-center mt-0 -mb-2"><img className="h-[90%]" src={app.icon} /></div>}
    <p className="px-1 text-lg z-5">{app.name}</p>
  </button>
}

const getTile = (r, c, currItem, currIngredients, setCurrIngredients, tileData, setTileData) => {
  if (!tileData) return null;
  if (!tileData[r][c]) return null;

  let tileItem = tileData[r][c];

  if (tileItem.type == "appliance") return <Appliance app={APPLIANCES.filter(a => a.name == tileItem.name)[0]} currIngredients={currIngredients} setCurrIngredients={setCurrIngredients} />
  else if (tileItem.type == "item") return <button
    className="text-center flex-col cursor-grab size-full z-10 items-center flex justify-center"
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
    <img className="z-10 size-[55%]" src={cupIcon} />
    <p className="z-10">{tileItem.name}</p>
  </button>
  return null;
}

const Floor = ({ currItem, currIngredients, setCurrIngredients, tileData, setTileData }) => {
  return <div className="flex flex-row w-full h-full bg-[#574e46] border-[3px] border-[#574e46] rounded-md">
    {[...Array(10)].map((col, c) => <div className="flex flex-col w-full">
      {[...Array(6)].map((row, r) => <div
        className={`w-[100%] h-[100%] border-[#574e46] rounded-md overflow-hidden border-[3px] ${((!(r % 2) && !(c % 2)) || ((r % 2) && (c % 2))) ? "bg-[#ab9685]" : "bg-[#e0d5cc]"}`}
        onClick={() => {
          if (!currItem) return;
          if (tileData[r][c]) return;

          let isAppliancesOnTile = APPLIANCES.filter(app => app.location == [r, c]).length;
          if (isAppliancesOnTile) return;

          let newTileData = tileData;
          newTileData[r][c] = {type: "item", name: currItem};
          setTileData(newTileData);

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

  useEffect(() => {console.log(tileData)}, [tileData])

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
    <div className="App flex items-center justify-center h-[100vh]">
      <BackgroundMusic />
      <div id="kitchen" className="w-[500px] h-[300px]">
        <Floor
          currItem={currItem}
          currIngredients={currIngredients}
          setCurrIngredients={setCurrIngredients}
          tileData={tileData}
          setTileData={setTileData}
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

import { useRef, useEffect, useState } from 'react';

const APPLIANCES = [
  {
    name: "espresso machine",
    defaultLocation: [0, 0],
    itemFunction: (currItem) => {
      if (currItem == "cup") return "shot"; 
      return currItem;
    }
  },
  {
    name: "steamer",
    defaultLocation: [0, 1],
    itemFunction: (currItem) => {
      if (["americano", "latte", "mocha", "milk", "water"].indexOf(currItem) != -1) return "hot " + currItem;
      return currItem;
    }
  },
  {
    name: "frother",
    defaultLocation: [0, 2],
    itemFunction: (currItem) => {
      if (currItem == "milk") return "frothed milk";

      return currItem;
    }
  },
  {
    name: "ice dispenser",
    defaultLocation: [0, 4],
    itemFunction: (currItem) => {
      if (currItem == "cup") return "ice cup";
      if (["cup", "americano", "latte", "mocha", "milk", "chocolate milk"].indexOf(currItem) != -1) return "iced " + currItem;
      return currItem;
    }
  },
  {
    name: "water dispenser",
    defaultLocation: [0, 5],
    itemFunction: (currItem) => {
      if (currItem == "ice cup") return "iced water";
      if (currItem == "cup") return "hot water"; 
      if (currItem == "shot") return "americano"; 
      return currItem;
    }
  },
  {
    name: "milk maker",
    defaultLocation: [0, 6],
    itemFunction: (currItem) => {
      if (currItem == "ice cup") return "iced milk";
      if (currItem == "cup") return "milk"; 
      if (currItem == "shot") return "latte"; 
      return currItem;
    }
  },
  {
    name: "cup stack",
    defaultLocation: [0, 8],
    itemFunction: (currItem) => {
      if (!currItem) return "cup";
      return currItem;
    }
  },
  {
    name: "trash",
    defaultLocation: [0, 9],
    itemFunction: (currItem) => {
      return null;
    }
  },

  {
    name: "chocolate pump",
    defaultLocation: [3, 5],
    itemFunction: (currItem) => {
      if (currItem == "milk") return "chocolate milk";
      if (currItem == "latte") return "mocha";
      return currItem;
    }
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


const Appliance = ({ app, setCurrItem }) => {
  return <button
    className="flex items-center text-center justify-center size-full font-bold"
    onClick={() => setCurrItem(app.itemFunction)}
  >
    <p className="px-1 text-lg">{app.name}</p>
  </button>
}

const getTile = (r, c, currItem, setCurrItem, tileData, setTileData) => {
  if (!tileData) return null;
  if (!tileData[r][c]) return null;

  let tileItem = tileData[r][c];

  if (tileItem.type == "appliance") return <Appliance app={APPLIANCES.filter(a => a.name == tileItem.name)[0]} setCurrItem={setCurrItem} />
  else if (tileItem.type == "item") return <button
    className="cursor-grab size-full text-center items-center flex justify-center"
    onClick={() => {
      if (!currItem) {
        setCurrItem(tileItem.name);

        let newItems = tileData;
        newItems[r][c] = null;
        setTileData(newItems);
      }
    }}
  >
    <p className="">{tileItem.name}</p>
  </button>
  return null;
}

const Floor = ({ currItem, setCurrItem, tileData, setTileData }) => {
  return <div className="flex flex-row w-full h-full bg-[#574e46] border-[3px] border-[#574e46] rounded-md">
    {[...Array(10)].map((col, c) => <div className="flex flex-col w-full">
      {[...Array(6)].map((row, r) => <div
        className={`w-[100%] h-[100%] border-[#574e46] rounded-md border-[3px] ${((!(r % 2) && !(c % 2)) || ((r % 2) && (c % 2))) ? "bg-[#ab9685]" : "bg-[#e0d5cc]"}`}
        onClick={() => {
          if (!currItem) return;
          if (tileData[r][c]) return;

          let isAppliancesOnTile = APPLIANCES.filter(app => app.location == [r, c]).length;
          if (isAppliancesOnTile) return;

          let newTileData = tileData;
          newTileData[r][c] = {type: "item", name: currItem};
          setTileData(newTileData);

          setCurrItem(null);
        }}
      >
        {getTile(r, c, currItem, setCurrItem, tileData, setTileData)}
      </div>)}
    </div>)}
  </div>
}

function App() {

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currItem, setCurrItem] = useState(null);

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
          setCurrItem={setCurrItem}
          tileData={tileData}
          setTileData={setTileData}
        />
      </div>

      {currItem && <p className="absolute cursor-grab pointer-events-none" style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)', // Centers the text on the cursor
      }}>
        {currItem}
      </p>}

    </div>
  );
}

export default App;

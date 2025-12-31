import { FLOORS } from "./data"
import { useRef } from "react";

const FloorTile = ({color}) => <div className={`size-[55px] rounded-sm border-[#574e46] border-[2.5px]`} style={{
    backgroundColor: `${color}`
}} />

export default function Floors ({ showFloors, setShowFloors, selectedFloor, setSelectedFloor, floorsOwned, setFloorsOwned, money, setMoney }) {

    const incorrectSound = useRef(new Audio(`${process.env.PUBLIC_URL}/music/wrong.mp3`));
    const correctSound = useRef(new Audio(`${process.env.PUBLIC_URL}/music/money.mp3`));

    return <div className="absolute bg-[#574e46] text-zinc-100 w-[600px] h-[250px] z-50 border-black border-4 p-6 rounded-md">
        <button className="absolute right-2 top-2 p-3 text-2xl font-bold z-50" onClick={() => setShowFloors(false)}>X</button>
        <h1 className="font-bold text-2xl text-center">Floors</h1>
        <ul className="flex flex-row overflow-x-scroll gap-4 mt-6">
            {Object.keys(FLOORS).map((name, i) => <button onClick={() => {
                if (floorsOwned.indexOf(name) != -1) {
                    setSelectedFloor(name);
                    return;
                }

                if (money < FLOORS[name].price) {
                    incorrectSound.current.currentTime = 0; // Rewind to start
                    incorrectSound.current.volume = 0.5;
                    incorrectSound.current.play();
                    return;
                }

                correctSound.current.currentTime = 0.2; // Rewind to start
                correctSound.current.volume = 0.5;
                correctSound.current.play();

                setMoney(prev => prev - FLOORS[name].price);
                setFloorsOwned(prev => [...prev, name]);
                setSelectedFloor(name);

            }} className="" key={i}>
                <div className="flex flex-col rounded-md overflow-hidden border-4" style={{
                    borderColor: `${selectedFloor == name ? "rgb(245, 245, 250)" : "#574e46"}`
                }}>
                    <div className="flex flex-row w-full">
                        <FloorTile color={FLOORS[name].colors[0]} />
                        <FloorTile color={FLOORS[name].colors[1]} />
                    </div>
                    <div className="flex flex-row w-full">
                        <FloorTile color={FLOORS[name].colors[1]} />
                        <FloorTile color={FLOORS[name].colors[0]} />
                    </div>
                </div>
                <h1 className="text-center">{`${name}${(FLOORS[name].price && floorsOwned.indexOf(name) == -1) ? " - $" + FLOORS[name].price : ""}`}</h1>
            </button>)}
        </ul>
    </div>
}
import { APPLIANCES, STOCK } from "./data"
import { useRef } from "react";

export default function Stock ({ showStock, setShowStock, stock, setStock, money, setMoney, XP }) {

    const incorrectSound = useRef(new Audio(`${process.env.PUBLIC_URL}/music/wrong.mp3`));
    const correctSound = useRef(new Audio(`${process.env.PUBLIC_URL}/music/money.mp3`));

    return <div className="absolute bg-[#574e46] text-zinc-100 w-[600px] h-[70vh] z-50 border-black border-4 md:h-[50vh] p-6 rounded-md">
        <button className="absolute right-2 top-2 p-3 text-2xl font-bold z-50" onClick={() => setShowStock(false)}>X</button>
        <h1 className="font-bold text-2xl text-center">Stock</h1>
        <div className="overflow-y-scroll h-[95%]">
            {Object.keys(STOCK).filter((key, i) => {
                let app = APPLIANCES.filter(app => app.requiredItem == key)[0];
                let level = Math.floor((XP + 100) / 100);
                return app.unlockLvl <= level;
            }).map((key, i) => <button key={i} onClick={() => {
                if (money < STOCK[key].priceToBuy) {
                    incorrectSound.current.currentTime = 0; // Rewind to start
                    incorrectSound.current.volume = 0.5;
                    incorrectSound.current.play();
                    return;
                };

                correctSound.current.currentTime = 0.2; // Rewind to start
                correctSound.current.volume = 0.5;
                correctSound.current.play();

                setMoney(prev => prev - STOCK[key].priceToBuy);
                
                let newStock = {...stock};
                newStock[key] += STOCK[key].amountToBuy;
                setStock(newStock);

            }} className="text-lg text-left w-full inline-block py-2 px-4 border-2 border-zinc-100 rounded-sm my-4">
                <div className="flex flex-row justify-between">
                    <h1><b>{STOCK[key].productToBuy}</b> ({STOCK[key].amountToBuy} servings)</h1>
                    <h1><b>${STOCK[key].priceToBuy}</b></h1>
                </div>
                
                <p>You have: {stock[key]} serving(s)</p>
            </button>)}
        </div>
    </div>
}
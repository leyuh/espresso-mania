import { RECIPES, ORDERS } from "./data.js"

const recipesToDisplay = ["americano", "cappuccino", "macchiato", "latte", "mocha", "hot chocolate", "latte frap", "mocha frap"];

export default function Recipes ({ showRecipes, setShowRecipes }) {
    return <div className="absolute bg-[#574e46] text-zinc-100 w-[600px] h-[70vh] z-40 border-black border-4 md:h-[50vh] p-6 rounded-md">
        <button className="absolute right-2 top-2 p-3 text-2xl font-bold" onClick={() => setShowRecipes(false)}>X</button>
        <h1 className="font-bold text-2xl text-center">Recipes</h1>
        <ul className="overflow-y-scroll h-[95%] mt-2">
            {recipesToDisplay.map((name, i) => <li key={i} className="my-4">
                <div className="flex justify-between text-xl font-bold w-full">
                    <div className="flex flex-row gap-3">
                        <h3>{name}</h3>
                        {(ORDERS.find(order => order.item == name).variants) && <p className="text-md font-normal"><i>{ORDERS.find(order => order.item == name).variants.join(", ")}</i></p>}
                    </div>
                    <h3 className="">${ORDERS.find(order => order.item == name)?.price}</h3>
                </div>

                
                
                <div className="flex flex-row gap-2 overflow-x-scroll">
                    {RECIPES[name].filter(ing => ing != "cup").map((ing, j) => <div className="border-2 border-zinc-100 rounded-sm px-5 py-[2px]">
                        <p>{ing}</p>
                    </div>)}
                </div>
            </li>)}
        </ul>
    </div>
}
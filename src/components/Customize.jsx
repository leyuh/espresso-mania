export default function Customize ({ rearranging, setRearranging, setCoordsOfRearrangingApp, setShowStock, setShowFloors }) {
    return <div className="text-zinc-100 z-30 absolute w-[70%] h-[55px] top-2 flex flex-row justify-center gap-4">
        <button className={`bg-[#574e46] px-8 py-2 border-4 border-black rounded-md font-bold text-lg ${rearranging && "bg-green-600"}`} onClick={() => {
            setRearranging(prev => !prev);
            setCoordsOfRearrangingApp(null);
        }}>Rearrange</button>
        <button className="bg-[#574e46] px-8 py-2 border-4 border-black rounded-md font-bold text-lg" onClick={() => setShowStock(prev => !prev)}>Stock</button>
        <button className="bg-[#574e46] px-8 py-2 border-4 border-black rounded-md font-bold text-lg" onClick={() => setShowFloors(prev => !prev)}>Floors</button>
        <button className="bg-[#574e46] px-8 py-2 border-4 border-black rounded-md font-bold text-lg">Upgrades</button>
    </div>
}
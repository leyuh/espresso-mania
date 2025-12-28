import { APPLIANCES } from "./data"

export default function Unlocked ({ setShowUnlocked, XP }) {

    let newLevel = Math.floor((XP + 100) / 100);
    let unlockedAppliances = APPLIANCES.filter(app => app.unlockLvl == newLevel);

    return <div className="flex flex-col items-center absolute bg-[#574e46] text-zinc-100 w-[400px] h-[400px] z-50 border-black border-4 p-6 rounded-md">
        <h1 className="text-2xl font-bold ">Level up!</h1>
        <h1 className="text-5xl font-bold mb-2">{newLevel}</h1>
        <h1 className="mt-4 mb-2 text-lg">Unlocks:</h1>
        <div className={`${unlockedAppliances.length == 1 ? "justify-center" : "flex-row"} flex gap-2 overflow-x-scroll w-full h-[150px]`}>
            {unlockedAppliances.map((app, i) => <div className="text-center items-center justify-center flex flex-col h-full w-[150px] border-2 shrink-0 border-black rounded-sm" key={i}>
                {app.icon && <img src={app.icon} className="h-[80%] object-contain" />}
                <p>{app.name}</p>
            </div>)}
        </div>
        <button className="mt-4 underline px-4 py-2 text-lg" onClick={() => setShowUnlocked(false)}>Continue</button>
    </div>
}
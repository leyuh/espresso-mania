import { useState, useEffect, useRef } from "react";

import { NAMES, ORDERS, POSITIVE_REVIEWS, NEGATIVE_REVIEWS, RECIPES, APPLIANCES } from "./data.js";

const MAX_ORDERS = 10;
const MAX_COMPLETION_TIME = 60;

const getReview = (name, opinion) => {
    let message = null;
    if (opinion == "positive") message = POSITIVE_REVIEWS[Math.floor(Math.random() * POSITIVE_REVIEWS.length)];
    if (opinion == "negative") message = NEGATIVE_REVIEWS[Math.floor(Math.random() * NEGATIVE_REVIEWS.length)];

    return [name, message];
}

const Ticket = ({ name, order, price, timeOrdered, currItem, setCurrIngredients, setOrders, setMoney, setRating, setReview, setXP, i }) => {

    const correctSound = useRef(new Audio('/music/money.mp3'));
    const incorrectSound = useRef(new Audio('/music/wrong.mp3'));

    return <button
        className="px-2 pb-4 text-left bg-gray-50 z-5 cursor-grab h-full w-[150px] shadow-md flex flex-col rounded-b-md"
        onClick={() => {
            if (!currItem) return;
            if (currItem != order) {
                // Order is incorrect
                setRating(prev => Math.max(1, prev - .5));
                incorrectSound.current.currentTime = 0; // Rewind to start
                incorrectSound.current.volume = 0.5;
                incorrectSound.current.play();

                setReview(getReview(name, "negative"));
            } else {
                // Order is correct
                correctSound.current.currentTime = 0.2; // Rewind to start
                correctSound.current.volume = 0.5;
                correctSound.current.play();

                setXP(prev => prev + 25);

                setMoney(prev => prev + price);
                let completionTime = Math.floor((Date.now() - timeOrdered) / 1000);

                if (completionTime > MAX_COMPLETION_TIME) {
                    setRating(prev => Math.max(1, prev - Math.min(completionTime, 120)/100));
                    setReview(getReview(name, "negative"));
                } else if (completionTime < MAX_COMPLETION_TIME) {
                    setRating(prev => Math.min(5, prev + ((MAX_COMPLETION_TIME-completionTime)/200)));
                    setReview(getReview(name, "positive"));
                };
            }
            

            setOrders(prev => prev.filter((order, j) => j != i));
            setCurrIngredients([]);
        }}
    >
        <p className="font-bold">{name}</p>
        <p>{order}</p>
    </button>
}


export default function Orders ({ orders, setOrders, currItem, setCurrIngredients, setMoney, setRating, open, XP, setXP }) {
    const timeoutRef = useRef(null);

    const soundEffect = useRef(new Audio('/music/bell.mp3'));

    const [review, setReview] = useState(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    
        if (!open || orders.length == MAX_ORDERS) {
            return; // Don't start new orders
        }

        const addOrder = () => {
            let newName = NAMES[Math.floor(Math.random() * NAMES.length)];

            let lockedIngredients = APPLIANCES.filter((app, i) => app.unlockLvl > (Math.floor((XP + 100) / 100))).map(app => app.ingredientToAdd);


            let unlockedOrders = ORDERS.filter(order => !RECIPES[order.item].some(item => lockedIngredients.includes(item)));

            let newOrder = unlockedOrders[Math.floor(Math.random() * unlockedOrders.length)];
            
            let orderName = newOrder.item;
            if (newOrder.variants) orderName = newOrder.variants[Math.floor(Math.random()*newOrder.variants.length)] + " " + orderName;

            if (orders.length < MAX_ORDERS) {
                soundEffect.current.currentTime = 0; // Rewind to start
                soundEffect.current.volume = 0.7;
                soundEffect.current.play();
            }

            setOrders(prev => [...prev, [newName, orderName, newOrder.price, Date.now()]]);
   
        };


        const scheduleNextOrder = () => {
            const randomDelay = Math.floor(Math.random() * 10000) + 4000; // 5-15s
      
            timeoutRef.current = setTimeout(() => {
              addOrder();
              scheduleNextOrder(); // Schedule the next one
            }, randomDelay);
          };
      
          scheduleNextOrder(); // Start the chain
      
          // Cleanup on unmount or when open changes
          return () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          };
    }, [open, orders]);
    

    return <div className="absolute w-[70%] h-[100px] top-0">
        {review && <div className="absolute -left-[140px] z-50 p-2 text-right w-[150px]">
            <h1 className="font-bold">{review[0]}:</h1>
            <p>{review[1]}</p>
        </div>}
        <div className="h-[10px] bg-zinc-400 top-0 rounded-b-md">
        </div>
        <div className="flex px-5 flex-row z-5 gap-4 h-[80px] w-full -top-[10px] relative">
            {orders.map((order, i) => <Ticket name={order[0]} order={order[1]} price={order[2]} timeOrdered={order[3]} currItem={currItem} setCurrIngredients={setCurrIngredients} setOrders={setOrders} setMoney={setMoney} setRating={setRating} setReview={setReview} setXP={setXP} i={i} />)}
        </div>
    </div>
}
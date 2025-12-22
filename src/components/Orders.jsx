import { useState, useEffect, useRef } from "react";

import { NAMES, ORDERS } from "./data.js";

const MAX_ORDERS = 3;
const MAX_COMPLETION_TIME = 60;

const Ticket = ({ name, order, price, timeOrdered, currItem, setCurrIngredients, setOrders, setMoney, setRating, i }) => {

    const correctSound = useRef(new Audio('/music/money.mp3'));
    const incorrectSound = useRef(new Audio('/music/wrong.mp3'));

    return <button
        className="px-2 pb-4 text-left bg-gray-50 z-5 cursor-grab h-full w-[150px] shadow-md flex flex-col rounded-b-md"
        onClick={() => {
            if (!currItem) return;
            if (currItem != order) {
                setRating(prev => Math.max(1, prev - .5));
                incorrectSound.current.currentTime = 0; // Rewind to start
                incorrectSound.current.volume = 0.5;
                incorrectSound.current.play();
            } else {
                correctSound.current.currentTime = 0.2; // Rewind to start
                correctSound.current.volume = 0.5;
                correctSound.current.play();

                setMoney(prev => prev + price);
                let completionTime = Math.floor((Date.now() - timeOrdered) / 1000);

                if (completionTime > MAX_COMPLETION_TIME) {
                    setRating(prev => Math.max(1, prev - Math.min(completionTime, 120)/100))
                };
                if (completionTime < MAX_COMPLETION_TIME) setRating(prev => Math.min(5, prev + ((MAX_COMPLETION_TIME-completionTime)/200)));
            }
            

            setOrders(prev => prev.filter((order, j) => j != i));
            setCurrIngredients([]);
        }}
    >
        <p className="font-bold">{name}</p>
        <p>{order}</p>
    </button>
}


export default function Orders ({ orders, setOrders, currItem, setCurrIngredients, setMoney, setRating, open }) {
    const timeoutRef = useRef(null);

    const soundEffect = useRef(new Audio('/music/bell.mp3'));

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
            let newOrder = ORDERS[Math.floor(Math.random() * ORDERS.length)];
            
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
            const randomDelay = Math.floor(Math.random() * 7000) + 3000; // 5-15s
      
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
        <div className="h-[10px] bg-zinc-400 top-0 rounded-b-md">
        </div>
        <div className="flex px-5 flex-row z-5 gap-2 h-[80px] w-full -top-[10px] relative">
            {orders.map((order, i) => <Ticket name={order[0]} order={order[1]} price={order[2]} timeOrdered={order[3]} currItem={currItem} setCurrIngredients={setCurrIngredients} setOrders={setOrders} setMoney={setMoney} setRating={setRating} i={i} />)}
        </div>
    </div>
}
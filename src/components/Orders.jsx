import { useState, useEffect, useRef } from "react";

const NAMES = ["John", "James", "Jack", "Sandra", "Randal", "Jessica", "George", "Bill", "Barbara", "Bella", "Noah", "Caden", "Peter", "Olivia", "Mia", "Rebecca", "Rose", "Sue", "Paul", "Alex", "Jason"];
const ORDERS = [
    {
        item: "mocha",
        variants: ["hot", "iced"],
        price: 5
    },
    {
        item: "caramel mocha",
        variants: ["hot", "iced"],
        price: 5
    },
    {
        item: "latte",
        variants: ["hot", "iced"],
        price: 4
    },
    {
        item: "caramel latte",
        variants: ["hot", "iced"],
        price: 5
    },
    {
        item: "americano",
        variants: ["hot", "iced"],
        price: 3
    },
    {
        item: "cappuccino",
        price: 3
    },
];
const MAX_ORDERS = 5;
const MAX_COMPLETION_TIME = 30;

const Ticket = ({ name, order, price, timeOrdered, currItem, setCurrIngredients, setOrders, setMoney, setRating, i }) => {

    return <button
        className="px-2 py-4 text-left bg-gray-50 cursor-grab h-full w-[150px] shadow-md flex flex-col rounded-b-md"
        onClick={() => {
            if (!currItem) return;
            if (currItem != order) {
                setRating(prev => Math.max(1, prev - .5));
            } else {
                setMoney(prev => prev + price);
                let completionTime = Math.floor((Date.now() - timeOrdered) / 1000);

                if (completionTime > MAX_COMPLETION_TIME) {
                    setRating(prev => Math.max(1, prev - Math.min(completionTime, 100)/100))
                };
                if (completionTime < MAX_COMPLETION_TIME) setRating(prev => Math.min(5, prev + ((MAX_COMPLETION_TIME-completionTime)/100)));
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
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    
        if (!open) {
            return; // Don't start new orders
        }

        const addOrder = () => {
            let newName = NAMES[Math.floor(Math.random() * NAMES.length)];
            let newOrder = ORDERS[Math.floor(Math.random() * ORDERS.length)];
            
            let orderName = newOrder.item;
            if (newOrder.variants) orderName = newOrder.variants[Math.floor(Math.random()*newOrder.variants.length)] + " " + orderName;

            setOrders(prev => [...prev, [newName, orderName, newOrder.price, Date.now()]].slice(0, MAX_ORDERS));
            setLastUpdate(Date.now());
        };


        const scheduleNextOrder = () => {
            const randomDelay = Math.floor(Math.random() * 10000) + 5000; // 5-15s
      
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
    }, [open]);
    

    return <div className="absolute w-[70%] h-[100px] top-0">
        <div className="h-[10px] bg-zinc-400 top-0 rounded-b-md">
        </div>
        <div className="flex px-5 flex-row z-20 gap-2 h-[80px] w-full">
            {orders.map((order, i) => <Ticket name={order[0]} order={order[1]} price={order[2]} timeOrdered={order[3]} currItem={currItem} setCurrIngredients={setCurrIngredients} setOrders={setOrders} setMoney={setMoney} setRating={setRating} i={i} />)}
        </div>
    </div>
}
export const RECIPES = {
    cup: ["cup"],
  
    milk: ["cup", "milk"],
    water: ["cup", "water"],
    shot: ["cup", "shot"],

    "iced shot": ["cup", "shot", "ice"],
  
    "cup w/ chocolate": ["cup", "chocolate"],
    "cup w/ caramel": ["cup", "caramel"],
    "cup w/ vanilla": ["cup", "vanilla"],
    "cup w/ carm, choc": ["cup", "caramel", "chocolate"],

  
    "ice cup": ["cup", "ice"],
    "ice water": ["cup", "ice", "water"],
    "iced milk": ["cup", "ice", "milk"],
  
    "chocolate milk": ["cup", "milk", "chocolate"],
  
    "chocolate shot": ["cup", "shot", "chocolate"],
    "caramel shot": ["cup", "shot", "caramel"],
    "vanilla shot": ["cup", "shot", "vanilla"],
    "choc caramel shot": ["cup", "shot", "caramel", "chocolate"],
  
    americano: ["cup", "shot", "water"],
    latte: ["cup", "shot", "milk"],
    mocha: ["cup", "shot", "chocolate", "milk"],
  
    "caramel frap": ["cup", "shot", "milk", "ice", "caramel", "blend"],
    "mocha frap": ["cup", "shot", "milk", "chocolate", "ice", "blend"],
  
    "hot chocolate": ["cup", "milk", "chocolate", "heat"],
  
    "caramel latte": ["cup", "shot", "milk", "caramel"],
    "vanilla latte": ["cup", "shot", "milk", "vanilla"],
    "caramel mocha": ["cup", "shot", "milk", "chocolate", "caramel"],
  
    "iced water": ["cup", "water", "ice"],
    "iced milk": ["cup", "milk", "ice"],
    "iced americano": ["cup", "shot", "water", "ice"],
    "iced latte": ["cup", "shot", "milk", "ice"],
    "iced mocha": ["cup", "shot", "milk", "chocolate", "ice"],
    "iced vanilla latte": ["cup", "shot", "milk", "vanilla", "ice"],
    "iced caramel latte": ["cup", "shot", "milk", "caramel", "ice"],
    "iced caramel mocha": ["cup", "shot", "milk", "chocolate", "caramel", "ice"],
  
    "hot water": ["cup", "water", "heat"],
    "hot milk": ["cup", "milk", "heat"],
    "hot americano": ["cup", "shot", "water", "heat"],
    "hot latte": ["cup", "shot", "milk", "heat"],
    "hot mocha": ["cup", "shot", "milk", "chocolate", "heat"],
    "hot vanilla latte": ["cup", "shot", "milk", "vanilla", "heat"],
    "hot caramel latte": ["cup", "shot", "milk", "caramel", "heat"],
    "hot caramel mocha": ["cup", "shot", "milk", "chocolate", "caramel", "heat"],
  
    "frothed milk": ["cup", "milk", "froth"],
  
    "cappuccino": ["cup", "shot", "milk", "heat", "froth"],

    "macchiato": ["cup", "shot", "milk", "froth"],
    "caramel macchiato": ["cup", "shot", "milk", "caramel", "froth"]
  
}

export const NAMES = ["John", "James", "Jack", "Sandra", "Randal", "Jessica", "George", "Bill", "Barbara", "Bella", "Noah", "Caden", "Peter", "Olivia", "Mia", "Rebecca", "Rose", "Sue", "Paul", "Alex", "Jason", "Jake", "Jennifer", "Ellie", "Paige", "Madison"];

export const ORDERS = [
    {
        item: "mocha",
        variants: ["hot", "iced"],
        price: 5
    },
    {
        item: "hot chocolate",
        price: 4
    },
    {
        item: "caramel frap",
        price: 5
    },
    {
        item: "mocha frap",
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
        item: "vanilla latte",
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
    {
        item: "macchiato",
        price: 3
    },
    {
        item: "caramel macchiato",
        price: 5
    },
];

export const STOCK = {
    "beans": {
        defaultStock: 12,
        
        amountToBuy: 20,
        priceToBuy: 5,
        productToBuy: "Bag of beans"
    },

    "milk": {
        defaultStock: 8,
        
        amountToBuy: 16,
        priceToBuy: 16,
        productToBuy: "Gallon of milk",
    },

    "chocolate": {
        defaultStock: 5,
        
        amountToBuy: 12,
        priceToBuy: 6,
        productToBuy: "Bottle of chocolate"
    },

    "caramel": {
        defaultStock: 5,
        stockUnit: "pump",
        
        amountToBuy: 12,
        priceToBuy: 6,
        productToBuy: "Bottle of caramel"
    },

    "vanilla": {
        defaultStock: 5,
        stockUnit: "pump",
        
        amountToBuy: 12,
        priceToBuy: 6,
        productToBuy: "Bottle of vanilla"
    },
}

export const FLOORS = {
    default: { colors: ["#ab9685", "#e0d5cc", "#ccb6a3"], price: null },
    red: { colors: ["#a63f3f", "#e3e3e3", "#242323"], price: 20 },
    gray: { colors: ["#bbc0c4", "#767e85", "#e1e3e6"], price: 30 },
    green: { colors: ["#b8d1bc", "#7b9c80", "#63544a"], price: 40 },
    blue: { colors: ["#7192bf", "#e9f0f7", "#314661"], price: 50 },
    pink: { colors: ["#ffc2d2", "#fff0a6", "#edccab"], price: 60 },
    purple: { colors: ["#f7e1f6", "#7d68a3", "#c0aed6"], price: 70 },
    seafoam: { colors: ["#adc9c2", "#5a8c7f", "#254039"], price: 80 },
}

export const POSITIVE_REVIEWS = ["Great!", "Wow!", "Best day ever!", "Thanks!", "Yay!", "Delicious!"];
export const NEGATIVE_REVIEWS = ["Terrible!", "Gross!", "Unbelievable!", "You stink!"];
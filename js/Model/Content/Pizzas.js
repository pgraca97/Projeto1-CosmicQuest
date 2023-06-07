window.PizzaTypes = {
    normal: "normal",
    spicy: "spicy",
    veggie: "veggie",
    fungi: "fungi",
    chill: "chill",
}

window.Pizzas = {
    "s001": {
        name: "Slice Samurai",
        type: PizzaTypes.spicy,
        src: "/assets/images/characters/pizzas/s001.png",
        icon: "/assets/images/icons/spicy.png",
        actions: [ "clumsyStatus" , "saucyStatus", "damage1" ],
    },
    "v001": {
        name: "Call me Kale",
        type: PizzaTypes.veggie,
        src: "/assets/images/characters/pizzas/v001.png",
        icon: "/assets/images/icons/veggie.png",
        actions: [ "damage1" ],
    },
    "f001": {
        name: "Portobello Express",
        type: PizzaTypes.fungi,
        src: "/assets/images/characters/pizzas/f001.png",
        icon: "/assets/images/icons/fungi.png",
        actions: [ "damage1" ],
    },
}
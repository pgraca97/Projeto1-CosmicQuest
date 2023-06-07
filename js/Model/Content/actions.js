window.Actions = {
    damage1: {
        name: " Whomp!",
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}!"},
            { type: "animation", animation: "spin" },
             { type: "stateChange", damage: 10 }
            
        ]
    },
    saucyStatus: {
        name: "Tomato Squeeze!",
        targetType: "friendly",
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}!"},
             { type: "stateChange",  status: { type: "saucy", expiresIn: 3 } }
        ]
    },
    clumsyStatus: {
        name: "Olive Oil",
        success: [
            {type: "textMessage", text: "{CASTER} uses {ACTION}!"},
            { type: "animation",  animation: "glob", color: "#dafd2a" },
             { type: "stateChange",  status: { type: "clumsy", expiresIn: 3 } },
             { type: "textMessage", text: "{TARGET} is slipping aLL AROUND!!"}
        ]
    },
}
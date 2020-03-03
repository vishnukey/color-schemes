const Colours = Object.freeze({
    yellow:"hsl(60,60%,80%)", //#444
    darkGrey: "hsl(0,0%,15%)",
    lightGrey: "#bbb", 
    black: "#000",
    white: "#fff",
})

const ColorSchemes = Object.freeze({
    "blackOnYellow":{
        backgroundColor: Colours.yellow,
        color: Colours.darkGrey,
    },
    "yellowOnBlack":{
        backgroundColor: Colours.darkGrey,
        color: Colours.yellow,
    },
    "darkOnLight":{
        backgroundColor: Colours.darkGrey, 
        color: Colours.lightGrey,
    },
    "lightOnDark":{
        backgroundColor: Colours.lightGrey,
        color: Colours.darkGrey, 
    },
    "blackOnWhite":{
        backgroundColor: Colours.white,
        color: Colours.black,
    },
    "whiteOnBlack":{
        backgroundColor: Colours.black,
        color: Colours.white,
    },
})

const buttons = document.querySelectorAll(".color-scheme-button");
const buttonArray = Array.from(buttons)

const Effect = f => (...args) => Object.freeze({
    runEffect: () => f(...args),
})

const runEffects = effs => effs.forEach(eff => eff.runEffect())

const deactivateAll = Effect(btns => 
    btns
        .map(btn => btn.dataset)
        .forEach(ds => ds.active = false))

const activateButton = btns => Effect(scheme =>
    btns
        .map(btn => btn.dataset)
        .filter(ds => ds.colorScheme === scheme)
        .forEach(ds => ds.active = true))

const applyNewStyleTo = schemes => Effect(btns => {
    const [scheme, ..._] = btns
        .map(btn => btn.dataset)
        .filter(ds => ds.active === "true")
        .map(ds => ds.colorScheme)

    const body = document.querySelector("body")
    const deltaStyle = schemes[scheme]
    
    for (const key in deltaStyle){
        body.style[key] = deltaStyle[key]
    }
})

const update = applyNewStyleTo(ColorSchemes)
const activate = activateButton(buttonArray)

// Initialize state of everything

buttonArray
    .map(button => button.dataset)
    .filter(dataset => dataset.default != undefined)
    .forEach(df => df.active = true)

buttonArray.forEach(btn => btn.addEventListener('click', e => {
    const scheme = btn.dataset.colorScheme
    runEffects([
        deactivateAll(buttonArray),
        activate(scheme),
        update(buttonArray)
    ])
}))

update(buttonArray).runEffect()
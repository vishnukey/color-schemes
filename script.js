const Namespace = Object.freeze
const Record = Object.freeze
const ImmutableObject = Object.freeze

const Colours = Namespace({
    yellow: "hsl(60,60%,80%)", //#444
    darkGrey: "hsl(0,0%,15%)",
    lightGrey: "#bbb", 
    black: "#000",
    white: "#fff",
})

const ColorSchemes = Namespace({
    "blackOnYellow":Record({
        backgroundColor: Colours.yellow,
        color: Colours.darkGrey,
    }),
    "yellowOnBlack":Record({
        backgroundColor: Colours.darkGrey,
        color: Colours.yellow,
    }),
    "darkOnLight":Record({
        backgroundColor: Colours.darkGrey, 
        color: Colours.lightGrey,
    }),
    "lightOnDark":Record({
        backgroundColor: Colours.lightGrey,
        color: Colours.darkGrey, 
    }),
    "blackOnWhite":Record({
        backgroundColor: Colours.white,
        color: Colours.black,
    }),
    "whiteOnBlack":Record({
        backgroundColor: Colours.black,
        color: Colours.white,
    }),
})

const buttons = document.querySelectorAll(".color-scheme-button")
const buttonArray = Array.from(buttons)

const Effect = f => (...args) => ImmutableObject({
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
    .filter(dataset => dataset.default !== undefined)
    .forEach(df => df.active = true)

buttonArray.forEach(btn => btn.addEventListener('click', _ => {
    const scheme = btn.dataset.colorScheme
    runEffects([
        deactivateAll(buttonArray),
        activate(scheme),
        update(buttonArray)
    ])
}))

update(buttonArray).runEffect()
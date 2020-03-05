const Namespace = Object.freeze
const Record = Object.freeze
const ImmutableObject = Object.freeze

const parsePallette = pallette => Object.freeze(Object.assign(
    ...Array.from(pallette.querySelectorAll("named-color"))
        .map(nc => nc.dataset)
        .map(ds => {
            const obj = {}
            obj[ds.name] = ds.color
            return obj
        })
))

const nameToColorScheme = colours => name => {
    const [fg, bg] = name.split("On")
    return Record({
        backgroundColor: colours[bg],
        color: colours[fg],
    })
}

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

const applyNewStyleWith = schemes => Effect(btns => {
    const [scheme, ..._] = btns
        .map(btn => btn.dataset)
        .filter(ds => ds.active === "true")
        .map(ds => ds.colorScheme)

    const body = document.querySelector("body")
    const deltaStyle = schemes(scheme)

    for (const key in deltaStyle){
        body.style[key] = deltaStyle[key]
    }
})

const blankElement = () => class extends HTMLElement{
    constructor(){
        super()
    }
}

const buttons = document.querySelectorAll("color-scheme")
const pallette = document.querySelector("color-pallette")

const buttonArray = Array.from(buttons)
const Colours = parsePallette(pallette)
const lookupColor = nameToColorScheme(Colours)
const update = applyNewStyleWith(lookupColor)
const activate = activateButton(buttonArray)

window.customElements.define("color-scheme", blankElement()) // maybe uneeded
window.customElements.define("color-pallette", blankElement())
window.customElements.define("named-color", blankElement())

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
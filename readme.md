# ycom

`yo-yo` components with events.

[![npm](https://img.shields.io/npm/v/ycom.svg?style=flat-square)](https://www.npmjs.com/package/ycom)
[![Build Status](https://img.shields.io/travis/seangenabe/ycom/master.svg?style=flat-square)](https://travis-ci.org/seangenabe/ycom)
[![Dependency Status](https://img.shields.io/david/seangenabe/ycom.svg?style=flat-square)](https://david-dm.org/seangenabe/ycom)
[![devDependency Status](https://img.shields.io/david/dev/seangenabe/ycom.svg?style=flat-square)](https://david-dm.org/seangenabe/ycom#info=devDependencies)
[![node](https://img.shields.io/node/v/ycom.svg?style=flat-square)](https://nodejs.org/en/download/)

## Usage

```javascript
const Component = require('ycom')
```

The module exports `Component`, a class that should be extended for use by consumers. `Component` extends `EventEmitter`, so passing events around is supported out of the box.

### #constructor(opts)

* opts: Passed to `EventEmitter`. Optional.

### #render(): HTMLElement

Should be overridden by consumers to return an instance of `HTMLElement`.

Check out the npm packages [bel](https://www.npmjs.com/package/bel), [hyperx](https://www.npmjs.com/package/hyperx), and [yo-yo](https://www.npmjs.com/package/yo-yo) for easy generation of `HTMLElement` instances from Javascript.

### #added() / Event: added

When the component node is added to the document, the `added` prototype method will be called, and the `added` event will be fired.

### #removed() / Event: removed

When the component node is removed from the document, the `removed` prototype method will be called, and the `removed` event will be fired.

### get #node

Returns the node currently assigned to the component, or generates one if it doesn't exist.

### Example

```javascript
const Component = require('ycom')
const yo = require('yo-yo')

class MyComponent extends Component {

  constructor({ message = '' } = {}) {
    super() // You can pass arguments to the EventEmitter constructor here (optional).
    this.message = message
  }

  added() {
    console.log("called when added to the DOM!")
  }

  removed() {
    console.log("called when removed from the DOM!")
  }

  render() {
    return yo`<em>${this.message}</em>` // compose the component rendering function here
  }
}

let component = new MyComponent({ message: "Hello Javascript!" })

component.once('added', () => console.log("also called when added to the DOM"))
component.once('removed', () =>
  console.log("also called when removed from the DOM")
)

document.body.appendChild(component.node)
```

## License

MIT

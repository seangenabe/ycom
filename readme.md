# ycom

`morphdom` components with events.

[![npm](https://img.shields.io/npm/v/ycom.svg?style=flat-square)](https://www.npmjs.com/package/ycom)
[![Build Status](https://img.shields.io/travis/seangenabe/ycom/master.svg?style=flat-square)](https://travis-ci.org/seangenabe/ycom)
[![Dependency Status](https://img.shields.io/david/seangenabe/ycom.svg?style=flat-square)](https://david-dm.org/seangenabe/ycom)
[![devDependency Status](https://img.shields.io/david/dev/seangenabe/ycom.svg?style=flat-square)](https://david-dm.org/seangenabe/ycom#info=devDependencies)
[![node](https://img.shields.io/node/v/ycom.svg?style=flat-square)](https://nodejs.org/en/download/)

## Usage

```
const Component = require('ycom')
```

The module exports `Component`, a class that can (and should) extended for use by consumers. `Component` extends `EventEmitter`, so passing events around is supported out of the box.

### #constructor(opts)

* opts: Passed to `EventEmitter`. Optional.

### #render(): HTMLElement

Should be overridden by consumers to return an instance of `HTMLElement`.

Check out the npm packages `bel`, `hyperx`, and `yo-yo` for easy generation of `HTMLElement` instances from Javascript.

### #added() / Event: added

When the component node is added to the document, the `added` prototype method will be called, and the `added` event will be fired.

### #removed() / Event: removed

When the component node is removed from the document, the `removed` prototype method will be called, and the `removed` event will be fired.

### get #node

Returns the node currently assigned to the document, or generates one if it doesn't exist.

## License

MIT

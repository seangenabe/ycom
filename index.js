const yo = require('yo-yo')
const { EventEmitter } = require('events')
const randomatic = require('randomatic')
const g = require('global')

function uid() {
  return randomatic('a0', 6)
}

const componentMap = new Map() // uuid -> Component
let observer
const pkgKey = `ycom${uid()}`
const browser = Boolean(g.document)

const initialized = Symbol('initialized')
const id = Symbol('id')
const addedCore = Symbol('addedCore')
const removedCore = Symbol('removedCore')
const wrapRender = Symbol('wrapRender')
const _node = Symbol('_node')
const inDOM = Symbol('inDOM')
const register = Symbol('register')

module.exports = class Component extends EventEmitter {

  constructor(opts) {
    super(opts)
    this[initialized] = false
    this[id] = `${this.constructor.name}+${uid()}`
  }

  added() {}
  removed() {}
  render() {}

  [addedCore]() {
    this.emit('added')
    this.added()
  }

  [removedCore]() {
    this.emit('removed')
    this.removed()
  }

  [wrapRender]() {
    let newNode
    try {
      newNode = this.render()
    }
    catch (err) {
      console.error(err)
      throw err
    }
    if (!(newNode instanceof HTMLElement)) {
      throw new Error("rendered node must be an HTMLElement")
    }
    if (browser && newNode.dataset) {
      newNode.dataset[pkgKey] = this[id]
    }
    return newNode
  }

  update() {
    let node = this[_node]
    if (node) {
      let newNode = this[wrapRender]()
      yo.update(node, newNode)
    }
    else {
      this.node
    }
  }

  get node() {
    if (!this[initialized]) {
      let node = this[wrapRender]()
      this[_node] = node
      this[inDOM] = false
      Component[register](node, this)
      this[initialized] = true
    }
    return this[_node]
  }

  static [register](node, component) {
    componentMap.set(component[id], component)
  }
}

if (browser) {
  observer = new MutationObserver(records => {
    for (let record of records) {
      let { target, oldValue } = record

      // Check for ID changes caused by being replaced by a similar component.
      if (record.attributeName === `data-${pkgKey}`) {
        if (record.oldValue != null) {
          // Signal removal of old component.
          componentMap.get(oldValue)[removedCore](target)
          componentMap.delete(oldValue)
        }
      }

      // Check if the target is a new component node.
      if (target.dataset && target.dataset[pkgKey]) {
        let component = componentMap.get(target.dataset[pkgKey])
        if (!component) { return }
        component[_node] = target
        // Signal addition of new component.
        if (record.attributeName === `data-${pkgKey}`) {
          component[addedCore]()
        }
      }

      // Check if the added node belongs to a component.
      for (let node of walk(record.addedNodes)) {
        if (!(node.dataset && node.dataset[pkgKey])) {
          continue
        }
        let component = componentMap.get(node.dataset[pkgKey])
        // Signal addition of new component.
        component[_node] = node
        component[addedCore]()
      }

      // Collect nodes to delete in a stack.
      // impl detail: inverted stack for forward iteration
      let nodesToDelete = []
      for (let node of walk(record.removedNodes)) {
        if (!(node.dataset && node.dataset[pkgKey])) {
          continue
        }
        nodesToDelete.unshift(node)
      }
      // Delete nodes starting from the bottom of the node tree.
      for (let node of nodesToDelete) {
        componentMap.get(node.dataset[pkgKey])[removedCore]()
        componentMap.delete(oldValue)
      }
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true
  })
}

function* iterate(list) {
  if (list[Symbol.iterator]) {
    yield* list
  }
  for (let i = 0, len = list.length; i < len; i++) {
    yield list[i]
  }
}

function* walk(n) {
  if (n instanceof NodeList || Array.isArray(n)) {
    for (let a of iterate(n)) {
      yield* walk(a)
    }
    return
  }
  yield n
  for (let childNode of iterate(n.childNodes)) {
    yield* walk(childNode)
  }
}

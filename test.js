const t = require('tape')
const Component = require('.')
const yo = require('yo-yo')

class MyComponent extends Component {

  constructor({ child, text = 'foo', comment = 'alpha' } = {}) {
    super()
    this.child = child
    this.text = text
    this.comment = comment
  }

  render() {
    let { child, text, comment } = this
    let c = child && child.node || text
    return yo`<div>${c} <em data-comment="${comment}">${comment}</em></div>`
  }

}

t('add component node', t => {
  t.plan(1)
  const component = new MyComponent()
  component.once('added', () => {
    t.ok(document.body.contains(component.node))
    t.end()
  })
  document.body.appendChild(component.node)
})

t('add component node to div', t => {
  t.plan(1)
  const component = new MyComponent()
  component.once('added', () => {
    t.ok(document.body.contains(component.node))
    t.end()
  })
  let div = document.createElement('div')
  document.body.appendChild(div)
  div.appendChild(component.node)
})

t('add component node to another', t => {
  t.plan(1)
  const inner = new MyComponent()
  const outer = new MyComponent({ child: inner })
  Promise.all([
    new Promise(r => outer.once('added', r)),
    new Promise(r => inner.once('added', r))
  ]).then(() => {
    t.ok(document.body.contains(inner.node))
  })
  document.body.appendChild(outer.node)
})

t('change inner node', t => {
  const inner = new MyComponent()
  const outer = new MyComponent({ child: inner })
  inner.once('added', () => {
    t.ok(document.body.contains(outer.node))
    t.ok(outer.node.querySelector(`div > em[data-comment="alpha"]`))
    inner.comment = 'beta'
    inner.update()
    t.ok(document.body.contains(outer.node))
    t.ok(outer.node.querySelector(`div > em[data-comment="beta"]`))
    t.end()
  })
  document.body.appendChild(outer.node)
})

t('update outer node without changing inner node', t => {
  const inner = new MyComponent()
  const outer = new MyComponent({ child: inner })
  inner.once('added', () => {
    inner.comment = 'beta'
    inner.update()
    t.ok(document.body.contains(inner.node))
    t.end()
    outer.comment = 'bar'
    t.ok(document.body.contains(inner.node))
  })
  document.body.appendChild(outer.node)
})

// more tests...

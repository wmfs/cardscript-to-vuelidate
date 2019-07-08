const jsonToVuelidate = require('@wmfs/json-to-vuelidate')
const COLLECTIONS = [
  { element: 'Container', collection: 'items' },
  { element: 'TabSet', collection: 'tabs' },
  { element: 'Tab', collection: 'items' },
  { element: 'ColumnSet', collection: 'columns' },
  { element: 'Column', collection: 'items' }
  // todo: other collections?
]

module.exports = function (cardscript) {
  const json = {}

  function parseElement (element, idx) {
    if (element.id) {
      json[element.id] = {}

      if (element.validation) {
        Object.entries(element.validation).forEach(([key, value]) => {
          switch (key) {
            case 'minLength':
              json[element.id].minLength = value
              break
            case 'maxLength':
              json[element.id].maxLength = value
              break
            case 'minimum':
              json[element.id].minimum = value
              break
            case 'maximum':
              json[element.id].maximum = value
              break
            case 'required':
              json[element.id].required = value
              break
            case 'requiredIf':
              json[element.id].requiredIf = value
              break
            case 'email':
              json[element.id].email = value
              break
            case 'between':
              json[element.id].between = value
          }
        })

        if (element.type === 'Input.ApiLookup') {
          const selected = json[element.id]
          json[element.id] = { selected }
        }
      }

      if (element.type === 'Input.Email') {
        json[element.id].email = true
      }

      if (Object.keys(json[element.id]).length === 0) delete json[element.id]
    }

    for (const c of COLLECTIONS) {
      if (element.type === c.element) {
        element[c.collection].forEach(parseElement)
      } else if (element.type === 'Collapsible') {
        element.card.body.forEach(parseElement)
      }
    }
  }

  cardscript.body.forEach(parseElement)

  return jsonToVuelidate(json)
}

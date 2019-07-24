const jsonToVuelidate = require('@wmfs/json-to-vuelidate')
const COLLECTIONS = [
  { element: 'Container', collection: 'items' },
  { element: 'TabSet', collection: 'tabs' },
  { element: 'Tab', collection: 'items' },
  { element: 'ColumnSet', collection: 'columns' },
  { element: 'Column', collection: 'items' }
  // todo: other collections?
]

const apiLookupPath = []

module.exports = function (cardscript) {
  const json = {}

  function parseElement (element, idx) {
    if (element.id) {
      json[element.id] = {}

      if (element.validation) {
        Object.entries(element.validation).forEach(([key, value]) => {
          switch (key) {
            case 'minLength':
              appendFn(json, element.id, 'minLength', value)
              break
            case 'maxLength':
              appendFn(json, element.id, 'maxLength', value)
              break
            case 'minimum':
              appendFn(json, element.id, 'minimum', value)
              break
            case 'maximum':
              appendFn(json, element.id, 'maximum', value)
              break
            case 'required':
              appendFn(json, element.id, 'required', value)
              break
            case 'requiredIf':
              appendFn(json, element.id, 'requiredIf', value)
              break
            case 'email':
              appendFn(json, element.id, 'email', value)
              break
            case 'between':
              appendFn(json, element.id, 'between', value)
          }
        })

        if (element.type === 'List' && !(element.selectionType === 'single' || element.selectionType === 'multi')) {
          delete json[element.id]
        }
      }

      if (element.type === 'Input.Email') {
        json[element.id].email = true
      }

      if (element.type === 'Input.ApiLookup' && element.resultsCard) {
        apiLookupPath.push(element.id)
        json[element.id].params = {}
        element.resultsCard.body.forEach(parseElement)
        apiLookupPath.pop()
      }

      if (json[element.id] && Object.keys(json[element.id]).length === 0) {
        delete json[element.id]
      }
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

function appendFn (obj, id, type, value) {
  if (apiLookupPath.length === 0) {
    obj[id][type] = value
  } else {
    const apiLookupId = apiLookupPath[apiLookupPath.length - 1]
    if (!obj[apiLookupId].params[id]) obj[apiLookupId].params[id] = {}
    obj[apiLookupId].params[id][type] = value
  }
}

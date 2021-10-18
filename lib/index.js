const jsonToVuelidate = require('@wmfs/json-to-vuelidate')
const { collections } = require('@wmfs/cardscript-schema')
const dottie = require('dottie')

const apiLookupPath = []

module.exports = function (cardscript) {
  const messages = {}
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
            case 'maximum.$':
              appendFn(json, element.id, 'maximum.$', value)
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
            case 'regex':
              appendFn(json, element.id, 'regex', value)
              break
            case 'postcode':
              appendFn(json, element.id, 'postcode', value)
              break
            case 'telephoneNumber':
              appendFn(json, element.id, 'telephoneNumber', value)
              break
            case 'between':
              appendFn(json, element.id, 'between', value)
              break
            case 'message':
              messages[element.id] = value
              break
          }
        })

        if (element.type === 'List' && !(element.selectionType === 'single' || element.selectionType === 'multi')) {
          delete json[element.id]
        }
      }

      if (element.type === 'Input.Date') {
        const { min, max } = element
        if (min) appendFn(json, element.id, 'minimumDate', min === '$TODAY' ? new Date() : min)
        if (max) appendFn(json, element.id, 'maximumDate', max === '$TODAY' ? new Date() : max)
      }

      if (element.type === 'Input.Email') {
        json[element.id].email = true
      }

      if (element.type === 'Input.TelephoneNumber') {
        json[element.id].telephoneNumber = true
      }

      if (element.type === 'Input.Number') {
        if (element.numberType === 'decimal') {
          json[element.id].decimal = true
        } else {
          json[element.id].integer = true
        }
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

    for (const [type, path] of Object.entries(collections)) {
      if (element.type === type) {
        dottie.get(element, path).forEach(parseElement)
      }
    }
  }

  cardscript.body.forEach(parseElement)
  return [jsonToVuelidate(json), messages]
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

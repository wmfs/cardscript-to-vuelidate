const jsonToVuelidate = require('@wmfs/json-to-vuelidate')

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
            case 'required':
              json[element.id].required = value
              break
            case 'requiredIf':
              json[element.id].requiredIf = value
              break
            case 'email':
              json[element.id].email = value
              break
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

    if (element.type === 'Container') element.items.forEach(parseElement)
    // todo: parse other 'Containers'
  }

  cardscript.body.forEach(parseElement)

  console.log('json:', json)
  return jsonToVuelidate(json)
}

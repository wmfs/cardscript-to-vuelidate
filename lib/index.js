const jsonToVuelidate = require('@wmfs/json-to-vuelidate')

module.exports = function (cardscript) {
  const json = {}

  function parseElement (element, idx) {
    if (element.id && element.validation) {
      json[element.id] = {}
      Object.entries(element.validation).forEach(([key, value]) => {
        console.log('KEY ', key, ' VAL ', value)
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

    if (element.type === 'Container') element.items.forEach(parseElement)
    // todo: parse other 'Containers'
  }

  cardscript.body.forEach(parseElement)

  return jsonToVuelidate(json)
}

const jsonToVuelidate = require('@wmfs/json-to-vuelidate')

module.exports = function (cardscript) {
  const json = {}

  function parseElement (element, idx) {
    if (element.id && element.validation) {
      json[element.id] = {}
      Object.entries(element.validation).forEach(([key, value]) => {
        console.log(key, value)
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
        }
      })
    }

    if (element.type === 'Container') element.items.forEach(parseElement)
    // todo: parse other 'Containers'
  }

  cardscript.body.forEach(parseElement)

  return jsonToVuelidate(json)
}

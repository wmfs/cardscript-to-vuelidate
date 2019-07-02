/* eslint-env mocha */

const converter = require('./../lib')
const expect = require('chai').expect

const FORM = {
  type: 'AdaptiveCard',
  $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
  version: '1.0',
  body: [
    {
      id: 'numberMin10Max50',
      type: 'Input.Number',
      validation: {
        minimum: 10,
        maximum: 50
      }
    },
    {
      id: 'textMinLen5MaxLen50',
      type: 'Input.Text',
      validation: {
        minLength: 5,
        maxLength: 50
      }
    },
    {
      id: 'textRequired',
      type: 'Input.Text',
      validation: {
        required: true
      }
    },
    {
      id: 'textRequiredIf',
      type: 'Input.Text',
      validation: {
        requiredIf: `data.pokemon = 'Psyduck' || data.pokemon = 'Pikachu'`
      }
    },
    {
      id: 'textEmail',
      type: 'Input.Text',
      validation: {
        email: true
      }
    }
  ]
}

describe('Test the vuelidate converter', () => {
  it('convert a form using validations', () => {
    const vuelidate = converter(FORM)

    expect(vuelidate.numberMin10Max50.minValue).to.be.a('function')
    expect(vuelidate.numberMin10Max50.maxValue).to.be.a('function')

    expect(vuelidate.textMinLen5MaxLen50.minLength).to.be.a('function')
    expect(vuelidate.textMinLen5MaxLen50.maxLength).to.be.a('function')

    expect(vuelidate.textRequired.required).to.be.a('function')

    expect(vuelidate.textRequiredIf.requiredIf).to.be.a('function')

    // expect(vuelidate.textEmail.email).to.be.a('function')
  })
})

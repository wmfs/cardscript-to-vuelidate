/* eslint-env mocha */

const converter = require('./../lib')
const expect = require('chai').expect

const FORM = {
  type: 'AdaptiveCard',
  $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
  version: '1.0',
  body: [
    {
      id: 'numberBetween5And10',
      type: 'Input.Number',
      validation: {
        between: [5, 10]
      }
    },
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
        requiredIf: 'data.pokemon = \'Psyduck\' || data.pokemon = \'Pikachu\''
      }
    },
    {
      id: 'textEmail',
      type: 'Input.Text',
      validation: {
        email: true
      }
    },
    {
      id: 'inputEmail',
      type: 'Input.Email'
    },
    {
      id: 'badList',
      type: 'List',
      validation: {
        required: true
      }
    },
    {
      id: 'list',
      type: 'List',
      selectionType: 'single',
      validation: {
        required: true
      }
    },
    {
      id: 'apiLookup',
      type: 'Input.ApiLookup',
      resultsCard: {
        body: [
          {
            id: 'apiLookupList',
            type: 'List',
            selectionType: 'single',
            validation: {
              required: true
            }
          }
        ]
      }
    }
  ]
}

describe('Test the vuelidate converter', () => {
  it('convert a form using validations', () => {
    const vuelidate = converter(FORM)[0]

    // console.log(vuelidate)

    expect(vuelidate.numberBetween5And10.between.$validator).to.be.a('function')

    expect(vuelidate.numberMin10Max50.minValue.$validator).to.be.a('function')
    expect(vuelidate.numberMin10Max50.maxValue.$validator).to.be.a('function')

    expect(vuelidate.textMinLen5MaxLen50.minLength.$validator).to.be.a('function')
    expect(vuelidate.textMinLen5MaxLen50.maxLength.$validator).to.be.a('function')

    expect(vuelidate.textRequired.required.$validator).to.be.a('function')

    expect(vuelidate.textRequiredIf.requiredIf.$validator).to.be.a('function')

    expect(vuelidate.textEmail.email.$validator).to.be.a('function')
    expect(vuelidate.inputEmail.email.$validator).to.be.a('function')

    console.log('\n------\n', vuelidate)
    // expect(vuelidate.list.required).to.be.a('function')
    // expect(vuelidate.apiLookup.params.apiLookupList.required).to.be.a('function')
  })
})

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

describe('Input.Address (address picker) validation', () => {
  const card = element => ({ type: 'AdaptiveCard', body: [element] })

  it('requires an address unless the user enters it by hand', () => {
    const [vuelidate, messages] = converter(card({ id: 'selectedUprn', type: 'Input.Address' }))

    expect(vuelidate.selectedUprn.requiredIf.$validator).to.be.a('function')
    expect(vuelidate.addressLine1.requiredIf.$validator).to.be.a('function')
    expect(vuelidate.townOrCity.requiredIf.$validator).to.be.a('function')
    expect(vuelidate.postcode.requiredIf.$validator).to.be.a('function')
    expect(vuelidate.postcode.postcode.$validator).to.be.a('function')
    expect(vuelidate.addressLine2).to.eql(undefined)
    expect(messages.selectedUprn).to.eql('Choose an address, or select "I can\'t find the address"')
    expect(messages.addressLine1).to.eql('Enter address line 1')
  })

  it('uses the id prefix for the manual fields', () => {
    const [vuelidate] = converter(card({ id: 'home_selectedUprn', idPrefix: 'home', type: 'Input.Address' }))
    expect(vuelidate.home_addressLine1.requiredIf.$validator).to.be.a('function')
    expect(vuelidate.addressLine1).to.eql(undefined)
  })

  it('is required outright when manual entry is off', () => {
    const [vuelidate, messages] = converter(card({ id: 'uprn', type: 'Input.Address', allowManualEntry: false }))
    expect(vuelidate.uprn.required.$validator).to.be.a('function')
    expect(vuelidate.addressLine1).to.eql(undefined)
    expect(messages.uprn).to.eql('Choose an address')
  })

  it('can be made optional', () => {
    const [vuelidate] = converter(card({ id: 'uprn', type: 'Input.Address', validation: { required: false } }))
    expect(vuelidate.uprn).to.eql(undefined)
    expect(vuelidate.addressLine1).to.eql(undefined)
  })
})

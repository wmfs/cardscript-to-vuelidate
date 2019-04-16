/* eslint-env mocha */

const converter = require('./../lib')
const expect = require('chai').expect
const { complex } = require('@wmfs/cardscript-examples')

describe('Test the vuelidate converter', function () {
  it('convert the complex form', () => {
    const vuelidate = converter(complex)
    console.log('>>> ', vuelidate)
    expect(vuelidate.name.required).to.be.a('function')
    expect(vuelidate.name.minLength).to.be.a('function')
    expect(vuelidate.name.maxLength).to.be.a('function')
  })
})

/* eslint-env mocha */

const converter = require('./../lib')
const expect = require('chai').expect
const { complex } = require('@wmfs/cardscript-examples')

describe('Test the vuelidate converter', function () {
  it('convert the complex form', () => {
    const vuelidate = converter(complex)
    console.log(vuelidate)
  })
})

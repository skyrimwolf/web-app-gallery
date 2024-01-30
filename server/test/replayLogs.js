const expect = require('chai').expect

describe('Tests for replaying logs', () => { 
    it ('should add two numbers', () => {
        const num1 = 2
        const num2 = 3

        expect(num1 + num2).to.equal(5)
    })
 })
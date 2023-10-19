const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('проверка правильно указанного типа', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 120,
        },
      });

      const errors = validator.validate({
        name: 94,
        age: 'Ivan Ivanov',
      });

      expect(errors).to.have.length(2);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');

      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        secondName: {
          type: 'string',
          min: 1,
          max: 5,
        },
      });

      const errors = validator.validate({
        name: 'Lalala',
        secondName: 'Trulala',
      });

      expect(errors).to.have.length(2);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');

      expect(errors[1]).to.have.property('field').and.to.be.equal('secondName');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too long, expect 5, got 7');
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        firstNum: {
          type: 'number',
          min: 10,
          max: 20,
        },
        secondNum: {
          type: 'number',
          min: 50,
          max: 100,
        },
        thirdNum: {
          type: 'number',
          min: 1,
          max: 10,
        },
      });

      const errors = validator.validate({
        firstNum: 4,
        secondNum: 200,
        thirdNum: 5,
      });

      expect(errors).to.have.length(2);

      expect(errors[0]).to.have.property('field').and.to.be.equal('firstNum');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 4');

      expect(errors[1]).to.have.property('field').and.to.be.equal('secondNum');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too big, expect 100, got 200');
    });
  });
});

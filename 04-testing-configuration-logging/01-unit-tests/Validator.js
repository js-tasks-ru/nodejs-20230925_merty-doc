module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
    this.errors = [];
  }

  validate(obj) {
    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        this.errors.push({field, error: `expect ${rules.type}, got ${type}`});
      } else {
        switch (type) {
          case 'string':
            if (value.length < rules.min) {
              this.errors.push({
                field,
                error: `too short, expect ${rules.min}, got ${value.length}`,
              });
            }
            if (value.length > rules.max) {
              this.errors.push({
                field,
                error: `too long, expect ${rules.max}, got ${value.length}`,
              });
            }
            break;
          case 'number':
            if (value < rules.min) {
              this.errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
            }
            if (value > rules.max) {
              this.errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
            }
            break;
        }
      }
    }

    return this.errors;
  }
};

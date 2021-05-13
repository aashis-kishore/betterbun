const schemaBaseLoc = require('../../lib/config').getConfig().schemaBaseLoc;

exports.signUp = {
  $id: `${schemaBaseLoc}/user.signup.schema.js`,
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 24,
      pattern: '^[a-zA-Z]{1,24}$'
    },
    lastName: {
      type: 'string',
      minLength: 1,
      maxLength: 24,
      pattern: '^[a-zA-Z]{1,24}$'
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 48
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 48
    },
    createdAt: {
      type: 'string',
      format: 'date-time'
    }
  },
  required: [
    'firstName',
    'email',
    'password'
  ],
  additionalProperties: false,
  errorMessage: {
    properties: {
      firstName: 'firstName fails to follow constraints',
      lastName: 'lastName fails to follow constraints',
      email: 'email fails to follow constraints',
      password: 'password fails to follow constraints',
      createdAt: 'createdAt fails to follow constraints'
    }
  }
};

// https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1

// https://jestjs.io/docs/en/expect
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
// https://www.freecodecamp.org/news/end-point-testing/
// https://zellwk.com/blog/seed-database/
// https://www.codementor.io/@knownasilya/testing-express-apis-with-supertest-du107mcv2
// https://zellwk.com/blog/endpoint-testing/
// https://www.npmjs.com/package/supertest

// https://thinkster.io/tutorials/node-json-api/configuring-middleware-for-authentication
// https://plugins.mongoosejs.io/plugins/autopopulate
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/

// https://auth0.com/blog/developing-well-organized-apis-with-nodejs-joi-and-mongo/
// https://mongoosejs.com/docs/middleware.html#pre
// https://mongoosejs.com/docs/guide.html

// http://expressjs.com/en/resources/middleware/body-parser.html

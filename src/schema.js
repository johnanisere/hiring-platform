'use strict';
exports.__esModule = true;
var graphql_1 = require('graphql');
var sample_1 = require('./controllers/sample');
var sample_2 = require('./types/sample');
var query = new graphql_1.GraphQLObjectType({
  name: 'Query',
  description: 'The query root of Nert.',
  fields: function() {
    return {
      sample: {
        type: sample_2['default'],
        description: 'A sample root schema',
        resolve: function() {
          return sample_1['default']();
        },
      },
    };
  },
});
var schema = new graphql_1.GraphQLSchema({
  query: query,
});
exports['default'] = schema;

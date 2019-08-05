'use strict';
exports.__esModule = true;
var graphql_1 = require('graphql');
var SampleType = new graphql_1.GraphQLObjectType({
  name: 'SampleType',
  description: 'This is a sample graphql type',
  fields: function() {
    return {
      hello: {
        type: graphql_1.GraphQLString,
        description: 'Returns hello world',
      },
    };
  },
});
exports['default'] = SampleType;

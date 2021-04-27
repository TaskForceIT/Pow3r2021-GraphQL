const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const pjs = require('profoundjs');

function ArtikelDirect(req, res) {
  // Construct a schema, using GraphQL schema language
  const typeDefs = `
    type Query {
      artikel: [Artikel]!
    },
    type Artikel {
      id: Int,    
      name: String,
      groesse: String,
      warengrp: Int,
      }
  `;

  // Resolvers define the technique for fetching the types defined in the schema.
  const resolvers = {
    Query:{
      artikel: () => {
        return pjs.data.get(
          'P3APR2021.ARTIKEL',
          { whereClause: ``, values: [] },
          ``,
          ``,
          ``,
          'ARTIKEL.id, ARTIKEL.name, ARTIKEL.groesse, ARTIKEL.warengrp'
        );
      },
    }
  };

  graphql(
    makeExecutableSchema({      
      typeDefs,      
      resolvers,    
    }),  
    req.body.query)
  .then(
    (response) => {
      res.json(response);
    }
  );
}

exports.run = ArtikelDirect;

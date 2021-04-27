const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const pjs = require('profoundjs');

function AllDirect(req, res) {
  // Construct a schema, using GraphQL schema language
  const typeDefs = `
    type Query {
      artikel: [Artikel]!,
      warengrp: [Warengrp]!,
      kunde: [Kunde]!,
      kauf: [Kauf]!,
    },
    type Artikel {
      id: Int!,    
      name: String,
      groesse: String,
      warengrp: Int,
    },
    type Warengrp {
      id: Int!,
      name: String,
    },
    type Kunde {
      id: Int!,
      vname: String,
      nname: String,
      email: String,
    },
    type Kauf {
      id: Int!, 
      kunde: Int,
      artikel: Int,
      anzahl: Int,
    },
  `;

  // Resolvers define the technique for fetching the types defined in the schema.
  const resolvers = {
    Query: {
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
      warengrp: () => {
        return pjs.data.get(
          'P3APR2021.WARENGRP',
          { whereClause: ``, values: [] },
          ``,
          ``,
          ``,
          'WARENGRP.id, WARENGRP.name'
        );
      },
      kunde: () => {
        return pjs.data.get(
          'P3APR2021.KUNDE',
          { whereClause: ``, values: [] },
          ``,
          ``,
          ``,
          'KUNDE.id, KUNDE.vname, KUNDE.nname, KUNDE.email'
        );
      },
      kauf: () => {
        return pjs.data.get(
          'P3APR2021.KAUF',
          { whereClause: ``, values: [] },
          ``,
          ``,
          ``,
          'KAUF.id, KAUF.kunde, KAUF.artikel, KAUF.anzahl'
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

exports.run = AllDirect;

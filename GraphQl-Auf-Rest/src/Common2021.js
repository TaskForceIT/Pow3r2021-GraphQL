const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const fetch = require('node-fetch');


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
    }
  type Warengrp {
    id: Int!,
    name: String,
  }
  type Kunde {
    id: Int!,
    vname: String,
    nname: String,
    email: String,
  }
  type Kauf {
    id: Int!,
    kunde: Int,
    artikel: Int,
    anzahl: Int,
  }
`;

  // Resolvers define the technique for fetching the types defined in the schema.
  const resolvers = {
    Query:{
      artikel: async () => {
        const response = await fetch('http://Ihre-Rest-Schnittstelle/Artikel')  
        const data  = await response.json();
        return data.artikel;
      },
      warengrp: async () => {
        const response = await fetch('http://Ihre-Rest-Schnittstelle/Warengrp')  
        const data = await response.json();
        return data.warengrp;
      },
      kunde: async () => {
        const response = await fetch('http://Ihre-Rest-Schnittstelle/Kunde')  
        const data = await response.json();
        return data.kunde;
      },
      kauf: async () => {
        const response = await fetch('http://Ihre-Rest-Schnittstelle/Kauf')  
        const data = await response.json();
        return data.kauf;
      },
    } 
  };

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({    
    schema: makeExecutableSchema({      
        typeDefs,      
        resolvers,    
    }),    
    graphiql: true,  
  })
);
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

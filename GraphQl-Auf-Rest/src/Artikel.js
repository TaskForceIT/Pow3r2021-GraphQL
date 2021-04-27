const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const fetch = require('node-fetch');


  // Construct type definitions
  const typeDefs = `
  type Query {
    artikel: [Artikel]!
  }
  type Artikel {    
    id: Int,    
    name: String,
    groesse: String,
    warengrp: Int,
    },
`;

  // Resolvers define the technique for fetching the types defined in the schema.
  const resolvers = {
    Query: {
      artikel: async () => {
        const response = await fetch('http://Ihre-Rest-Schnittstelle/Artikel')  
        const data = await response.json();
        return data.artikel;
      },
    },
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

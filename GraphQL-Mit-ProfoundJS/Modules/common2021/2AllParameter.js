const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const pjs = require('profoundjs');

function AllParameter(req, res) {
  // Construct a schema, using GraphQL schema language
  const typeDefs = `
    type Query {
      artikel(id: Int, name: String): [Artikel]!,
      warengrp(id: Int): [Warengrp]!,
      kunde(id: Int, nname: String): [Kunde]!,
      kauf: [Kauf]!,
    },
    type Artikel {
      id: Int!,    
      name: String,
      groesse: String,
      warengrp: Int,
      art: String,
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
    Query:{
      artikel: (parent, args) => {
        let data = pjs.data.get(
          'P3APR2021.ARTIKEL',
          { whereClause: '', values: [] },
          ``,
          ``,
          ``,
          'ARTIKEL.id, ARTIKEL.name, ARTIKEL.groesse, ARTIKEL.warengrp'
        );

        if(args){
          if(args.id){
            data = [data.find((e) => e.id === args.id)];
          }
          if(args.name){
            data = [data.find((e) => e.name === args.name)];
          }
        }

        return data;
      },
      warengrp: (parent,{id}) => {
        let data = pjs.data.get(
          'P3APR2021.WARENGRP',
          { whereClause: ``, values: [] },
          ``,
          ``,
          ``,
          'WARENGRP.id, WARENGRP.name'
        );

        if(id) data = [data.find((e) => e.id === id)];
        
        return data;
      },
      kunde: (parent,{id,nname}) => {
        let data = pjs.data.get(
          'P3APR2021.KUNDE',
          { whereClause: ``, values: [] },
          ``,
          ``,
          ``,
          'KUNDE.id, KUNDE.vname, KUNDE.nname, KUNDE.email'
        );

        if(id) data = [data.find((e) => e.id === id)];
        if(nname) data = [data.find((e) => e.nname === nname)];
        
        return data;
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
    },
    Artikel:{
      art: ()=>{
        return 'Artikel';
      }
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

exports.run = AllParameter;

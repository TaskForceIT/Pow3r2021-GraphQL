const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const pjs = require('profoundjs');

function AllARR(req, res) {
  const request = req.body.query;

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
      warengrp: Warengrp,
      kauf: Kauf,
      art: String,
    },
    type Warengrp {
      id: Int!,
      name: String,
      artikel: Artikel,
    },
    type Kunde {
      id: Int!,
      vname: String,
      nname: String,
      email: String,
      kauf: Kauf,
    },
    type Kauf {
      id: Int!, 
      kunde: Kunde,
      artikel: Artikel,
      anzahl: Int,
    },
  `;

  function createSql(query, infoElement, sqlParameters){
    const library = 'P3APR2021';
    const table = infoElement.name.value.toUpperCase();

    if(sqlParameters.tables === '') sqlParameters.tables = library + "." + table;
    else addJoinCondition(query, table, sqlParameters);

    const tableFields = infoElement.selectionSet.selections;
    for(const field in tableFields){
      // if the field has no selectionSet it is a leaf item
      if(!tableFields[field].selectionSet){
        // exclude additional info that is not in the db
        if(table !== "ARTIKEL" || tableFields[field].name.value.toUpperCase() !== "ART")
        {
          if(sqlParameters.fields !== '') sqlParameters.fields += ', ';
          sqlParameters.fields += table + '.' + tableFields[field].name.value + " AS " + table + "_" + tableFields[field].name.value;
        }
      }
      else{
        createSql(query, tableFields[field], sqlParameters);
      }
    }
  }

  function addJoinCondition(query, table, sqlParameters){
    switch (table) {
      case 'ARTIKEL':
        if(query === 'WARENGRP'){
          sqlParameters.tables += " INNER JOIN P3APR2021.ARTIKEL ON WARENGRP.ID = ARTIKEL.WARENGRP"
        }
        else sqlParameters.tables += " INNER JOIN P3APR2021.ARTIKEL ON KAUF.ARTIKEL = ARTIKEL.ID"
        break;
      case 'WARENGRP':
        sqlParameters.tables += " INNER JOIN P3APR2021.WARENGRP ON ARTIKEL.WARENGRP = WARENGRP.ID"
        break;
      case 'KAUF':
        if(query === 'KUNDE'){
          sqlParameters.tables += " INNER JOIN P3APR2021.KAUF ON KUNDE.ID = KAUF.KUNDE"
        }
        else sqlParameters.tables += " INNER JOIN P3APR2021.KAUF ON ARTIKEL.ID = KAUF.ARTIKEL"
        break;
      case 'KUNDE':
        sqlParameters.tables += " INNER JOIN P3APR2021.KUNDE ON KAUF.KUNDE = KUNDE.ID"
        break;
      default:
        break;
    }
  }

  // Resolvers define the technique for fetching the types defined in the schema.
  const resolvers = {
    Query:{
      artikel: (parent,{id,name},context,info) => {
        const sqlParameters = {whereClause: '', tables:'',fields:''};

        if(name) sqlParameters.whereClause = 'name LIKE'+ name;
        if(id) sqlParameters.whereClause = 'id='+ id;

        createSql(info.fieldName.toUpperCase(),info.fieldNodes[0],sqlParameters);

        return pjs.data.get(
          sqlParameters.tables,
          { whereClause: sqlParameters.whereClause, values: [] },
          ``,
          ``,
          ``,
          sqlParameters.fields
        );
      },
      warengrp: (parent,{id},context,info) => {
        const sqlParameters = {whereClause: '', tables:'',fields:''};

        if(id) sqlParameters.whereClause = 'id='+ id;

        createSql(info.fieldName.toUpperCase(),info.fieldNodes[0],sqlParameters);

        return pjs.data.get(
          sqlParameters.tables,
          { whereClause: sqlParameters.whereClause, values: [] },
          ``,
          ``,
          ``,
          sqlParameters.fields
        );
      },
      kunde: (parent,{id,nname},context,info) => {
        const sqlParameters = {whereClause: '', tables:'',fields:''};

        if(nname) sqlParameters.whereClause = 'nname='+ nname;
        if(id) sqlParameters.whereClause = 'id='+ id;

        createSql(info.fieldName.toUpperCase(),info.fieldNodes[0],sqlParameters);

        return pjs.data.get(
          sqlParameters.tables,
          { whereClause: sqlParameters.whereClause, values: [] },
          ``,
          ``,
          ``,
          sqlParameters.fields
        );
      },
      kauf: (parent,args,context,info) => {
        const sqlParameters = {whereClause: '', tables:'',fields:''};

        createSql(info.fieldName.toUpperCase(),info.fieldNodes[0],sqlParameters);

        return pjs.data.get(
          sqlParameters.tables,
          { whereClause: sqlParameters.whereClause, values: [] },
          ``,
          ``,
          ``,
          sqlParameters.fields
        );
      },
    },
    Artikel:{
      id: (parent)=>(parent.artikel_id),
      name: (parent)=>(parent.artikel_name),
      groesse: (parent)=>(parent.artikel_groesse),
      warengrp: (parent)=>(parent),
      kauf: (parent)=>(parent),
      art: ()=>('Artikel'),
    },
    Warengrp:{
      id: (parent)=>(parent.warengrp_id),
      name: (parent)=>(parent.warengrp_name),
      artikel: (parent)=>(parent),
    },
    Kunde:{
      id: (parent)=>(parent.kunde_id),
      vname: (parent)=>(parent.kunde_vname),
      nname: (parent)=>(parent.kunde_nname),
      email: (parent)=>(parent.kunde_email),
      kauf: (parent)=>(parent),
    },
    Kauf:{
      id: (parent)=>(parent.kauf_id), 
      kunde: (parent)=>(parent),
      artikel: (parent)=>(parent),
      anzahl: (parent)=>(parent.kauf_anzahl),
    }
  };

  graphql(
    makeExecutableSchema({      
      typeDefs,      
      resolvers,    
    }),  
    request)
  .then(
    (response) => {
      res.json(response);
    }
  );
}

exports.run = AllARR;

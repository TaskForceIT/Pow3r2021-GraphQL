const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const pjs = require('profoundjs');


function AllJoined(req, res) {
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
      kauf: [Kauf],
      art: String,
    },
    type Warengrp {
      id: Int!,
      name: String,
      artikel: [Artikel],
    },
    type Kunde {
      id: Int!,
      vname: String,
      nname: String,
      email: String,
      kauf: [Kauf],
    },
    type Kauf {
      id: Int!, 
      kunde: Kunde,
      artikel: Artikel,
      anzahl: Int,
    },
  `;

  function getArtikel(){
    return pjs.data.get(
      'P3APR2021.ARTIKEL',
      { whereClause: '', values: [] },
      ``,
      ``,
      ``,
      'ARTIKEL.id, ARTIKEL.name, ARTIKEL.groesse, Artikel.warengrp'
    );
  }

  function getWarengrp(){
    return pjs.data.get(
      'P3APR2021.WARENGRP',
      { whereClause: ``, values: [] },
      ``,
      ``,
      ``,
      'WARENGRP.id, WARENGRP.name'
    );
  }

  function getKunde(){
    return pjs.data.get(
      'P3APR2021.KUNDE',
      { whereClause: ``, values: [] },
      ``,
      ``,
      ``,
      'KUNDE.id, KUNDE.vname, KUNDE.nname, KUNDE.email'
    );
  }

  function getKauf(){
    return pjs.data.get(
      'P3APR2021.KAUF',
      { whereClause: ``, values: [] },
      ``,
      ``,
      ``,
      'KAUF.id, KAUF.kunde, KAUF.artikel, KAUF.anzahl'
    );
  }

  // Resolvers define the technique for fetching the types defined in the schema.
  const resolvers = {
    Query:{
      artikel: (parent,{id,name}) => {
        let data = getArtikel(); 
        if(id) data = [data.find((e) => e.id === id)];
        if(name) data = [data.find((e) => e.name === name)];

        if(request.includes('warengrp')){
          const warengrp = getWarengrp();
          for(const element in data){
            if(data[element]) data[element].warengrp = warengrp.find((e) => e.id === data[element].warengrp)
          }
        }
        
        if(request.includes('kauf')){
          const kauf = getKauf();
          for(const element in data){
            if(data[element]) data[element].kauf = kauf.filter((e) => e.artikel === data[element].id)
          }

          if(request.includes('kunde')){
            const kunde = getKunde();
            for(const element in data){
              if(data[element]){
                for(const k in data[element].kauf){
                  if(data[element].kauf[k]) data[element].kauf[k].kunde = kunde.find((e)=> e.id === data[element].kauf[k].kunde)
                }
              }
            }
          }
        }
        
        data.art = 'Artikel';
        return data;
      },
      warengrp: (parent,{id}) => {
        let data = getWarengrp();  
        if(id) data = [data.find((e) => e.id === id)];

        if(request.includes('artikel')){
          const artikel = getArtikel();
          for(const element in data){
            if(data[element]) data[element].artikel = artikel.filter((e) => e.warengrp === data[element].id)
          }

          if(request.includes('kauf')){
            const kauf = getKauf();
            for(const element in data){
              if(data[element]){
                for(const a in data[element].artikel){
                  if(data[element].artikel[a]) data[element].artikel[a].kauf = kauf.filter((e)=> e.artikel === data[element].artikel[a].id)
                } 
              } 
            }

            if(request.includes('kunde')){
              const kunde = getKunde();
              for(const element in data){
                if(data[element]){
                  for(const a in data[element].artikel){
                    if(data[element].artikel[a]) {
                      for(const k in data[element].artikel[a].kauf){
                        if(data[element].artikel[a].kauf[k]) {
                          data[element].artikel[a].kauf[k].kunde = kunde.find((e)=> e.id === data[element].artikel[a].kauf[k].kunde)
                        }
                      }
                    }
                  } 
                } 
              }
            }
          }
        }

        return data;
      },
      kunde: (parent,{id,nname}) => {
        let data = getKunde();   
        if(id) data = [data.find((e) => e.id === id)];
        if(nname) data = [data.find((e) => e.nname === nname)];

        if(request.includes('kauf')){
          const kauf = getKauf();
          for(const element in data){
            if(data[element]) data[element].kauf = kauf.filter((e) => e.kunde === data[element].id)
          }

          if(request.includes('artikel')){
            const artikel = getArtikel();
            for(const element in data){
              if(data[element]) {
                for(const k in data[element].kauf){
                  if(data[element].kauf[k]) data[element].kauf[k].artikel = artikel.find((e)=> e.id === data[element].kauf[k].artikel)
                }
              }
            }

            if(request.includes('warengrp')){
              const warengrp = getWarengrp();
              for(const element in data){
                if(data[element]) {
                  for(const k in data[element].kauf){
                    if(data[element].kauf[k] && data[element].kauf[k].artikel){
                      data[element].kauf[k].artikel.warengrp = warengrp.find((e)=> e.id === data[element].kauf[k].artikel.warengrp)
                    }
                  }
                }
              }
            }
          }
        }

        return data;
      },
      kauf: () => {
        const data = getKauf();

        if(request.includes('kunde')){
          const kunde = getKunde();
          for(const element in data){
            if(data[element]) data[element].kunde = kunde.find((e) => e.id === data[element].kunde)
          }
        }

        if(request.includes('artikel')){
          const artikel = getArtikel();
          for(const element in data){
            if(data[element]) data[element].artikel = artikel.find((e) => e.id === data[element].artikel)
          }

          if(request.includes('warengrp')){
            const warengrp = getWarengrp();
            for(const element in data){
              if(data[element].artikel) data[element].artikel.warengrp = warengrp.find((e)=> e.id === data[element].artikel.warengrp)
            }
          }
        }

        return data;
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
    request)
  .then(
    (response) => {
      res.json(response);
    }
  );
}

exports.run = AllJoined;

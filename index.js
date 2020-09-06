const Pool = require('pg').Pool
const admin = require("firebase-admin");

const pool = new Pool({
    user: process.env.db_user,
    host: process.env.db_host,
    database: process.env.db_db,
    password: process.env.db_pass,
    port: process.env.db_port
})

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://edu1-52b30.firebaseio.com"
});

admin.firestore().collection('data').get().then(res=>{
  res.docs.map((doc,ind)=>{
    if('justImage' in doc.data() && doc.data().justImage){
      pool.query('select * from problem where doc_id=\''+doc.id+'\'').then(baseRes=>{
        if(baseRes.rows.length==0){
          pool.query('select series_id from series where doc_id=\''+doc.data().series_id+'\'').then(res=>{
            if(res.rows.length>0){
              var data={
                explanation:doc.data().explanation,
                answer:doc.data().answer,
                description:doc.data().description,
                statement:doc.data().statement
              }
              if('options' in doc.data())
                data['options']=doc.data().options
              if('des_images' in doc.data())
                data['des_images']=doc.data().des_images
              if('ans_images' in doc.data())
                data['ans_images']=doc.data().ans_images
              const query = {
                        text: 'INSERT INTO problem(series_id,name,logo,ans_type,difficulty,serial,data,isInteractive,author,doc_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *',
                        values: [res.rows[0].series_id,doc.data().title,doc.data().logo,doc.data().ans_type,2,ind,data,false,doc.data().author,doc.id]
                      }
              pool.query(query).then(res=>{
                console.log(res.rows[0].problem_id)
              }).catch(err=>{
                console.log(err)
              })
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      }).catch(err=>{
        console.log(err)
      })
    }else{

    }
  })
})

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
  res.docs.map(doc=>{
    if('justImage' in doc.data())
      console.log(doc.id)
  })
})

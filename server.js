const express = require('express')
const path = require('path')
const uuid = require('./helpers/uuid')
const fs = require('fs')
const PORT = process.env.PORT||5000;

const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'/public/index.html'))
  console.log(`${req.method} is requested`)
})

app.get('/notes',(req,res)=>{
  res.sendFile(path.join(__dirname,'/public/notes.html'))
})

app.get('/api/notes',(req,res)=>{
  res.sendFile(path.join(__dirname,'db/db.json'))
})

app.post('/api/notes',(req,res)=>{
  const {title, text} = req.body
 
  if(title && text ){
  const newnote ={
    title,
    text,
    id:uuid()
  }

 fs.readFile('./db/db.json',"utf-8",(err,data)=>
 {
   const notes =JSON.parse(data)
   notes.push(newnote)
   fs.writeFile('./db/db.json',JSON.stringify(notes),(err)=>{
     if(err){
       console.error(err)
     }else{
       console.log('file is written')
     }
     const response = {
       status:'sucess',
       body:newnote
     }
     res.status(202).json(response)
     console.log(response)
   })
  
  })
} else{
 res.status(500).json('Error in the posting note')
 console.log('error on the data entered')
}

})



app.listen(PORT,()=>{
  console.log(`start listening http://localhost:${PORT}`)
})



const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const marioModel = require('./models/marioChar');

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// your code goes here

app.get("/mario",async (req,res)=>{
    res.send(await marioModel.find());
} )

app.get("/mario/:id",async(req,res)=>{
    const idToFound = req.params.id;
    try{
        const objFound = await marioModel.findOne({_id:idToFound})
        if(objFound==null){
            res.status(400).send({message :"Id not Formated"})
        }else{
            res.send(objFound);
        }

    }catch(err){
        res.status(400).send({message:err.message})
    }
})

const isNullOrUndefined = (val) => val===null || val===undefined
app.post("/mario",async(req,res)=>{
    const newMario = req.body;
    if(isNullOrUndefined(newMario.name) || isNullOrUndefined(newMario.weight)){
        res.status(400).send({message:"either name or weight is missing"});
    }else{
        const newMarioDocument = new marioModel(newMario);
        await newMarioDocument.save();
        res.status(201).send(newMarioDocument);
    }
})

app.patch("mario/:id", async (req,res)=>{
    const id = req.params.id;
    const newMario = req.body;
    try{
        const data = await marioModel.findById(id);
        if(isNullOrUndefined(newMario.name) || isNullOrUndefined(newMario.weight)){
            res.status(400).send({message: "both name and weight is missing"});
        }else{
            if(!isNullOrUndefined(newMario.name)){
                data.name=newMario.name;
            }
            if(!isNullOrUndefined(newMario.weight)){
                data.weight=Number(newMario.weight);
            }
            await data.save();
            res.send(data);
        }
    }catch(err){
        res.status(400).send({message:err.message})
    }
})


app.delete("/mario/:id",async (req,res)=>{
    const id = req.params.id;
    try{
        await marioModel.findById(id);
        await marioModel.deleteOne({_id:id});
        res.send({message:'character deleted'});
    }catch(err){
        res.status(400).send({message:err.message})
    }
});



module.exports = app;
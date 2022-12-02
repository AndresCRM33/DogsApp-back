const { default: axios } = require("axios");
const express = require("express")
const{ Router } = require('express');
const{ Dog, Temperament } = require("../db.js")
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { getDogsDB, getDogsAPI, getAllDogs } = require("./controllers.js")


const router = Router();

//MIDDLEWARE
router.use(express.json())

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/dogs", async (req, res) => {
    const {name} = req.query
    const getAll = await getAllDogs();
    // console.log(getAllDogs);
    try{
        if(name){
            let searchDog = getAll.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
            
            if(searchDog.length > 0){
                return res.status(200).json(searchDog)
            }else{
                return res.status(404).send("No se encontró el perro ingresado por query")
            }
        }
        return res.status(200).json(getAll)
    }catch{
        return res.status(404).send("No se encontró ningun perro")
    }
})

router.get("/dogs/:idRaza", async (req, res) => {
    const {idRaza} = req.params
    try{
        let dataDogs = await getAllDogs()
        if(dataDogs.length){
            let filterDog = await dataDogs.filter(e => e.id == idRaza || e.name == idRaza)
            if(filterDog){
                return res.status(200).json(filterDog)
            }else{
                return res.status(404).send("No se encontró la raza especificada")
            }
        }
    }catch{
        return res.status(404).send("Ocurrió un error")
    }
})



router.get("/temperaments", async (req, res) => {
    const getTemp = await getDogsAPI();
    try{
        let temps = getTemp.map(e => {
            return e.temperament
        })
        let tempsFilt = temps.toString().split(/\s*,\s*/).filter(e => e !== "");

        for (elem of tempsFilt){
            Temperament.findOrCreate({
                where: {
                    name: elem,
                }
            })
        }

        const allTemperaments = await Temperament.findAll()

        return res.status(200).json(allTemperaments)

    }catch{
        return res.status(404).send("No se encontró ningun temperamento")
    }
})

router.post("/dogs", async (req, res) => {

    const {id, name, height_min, height_max, weight_min, weight_max, temperament, life_span, image, createInDB} = req.body

    try{

        if(!name || !height_min ||!height_max || !weight_min || !weight_max || !temperament){
            return res.status(404).json({error: "Complete todos los campos obligatorios"})
        }else{
            if(!image){
                const createDog = await Dog.create({
                    id: id,
                    name: name,
                    height_min: height_min,
                    height_max: height_max,
                    weight_min: weight_min,
                    weight_max: weight_max,
                    life_span: life_span,
                    image: "https://i.pinimg.com/originals/eb/19/e7/eb19e7ac38d0f9bd83875cfa01e9de41.png",
                    createInDB: createInDB
    
                })
    
                const findTemperament = await Temperament.findAll({where: {name: temperament}})
                createDog.addTemperament(findTemperament);
                return res.status(200).json(createDog); 
            }else{
                const createDog = await Dog.create({
                    id: id,
                    name: name,
                    height_min: height_min,
                    height_max: height_max,
                    weight_min: weight_min,
                    weight_max: weight_max,
                    life_span: life_span,
                    image: image,
                    createInDB: createInDB
    
                })
    
                const findTemperament = await Temperament.findAll({where: {name: temperament}})
                createDog.addTemperament(findTemperament);
                return res.status(200).json(createDog); 
            }
            
        }
    }catch{
        return res.status(404).send("please complete all the fields")
    }

})


module.exports = router;

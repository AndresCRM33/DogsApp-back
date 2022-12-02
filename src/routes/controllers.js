const axios = require("axios")

const {Dog, Temperament} = require("../db.js");


const getDogsDB = async () => {
    let infoDB = await Dog.findAll({
        include: {
            model: Temperament, // incluyo el modelo Temperament para que haga relacion con el Dog, ya que Dog no incluye temperamento 
            attributes: ["name"], // Quiero que me traiga el modelo Temperament mediante el atributo name              
            through: {
                attributes: []
            }
        }
    })

    return infoDB

}

const getDogsAPI = async () => {
    let infoAPI = await axios.get("https://api.thedogapi.com/v1/breeds");
    let dataAPI = await infoAPI.data.map(e => {
        return{
            id: e.id,
            name: e.name,
            weight_min: parseInt(e.weight.metric.slice(0, 2).trim()), // "10 - 15"
            weight_max: parseInt(e.weight.metric.slice(4).trim()),
            height_min: parseInt(e.height.metric.slice(0, 2).trim()),
            height_max: parseInt(e.height.metric.slice(4).trim()),
            life_span: e.life_span,
            image: e.image.url,
            temperament: e.temperament,
            createInDB: false
        }
    })
    return dataAPI;
}

const getAllDogs = async () => {
    let db = await getDogsDB()
    let api = await getDogsAPI()
    let allDogs = await db.concat(api)

    return allDogs

}

module.exports = {
    getDogsDB,
    getDogsAPI,
    getAllDogs
}
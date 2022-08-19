const express = require('express')
const { seed, Pet } = require('./models')
const { logTable } = require('sequelize-logger')

const app = express()
// app at the moment, doesn't know how to turn the Body of a request
// into a javascript object (it just gets sent as a string!)
// the below gives app the power to parse body into a js object
app.use(express.json())

app.get('/ping', (req, res) => {
    res.send('pong')
})

app.get('/pet', async (req, res) => {
    // get the data from the db
    const data = await Pet.findAll()
    res.send(data)
})

// get pet by id
app.get('/pet/:id', async (req, res) => {
    // find pet
    const data = await Pet.findByPk(req.params.id)
    // if data isn't found, send error and stop data from running
    if (!data) {
        res.status(404).send(`Sorry! This pet ${req.params.id} doesn't exist!`)
        return
    }
    // send that pet
    res.send(data)
})

// delete a pet by id
app.delete('/pet/:id', async (req,res) => {
    const deleted = await Pet.destroy({ 
        where: {
            id: req.params.id
        }
    })
    if (!deleted) {
        res.status(404).send(`There is no pet with an id ${req.params.id}.`)
        return
    }
    res.status(202).send(`Pet with id ${req.params.id} was deleted.`)
})

// add pet
app.post('/pet', async (req,res) => {
    // the user's data is in req.body
    // we use that date to make new pet in the db:
    try {
    await Pet.create(req.body)
    res.sendStatus(201)
    } catch(error) {
        res.status(400).send(error.errors)
    }
    logTable(Pet)
})

// update a pet
app.put('/pet/:id', async (req,res) => {
    const petToUpdate = await Pet.findByPk(req.params.id)

    if (!petToUpdate) {
        res.sendStatus(404)
        return
    }
    try {
        await petToUpdate.update(req.body)
        res.sendStatus(200)
    } catch (error) {
        res.status(400).send(error.errors)
    }

    logTable(Pet)
})

async function main () {
    // wait for the db to get filled with data
    await seed()
    // then start server
    const port = 5000
    app.listen(port, () => {
        console.log(`Listening on port ${port}.`)
    })
}
main()

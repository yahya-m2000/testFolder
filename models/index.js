const Pet = require('./Pet')

const db = require('../db')

async function seed() {
    // this will delete all the tables and recreate them empty
    await db.sync({ force: true})

    // create some fake data

    await Pet.create({
        animal: 'Dog',
        breed: 'Bernese Mountain Dog',
        name: 'Mass',
        age: 05
    })

    await Pet.create({
        animal: 'Cat',
        breed: 'Some Ginger cat',
        name: 'Pisstake',
        age: 07
    })
}

module.exports = { seed, Pet }
const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });

    describe('POST /dogs', () => {
            const testDogData = {
                breed: 'Poodle',
                name: 'Sasha',
                color: 'black',
                description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
            };

            it('should create a new dog', async () => {
                // make a request
                const response = await request(app).post('/dogs').send(testDogData);
                // assert a response code
                expect(response.status).toBe(201);
                // expect a response
                expect(response.body).toBeDefined();
                // toEqual checks deep equality in objects
                expect(response.body.name).toBe('Sasha');
            });


            it('should return correct dog based on id from response', async () => {
                const response = await request(app).post('/dogs').send(testDogData);
                const dogId = await response.body.id;
                const foundDog = await Dog.findByPk(dogId);
                expect(foundDog).toEqual(expect.objectContaining(testDogData));
            });

    });

    describe('DELETE /dogs/:id', () => {

        it('should delete a dog', async () => {
            const response = await request(app).delete('/dogs/1');
            expect(response.status).toBe(200);
        });

        it('should remove dog from database', async () => {
            await request(app).delete('/dogs/1');
            const allDogs = await Dog.findAll({where: {id : 1}});
            expect(allDogs).toEqual([]);
            expect(allDogs).toHaveLength(0);
        });

    });




});
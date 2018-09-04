import fs from 'fs'
import supertest from 'supertest'
import app from '../src/app'
import should from 'should'
import config from 'config'

beforeEach(() => {
    fs.copyFileSync('src/data/movieList.json', 'src/data/moviesTest.json')
})

describe('GET /movie', () => {
    it('should send a list of movies', done => {
        supertest(app)
            .get('/movie')
            .expect(200)
            .expect(res => {
                should.exist(res.body)
                res.body.should.be.a.Array
                res.body.should.have.length > 0
                res.body[0].should.have.only.keys('id', 'title', 'url', 'autre')
            })
            .end(done)
    })
})
describe('GET /movie/:id', () => {
    it('should send one movie', done => {
        supertest(app)
            .get('/movie/1')
            .expect(200)
            .expect(res => {
                should.exist(res.body)
                res.body.should.be.a.Object
                res.body.should.have.only.keys('id', 'title', 'url', 'autre', 'synopsis')
            })
            .end(done)
    })
    it('should return 404 error', done => {
        supertest(app)
            .get('/movie/1SDF434RFS')
            .expect(404)
            .expect(({ text }) => {
                should.exist(text)
                text.should.not.be.empty
            })
            .end(done)
    })
})
describe('POST /addMovie', () => {
   
    it('should be add one movie', done => {
        supertest(app)
            .post('/addMovie')
            .send({ title: 'john', synopsis: 'truc' })
            .expect(200)
            .expect(res => {
                should.exist(res.body)
                res.body.should.be.a.Object
                res.body.should.have.only.keys('id', 'title', 'synopsis')
            })
            .end(done)
    })
    it('should return 400 error', done => {
        supertest(app)
            .post('/addMovie')
            .send({ title: "", synopsis: "" })
            .expect(400)
            .expect(res => {
                should.exist(res.body)
                res.body.should.be.a.Array
                res.body.length.should.be.above(0)
            })
            .end(done)
    })
    it('should be verify if movie is updated', done => {
        supertest(app)
            .post('/addMovie/1')
            .send({ title: 'NouveauTitre', synopsis: "NouveauSynopsis" })
            .expect(200)
            .expect(res => {
              const newMovie=  fs.readFileSync(config.get('data'),'utf8')
             should(newMovie[1].title === 'NouveauTitre').be.ok
            })
            .end(done)
    })
})
    describe('DELETE /movie/:id', () => {
        it('should be verify if movie selectioned is deleted', done => {
            supertest(app)
                .delete('/movie/1')
                .expect(204)
                .end(done) 
            //     => {
            //         .get('movie/1')
            //         .expected(404)
            //         .end(done)
            // }
        })
        // it('should be verify if movie isn\'t exist yet', done => {
        //     supertest(app)
        //     .delete('/movie/1')
        //     .expect(404)
        //     .end(done)
        // })
    })

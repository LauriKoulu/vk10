const Promise = require('bluebird');
const request = require('supertest');
const mongoose = require('mongoose');
//const vue = require('vue').default;
const Vue = require('vue');
const jsdom = require('jsdom');
var ItemsComponent = require('../public/javascripts/indexVue.js')(Vue);

// vue renderer
const renderer = require('vue-server-renderer').createRenderer();

mongoose.Promise = Promise;
const app = require('../app');

const DB = require('../config/DBurl.js');
var DBurl = DB.url;

describe('Test Mongoose database connection', () => {
  test('Test connection', (done) => {
    mongoose.connect(DBurl).then(() => {
      expect(mongoose.connection.readyState).toBe(1);
    });
    mongoose.disconnect();
    done(); // eslint-disable-line no-undef
  });
});


describe('Test home page path and render', () => {
  test('Should get response with ok status 200', () => {
    request(app).get("/").then(response => {
      expect(response.statusCode).toBe(200);
      done();
    })
  });

  afterAll(() => {
    app.close();
  });
}); 


describe('Test GET all items', () => {
  test('Test if socket is open and routers work', (done) => {
    request(app).get('/items').set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      // Assert other desired stuff
    });
    done();
  });

  afterAll(() => {
    app.close();
  })
  // An exercise to the reader: How to validate the JSON structure?
  // See https://www.npmjs.com/package/supertest and promises
});


describe('Test vue function', () => {
  test('Test if function returns right value', () => {
    const ClonedComponent = Vue.extend(ItemsComponent);
    const NewComponent = new ClonedComponent( {
      data() {
       return {
        msg: 'I am a message',
       }; 
      },
    }).$mount();
    expect(typeof NewComponent.msg).toBe('String');
    done();
  });
});

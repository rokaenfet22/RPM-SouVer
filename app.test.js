"use string" //Prevent undeclared vars

const request = require("supertest")
const app = require("./app")

describe("Test time",()=>{
    /*
    Test for HTTP, expected Content-type, expected content, unexpected inputs (POST) etc... for below...
    app.get("/content")
    app.post("/new")
    app.post("/preview")
    app.post("/commented")
    app.get("/sort")
    app.get("/sort_freq")
    */

    //non-existence url
    test('GET /c fails, such url does not exist', () => {
        return request(app)
	    .get('/c')
	    .expect(404);
    });

    //sending request body to non-existence url
    test("POST /c fails, can't send data to such url", () => {
        return request(app)
        .post('/c')
        .send({"something":"some data"})
	    .expect(404);
    });

    //app.get("/content")
    test('GET /content succeeds', () => {
        return request(app)
	    .get('/content')
	    .expect(200);
    });

    test('GET /content returns JSON', () => {
        return request(app)
	    .get('/content')
	    .expect('Content-type', /json/);
    });

    //app.post("/new")
    test('POST /new adding new day card succeeds', () => {
        const params = {
            'title': 'jest added title',
            "content":"jest added content",
            "date":""
        };
        return request(app)
        .post('/new')
        .send(params)
	    .expect(200);
    });

    test('POST /new added content is done through JSON', () => {
        const params = {
            'title': 'jest added title',
            "content":"jest added content",
            "date":""
        };
        return request(app)
        .post('/new')
        .send(params)
	    .expect("Content-type",/json/);
    });

    test('POST /new adding, with js object with empty values with existing keys, succeed to fail.', () => {
        const params = {
            'title': "",
            "content":"",
            "date":""
        };
        return request(app)
        .post('/new')
        .send(params)
	    .expect(400);
    });
    /*
    test('POST /new adding with a completely empty request body, succeed to fail.', () => {
        const params = {
        };
        return request(app)
        .post('/new')
        .send(params)
	    .expect(400);
    });
    */

    //app.post("/preview")
    test('POST /preview succeeds', () => {
        const params = {
            'title': 'jest added title',
            "content":"jest added content",
            "date":""
        };
        return request(app)
        .post('/preview')
        .send(params)
	    .expect(200);
    });

    test('POST /preview update, successfully responds with JSOn', () => {
        const params = {
            'title': 'jest added title',
            "content":"jest added content",
            "date":""
        };
        return request(app)
        .post('/preview')
        .send(params)
	    .expect("Content-type",/json/);
    });

    test('POST /preview update with empty texts, succeed.', () => {
        const params = {
            'title': "",
            "content":"",
            "date":""
        };
        return request(app)
        .post('/preview')
        .send(params)
        .expect(200);
    });

    test('POST /preview update with expected value included, succeed.', () => {
        const params = {
            'title': "Sample",
            "content":"",
            "date":""
        };
        return request(app)
        .post('/preview')
        .send(params)
        .expect(/Sample/);
    });

    //app.post("/commented")
    test('POST /commented succeeds', () => {
        const params = {
            "id":0,
            "target_data":"Sample comment from Jest"
        };
        return request(app)
        .post('/commented')
        .send(params)
	    .expect(200);
    });

    test('POST /commented update, successfully responds with JSOn', () => {
        const params = {
            "id":0,
            "target_data":"Sample comment from Jest"
        };
        return request(app)
        .post('/commented')
        .send(params)
	    .expect("Content-type",/json/);
    });

    test('POST /commented update with empty value, succeed to fail.', () => {
        const params = {
            "id":0,
            "target_data":""
        };
        return request(app)
        .post('/commented')
        .send(params)
        .expect(400);
    });

    test('POST /commented update with expected value included, succeed.', () => {
        const params = {
            "id":0,
            "target_data":"Jest comment"
        };
        return request(app)
        .post('/commented')
        .send(params)
        .expect(/Jest comment/);
    });

    //app.get("/sort")
    test('GET /sort succeeds', () => {
        return request(app)
	    .get('/sort')
	    .expect(200);
    });

    test('GET /sort includes json files in content, checked', () => {
        return request(app)
	    .get('/sort')
	    .expect("Content-type",/json/);
    });

    //app.get("/sort_freq")
    test('GET /sort_freq succeeds', () => {
        return request(app)
	    .get('/sort_freq')
	    .expect(200);
    });

    test('GET /sort_freq includes json files in content, checked', () => {
        return request(app)
	    .get('/sort_freq')
	    .expect("Content-type",/json/);
    });
})
const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

// All test suites should be under this Routes : Static
describe("routes : static", () => {

    // GET Request Test Suite
    describe("GET /", () => {

      // Tests to make sure we get status code 200 when requesting
      // the server using that route
      it("Should return status code 200", (done) => {

        // Sends GET request to te base URL.
        // All request making methods take a function as a second
        // argument which will contain the response from the
        // server as well as content and any errors.
        request.get(base, (error, response, body) => {
          expect(response.statusCode).toBe(200);

          // Lets Jasmine know our test is completed.
          done();
        });
      });
    });
});

const request = require("request");
const { response } = require("../../src/app");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;

describe("routes : topics", () => {

  beforeEach((done) => {
    this.topic;
    sequelize.sync({force: true}).then((response) => {
      Topic.create({
        title: "JS Frameworks",
        description: "There are a lot of them"
      })
      .then((topic) => {
        this.topic = topic;
        done();
      })
      .catch((error) => {
        console.log(error);
        done();
      });
    });
  });

  describe("GET /topics", () => {
    it("Should return status code 200", (done) => {
      request.get(base, (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(error).toBeNull();
        expect(body).toContain("Topics");
        expect(body).toContain("JS Frameworks");
        done();
      });
    });
  });

  describe("GET /topics/new", () => {

    it("Should render a new topic form", (done) => {
      request.get(base + 'new', (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("New Topic");
        done();
      });
    });
  });

  describe("POST /topics/create", () => {

    const options = {
      url: '${base}create',
      form: {
        title: "Drake songs",
        description: "What's your favorite Drake song?"
      }
    };

    it("Should create a new topic and redirect", (done) => {

      request.post(options, (error, response, body) => {
        Topic.findOne({where: {title: "Drake songs"}})
        .then((topic) => {
          expect(response.statusCode).toBe(303);
          expect(topic.title).toBe("Drake songs");
          expect(topic.description).toBe("What's your favorite Drake song?");
          done();
        })
        .catch((error) => {
          console.log(error);
          done();
        });
      });
    });
  });

  describe("GET /topics/:id", () => {

    it("Should render a view with the selected topic", (done) => {
        request.get(base + this.topic.id, (error, response, body) => {
          expect(error).toBeNull();
          expect(body).toContain("JS Frameworks");
          done();
        });
    });
  });
  
  describe("POST /topics/:id/destroy", () => {

    it("Should delete the topic with the associated ID", (done) => {


      Topic.findAll()
      .then((topics) => {

        const topicCountBeforeDelete = topics.length;

        expect(topicCountBeforeDelete).toBe(1);

        request.post(base + this.topic.id + "/destroy", (error, response, body) => {
          Topic.findAll()
          .then((topics) => {
            expect(error).toBeNull();
            expect(topics.length).toBe(topicCountBeforeDelete - 1);
            done();
          })

        });
      });

    });

  });

  describe("GET /topics/:id/update", () => {
    
    it("Should render a view with an edit topic form", (done) => {
      request.get(`${base}${this.topic.id}/edit`, (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("Edit Topic");
        expect(body).toContain("JS Frameworks");
        done();
      });
    });
  });
});

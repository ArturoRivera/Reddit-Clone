const topicQueries = require("../db/queries.topics.js");

module.exports = {
  index(request, response, next){
    topicQueries.getAllTopics((error, topics) => {

      if (error) {
        response.redirect(500, "static/index");
      } else {
        response.render("topics/index", {topics});
      }
    })
  },

  new(request, response, next){
    response.render("topics/new");
  },

  create(request, response, next) {
    let newTopic = {
      title: request.body.title,
      description: response.body.description
    };

    topicQueries.addTopic(newTopic, (error, topic) => {
      if(error) {
        response.redirect(500, "/topics/new");
      } else {
        response.redirect(303, "/topics/${topic.id");
      }
    });
  },

  show(request, response, next) {
    topicQueries.getTopic(request.params.id, (error, topic) => {
      if(error || topic == null){
        response.redirect(404, "/");
      } else {
        response.render("topics/show", {topic});
      }
    })
  },

  destroy(request, response, next) {
    // On error, we return a server error and redirect to the show view
    // On successs, we redirect to the /topics path
    topicQueries.deleteTopic(request.params.id, (error, topic) => {
      if(error) {
        response.redirect(500, `/topics/${topic.id}`);
      } else {
        response.redirect(303, "/topics");
      }
    });
  },

  edit(request, response, next) {
    topicQueries.getTopic(request.params.id, (error, topic) => {
      // If there is an error present or there is no topic returned, redirect 404
      // Else, render the edit view with the topic returned
      if(error || topic == null) {
        response.redirect(404, "/");
      } else {
        response.render("topics/edit", {topic});
      }

    });
  },

  update(request, response, next) {
    topicQueries.updateTopic(request.params.id, request.body, (error, topic) => {
      if(error || topic == null){
        response.redirect(404, `/topics/${req.params.id}/edit`);
      } else {
        response.redirect(`/topics/${topic.id}`);
      }
    });
  }
}

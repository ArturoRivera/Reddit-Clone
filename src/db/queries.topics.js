const Topic = require("./models").Topic;

module.exports = {

  getAllTopics(callback) {
    return Topic.findAll()

    .then((topics) => {
      callback(null, topics);
    })
    .catch((error) => {
      callback(error);
    })
  },

  addTopic(newTopic, callback){
    return Topic.create({
        title: newTopic.title,
        description: newTopic.description
    })

    .then((topic) => {
      callback(null, topic);
    })
    
    .catch((error) => {
      callback(error);
    })
  },

  getTopic(id, callback) {
    return Topic.findById(id) //Find by primary key, had to use older findById() method

    .then((topic) => {
      callback(null, topic);
    })
    .catch((error) => {
      callback(error);
    })
  },

  deleteTopic(id, callback) {
    return Topic.destroy({
      where: {id}
    })

    .then((topic) => {
      callback(null, topic);
    })

    .catch((error) => {
      callback(error);
    })
  },

  updateTopic(id, updatedTopic, callback) {
    return Topic.findById(id)

    .then((topic) => {
      if(!topic){
        return callback("Topic not found");
      }
      topic.update(updatedTopic, {
        fields: Object.keys(updatedTopic)
      })
      .then(() => {
        callback(null, topic);
      })
      .catch((error) => {
        callback(error);
      });
    });
  
  }
}

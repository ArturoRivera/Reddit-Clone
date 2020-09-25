'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rule.belongsTo(models.Topic, {
        foreignKey: "topicId",
        onDelete: "CASCADE"
      });
    }
  };
  Rule.init({
    description: DataTypes.STRING,
    topicId: {
     type: DataTypes.INTEGER,
     onDelete: "CASCADE",
     references: {
       model: "Topics",
       key: "id",
       as: "topicId",
     }
  }, {
    sequelize,
    modelName: 'Rule',
  });
  return Rule;
};

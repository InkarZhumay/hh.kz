const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const employmentType = sequelize.define('EmploymentType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

},{
    timestamps: false // Отключение автоматического создания полей createdAt и updatedAt
  }
);

module.exports = employmentType;
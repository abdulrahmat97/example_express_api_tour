'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpiry: DataTypes.DATE,
  }, {});

  User.associate = function (models) {
    User.hasOne(models.Tour)
    User.hasMany(models.TourMember, {as: 'member', foreignKey: 'memberId'})
  }

  User.prototype.display = function () {
    const {
      password,
      resetPasswordToken,
      resetPasswordExpiry,
      ...user
    } = this.get({ plain: true })
    return user
  }

  return User;
};
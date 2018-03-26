export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  User.associate = (models) => {
    // 1 to many with polls
    User.hasMany(models.Poll, {
      foreignKey: 'creator',
    });
  };

  return User;
};

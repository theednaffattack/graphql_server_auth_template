export default (sequelize, DataTypes) => {
  const PollOption = sequelize.define('poll_option', {
    name: {
      type: DataTypes.STRING,
    },
    votes: {
      type: DataTypes.INTEGER,
    },
  });

  return PollOption;
};

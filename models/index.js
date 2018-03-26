import Sequelize from 'sequelize';

// postgres connection instance with sequelize ORM
const sequelize = new Sequelize('fccPollv2', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
});

// import our db models to the database below
const db = {
  User: sequelize.import('./user'),
  Poll: sequelize.import('./poll'),
  PollOption: sequelize.import('./pollOption'),
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

export default db;

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    rating: DataTypes.STRING,
    genre: DataTypes.TEXT,
    rtRating: DataTypes.INTEGER,
    metaCritic: DataTypes.INTEGER,
    posterImage: DataTypes.TEXT,
    description: DataTypes.TEXT,
    showtime: DataTypes.STRING,
    theater: DataTypes.STRING,
    time2Theater: DataTypes.INTEGER,  //minutes to drive to theater
    miles2Theater: DataTypes.INTEGER,
    gMapsLink: DataTypes.STRING,
    buyTixLink: DataTypes.STRING
  });
  return User;
};



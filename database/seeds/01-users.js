const hashedPassword = "$2a14$qHqCbXUImiB0gXlFNX47wuA7uFWNGNAZutYLvOeye9eotewGlfYV6"
//pre-hashed password 'abc12345'
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').insert([
    {id: 1, username: "janedoe", password: hashedPassword, department: "development" }, 
    {id: 2, username: "johndoe", password: hashedPassword, department: "marketing" }
  ])
};

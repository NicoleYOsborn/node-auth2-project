const bcrypt = require('bcryptjs')
const db = require("../database/db-config");

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find() {
  return db("users").select("id", "username", "password", "department").orderBy("id");
}

function findBy(filter) {
  return db("users").where(filter).select("id", "username", "password", "department");
}

async function add(user) {
    
    const [id] = await db("users")
    .insert(user)

    return findById(id)
}

function findById(id) {
  return db("users").where({ id }).first("id", "username");
}

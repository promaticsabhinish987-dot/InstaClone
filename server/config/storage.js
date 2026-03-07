const { StorageEngine}=require("../storageSystem/src/index")

const storage = new StorageEngine({
  mongoUrl: "mongodb://localhost:27017",
  dbName: "userStorageDB",
  baseUrl: "http://localhost:4000/files"
});

module.exports = storage;
const mongoose = require("mongoose");

class FileRepository {
  constructor(connection) {
    const schema = new mongoose.Schema(
      {
        key: { type: String, required: true, unique: true },
        filename: String,
        contentType: String,
        size: Number,
        hash: String,
        data: Buffer
      },
      { timestamps: true }
    );

    this.model = connection.model("File", schema);
  }

  async save(fileData) {
    const file = new this.model(fileData);
    return await file.save();
  }

  async findById(key) {
    return await this.model.findOne({key});
  }

  async delete(key) {
    console.log("key " ,key)
    return await this.model.deleteOne({key});
  }
}

module.exports = FileRepository;
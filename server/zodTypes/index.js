const zod = require("zod");

const signSchema = zod.object({
    username : zod.string().email(),
    password : zod.string().min(8)
  })

  module.exports = {
    signSchema : signSchema
  }
  



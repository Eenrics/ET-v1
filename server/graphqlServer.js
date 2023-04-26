import { ApolloServer } from ('@apollo/server')
import { startStandaloneServer } from ('@apollo/server/standalone')
import connectDatabase from "./config/database.js";
import typeDefs from './schema/index.js'
import resolvers from './resolvers/index.js'


// database connnection
dotenv.config({ path: "./config/config.env" });
connectDatabase();

// create server using graphql schema and resolver
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// start graphql server using appropriate context
startStandaloneServer(server, {
    listen: { port: process.env.PORT },
    context: async ({ req, res }) => {
        // I am not sure if you are looking for authorization header part to verify user.. I assumed you do
      const auth = req ? req.headers.authorization : null
      const token = req.query.token
      if (auth) {
        const decToken = jwt.verify(
          auth.substring(7), process.env.JWT_SECRET
          )
          // when you created token, you used users _id.. 
          const currUser = await User.findById(decToken._id).populate("userProfile")
        return { currUser, token }
      }
    },
  }).then(({ url }) => {
    console.log(`server started at ${url} in ${process.env.NODE_ENV}`)
  })
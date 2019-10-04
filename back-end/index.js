const { ApolloServer, gql } = require('apollo-server');
const uuid = require('uuid/v1');

const typeDefs = gql`
  type Movie {
  	title: String
  	year: Int
  	rating: Float
  	actors: [Actor]
  }

  type Actor {
  	name: String
  	birthday: String
  	country: String
  	directors: [Director]
  }

  type Director {
  	name: String
  	birthday: String
  	country: String
  }

  type User {
  	id: Int
  	name: String
  	username: String
  	password: String
  }

  type CreateUserResponse {
  	token: String
  	user: User
  }

  type Query {
    movies: [Movie],
    users: [User]
  }

  type Mutation {
  	createUser(username: String, password: String): CreateUserResponse
  }
`;

let users = [];

const movies = [
	{
		title: "Inception",
		year: 2010,
		rating: 8.8,
		actors: [
			{
				name: "Leonardo DiCaprio",
				birthday: "11/11/1974",
				country: "USA",
				directors: [
					{
						name: "Chirstopher Nolan",
						birthday: "07/30/1970",
						country: "UK"
					},
					{
						name: "Alejandro Inarritu",
						birthday: "08/15/1963",
						country: "Mexico"
					}
				]
			},
			{
				name: "Ellen Page",
				birthday: "02/21/1987",
				country: "Canada",
				directors: [
					{
						name: "Chirstopher Nolan",
						birthday: "07/30/1970",
						country: "UK"
					},
					{
						name: "Bryan Singer",
						birthday: "09/17/1965",
						country: "USA"
					}
				]
			}
		]
	}	
];

const resolvers = {
  Query: {
    movies: () => movies,
    users: () => users
  },
  Mutation: {
  	createUser: (parent, args) => {
  		let user = {
  			id: (users.length+1),
  			name: args.username,
  			username: args.username,
  			password: args.password,
  		};
  		users.push(user);

  		return {
  			token: uuid(),
  			user: user
  		};
  	}
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
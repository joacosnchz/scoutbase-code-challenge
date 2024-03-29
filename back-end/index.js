const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const uuid = require('uuid/v1');

const typeDefs = gql`
  type Movie {
  	title: String
  	year: Int
  	rating: Float
  	scoutbase_rating: Float
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

  type UserResponse {
  	token: String
  	user: User
  }

  type Query {
    movies: [Movie],
    users: [User]
  }

  type Mutation {
  	createUser(username: String, password: String): UserResponse
  	login(username: String, password: String): UserResponse
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
    movies: () => {
    	for (var i = movies.length - 1; i >= 0; i--) {
    		movies[i].scoutbase_rating = parseFloat(10 - Math.floor(Math.random() * 5));
    	}

    	return movies;
    },
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
  	},
  	login: (parent, args) => {
  		let user = users.find(usr => {
  			if(usr.username == args.username &&
  				usr.password == args.password) {
  				return usr;
  			}
  		});

  		let token = "";
  		if(user) {
  			token = uuid();
  		}

  		return {
  			token: token,
  			user: user
  		};
  	}
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

server.applyMiddleware({app, path: '/graphql'})

app.listen({port:4000}, () => {
	console.log('Server ready');
});

var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6]||null);
var user 		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol 	= (url[1]||null);
var dialect 	= (url[1]||null);
var port 		= (url[5]||null);
var host 		= (url[4]||null);
var storage		= process.env.DATABASE_STORAGE;

//Cargar Modelo DRM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name, user, pwd,
		{	dialect: 	protocol,
			protocol: 	protocol,
			port:       port, 
			host: 		host,
			storage:    storage,
			omitNull: 	true 
		}
	);

// Importar la definicion de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz; //exportar definición de tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() 
{
	//success(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) 
	{
		if(count === 0) 
		{
			Quiz.create(
			{
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			})

			.then(function(){console.log('Base de datos inicializada')});
		};

	});
});
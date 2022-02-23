const { Pool } = require("pg");
const axios = require('axios');

// CONEXIÓN A BASE DE DATOS POSTGRESQL
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "fullstack",
    password: 'yeinerm12'
});

// NOMBRE QUE VA A TENER LA TABLA
let name_table="players";

//CREACIÓN DE LA TABLA
let new_table= `CREATE TABLE ${name_table} (nombre character varying NOT NULL PRIMARY KEY, posicion character varying, nacionalidad character varying, equipo character varying);`;

pool.query(new_table, (err, res) => {
    //console.log(err, res);
    if (err == undefined) {
        console.log("tabla creada");
        let api = "https://www.easports.com/fifa/ultimate-team/api/fut/item";
        axios.get(api).then(res => {
            if (res.status==200) {     
                let sql = `INSERT INTO ${name_table} (nombre, posicion, nacionalidad, equipo) VALUES`
                let pages = res.data.totalPages;
                for (let i = 0; i < pages; i++) {
                    let api_page= api + "?page=" + i;
                    // if (i<5) {
                        axios.get(api_page).then(res => {
                            res.data.items.forEach(p => {
                                let name_player = `${p.firstName} ${p.lastName}`;
                                let position = p.position;
                                let nationality = p.nation.name;
                                let club = p.club.name;
                                let sql_values = `${sql} ('${name_player}','${position}','${nationality}','${club}');`
                                pool.query(sql_values, (err, res) => {
                                    //console.log(err, res);
                                    if (res) {
                                        console.log("jugador agregado");
                                    } else {
                                        console.log("jugador repetido");
                                    }
                                });
                            });
                            console.log("finish");
                        });
                    //}   
                }    
                //pool.end();
            }
        });   
    }
});
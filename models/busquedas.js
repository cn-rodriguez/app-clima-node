import * as fs from 'fs';
import axios from 'axios';

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        // leer db si existe
    }

    get historialCapitalizado() {
        
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        })

        // this.historial.forEach( (lugar, i) => {
        //     const lugarAux = lugar.split(' ');
        //     let info = '';
        //     lugarAux.forEach( (word, i) => {
        //         const wordCapitalized = word.replace(word[0], word[0].toUpperCase());
        //         info = info + wordCapitalized + ' ';
        //     })
        //     this.historial[i] = info.trim();
        // });
        // return this.historial;

    }

    get paramsMapBox() {
        return {
            'limit': 5,
            'language': 'es',
            'access_token':process.env.MAPBOX_KEY,
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'

        }
    }

    async ciudad( lugar = '' ) {
        // peticion http

        try {

            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/`,
                params: this.paramsMapBox,
            })
            // https://api.mapbox.com/geocoding/v5/mapbox.places/coquimbo.json?limit=5&proximity=ip&types=place%2Cpostcode%2Caddress%2Cregion%2Ccountry&language=es&access_token=pk.eyJ1IjoidHhxYnFiIiwiYSI6ImNsNm5yMW9jajAzbWUzbG9kOTJsZm01Z3AifQ.9I5xyF-ZKi4hDKD2m8tifg
            const resp = await instance.get(`${lugar}.json`);
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],

            }));
            // console.log(resp.data.features)
            // return []; // retornar array con lugares encontrados
        } catch (error) {
            return [];
        } 
    }

    async clima( lat, lon ) {
        try {
            const instance = axios.create({
                // baseURL: 'https://api.openweathermap.org/data/2.5/',
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { ...this.paramsOpenWeather, lat, lon }
            });
            // const resp = await instance.get(`weather?lat=${lat}&lon=${lon}`);
            const resp = await instance.get();
            
            const [{description}] = resp.data.weather;
            const { temp, temp_min, temp_max } = resp.data.main;

            return ({
                description,
                temp,
                temp_min,
                temp_max,
            })


        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial( lugar = '' ){
        // prevenir duplicado
        if (this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0, 5);

        this.historial.unshift( lugar.toLocaleLowerCase() );

        // grabar en db
        this.guardarDB();

    }

    guardarDB() {
        const payload = {
            historial: this.historial,
        };
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerDB() {
        if (!fs.existsSync( this.dbPath )) return;
        
        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse( info ); 
        this.historial = data.historial;
    }

}

export {Busquedas}
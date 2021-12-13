const fs = require('fs');
const axios = require('axios');



class Searches {

    history = [];
    dbPath = './db/database.json';

    constructor() {
        this.readDB()
    }

    get CapitalizedHistory() {
        return this.history.map( place => {
            let words = place.split(' ');
            words = words.map( word => word[0].toUpperCase() + word.substring(1) );
            return words.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es',
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATER_KEY,
            'units': 'metric',
        }
    }

    async city( place = '' ) {

        try {

            const instance = axios.default.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
            })

            const { data } = await instance.get( '', { params: this.paramsMapbox } );
            return data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                longitude: place.center[0],
                latitude: place.center[1],
            }));

        } catch (error) {
            console.error( error );
            return [];
        }

    }

    async weather( lat, lon ) {
        try {
            const instance = axios.default.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            })

            const { data } = await instance.get( '', { params: { ...this.paramsOpenWeather, lat, lon } } );
            return {
                description: data.weather[0].description,
                temperature: data.main.temp,
                min: data.main.temp_min,
                max: data.main.temp_max,
            }
        } catch (error) {
            console.error( error );
            return [];
        }
    }

    addHistory( place = '' ) {
        if ( this.history.includes( place.toLocaleLowerCase() ) ) {
            return;
        }
        this.history = this.history.splice( 0 , 5 );
        this.history.unshift( place.toLocaleLowerCase() );
        this.saveDB();
    }

    saveDB() {
        const payload = {
            history: this.history,
        };
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    readDB() {
        if ( !fs.existsSync( this.dbPath ) ) {
            return;
        }
        const info = fs.readFileSync( this.dbPath, {
            encoding: 'utf-8'
        });
        const data = JSON.parse( info );
        console.log( data );
        this.history = data.history;

    }

}

module.exports = Searches;


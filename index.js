require('dotenv').config();
const { inquirerMenu, pause, readInput, listPlaces } = require('./helpers/inquirer');
const Searches = require('./models/searches');



console.clear();

const main = async() => {

    const searches = new Searches();
    let option;

    

    do {

        option = await inquirerMenu();

        switch ( option ) {
            case 1:
                // Display message
                const place = await readInput( 'City: ' );
                // Search places
                const places = await searches.city( place );
                // Select place
                const id = await listPlaces( places );
                // Cancel
                if ( id === '0' ) {
                    continue;
                }
                // Selected place
                const { name, latitude, longitude } = places.find( place => place.id === id );
                // Save in DB
                searches.addHistory( name );
                // Weather data
                const { description, temperature, min, max } = await searches.weather( latitude, longitude )
                // Display results
                console.log( '\nCity information\n'.green );
                console.log( 'City:', name.green );
                console.log( 'Latitude:', latitude );
                console.log( 'Longitude:', longitude );
                console.log( 'Temperature:', temperature );
                console.log( 'Min:', min );
                console.log( 'Max:', max );
                console.log( 'Description:', description.green );
                break;
            case 2:
                searches.CapitalizedHistory.map( (place, i) => {
                    const index = `${ i + 1 }.`.green;
                    console.log( `${ index } ${ place }` );
                })
                break;
        }

        ( option !== 3 ) && await pause();

    } while ( option !== 3 );


}

main();
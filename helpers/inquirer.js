const inquirer = require('inquirer');
require('colors');


const questions = [
    { 
        type: 'list',
        name: 'option',
        message: `( press ${ 'ctrl'.yellow } + ${ 'c'.yellow } to exit at any time )\nWhat do you want to do?`,
        choices: [
            {
                value: 1,
                name: `${ '1.'.green } Search city`,
            },
            {
                value: 2,
                name: `${ '2.'.green } History`,
            },
            {
                value: 3,
                name: `${ '3.'.green } Exit`,
            },
        ]
    }
]


const inquirerMenu = async() => {
    console.clear();
    console.log( '========================'.green );
    console.log( '    Select an option    '.white );
    console.log( '========================\n'.green );
    const { option } = await inquirer.prompt( questions );
    return option;
}

const pause = async() => {
    return await inquirer.prompt([{
        type: 'input',
        name: 'enter',
        message: `Press ${ 'ENTER'.green } to continue`,
    }])
}

const readInput = async( message ) => {
    const question = [{
        type: 'input',
        name: 'description',
        message,
        validate( value ) {
            if ( value.length === 0 ) {
                return 'Please enter a value';
            }
            return true;
        }
    }];
    const { description } = await inquirer.prompt( question );
    return description;
}


const listPlaces = async( places = [] ) => {
    
    const choices = places.map( (place, i) => {
        const index = `${ i + 1 }.`.green;
        return {
            value: place.id,
            name: `${ index } ${ place.name }`,
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancel'
    })

    const questions = [{
        type: 'list',
        name: 'id',
        message: 'Select a place:',
        choices,
    }]

    const { id } = await inquirer.prompt( questions );
    return id;

}

const confirm = async( message ) => {
    const question = [{
        type: 'confirm',
        name: 'ok',
        message,
    }];
    const { ok } = await inquirer.prompt( question );
    return ok;
}

const displayChecklist = async( todos = [] ) => {
    
    const choices = todos.map( (todo, i) => {
        const index = `${ i + 1 }.`.green;
        return {
            value: todo.id,
            name: `${ index } ${ todo.description }`,
            checked: ( todo.completionDate ) ? true : false
        }
    });

    const question = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Select the todos',
        choices,
    }]

    const { ids } = await inquirer.prompt( question );
    return ids;

}

module.exports = { 
    inquirerMenu,
    pause,
    readInput,
    confirm,
    displayChecklist,
    listPlaces,
}
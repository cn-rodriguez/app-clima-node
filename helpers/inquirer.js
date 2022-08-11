import colors from 'colors';

import inquirer from 'inquirer';

const preguntas = [
    {
        type: 'list',
        name: 'option',
        message: 'Que desea hacer',
        choices: [
            {
                value: 1,
                name: `${'1.'.brightRed} Buscar ciudad`,
            },
            {
                value: 2,
                name: `${'2.'.brightRed} Historial`,
            },
            {
                value: 0,
                name: `${'0.'.brightRed} Salir`,
            }
        ],
    },

];




const inquirerMenu = async() => {
    console.clear();
    console.log('================================');
    console.log(' Selecccione una opcion'.green);
    console.log('================================');

    const { option } = await inquirer.prompt(preguntas);

    return option;
};

const pausar = async() => {

    const optionPausar = [
        {
            type: 'input',
            name: 'pausar',
            message: `Presione ${'ENTER'.red} para continuar.`,
        }
    ]
    console.log('\n');
    await inquirer.prompt(optionPausar);
    
}

const leerInput = async( message ) => {
    
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);

    return desc;
}

const listarLugares = async( lugares = []) => {
    const choices = lugares.map( (lugar, i) => {

        const idx = `${i + 1}`.green
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`,
        }
    })
    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar'
    });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices,
        }
    ];

    const { id } = await inquirer.prompt(questions);
    return id;
};

const mostrarListadoChecklist = async(tareas = []) => {
    const choices = tareas.map( (tarea, i) => {
        const idx = `${i + 1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true: false,
        }
    });

    const questions = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices,
        }
    ]

    const { ids } = await inquirer.prompt(questions);
    return ids;

}

const confirmar = async(message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message,
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;
};

export {
    inquirerMenu,
    pausar,
    leerInput,
    listarLugares,
    mostrarListadoChecklist,
    confirmar,
}
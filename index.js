import 'dotenv/config'

import { inquirerMenu, leerInput, listarLugares, pausar } from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";

const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                console.log('Buscar ciudad');
                const termino = await leerInput('Ingrese ciudad:');
                const lugares = await busquedas.ciudad(termino);
                const id = await listarLugares(lugares);

                if (id === '0') continue;
                
                const lugarSel = lugares.find( lugar => lugar.id === id);

                // Guardar db
                busquedas.agregarHistorial( lugarSel.nombre );
                const temp = await busquedas.clima(lugarSel.lat, lugarSel.lng);

                // Mostrar resultados
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Clima:', temp.description)
                console.log('Temperatura:', temp.temp);
                console.log('Minima:', temp.temp_min);
                console.log('Maxima:', temp.temp_max);
                



                await pausar();

                break;
            case 2:
                console.log('Historial');

                busquedas.leerDB();

                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(` ${idx} ${lugar}`)
                })
                await pausar();
                break;
            case 0:
                console.log('Salir');
                break;
        }


    } while (opt !== 0) 




}

main();
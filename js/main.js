let provincias; 

function getLatLongProvincias(){
    const apiProvincias = 'https://apis.datos.gob.ar/georef/api/provincias';

    fetch(apiProvincias)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        provincias=data;
        console.log(provincias);
        prov_options.innerHTML+=`<option value="">Seleccionar Provincia</option>`;
        data.provincias.forEach(element => {
            prov_options.innerHTML += plantilla(element);
        });
    });
} 

function plantilla(prov){
   // console.log(prov.nombre);
const element=`
<option value="${prov.nombre}">${prov.nombre}</option>
`;
return element; 
}

function climaProvincia(event){
    let data= event.options[event.selectedIndex].value;

    // let provincia = provincias.provincias.find(element => {
    //   //  console.log(data);
    //     element.nombre===data; 
    // });

    // console.log(provincia);

    for (const provincia of provincias.provincias) {
        if(provincia.nombre===data) {
            console.log(provincia);
            getClimaProvincia(provincia);
            break; 
        }
    }
   
}

function getClimaProvincia(provincia){


    const nombre=provincia.nombre; 
    const lat=provincia.centroide.lat;
    const lon=provincia.centroide.lon;
    //Para mostrar
    const hoy=moment().locale('es').format('MMMM Do YYYY, h:mm');
    //Para comparar con array obtenido desde la api
    const hoy_format=moment().startOf('hour').format('YYYY-MM-DDTHH:mm'); 
    //console.log('hoy_format',hoy_format.format());
    const apiWather = 
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation,windspeed_10m`;
    ;

    fetch(apiWather)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        // prov_options.innerHTML+=`<option value="">Seleccionar Provincia</option>`;
        // data.provincias.forEach(element => {
        //     prov_options.innerHTML += plantilla(element);
        // });
        datos_provincia.innerHTML=`<h1>${nombre}</h1>
        <p>${hoy} hs</p>
        <img src="https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-2-day.svg" alt="clima-soleado" height="250px">`
        const index_time=data.hourly.time.indexOf(hoy_format);
        const temp_actual=data.hourly.temperature_2m[index_time];
        const precipitation_actual=data.hourly.precipitation[index_time];
        const st=data.hourly.apparent_temperature[index_time];
        const viento=data.hourly.windspeed_10m[index_time]; 
        temperatura_actual.innerHTML=`${temp_actual}°`; 
        lluvia.innerHTML=`${precipitation_actual}mm`;
        sens_term.innerHTML=`${st}°`;
        wind.innerHTML=`${viento}km/h`;  
       let temperaturas=Array.from(data.hourly.temperature_2m);
        console.log(temperaturas[0]);
    //    let temps=[''];
        let tMax;
        let tMin; 
        tMax=temperaturas[0];
        tMin=temperaturas[0];   
        for (let index = 1; index < 23; index++) {
                if(temperaturas[index]>tMax){
                    tMax=temperaturas[index];
                }
                if(temperaturas[index]<tMax){
                    tMin=temperaturas[index];
                }
        }

        tempMax.innerHTML='Max: '+tMax+'°';
        tempMin.innerHTML='Min: '+tMin+'°';


    });
    
}

getLatLongProvincias();

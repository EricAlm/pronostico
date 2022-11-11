let provincias; 

function getLatLongProvincias(){
    const apiProvincias = 'https://apis.datos.gob.ar/georef/api/provincias';
    Swal.showLoading();
    fetch(apiProvincias)
    .then(res => res.json())
    .then(data => {
        Swal.close();
        caracteristicas_dia.innerHTML += `<h3>-- BIENVENIDO AL CONSULTOR DE PRONÓSTICO DE ARGENTINA --</h3>`;
        panel_secundario.innerHTML += `
        <div id="bandera" class="d-flex justify-content-center align-items-center mt-4">
            <img src="./img/bandera.jpg" alt="bandera Argentina" width="50%" heigth="100"></img>
        </div>
            `;
        provincias = data;
        prov_options.innerHTML+=`<option value="">Seleccionar Provincia</option>`;
        data.provincias.forEach(element => {
            prov_options.innerHTML += drawNameProvincia(element);
        });
    });
} 

function drawNameProvincia(prov){
    const element = `<option value="${prov.nombre}">${prov.nombre}</option>`;
    return element; 
}

function drawDia(dia, max, min, icon){
    const element = `<div class="col">
                        <div class="card text-center">
                            <div class="card-header">
                            <p class="card-title">${dia}</p>
                            </div>
                            <div class="card-body">
                                <img src="${icon}" alt="clima-soleado" height="70px">
                                <p class="card-text">Maxima ${max}</p>
                                <p class="card-text">Minima ${min}</p>
                            </div>
                        </div>
                    </div>`;
  return element;
}

function climaProvincia(event){
    cards.innerHTML = '';
    let data = event.options[event.selectedIndex].value;

    for (const provincia of provincias.provincias) {
        if(provincia.nombre === data) {
            getClimaProvincia(provincia);
            break; 
        }
    }
}

function getClimaProximosDias(data, temperaturas){
    let index = 0;
    let final_index = 23;
    let max;
    let min;
    let dia;
    let img;

    for (let i = 0; i < 7; i++) {
        dia = moment(data.hourly.time[index]).locale('es').format('dddd');
        max = temperaturas[index];
        min = temperaturas[index];
        
        for (let j = index; j <= final_index; j++) {
            if(temperaturas[j] > max){
                max = temperaturas[j];
            }
            if(temperaturas[j] < min){
                min = temperaturas[j];
            }
        }

        img = getGifTemperatura(max);

        cards.innerHTML += drawDia(dia,max,min,img);

        index = final_index + 1;
        final_index += 24; 
    }
};

function getClimaProvincia(provincia){
    const nombre = provincia.nombre; 
    const lat = provincia.centroide.lat;
    const lon = provincia.centroide.lon;
    //Para mostrar
    const hoy = moment().locale('es').format('MMMM Do YYYY, h:mm');
    //Para comparar con array obtenido desde la api
    const hoy_format = moment().startOf('hour').format('YYYY-MM-DDTHH:mm'); 
    //console.log('hoy_format',hoy_format.format());
    const apiWather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation,windspeed_10m`;
    Swal.showLoading();

    fetch(apiWather)
    .then(res => res.json())
    .then(data => {
        const bandera = document.getElementById('bandera');
        Swal.close();
        caracteristicas_dia.innerHTML = '';
        if (bandera != null)
            bandera.remove();
        console.log(data);
        const index_time = data.hourly.time.indexOf(hoy_format);
        const temp_actual = data.hourly.temperature_2m[index_time];
        const precipitation_actual = data.hourly.precipitation[index_time];
        const st = data.hourly.apparent_temperature[index_time];
        const viento = data.hourly.windspeed_10m[index_time]; 
        let gif;

        if (precipitation_actual > 0){
            gif = getGifPrecipitacion(precipitation_actual);
        } else{
            gif = getGifTemperatura(temp_actual);
        }
            
        datos_provincia.innerHTML=`<h2>${nombre}</h2>
                                    <h4>${hoy} hs</h4>
                                    <img src="${gif}" alt="clima-soleado" height="240px">`;
        
        caracteristicas_dia.innerHTML +=
                        `<div class="col">
                            <i class="fa-solid fa-umbrella fa-xl"></i>
                            <p class="m-3">${precipitation_actual}mm</p>
                            <p>Precipitación</p>
                        </div>
                        <div class="col">
                            <i class="fa-solid fa-droplet fa-xl"></i>
                            <p class="m-3">${st}°</p>
                            <p>Sensación Térmica</p>
                        </div>
                        <div class="col">
                            <i class="fa-solid fa-wind fa-xl"></i>
                            <p class="m-3">${viento}km/h</p>
                            <p>Viento</p>
                        </div>`;
                        
        const temperaturas = Array.from(data.hourly.temperature_2m);
        let tMax = temperaturas[0];
        let tMin = temperaturas[0];  
         
        for (let index = 1; index < 23; index++) {
            if(temperaturas[index] > tMax){
                tMax = temperaturas[index];
            }
            if(temperaturas[index] < tMin){
                tMin = temperaturas[index];
            }
        }

        temperatura_actual.innerHTML=`
                <p>Temp. Actual</p>
                <p class="grados">${temp_actual}°</p>
                <div class="row">
                <p class="col-auto">Max: ${tMax}°</p>
                <p class="col-auto">Min: ${tMin}°</p> 
                </div> `; 

        getClimaProximosDias(data, temperaturas);
    });
};

function getGifPrecipitacion(lluvia){
    let ubicacion;

    switch (true){
        case (lluvia < 1):
            ubicacion = "https://camo.githubusercontent.com/f2011084110823ab2ee90fd16e6fede5e13c1ebae62f9820f234025b0c453d41/68747470733a2f2f626d63646e2e6e6c2f6173736574732f776561746865722d69636f6e732f76332e302f66696c6c2f7376672f636c6561722d6461792e737667";
            break;
        case ((lluvia > 1) && (lluvia < 2)):
            ubicacion = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1.svg";
            break;
        case ((lluvia >= 2) && (lluvia < 15)):
            ubicacion = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2.svg";
            break;    
        case ((lluvia >= 15) && (lluvia < 30)):
            ubicacion = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3.svg";
            break;
        case ((lluvia >= 30) && (lluvia <= 60)):
            ubicacion = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rain-and-sleet-mix.svg";
            break;
        case (lluvia > 60):
            ubicacion = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/severe-thunderstorm.svg";
            break;
        default:
            ubicacion = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/severe-thunderstorm.svg";
            break;
        }
        return ubicacion;
}

function getGifTemperatura(temperatura){
    let ubicacion;

    switch (true){
        case ((temperatura > 4) && (temperatura < 12)):
            ubicacion = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-1-day.svg";
            break;
        case (temperatura >= 12):
            ubicacion = "https://camo.githubusercontent.com/f2011084110823ab2ee90fd16e6fede5e13c1ebae62f9820f234025b0c453d41/68747470733a2f2f626d63646e2e6e6c2f6173736574732f776561746865722d69636f6e732f76332e302f66696c6c2f7376672f636c6561722d6461792e737667";
            break;
        case ((temperatura > 0) && (temperatura <= 4)):
            ubicacion = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy.svg";
            break;    
        case (temperatura <= 0):
            ubicacion = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/frost.svg";
            break;
    }        
    return ubicacion;
}

getLatLongProvincias();

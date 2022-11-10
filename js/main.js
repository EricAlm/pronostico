function getLatLongProvincias(){
    const apiProvincias = 'https://apis.datos.gob.ar/georef/api/provincias';

    fetch(apiProvincias)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        // data.provincias.forEach(element => {
        //     provin.innerHTML += plantilla(element);
        // });
    });
} 

function getDefaultProvincia(){
    const apiWather = '';
    
}

getLatLongProvincias();

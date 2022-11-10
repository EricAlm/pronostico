const labels = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo'
];

const data = {
    labels: labels,
    datasets: [{
      label: '',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      //aqui en data irian los datos dentro del grafico (los puntos de interrupcion)
      data: [5, 10, 5, 2, 20, 30, 45]
    }]
};
//al costado en eje y poner grados
const config = {
    type: 'line',
    data: data,
    options: {
      plugins: {
        legend: {
          display: false
        }
    },
    scales: {
        y: {
            ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value) {
                        return value + '°';
                    }
                }
            }
        }
    }
  };

const myChart = new Chart(
    document.getElementById('grafico-clima'),
    config
);

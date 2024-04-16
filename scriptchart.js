document.addEventListener('DOMContentLoaded', function() {
    const data = [7, 5, 6.33 , 3.33];
    const labels = ["Comunicación", "Situación", "Decisión", "Mando y Control"];
    drawRadarChart(data, labels);
});

function drawRadarChart(data, labels) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx, config = {  
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '% de idoneidad',
                data: data,
                fill: true,
                backgroundColor: "rgba(151,187,205,0.2)",
                borderColor: "rgba(151,187,205,1)",
                pointBackgroundColor: "rgba(151,187,205,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)"
            }]
        },
        options: {
            scales: {
                r: {
                    min: 0,  // Esto asegura que la escala radial comienza en 0
                    max: 10,
                    angleLines: {
                        display: false
                    },
                    ticks: {
                        suggestedMin: 0,  // Sugerir que los ticks comiencen en 0
                        suggestedMax: 10  // Ajusta según el máximo esperado en tus datos
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
}


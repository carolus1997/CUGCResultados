document.addEventListener('DOMContentLoaded', function() {
    const data = [6, 5, 6.33, 3.33];
    const labels = ["Comunicación", "Situación", "Decisión", "Mando y Control"];
    drawRadarChart(data, labels);
});

function drawRadarChart(data, labels) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const chart = new Chart(ctx, {  
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
                    min: 0,
                    max: 10,
                    angleLines: {
                        display: false
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

    window.myRadarChart = chart;
}

function updateChart() {
    const newData = [Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10];
    
    window.myRadarChart.data.datasets.forEach((dataset) => {
        dataset.data = newData;
    });
    window.myRadarChart.update();

    const totalScore = newData.reduce((a, b) => a + b);
    const percentageSuitability = (totalScore / 40 * 100).toFixed(2);
    
    document.getElementById('averagePercentage').textContent = percentageSuitability;
    document.getElementById('scoreComunicacion').textContent = newData[0].toFixed(2);
    document.getElementById('scoreSituacion').textContent = newData[1].toFixed(2);
    document.getElementById('scoreDecision').textContent = newData[2].toFixed(2);
    document.getElementById('scoreMando').textContent = newData[3].toFixed(2);
}

function toggleAnswers() {
    var answersDiv = document.getElementById('correctAnswers');
    var button = document.getElementById('correctButton');

    // Verificar si las respuestas están siendo mostradas
    if (answersDiv.style.display === "none") {
        // Si no se están mostrando, mostrarlas y cambiar el texto del botón
        answersDiv.style.display = "block";
        button.textContent = "Ocultar Respuestas";
        fillAnswers(true); // Llamada a función que llena las respuestas con animación si es necesario
    } else {
        // Si se están mostrando, ocultarlas y cambiar el texto del botón
        answersDiv.style.display = "none";
        button.textContent = "Mostrar Respuestas";
        clearAnswers(); // Opcional, limpia las respuestas para reiniciar la animación la próxima vez
    }
}

function fillAnswers(animate) {
    var correctAnswers = [
        ["Centro de Concentración contra el Narcotráfico (CCON)"],
        ["Patrullas y aeronaves GC enviadas a las playas", "Redes sociales y medios de comunicación", "Información obtenida de controles GAR"],
        ["Despliegue de unidades de investigación GC y solicitud colaboración PN y PL", "Controles de carreteras y despliegue de unidades GAR", "Intercambio de información con oficiales de enlace y CCP Tánger y Algeciras"],
        ["Portavoz GC informa de respuesta del Estado ante incidente de seguridad", "Portavoz GC solicita colaboración ciudadana para detener narcotraficantes", "Portavoz GC informa sobre situación en las playas y mensaje de calma"]
    ];
    const sections = ['Mando', 'Situacion', 'Decision', 'Comunicacion'];
    let delay = 0;

    sections.forEach((section, index) => {
        const listId = `answer${section}`;
        const list = document.getElementById(listId);
        list.innerHTML = ''; // Limpiar lista actual

        correctAnswers[index].forEach(answer => {
            const listItem = document.createElement('li');
            listItem.textContent = answer;
            listItem.className = 'answerReveal';
            list.appendChild(listItem);

            if (animate) {
                listItem.style.opacity = 0; // Inicializa opacidad a 0
                listItem.style.transform = 'translateX(-20px)'; // Posición inicial para la animación
                setTimeout(() => {
                    listItem.style.opacity = 1;
                    listItem.style.transform = 'translateX(0)';
                }, delay);
                delay += 1000; // Incrementa el retraso para la próxima respuesta
            }
        });
    });
}

function clearAnswers() {
    const lists = document.querySelectorAll('#correctAnswers ul li');
    let delay = 0;  // Incrementa el retraso para cada elemento, creando una cascada de desaparición

    lists.forEach(listItem => {
        listItem.classList.add('hiddenAnswer');  // Aplica la animación de desvanecimiento
        setTimeout(() => {
            listItem.style.display = 'none';  // Opcionalmente oculta el elemento antes de eliminarlo, si deseas que desaparezca de la vista antes de vaciar
        }, delay);
        delay += 100; // Pequeño incremento para que la desaparición sea en secuencia y no instantánea
    });

    // Espera a que todas las animaciones terminen antes de limpiar el contenido
    setTimeout(() => {
        lists.forEach(list => list.parentElement.innerHTML = ''); // Limpia cada lista después de que la animación termine
        document.getElementById('correctAnswers').style.display = 'none'; // Opcional, oculta el contenedor después de limpiar
    }, delay);
}



document.addEventListener('DOMContentLoaded', function () {
    const data = [6, 5, 6.33, 3.33];
    const labels = ["Comunicación", "Situación", "Decisión", "Mando y Control"];
    drawRadarChart(data, labels);
    updateChart(); // Llama a actualizar el gráfico con datos iniciales
});

// Llama a la función para enviar las respuestas cuando se active el evento "DOMContentLoaded"
document.addEventListener('DOMContentLoaded', function () {
    sendAnswersToScriptJS();
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
                    },
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5
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
var selectedAnswersByCategory = {};

function updateChart() {
    // Listas de posibles respuestas
    const listaMandoControl = ["SIVE", "Centro Regional de Vigilancia Marítima del Estrecho (CRVME)", "Centro de Concentración contra el Narcotráfico (CCON)"];
    const listaSituacion = ["Patrullas y aeronaves GC enviadas a las playas", "Drones de Ejército del Aire y del Espacio", "Redes sociales y medios de comunicación", "Sistemas de vigilancia de la Armada", "Prensa escrita", "Sistema de información del Puerto de Algeciras", "Fiscalía", "Información obtenida de controles GAR", "Hospitales de la zona"];
    const listaDecision = ["Despliegue de un Buque BAN de la Armada", "Despliegue de unidades de investigación GC y solicitud colaboración PN y PL", "Cierre de la Frontera Hispano-Marroquí", "Despliegue del Ejército de Tierra en España", "Controles de carreteras y despliegue de unidades GAR", "Solicitud de despliegue y controles de unidades de policía local", "Intercambio de información con oficiales de enlace y CCP Tánger y Algeciras", "Solicitud de apertura de diligencias penales en Audiencia Nacional", "Toma de control de la sala de operaciones GC en Madrid"];
    const listaComunicacion = ["Portavoz GC informa sobre incidente y detalle de personas detenidas", "Portavoz GC informa de respuesta del Estado ante incidente de seguridad", "No se realiza comunicación institucional", "Portavoz GC solicita colaboración ciudadana para detener narcotraficantes", "Asociaciones y sindicatos policiales llaman a la calma e informan de actuaciones", "Portavoz GC informa sobre situación en las playas y mensaje de calma", "Alcalde de Barbate informa sobre actuaciones policiales", "Alcalde de Tarifa informa sobre actuaciones policiales", "Juez de Instrucción informa sobre actuaciones judiciales"];

    // Respuestas correctas
    const correctAnswers = [
        ["Portavoz GC informa de respuesta del Estado ante incidente de seguridad", "Portavoz GC solicita colaboración ciudadana para detener narcotraficantes", "Portavoz GC informa sobre situación en las playas y mensaje de calma"],
        ["Patrullas y aeronaves GC enviadas a las playas", "Redes sociales y medios de comunicación", "Información obtenida de controles GAR"],
        ["Despliegue de unidades de investigación GC y solicitud colaboración PN y PL", "Controles de carreteras y despliegue de unidades GAR", "Intercambio de información con oficiales de enlace y CCP Tánger y Algeciras"],
        ["Centro de Concentración contra el Narcotráfico (CCON)"]
    ];

    // Función auxiliar para seleccionar elementos aleatorios de una lista
    function selectRandomElements(list, num) {
        const shuffled = [...list].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }

    // Selecciona respuestas aleatorias de cada lista
    const selectedMandoControl = selectRandomElements(listaMandoControl, 1);
    const selectedSituacion = selectRandomElements(listaSituacion, 3);
    const selectedDecision = selectRandomElements(listaDecision, 3);
    const selectedComunicacion = selectRandomElements(listaComunicacion, 3);

    // Calcula la idoneidad de las respuestas seleccionadas
    const scores = [selectedComunicacion, selectedSituacion, selectedDecision, selectedMandoControl].map((selected, index) => {
        const correctCount = selected.filter(answer => correctAnswers[index].includes(answer)).length;
        return (correctCount / correctAnswers[index].length) * 10; // Puntuación basada en la proporción correcta
    });

    // Actualiza el gráfico con las nuevas puntuaciones
    window.myRadarChart.data.datasets.forEach((dataset) => {
        dataset.data = scores;
    });
    window.myRadarChart.update();

    // Calcula y muestra el porcentaje de idoneidad general
    const totalScore = scores.reduce((a, b) => a + b);
    const percentageSuitability = (totalScore / 40 * 100).toFixed(2);
    document.getElementById('averagePercentage').textContent = percentageSuitability + '%';

    // Actualiza los scores individuales para cada área
    document.getElementById('scoreComunicacion').textContent = scores[0].toFixed(2) * 10 + '%';
    document.getElementById('scoreSituacion').textContent = scores[1].toFixed(2) * 10 + '%';
    document.getElementById('scoreDecision').textContent = scores[2].toFixed(2) * 10 + '%';
    document.getElementById('scoreMando').textContent = scores[3].toFixed(2) * 10 + '%';

    selectedAnswersByCategory = {
        Comunicacion: selectedComunicacion,
        Situacion: selectedSituacion,
        Decision: selectedDecision,
        Mando: selectedMandoControl
    };
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

function toggleSelectedAnswers(category) {
    var list = document.getElementById(`selected${category}`);
    var button = event.currentTarget;

    if (list.classList.contains("show")) {
        list.classList.remove("show");  // Oculta y detiene la animación
        button.textContent = "+";
    } else {
        list.classList.add("show");  // Muestra y comienza la animación
        button.textContent = "−";
        fillSelectedAnswers(category);
    }
}

function fillSelectedAnswers(category) {
    var answers = selectedAnswersByCategory[category];
    var listId = `selected${category}`;
    var list = document.getElementById(listId);
    list.innerHTML = '';  // Limpiar lista actual

    answers.forEach((answer, index) => {
        var listItem = document.createElement('li');
        listItem.textContent = answer;
        // Se añade un pequeño retraso para cada elemento li para crear el efecto 'creciente'
        setTimeout(() => {
            list.appendChild(listItem);
        }, index * 100);  // Incrementa el retraso para cada elemento siguiente
    });
}



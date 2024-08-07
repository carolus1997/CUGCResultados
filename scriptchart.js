document.addEventListener('DOMContentLoaded', function () {
    const initialData = [0, 0, 0, 0];
    const labels = ["Comunicación", "Situación", "Decisión", "Mando y Control"];
    drawRadarChart(initialData, labels);
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
                    max: 100,
                    angleLines: { display: false },
                    ticks: { beginAtZero: true, maxTicksLimit: 5 }
                }
            },
            elements: { line: { borderWidth: 3 } }
        }
    });
    window.myRadarChart = chart;
}

function showChart() {
    document.getElementById('resultsSection').style.display = 'block';
    const data = [65, 59, 80, 81]; // Datos de ejemplo
    const labels = ['Mando y Control', 'Situación', 'Decisión', 'Comunicación'];
    drawRadarChart(data, labels);
}

function printReport() {
    // Actualiza el gráfico con los datos reales antes de generar el informe
    updateChartWithRealData();

    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write('<html><head><title>Informe de Evaluación</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
    printWindow.document.write('h4 { margin-top: 20px; border-bottom: 1px solid #000; padding-bottom: 5px; }');
    printWindow.document.write('p { margin-left: 20px; }');
    printWindow.document.write('.annotationBox { width: 95%; height: 50px; border: 1px solid #ccc; background-color: #f0f0f0; margin: 10px auto 20px; padding: 10px; }');
    printWindow.document.write('.selectedAnswer { color: blue; }');
    printWindow.document.write('.correctAnswer { color: green; }');
    printWindow.document.write('.incorrectAnswer { color: red; }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');

    printWindow.document.write('<h1>Informe de Evaluación Equipo 6</h1>');
    printWindow.document.write('<h2>Resultados de la práctica</h2>');

    // Obtener la imagen del gráfico de radar
    const canvas = document.getElementById("radarChart");
    const imgData = canvas.toDataURL("image/png");
    printWindow.document.write('<div><img src="' + imgData + '" width="400" height="400"/></div>');

    // Añadir preguntas, respuestas seleccionadas y correctas
    const correctAnswers = {
        "Mando": ["Centro de Concentración contra el Narcotráfico (CCON)"],
        "Situacion": ["Patrullas y aeronaves GC enviadas a las playas", "Redes sociales y medios de comunicación", "Información obtenida de controles GAR"],
        "Decision": ["Despliegue de unidades de investigación GC y solicitud colaboración PN y PL", "Controles de carreteras y despliegue de unidades GAR", "Intercambio de información con oficiales de enlace y CCP Tánger y Algeciras"],
        "Comunicacion": ["Portavoz GC informa de respuesta del Estado ante incidente de seguridad", "Portavoz GC solicita colaboración ciudadana para detener narcotraficantes", "Portavoz GC informa sobre situación en las playas y mensaje de calma"]
    };

    const selectedAnswers = {
        "Mando": selectedAnswersByCategory["Mando"] || [],
        "Situacion": selectedAnswersByCategory["Situacion"] || [],
        "Decision": selectedAnswersByCategory["Decision"] || [],
        "Comunicacion": selectedAnswersByCategory["Comunicacion"] || []
    };

    const sections = ['Mando', 'Situacion', 'Decision', 'Comunicacion'];
    sections.forEach(section => {
        printWindow.document.write('<h4>' + section + '</h4>');

        printWindow.document.write('<h5>Respuestas Seleccionadas</h5>');
        selectedAnswers[section].forEach(answer => {
            const isCorrect = correctAnswers[section].includes(answer);
            const answerClass = isCorrect ? 'correctAnswer' : 'incorrectAnswer';
            printWindow.document.write('<p class="' + answerClass + '">- ' + answer + '</p>');
        });

        printWindow.document.write('<h5>Respuestas Correctas</h5>');
        correctAnswers[section].forEach(answer => {
            printWindow.document.write('<p class="correctAnswer">- ' + answer + '</p>');
        });

        const correctCount = selectedAnswers[section].filter(answer => correctAnswers[section].includes(answer)).length;
        const score = (correctCount / correctAnswers[section].length) * 100;
        printWindow.document.write('<p><b>Porcentaje de Idoneidad: ' + score.toFixed(2) + '%</b></p>');
    });

    const totalSuitability = calculateTotalSuitability();
    printWindow.document.write('<h3><b>Idoneidad Total: ' + totalSuitability.toFixed(2) + '%</b></h3>');

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function updateChartWithRealData() {
    // Datos reales para el gráfico de radar
    const realData = [
        calculateScore("Comunicacion"),
        calculateScore("Situacion"),
        calculateScore("Decision"),
        calculateScore("Mando")
    ];
    window.myRadarChart.data.datasets[0].data = realData;
    window.myRadarChart.update();
}

function calculateScore(category) {
    const correctAnswers = {
        "Mando": ["Centro de Concentración contra el Narcotráfico (CCON)"],
        "Situacion": ["Patrullas y aeronaves GC enviadas a las playas", "Redes sociales y medios de comunicación", "Información obtenida de controles GAR"],
        "Decision": ["Despliegue de unidades de investigación GC y solicitud colaboración PN y PL", "Controles de carreteras y despliegue de unidades GAR", "Intercambio de información con oficiales de enlace y CCP Tánger y Algeciras"],
        "Comunicacion": ["Portavoz GC informa de respuesta del Estado ante incidente de seguridad", "Portavoz GC solicita colaboración ciudadana para detener narcotraficantes", "Portavoz GC informa sobre situación en las playas y mensaje de calma"]
    };

    const selectedAnswers = selectedAnswersByCategory[category] || [];
    const correctCount = selectedAnswers.filter(answer => correctAnswers[category].includes(answer)).length;
    return (correctCount / correctAnswers[category].length) * 100;
}

function calculateTotalSuitability() {
    const categories = ["Mando", "Situacion", "Decision", "Comunicacion"];
    let totalScore = 0;

    categories.forEach(category => {
        totalScore += calculateScore(category);
    });

    return totalScore / categories.length;
}

let selectedAnswersByCategory = {};

function updateChart(formId, selectedAnswers) {
    const correctAnswers = {
        "examForm1": ["Centro de Concentración contra el Narcotráfico (CCON)"],
        "examForm2": ["Patrullas y aeronaves GC enviadas a las playas", "Redes sociales y medios de comunicación", "Información obtenida de controles GAR"],
        "examForm3": ["Despliegue de unidades de investigación GC y solicitud colaboración PN y PL", "Controles de carreteras y despliegue de unidades GAR", "Intercambio de información con oficiales de enlace y CCP Tánger y Algeciras"],
        "examForm4": ["Portavoz GC informa de respuesta del Estado ante incidente de seguridad", "Portavoz GC solicita colaboración ciudadana para detener narcotraficantes", "Portavoz GC informa sobre situación en las playas y mensaje de calma"]
    };

    const categoryMap = {
        "examForm1": "Mando",
        "examForm2": "Situacion",
        "examForm3": "Decision",
        "examForm4": "Comunicacion"
    };
    const categoryIndex = {
        "examForm1": 3,
        "examForm2": 1,
        "examForm3": 2,
        "examForm4": 0
    };

    const correctCount = selectedAnswers.filter(answer => correctAnswers[formId].includes(answer)).length;
    const score = (correctCount / correctAnswers[formId].length) * 100;

    const index = categoryIndex[formId];
    window.myRadarChart.data.datasets[0].data[index] = score;
    window.myRadarChart.update();

    const category = categoryMap[formId];
    selectedAnswersByCategory[category] = selectedAnswers;

    document.getElementById(`score${category}`).textContent = `${score.toFixed(2)}%`;

    const totalScore = window.myRadarChart.data.datasets[0].data.reduce((a, b) => a + b);
    const percentageSuitability = (totalScore / 40 * 10).toFixed(2);
    document.getElementById('averagePercentage').textContent = `${percentageSuitability}%`;
}

function toggleAnswers() {
    const answersDiv = document.getElementById('correctAnswers');
    const button = document.getElementById('correctButton');
    const show = answersDiv.style.display === "none";

    answersDiv.style.display = show ? "block" : "none";
    button.textContent = show ? "Ocultar Respuestas" : "Mostrar Respuestas";

    if (show) {
        fillAnswers(true);
    } else {
        clearAnswers();
    }
}

function fillAnswers(animate) {
    const correctAnswers = {
        "Mando": ["Centro de Concentración contra el Narcotráfico (CCON)"],
        "Situacion": ["Patrullas y aeronaves GC enviadas a las playas", "Redes sociales y medios de comunicación", "Información obtenida de controles GAR"],
        "Decision": ["Despliegue de unidades de investigación GC y solicitud colaboración PN y PL", "Controles de carreteras y despliegue de unidades GAR", "Intercambio de información con oficiales de enlace y CCP Tánger y Algeciras"],
        "Comunicacion": ["Portavoz GC informa de respuesta del Estado ante incidente de seguridad", "Portavoz GC solicita colaboración ciudadana para detener narcotraficantes", "Portavoz GC informa sobre situación en las playas y mensaje de calma"]
    };

    const sections = ['Mando', 'Situacion', 'Decision', 'Comunicacion'];
    let delay = 0;

    sections.forEach(section => {
        const list = document.getElementById(`answer${section}`);
        list.innerHTML = '';

        correctAnswers[section].forEach(answer => {
            const listItem = document.createElement('li');
            listItem.textContent = answer;
            listItem.className = 'answerReveal';
            list.appendChild(listItem);

            if (animate) {
                listItem.style.opacity = 0;
                listItem.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    listItem.style.opacity = 1;
                    listItem.style.transform = 'translateX(0)';
                }, delay);
                delay += 1000;
            }
        });
    });
}

function clearAnswers() {
    const lists = document.querySelectorAll('#correctAnswers ul li');
    let delay = 0;

    lists.forEach(listItem => {
        listItem.classList.add('hiddenAnswer');
        setTimeout(() => {
            listItem.style.display = 'none';
        }, delay);
        delay += 100;
    });

    setTimeout(() => {
        lists.forEach(list => list.parentElement.innerHTML = '');
        document.getElementById('correctAnswers').style.display = 'none';
    }, delay);
}

function toggleSelectedAnswers(category) {
    const list = document.getElementById(`selected${category}`);
    const button = event.currentTarget;
    const show = !list.classList.contains("show");

    list.classList.toggle("show", show);
    button.textContent = show ? "−" : "+";

    if (show) {
        fillSelectedAnswers(category);
    }
}

function fillSelectedAnswers(category) {
    const answers = selectedAnswersByCategory[category];
    const list = document.getElementById(`selected${category}`);
    list.innerHTML = '';

    answers.forEach((answer, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = answer;
        setTimeout(() => {
            list.appendChild(listItem);
        }, index * 100);
    });
}
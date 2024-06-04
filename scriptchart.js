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

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Informe de Evaluación", 10, 10);
    doc.text("Resultados de la práctica", 10, 20);

    // Obtener la imagen del gráfico de radar
    const canvas = document.getElementById("radarChart");
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, 'PNG', 10, 30, 180, 160);

    doc.save("informe_evaluacion.pdf");
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




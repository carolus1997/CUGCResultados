const canvas = document.getElementById('radarChart');
const ctx = canvas.getContext('2d');

function drawRadar() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Variables de configuración
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const numAxis = 4; // Número de ejes, asegúrate de que coincide con la longitud de tu array de datos y títulos
    const angle = (Math.PI * 2) / numAxis; // Ángulo entre ejes

    // Dibujar ejes del radar y subsecciones
    drawAxesAndSubsections(centerX, centerY, radius, numAxis, angle);

    // Dibujar títulos de ejes
    drawAxisTitles(centerX, centerY, radius, numAxis, angle);

    // Dibujar el polígono de datos y puntos medianos
    drawDataPolygon(centerX, centerY, radius, numAxis, angle);
}

function drawAxesAndSubsections(centerX, centerY, radius, numAxis, angle) {
    const subsections = 3; // Número de subsecciones por eje
    const subsectionRadius = radius / subsections;

    // Dibujar ejes del radar
    for (let i = 0; i < numAxis; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const x = centerX + radius * Math.cos(angle * i);
        const y = centerY + radius * Math.sin(angle * i);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Dibujar subsecciones en los ejes y conectar los vértices
    ctx.strokeStyle = 'lightgray'; // Color de las líneas de las subsecciones
    for (let j = 1; j <= subsections; j++) {
        ctx.beginPath();
        const subRadius = subsectionRadius * j;
        for (let i = 0; i <= numAxis; i++) { // Usar <= para cerrar el círculo
            const x = centerX + subRadius * Math.cos(angle * i);
            const y = centerY + subRadius * Math.sin(angle * i);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
}

function drawAxisTitles(centerX, centerY, radius, numAxis, angle) {
    ctx.font = "16px Arial"; // Estilo de fuente para los títulos de los ejes
    ctx.fillStyle = "black"; // Color del texto
    const titles = ["Mando y Control", "Situación", "Decisión", "Comunicación"]; // Títulos de los ejes

    for (let i = 0; i < numAxis; i++) {
        const angleRadians = angle * i;
        const x = centerX + (radius + 20) * Math.cos(angleRadians);
        const y = centerY + (radius + 20) * Math.sin(angleRadians);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Ajustar la posición del texto para mejorar la legibilidad
        const adjustedX = x + (Math.cos(angleRadians) > 0 ? 10 : -10);
        const adjustedY = y + (Math.sin(angleRadians) > 0 ? 10 : -10);

        ctx.fillText(titles[i], adjustedX, adjustedY);
    }
}

function drawDataPolygon(centerX, centerY, radius, numAxis, angle) {
    const data = [7, 3, 8, 5]; // Tus datos normalizados de 1 a 10
    ctx.beginPath();
    ctx.fillStyle = "rgba(151,187,205,0.2)"; // Opacidad ajustada

    data.forEach((value, index) => {
        const dataAngle = angle * index;
        const dataRadius = (value / 10) * radius; // Escala el valor al radio del radar
        const x = centerX + dataRadius * Math.cos(dataAngle);
        const y = centerY + dataRadius * Math.sin(dataAngle);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        // Dibuja puntos medianos en los vértices
        ctx.fillStyle = "rgba(151,187,205,1)"; // Color del polígono
        ctx.beginPath();
        ctx.arc(x, y,3, 0, Math.PI * 2); // Tamaño de los puntos
        ctx.fill();
    });

    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(151,187,205,1)";
    ctx.stroke();
}

drawRadar(); // Llamar a la función para dibujar el gráfico

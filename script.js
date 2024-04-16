const canvas = document.getElementById('radarChart');
const ctx = canvas.getContext('2d');
const points = []; // Almacenará los objetos con las coordenadas y puntuaciones de cada punto

function drawRadar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const numAxis = 4;
    const angle = (Math.PI * 2) / numAxis;

    drawAxesAndSubsections(centerX, centerY, radius, numAxis, angle);
    drawAxisTitles(centerX, centerY, radius, numAxis, angle);
    drawDataPolygon(centerX, centerY, radius, numAxis, angle);
}

function drawAxesAndSubsections(centerX, centerY, radius, numAxis, angle) {
    const subsections = 3;
    const subsectionRadius = radius / subsections;

    for (let i = 0; i < numAxis; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const x = centerX + radius * Math.cos(angle * i);
        const y = centerY + radius * Math.sin(angle * i);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    ctx.strokeStyle = 'lightgray';
    for (let j = 1; j <= subsections; j++) {
        ctx.beginPath();
        const subRadius = subsectionRadius * j;
        for (let i = 0; i <= numAxis; i++) {
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
    ctx.font = "20px Times New Roman";
    const titles = ["Comunicación", "Situación", "Decisión","Mando y Control"];

    for (let i = 0; i < numAxis; i++) {
        ctx.save(); // Guarda el estado actual del contexto
        const angleRadians = angle * i;
        const x = centerX + (radius + 20) * Math.cos(angleRadians);
        const y = centerY + (radius + 20) * Math.sin(angleRadians);

        ctx.translate(x, y);
        ctx.rotate(angleRadians + Math.PI / 2); // Rota el texto para alinearlo con el eje

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top'; // Ajusta aquí dependiendo de la orientación deseada

        ctx.fillText(titles[i], 0, 0); // Posiciona el texto en el punto transformado
        ctx.restore(); // Restaura el estado original para no afectar otros dibujos
    }
}

function drawDataPolygon(centerX, centerY, radius, numAxis, angle) {
    const data = [7, 4, 9, 2];
    ctx.beginPath();
    ctx.fillStyle = "rgba(151,187,205,0.2)";

    data.forEach((value, index) => {
        const dataAngle = angle * index;
        const dataRadius = (value / 10) * radius;
        const x = centerX + dataRadius * Math.cos(dataAngle);
        const y = centerY + dataRadius * Math.sin(dataAngle);

        points.push({ x, y, value }); // Guarda los puntos para el evento de hover

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(151,187,205,1)";
    ctx.stroke();
}

canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    points.forEach(point => {
        const distance = Math.sqrt((point.x - mouseX) ** 2 + (point.y - mouseY) ** 2);
        if (distance < 10) { // Ajusta según el tamaño de tus puntos
            showTooltip(point.x, point.y, point.value);
        } else {
            hideTooltip();
        }
    });
});

function showTooltip(x, y, value) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.padding = '8px';
        tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.border- `border-radius`, '10px';
        document.body.appendChild(tooltip);
    }
    tooltip.textContent = `Puntuación: ${value}`;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y + 20}px`;
    tooltip.style.display = 'block';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

drawRadar(); // Inicia la función para dibujar el gráfico

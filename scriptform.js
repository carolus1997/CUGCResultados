document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    const formSections = document.querySelectorAll(".form-section");

    const options = [
        // Opciones para la pregunta de Situación (2)
        ["Patrullas y aeronaves GC enviadas a las playas", "Drones de Ejército del Aire y del Espacio", "Redes sociales y medios de comunicación", "Sistemas de vigilancia de la Armada", "Prensa escrita", "Sistema de información del Puerto de Algeciras", "Fiscalía", "Información obtenida de controles GAR", "Hospitales de la zona"],
        // Opciones para la pregunta de Decisión (3)
        ["Despliegue de un Buque BAN de la Armada", "Despliegue de unidades de investigación GC y solicitud colaboración PN y PL", "Cierre de la Frontera Hispano-Marroquí", "Despliegue del Ejército de Tierra en España", "Controles de carreteras y despliegue de unidades GAR", "Solicitud de despliegue y controles de unidades de policía local", "Intercambio de información con oficiales de enlace y CCP Tánger y Algeciras", "Solicitud de apertura de diligencias penales en Audiencia Nacional", "Toma de control de la sala de operaciones GC en Madrid"],
        // Opciones para la pregunta de Comunicación (4)
        ["Portavoz GC informa sobre incidente y detalle de personas detenidas", "Portavoz GC informa de respuesta del Estado ante incidente de seguridad", "No se realiza comunicación institucional", "Portavoz GC solicita colaboración ciudadana para detener narcotraficantes", "Asociaciones y sindicatos policiales llaman a la calma e informan de actuaciones", "Portavoz GC informa sobre situación en las playas y mensaje de calma", "Alcalde de Barbate informa sobre actuaciones policiales", "Alcalde de Tarifa informa sobre actuaciones policiales", "Juez de Instrucción informa sobre actuaciones judiciales"]
    ];

    formSections.forEach(section => section.classList.add('hidden'));

    cards.forEach(card => {
        card.addEventListener("click", function (event) {
            event.preventDefault();
            const targetForm = document.getElementById(card.dataset.target);

            formSections.forEach(section => {
                section.classList.add('hidden');
                section.classList.remove("active");
            });

            targetForm.classList.remove('hidden');
            setTimeout(() => {
                targetForm.classList.add("active");
                targetForm.scrollIntoView({ behavior: 'smooth' });
            }, 10);
        });
    });

    function generateOptions(questionIndex, optionsList) {
        const questionDiv = document.getElementById(`options${questionIndex + 2}`);
        optionsList.forEach(option => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "form-check-input";
            checkbox.name = `question${questionIndex + 2}`;
            checkbox.value = option;

            const label = document.createElement("label");
            label.className = "form-check-label";
            label.textContent = option;

            const div = document.createElement("div");
            div.className = "form-check";
            div.appendChild(checkbox);
            div.appendChild(label);
            questionDiv.appendChild(div);

            checkbox.addEventListener("change", function () {
                const checkedCheckboxes = questionDiv.querySelectorAll('input[type="checkbox"]:checked');
                questionDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.disabled = checkedCheckboxes.length >= 3 && !cb.checked;
                    cb.parentNode.classList.toggle("disabled-checkbox", cb.disabled);
                });
            });
        });
    }

    options.forEach((optionsList, index) => generateOptions(index, optionsList));

    document.querySelectorAll("form[id^='examForm']").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const currentFormSection = form.parentElement;
            const formData = new FormData(form);
            const selectedAnswers = [];

            formData.forEach((value, key) => {
                selectedAnswers.push(value);
            });

            updateChart(form.id, selectedAnswers);

            currentFormSection.classList.add('fade-out');
            setTimeout(() => {
                currentFormSection.classList.remove('active');
                currentFormSection.classList.add('hidden');
                currentFormSection.classList.remove('fade-out');
            }, 500);

            $('#confirmationModal').modal('show');

            let countdown = 5;
            const countdownElement = document.getElementById('countdown');

            const timer = setInterval(() => {
                countdownElement.textContent = countdown--;
                if (countdown < 0) {
                    clearInterval(timer);
                    window.close();
                }
            }, 1000);
        });
    });
});

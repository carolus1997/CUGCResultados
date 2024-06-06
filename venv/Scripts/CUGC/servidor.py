from flask import Flask, request, send_file
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image
from reportlab.lib.styles import getSampleStyleSheet
import io

app = Flask(__name__)

@app.route('/generar-informe', methods=['POST'])
def generar_informe():
    data = request.json

    # Generar gráfico
    categories = ["Comunicación", "Situación", "Decisión", "Mando y Control"]
    scores = [0, 0, 0, 0]

    for resultado in data['resultados']:
        index = categories.index(resultado['pregunta'])
        scores[index] = 100 if resultado['correcta'] else 0

    plt.figure(figsize=(6, 6))
    plt.bar(categories, scores, color='blue')
    plt.xlabel('Categorías')
    plt.ylabel('% de idoneidad')
    plt.title('Resultados del Examen')
    plt.savefig('grafico.png')
    plt.close()

    # Crear PDF
    buffer = io.BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    title = Paragraph("Informe de Evaluación", styles['Title'])
    elements.append(title)
    elements.append(Paragraph(f"Estudiante: {data['estudiante']}", styles['Normal']))
    elements.append(Paragraph(f"Examen: {data['examen']}", styles['Normal']))

    elements.append(Paragraph("<br/><br/>", styles['Normal']))
    elements.append(Image("grafico.png", width=400, height=400))

    document.build(elements)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='informe_evaluacion.pdf', mimetype='application/pdf')

if __name__ == '__main__':
    app.run(debug=True)

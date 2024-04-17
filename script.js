function consolidateResponses() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var consolidationSheet = spreadsheet.getSheetByName('Consolidado') || spreadsheet.insertSheet('Consolidado');
    Logger.log('Consolidation Sheet cleared.'); // Depuración
    consolidationSheet.clear();
  
    var formSheets = ['Respuestas de formulario 1', 'Respuestas de formulario 2', 'Respuestas de formulario 3', 'Respuestas de formulario 4'];
  
    formSheets.forEach(function(sheetName) {
      var sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        Logger.log(sheetName + ' no existe.');
        return;
      }
  
      var data = sheet.getDataRange().getValues();
      Logger.log('Data retrieved from ' + sheetName + ': ' + data.length + ' rows'); // Depuración
  
      if (data.length > 1) {
        var cleanedData = cleanData(data, true);
        consolidationSheet.getRange(consolidationSheet.getLastRow() + 1, 1, cleanedData.length, cleanedData[0].length).setValues(cleanedData);
        Logger.log('Data consolidated from ' + sheetName); // Depuración
      }
    });
  
    var percentage = calculateIdoneityPercentage();
    PropertiesService.getScriptProperties().setProperty('percentage', percentage);
    Logger.log('Idoneity Percentage Calculated: ' + percentage); // Depuración
  }
  
  
  
  function cleanData(data, includeHeaders) {
    var defaultValue = 'Valor por defecto';
    var startRowIndex = includeHeaders ? 1 : 0;
  
    for (var i = startRowIndex; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        if (data[i][j] === '') {
          Logger.log('Empty cell found at row ' + (i + 1) + ', column ' + (j + 1)); // Depuración
          data[i][j] = defaultValue;
        }
      }
    }
  
    return includeHeaders ? data : data.slice(1);
  }
  
  
  function doGet() {
    var template = HtmlService.createTemplateFromFile('index');
    var scores = getScores(); // Suponiendo que esta función devuelve un array de puntuaciones
    template.scores = scores.join(','); // Convertir array en cadena para pasar a HTML
    return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  function getScores() {
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Consolidado');
      var range = sheet.getRange("C2:C80");
      var allValues = range.getValues();
      var scores = [];
  
      for (var i = 0; i < allValues.length; i++) {
        var value = allValues[i][0];
        if (typeof value === 'number') {
          scores.push(value);
          Logger.log('Valor añadido a scores: ' + value);
        } else {
          Logger.log('Non-numeric value skipped at row ' + (i + 2) + ': ' + value); // Depuración
        }
      }
  
      return scores;
    } catch (e) {
      Logger.log('Error retrieving scores: ' + e.toString()); // Captura y registra errores
      return []; // Devuelve un array vacío en caso de error
    }
  }
  
  
  
  function calculateIdoneityPercentage() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var responsesSheet = spreadsheet.getSheetByName('Consolidado');
    var values = responsesSheet.getDataRange().getValues();
  
    var correctAnswers = [
      ["Centro de Concentración contra el Narcotráfico (CCON)"],
      ["Patrullas y aeronaves GC enviadas a las playas", "Redes sociales y medios de comunicación", "Información obtenida de controles GAR"],
      ["Despliegue de unidades de investigación GC y solicitud colaboración PN y PL", "Controles de carreteras y despliegue de unidades GAR", "Intercambio de información con oficiales de enlace y CCP Tánger y Algeciras"],
      ["Portavoz GC informa de respuesta del Estado ante incidente de seguridad", "Portavoz GC solicita colaboración ciudadana para detener narcotraficantes", "Portavoz GC informa sobre situación en las playas y mensaje de calma"]
    ];
  
    var totalPercentage = 0;
  
    for (var i = 1; i < values.length; i++) {
      for (var j = 2; j < values[i].length; j++) {
        var questionPercentage = 0;  // Inicializa el porcentaje de esta pregunta en 0
        var responses = String(values[i][j]).split(', ').map(function(item) { return item.trim(); });  // Normaliza y divide las respuestas
        var correct = correctAnswers[j-2];
  
        // Calcula el porcentaje de respuestas correctas para la pregunta
        correct.forEach(function(correctResponse) {
          if (responses.includes(correctResponse)) {
            questionPercentage += (25 / correct.length);  // Suma una fracción del total basado en cuántas partes correctas hay
          }
        });
  
        totalPercentage += questionPercentage;
      }
    }
  
    var averagePercentage = totalPercentage / (values.length - 1);  // Calcula el promedio del porcentaje total
    return averagePercentage.toFixed(2);  // Formatea a dos decimales
  }
  
  
  
  function getIdoneityPercentage() {
    // Recuperar el porcentaje almacenado y devolverlo
    return PropertiesService.getScriptProperties().getProperty('percentage');
  }
  
  
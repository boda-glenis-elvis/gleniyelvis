/**
 * ===================================================================
 * BODA GLENIS & ELVIS - GOOGLE APPS SCRIPT (Código.gs)
 * VERSIÓN ULTRA COMPATIBLE (100% Sin dependencias modernas ni fallos)
 * ===================================================================
 * 
 * Columnas exactas:
 * A: Fecha y Hora (1)
 * B: Tipo (2)
 * C: Invitacion Para (3)
 * D: ¿Asiste? (4)
 * E: Pases (5)
 * F: Nombres de Asistentes (6)
 * G: Mensaje/Deseo (7)
 * H: ID Invitado (8)
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];

    // Asegurar título en Columna H (ID Invitado)
    if (sheet.getLastColumn() < 8 || !sheet.getRange(1, 8).getValue()) {
      sheet.getRange(1, 8).setValue("ID Invitado");
    }

    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
    if (!contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Sin datos recibidos" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(contents);
    var timestamp = Utilities.formatDate(new Date(), "America/Lima", "dd/MM/yyyy HH:mm:ss");

    var guestId = (data.id || "").toString();
    var guestName = (data.invitado || "").toString();
    if (!guestId && guestName) {
      guestId = "guest_" + cleanText(guestName);
    }

    var isRsvp = data.tipo && data.tipo.toString().indexOf("RSVP") !== -1;
    var isBuzon = data.tipo && data.tipo.toString().indexOf("BUZÓN") !== -1;

    var targetRow = buscarFilaInvitado(sheet, guestId, guestName);

    if (targetRow > 1) {
      // ===== ACTUALIZAR FILA EXISTENTE (MISMA LÍNEA) =====
      sheet.getRange(targetRow, 1).setValue(timestamp); // Col A: Fecha
      sheet.getRange(targetRow, 8).setValue(guestId);   // Col H: ID

      var tipoActual = (sheet.getRange(targetRow, 2).getValue() || "").toString();

      if (isRsvp) {
        var nuevoTipo = (tipoActual.indexOf("BUZÓN") !== -1) ? "RSVP + BUZÓN" : "RSVP";
        sheet.getRange(targetRow, 2).setValue(nuevoTipo);               // Col B: Tipo
        if (guestName) sheet.getRange(targetRow, 3).setValue(guestName); // Col C: Invitado
        sheet.getRange(targetRow, 4).setValue(data.asistencia || "—");   // Col D: Asistencia
        sheet.getRange(targetRow, 5).setValue(data.pases || "—");        // Col E: Pases
        sheet.getRange(targetRow, 6).setValue(data.asistentes || "—");   // Col F: Asistentes
        if (data.mensaje && data.mensaje !== "—") {
          sheet.getRange(targetRow, 7).setValue(data.mensaje);          // Col G: Mensaje
        }
      } else if (isBuzon) {
        var nuevoTipoBuzon = (tipoActual.indexOf("RSVP") !== -1) ? "RSVP + BUZÓN" : "BUZÓN";
        sheet.getRange(targetRow, 2).setValue(nuevoTipoBuzon);          // Col B: Tipo
        if (data.mensaje) {
          sheet.getRange(targetRow, 7).setValue(data.mensaje);          // Col G: Mensaje
        }
        var nombreActual = (sheet.getRange(targetRow, 3).getValue() || "").toString();
        if (!nombreActual && guestName) {
          sheet.getRange(targetRow, 3).setValue(guestName);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ success: true, updated: true, row: targetRow }))
        .setMimeType(ContentService.MimeType.JSON);

    } else {
      // ===== CREAR NUEVA FILA (PRIMER ENVÍO) =====
      var tipoVal = isRsvp ? "RSVP" : "BUZÓN";
      var asistenciaVal = isRsvp ? (data.asistencia || "—") : "—";
      var pasesVal = isRsvp ? (data.pases || "—") : "—";
      var asistentesVal = isRsvp ? (data.asistentes || "—") : "—";
      var mensajeVal = isBuzon ? (data.mensaje || "") : (data.mensaje && data.mensaje !== "—" ? data.mensaje : "");

      var rowValues = [
        timestamp,      // Col A (1)
        tipoVal,        // Col B (2)
        guestName,      // Col C (3)
        asistenciaVal,  // Col D (4)
        pasesVal,       // Col E (5)
        asistentesVal,  // Col F (6)
        mensajeVal,     // Col G (7)
        guestId         // Col H (8)
      ];

      sheet.appendRow(rowValues);

      return ContentService.createTextOutput(JSON.stringify({ success: true, created: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action;
    var guestId = (params.id || "").toString();
    var guestName = (params.invitado || "").toString();
    var callback = params.callback;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];

    if (action === "check_all") {
      var targetRow = buscarFilaInvitado(sheet, guestId, guestName);
      var result = {
        rsvp: { exists: false },
        wish: { exists: false }
      };

      if (targetRow > 1) {
        var numCols = Math.max(sheet.getLastColumn(), 8);
        var row = sheet.getRange(targetRow, 1, 1, numCols).getValues()[0];
        var fecha = row[0] || "";
        var asistencia = (row[3] || "").toString();
        var pases = (row[4] || "").toString();
        var asistentes = (row[5] || "").toString();
        var mensaje = (row[6] || "").toString();

        if (asistencia && asistencia !== "—") {
          result.rsvp = {
            exists: true,
            asistencia: asistencia,
            pases: pases,
            asistentes: asistentes,
            timestamp: fecha
          };
        }

        if (mensaje && mensaje !== "—") {
          result.wish = {
            exists: true,
            mensaje: mensaje,
            timestamp: fecha
          };
        }
      }

      var jsonStr = JSON.stringify(result);
      if (callback) {
        return ContentService.createTextOutput(callback + "(" + jsonStr + ");")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService.createTextOutput(jsonStr)
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "online" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    var errObj = { error: err.toString() };
    if (e && e.parameter && e.parameter.callback) {
      return ContentService.createTextOutput(e.parameter.callback + "(" + JSON.stringify(errObj) + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(JSON.stringify(errObj))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// -------------------------------------------------------------------
// BÚSQUEDA Y LIMPIEZA TOTALMENTE COMPATIBLE (ES5)
// -------------------------------------------------------------------
function buscarFilaInvitado(sheet, guestId, guestName) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;

  var numRows = lastRow - 1;
  var numCols = Math.max(sheet.getLastColumn(), 8);
  var values = sheet.getRange(2, 1, numRows, numCols).getValues();

  var cleanId = cleanText(guestId);
  var cleanName = cleanText(guestName);

  // 1. Buscar primero por ID en la columna H (Índice 7)
  if (cleanId) {
    for (var i = 0; i < values.length; i++) {
      var rowId = cleanText(values[i][7]);
      if (rowId && rowId === cleanId) {
        return i + 2;
      }
    }
  }

  // 2. Buscar por Nombre en la columna C (Índice 2)
  if (cleanName) {
    for (var j = 0; j < values.length; j++) {
      var rowName = cleanText(values[j][2]);
      if (rowName && (rowName === cleanName || nombresCoinciden(rowName, cleanName))) {
        return j + 2;
      }
    }
  }

  return -1;
}

function nombresCoinciden(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.indexOf(b) !== -1 || b.indexOf(a) !== -1) return true;
  return false;
}

function cleanText(text) {
  if (!text) return "";
  var str = text.toString().toLowerCase();
  str = str.replace(/[áàäâ]/g, "a")
           .replace(/[éèëê]/g, "e")
           .replace(/[íìïî]/g, "i")
           .replace(/[óòöô]/g, "o")
           .replace(/[úùüû]/g, "u")
           .replace(/ñ/g, "n");
  return str.replace(/[^a-z0-9]/g, "");
}

// Función de prueba directa desde Apps Script
function TEST_PROBAR_REGISTRO() {
  var e = {
    postData: {
      contents: JSON.stringify({
        tipo: "RSVP",
        id: "g_test_100",
        invitado: "Invitado de Prueba",
        asistencia: "SÍ ASISTIRÁ",
        pases: "2",
        asistentes: "Invitado de Prueba, Pareja",
        mensaje: "¡Muchas bendiciones!"
      })
    }
  };
  var res = doPost(e);
  Logger.log(res.getContent());
}

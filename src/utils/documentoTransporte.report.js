const PDFDocument = require('pdfkit');

/**
 * Genera el Manifiesto de Carga en formato PDF y lo escribe directamente en el flujo de respuesta (res)
 * @param {Object} data - El objeto retornado por tu función generarDocumentoTransporte
 * @param {Object} res - El objeto 'res' de Express para enviar el archivo al navegador
 */
const crearPdfManifiestoCarga = (data, res) => {
    // 1. Crear el documento PDF (Tamaño Carta, márgenes de 1 pulgada)
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });

    const { informacionLogistica, destinos, voluntarios } = data;

    // Configurar los encabezados de respuesta de Express para que el navegador entienda que es un PDF descargable
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Manifiesto_de_Carga_${Date.now()}.pdf`);

    // Tubería (Pipe): Todo lo que dibuje el doc se enviará directamente al cliente de Express
    doc.pipe(res);

    // =========================================================================
    // ENCABEZADO INSTITUCIONAL
    // =========================================================================
    doc.fontSize(10).font('Helvetica-Bold').text('TECHO PARA CHILE', { align: 'left' });
    doc.fontSize(8).font('Helvetica').text('Central de Planificación Logística y Despliegue', { align: 'left' });
    doc.moveDown(1);

    // Línea divisoria decorativa superior
    doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke('#0275d8'); 
    doc.moveDown(1.5);

    // Título Principal
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#111111').text('MANIFIESTO DE CARGA Y DESPACHO', { align: 'center' });
    doc.fontSize(10).font('Helvetica-Oblique').fillColor('#555555').text('Documento Oficial de Solicitud de Transporte para Empresa Externa', { align: 'center' });
    doc.moveDown(2);

    // =========================================================================
    // BLOQUE 1: INFORMACIÓN LOGÍSTICA DE ORIGEN Y FLOTA
    // =========================================================================
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0275d8').text('1. RESUMEN DE PLANIFICACIÓN LOGÍSTICA');
    doc.moveDown(0.5);
    
    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    
    doc.text(`Punto de Origen Sugerido (Recogida): `, {continued: true }).font('Helvetica-Bold').text(informacionLogistica.origen);
    doc.text(`Total de Pasajeros Registrados: `, {continued: true }).font('Helvetica-Bold').text(informacionLogistica.totalPasajeros);
    doc.text(`Fecha de Salida Sugerida: `, {continued: true }).font('Helvetica-Bold').text(informacionLogistica.fechaSalida);

    doc.moveDown(2);

    // =========================================================================
    // BLOQUE 2: ITINERARIO DE DESTINOS (ZONAS DE TRABAJO)
    // =========================================================================
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0275d8').text('2. RUTA DE DESTINOS');
    doc.moveDown(0.5);
    
    doc.fontSize(10).fillColor('#333333');
    destinos.forEach((destino, index) => {
        doc.font('Helvetica-Bold').text(`Parada ${index + 1}: ${destino.direccionDestino} (Proyecto Vivienda: ${destino.codigoVivienda})`);
        doc.moveDown(0.5);
    });
    doc.moveDown(1.5);

    // =========================================================================
    // BLOQUE 3: TABLA DETALLADA DE PASAJEROS (VOLUNTARIOS)
    // =========================================================================
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0275d8').text('3. LISTADO OFICIAL DE PASAJEROS');
    doc.moveDown(0.5);

    // Dibujar Encabezado de la Tabla
    const tableTop = doc.y;
    doc.fontSize(9).font('Helvetica-Bold');
    
    // Rectángulo de fondo para el encabezado de la tabla
    doc.rect(50, tableTop, 512, 18).fill('#0275d8');
    
    // Resetear color a blanco para el texto de la cabecera
    doc.fillColor('#ffffff');
    
    // Textos de la cabecera (X, Y) utilizando coordenadas fijas para simular columnas
    doc.text('RUT', 55, tableTop + 5);
    doc.text('Nombre Completo', 130, tableTop + 5);
    doc.text('Contacto Emergencia', 270, tableTop + 5);
    doc.text('Cuadrilla', 390, tableTop + 5);

    // Dibujar las filas de los voluntar3ios
    let currentY = tableTop + 18;
    doc.font('Helvetica').fillColor('#333333');

    voluntarios.forEach((voluntario, index) => {
        // Control de salto de página automático si la tabla es muy larga
        if (currentY > 700) {
            doc.addPage();
            currentY = 50; // Reiniciar arriba en la nueva página
        }

        // Alternar color de fondo para filas pares/impares (Opcional, da mucha elegancia)
        if (index % 2 === 0) {
            doc.rect(50, currentY, 512, 16).fill('#f9f9f9');
            doc.fillColor('#333333');
        }

        doc.text(voluntario.rut, 55, currentY + 4);
        doc.text(voluntario.nombreCompleto, 130, currentY + 4);
        doc.text(voluntario.telefonoEmergencia, 270, currentY + 4);
        doc.text(voluntario.cuadrilla, 390, currentY + 4);

        currentY += 16;
    });

    // =========================================================================
    // PIE DE PÁGINA Y FIRMA DE VALIDACIÓN
    // =========================================================================
    doc.moveDown(4);
    
    const firmaY = doc.y > 650 ? (doc.addPage(), 100) : doc.y + 30;
    
    doc.moveTo(206, firmaY).lineTo(406, firmaY).stroke('#999999');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#333333')
       .text('Firma y Timbre Encargado de Central', 50, firmaY + 5, { align: 'center' });
    doc.fontSize(8).font('Helvetica-Oblique').fillColor('#777777')
       .text('Documento emitido electrónicamente como reporte oficial de despacho.', 50, firmaY + 18, { align: 'center' });

    // Finalizar el documento de forma obligatoria
    doc.end();
};

module.exports = {crearPdfManifiestoCarga};
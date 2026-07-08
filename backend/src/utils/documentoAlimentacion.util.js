import PDFDocument from 'pdfkit';

/**
 * Genera el Pedido Oficial de Insumos de Alimentación en formato PDF y lo escribe directamente en el flujo de respuesta (res)
 * @param {Object} data - El objeto retornado por tu función generarDocumentoProvisionAlimentos
 * @param {Object} res - El objeto 'res' de Express para enviar el archivo al navegador
 */
export const crearPdfProvisionAlimentacion = (data, res) => {
    // 1. Crear el documento PDF (Tamaño Carta, márgenes de 50 puntos / 1 pulgada)
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });

    const { detalleZona, calculoLogistico, respaldoGasto } = data;

    // Configurar los encabezados de respuesta de Express para que el navegador entienda que es un PDF descargable
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Pedido_Alimentos_${detalleZona.codigoVivienda}_${Date.now()}.pdf`);

    // Tubería (Pipe): Todo lo que dibuje el doc se enviará directamente al cliente de Express
    doc.pipe(res);

    // =========================================================================
    // ENCABEZADO INSTITUCIONAL
    // =========================================================================
    doc.fontSize(10).font('Helvetica-Bold').text('TECHO PARA CHILE', { align: 'left' });
    doc.fontSize(8).font('Helvetica').text('Central de Planificación Logística y Despliegue', { align: 'left' });
    doc.moveDown(1);

    // Línea divisoria decorativa superior (Color naranja para diferenciarlo del transporte azul)
    doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke('#e67e22'); 
    doc.moveDown(1.5);

    // Título Principal
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#111111').text('ORDEN DE PROVISIÓN DE INSUMOS DE ALIMENTACIÓN', { align: 'center' });
    doc.fontSize(10).font('Helvetica-Oblique').fillColor('#555555').text('Documento Oficial de Solicitud de Raciones para Proveedores de Terreno', { align: 'center' });
    doc.moveDown(2);

    // =========================================================================
    // BLOQUE 1: INFORMACIÓN DE LA ZONA DE CONSTRUCCIÓN
    // =========================================================================
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#e67e22').text('1. INFORMACIÓN DE LA ZONA DE CONSTRUCCIÓN');
    doc.moveDown(0.5);
    
    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text(`Código de Proyecto / Vivienda: `, { continued: true }).font('Helvetica-Bold').text(detalleZona.codigoVivienda);
    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text(`Dirección del Despliegue: `, {continued: true}).font('Helvetica-Bold').text(detalleZona.descripcion);
    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text(`Días de Estancia Planificados: `, {continued: true}).font('Helvetica-Bold').text(`${detalleZona.diasEstancia} Días.`);

    doc.moveDown(2);

    // =========================================================================
    // BLOQUE 2: CÁLCULO LOGÍSTICO (TABLA DE CUANTIFICACIÓN)
    // =========================================================================
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#e67e22').text('2. CUANTIFICACIÓN DE RACIONES REQUERIDAS');
    doc.moveDown(0.5);

    // Dibujar Encabezado de la Tabla
    const tableTop = doc.y;
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
    
    // Rectángulo de fondo para el encabezado de la tabla (Color naranja)
    doc.rect(50, tableTop, 512, 18).fill('#e67e22');
    
    // Textos de la cabecera emulando columnas fijas
    doc.text('Concepto / Factor Logístico', 65, tableTop + 5);
    doc.text('Multiplicador Base', 320, tableTop + 5, { width: 100, align: 'center' });
    doc.text('Subtotal Calculado', 450, tableTop + 5, { width: 100, align: 'right' });

    // Dibujar las filas fijas de cálculo
    let currentY = tableTop + 18;
    doc.fontSize(10).fillColor('#333333');

    // Fila 1: Voluntarios Activos
    doc.rect(50, currentY, 512, 18).fill('#f9f9f9');
    doc.fillColor('#333333').font('Helvetica').text('Voluntarios Activos en Terreno', 65, currentY + 5);
    doc.text('-', 320, currentY + 5, { width: 100, align: 'center' });
    doc.font('Helvetica-Bold').text(`${calculoLogistico.voluntariosActivos} Personas`, 450, currentY + 5, { width: 100, align: 'right' });
    currentY += 18;

    // Fila 2: Días de Estancia
    doc.font('Helvetica').text('Días Totales de Cobertura', 65, currentY + 5);
    doc.text('-', 320, currentY + 5, { width: 100, align: 'center' });
    doc.font('Helvetica-Bold').text(`${detalleZona.diasEstancia} Días`, 450, currentY + 5, { width: 100, align: 'right' });
    currentY += 18;

    // Fila 3: Raciones diarias por persona
    doc.rect(50, currentY, 512, 18).fill('#f9f9f9');
    doc.fillColor('#333333').font('Helvetica').text('Raciones por Persona al Día (Desayuno, Almuerzo, Cena)', 65, currentY + 5);
    doc.text(`x ${calculoLogistico.racionesPorPersonaAlDia}`, 320, currentY + 5, { width: 100, align: 'center' });
    doc.font('Helvetica-Bold').text(`${calculoLogistico.racionesPorPersonaAlDia} Porciones`, 450, currentY + 5, { width: 100, align: 'right' });
    currentY += 18;

    // Fila Destacada: Total General
    doc.rect(50, currentY, 512, 22).fill('#f3f3f3');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#e67e22').text('TOTAL PORCIONES DETERMINADAS', 65, currentY + 6);
    doc.text(`${calculoLogistico.totalRacionesDeterminadas} Raciones`, 450, currentY + 6, { width: 100, align: 'right' });
    
    doc.moveDown(3);

    // =========================================================================
    // BLOQUE 3: RESPALDO Y GESTIÓN DE GASTOS
    // =========================================================================
    const boxY = doc.y;
    doc.rect(50, boxY + 20, 512, 70).fill('#f5f5f5');

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#e67e22')
       .text('3. RESPALDO Y AUTORIZACIÓN DE GASTO', 55, boxY - 15);

    doc.fontSize(10).font('Helvetica').fillColor('#333333')
       .text(`Solicitud Gestionada por el RUT Encargado: `, 55, boxY, { continued: true })
       .font('Helvetica-Bold')
       .text(respaldoGasto.rutEncargado || respaldoGasto.gestionadoPorRut);

    doc.fontSize(9).font('Helvetica-Oblique').fillColor('#555555')
       .text(respaldoGasto.mensaje, 55, boxY + 45, { width: 502, align: 'justify' });

    doc.moveDown(5);

    // =========================================================================
    // PIE DE PÁGINA Y FIRMA DE VALIDACIÓN
    // =========================================================================
    doc.moveDown(4);
    
    const firmaY = doc.y > 650 ? (doc.addPage(), 100) : doc.y + 35;
    
    doc.moveTo(180, firmaY).lineTo(380, firmaY).stroke('#999999');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#333333')
       .text('Firma Autorizada - Finanzas Terreno', 50, firmaY + 5, { align: 'center' });
    doc.fontSize(8).font('Helvetica-Oblique').fillColor('#777777')
       .text(`Documento emitido electrónicamente como reporte oficial el ${data.fechaGeneracion.toLocaleDateString()}.`, 50, firmaY + 18, { align: 'center' });

    // Finalizar el documento de forma obligatoria
   doc.end();
};
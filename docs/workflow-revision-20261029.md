# Panel interno de órdenes — revisión 29 octubre 2026

Solicitud: implementar y mostrar para revisión antes de producción. No publicar.

Página: web/produccion.html, enlazada desde la navegación existente; incluida en scripts/build.mjs.

Ocho estados: validación, especialidad, construcción, pruebas, calidad final, despliegue, entrega, cierre. Dos transiciones destacadas: construcción→pruebas y despliegue→entrega. Un fallo devuelve a construcción y exige repetir pruebas y calidad. Entrega requiere una URL HTTPS sin credenciales/parámetros/tokens y referencia del paquete. Las aprobaciones requieren controles marcados y evidencia manual.

El panel es una implementación de revisión del flujo, con persistencia local y expediente JSON. No certifica capacidades ni ejecuta fabricación/despliegue/envío. Consulta solo lectura al endpoint CRM existente, sin traspasos entre proyectos ni nuevas integraciones.

Pendiente para operación real: modelo persistente de órdenes de fabricación, recibos firmados/versionados de ejecución de pruebas, adaptadores de fabricación y despliegue, autorización de entrega, registro de recepción y pruebas de integración. El estado comercial del CRM no se interpreta como certificación de producción.

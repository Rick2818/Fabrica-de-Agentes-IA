# Punto 4 — Puertas de certificación (30 octubre 2026)

Estado: **cerrado provisionalmente, NO certificado**. Fuente principal: `agent_status` del complemento de Fábrica y proyecto Supabase `udispwzwrebjkanudcoy`. Este documento no habilita facturación, correo, producción nueva ni clientes reales.

## Correcciones y pruebas exigidas

1. **Disponibilidad Gemini.** Las últimas sondas guardadas devolvieron HTTP 404 para `gemini-2.5-flash` y `gemini-2.5-flash-lite`; únicamente el tercer modelo configurado devolvió HTTP 200. Bloquear el rótulo “tres modelos operativos”. Verificar lista real de modelos para la clave del servidor, ruta, versión de API y modelo permitido; corregir identificadores solo con evidencia. Nunca publicar secretos. Reprobar los tres con peticiones baratas y recibo individual, respetando cuota.
2. **Reintentos.** Inyectar HTTP 503/timeout en entorno aislado y comprobar mismo job_id, lease vencido, número de intentos y un solo resultado final. El éxito previo de una práctica al segundo intento no sustituye la prueba de apagado/reanudación.
3. **Dos clientes.** Crear dos identidades sintéticas aisladas, trabajos con distintos propietarios y solicitudes concurrentes. Consultar bajo cada identidad: ninguna puede leer o modificar trabajo, notas, recibos o membresía del otro. Ejecutar dos workers simultáneos y verificar un solo procesamiento por job. Antes de permitir clientes reales revisar RLS y controles de acceso del Site.
4. **Continuidad.** La fuente operativa es Supabase Cron `supabase:udispwzwrebjkanudcoy:fabrica-queue` (ciclos recientes `idle`, pendiente 0). El workflow `.github/workflows/agent-runner.yml` actualmente tiene exclusivamente `workflow_dispatch` y **no** ejecuta cada 15 minutos. No activar el horario GitHub mientras el Cron primario esté activo sin un mecanismo de exclusión, y nunca inferir recuperación del respaldo desde un ciclo vacío. Crear trabajo sintético fechado, suspender transitoriamente un ejecutor en ensayo aislado y probar la recuperación y recibos correlacionados del respaldo.
5. **Cliente real.** No hay aprobación ni pedido real verificable. El pedido sintético #4 estaba `draft`; faltaban recibos `order.confirmed` y `agent.ready`. Conservar la certificación definitiva bloqueada hasta contar con autorización real y trazas de aislamiento, fabricación y entrega.

## Criterio de cierre

Adjuntar por cada puerta: identificador de prueba, ambiente, fecha, resultado, identidad/tenant sintético, recibo persistido, logs depurados, versión y confirmación de que no hubo llamadas de pago ni datos reales. Los ensayos y comprobaciones unitarias **no** equivalen a certificación de producción.

## Alcance de esta revisión

Documento de control y criterios de prueba. No modifica Site, cron, secretos ni proveedores. No afirma que los cinco fallos estén reparados.

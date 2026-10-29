# Punto 6 — Plan de certificación y publicación
Fecha: 29-10-2026 · America/El_Salvador.
Alcance confirmado por Ricardo: **Certificación y publicación**.
Estado de esta entrega: **PREPARADO; NO EJECUTADO NI CERTIFICADO**.

## Condiciones de partida
- Punto 4: cerrado provisionalmente SIN certificación por decisión de Ricardo. Conservar evidencias y mantenimiento; este plan no lo reabre ni cambia su estado.
- Punto 5: abierto. Pedido sintético #4, UUID `406e7392-69a2-4107-8cba-2ad938ff3c7f`, permanece en borrador. El segundo ensayo produjo una respuesta HTTP 200, no recibos de aprobación o fabricación.
- Diseño visual: en pausa. No condiciona ni sustituye la certificación funcional.
- Site original: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. Versión 54 guardada sin desplegar; no publicar simplemente por existir el archivo.
- PR #9: borrador abierto, no fusionado; head `fa89437be85a2da6b4f4bdd3465fde63823c2442`. Check `verify` completado con success, contrastado durante esta preparación.
- Tres bugs corregidos en esa propuesta: validación de pedidos incompletos, límite de reparaciones y transacción pedido/recibo. La corrección está en código probado; todavía no desplegada en el backend.
- Datos sintéticos permitidos; resultados y recibos deben proceder de ejecuciones auténticas. No hace falta esperar una venta para ejecutar estas pruebas técnicas.

## Matriz de aceptación

| Gate | Ejecución requerida | Evidencia mínima para aprobar | Estado actual |
|---|---|---|---|
| G1. Pedido y aceptación | Recuperar el pedido #4 y aprobarlo mediante una operación autorizada, sin cambiarlo por SQL | Mismo UUID, actor autorizado, fecha, versión aceptada y recibo persistido de aprobación | Bloqueado: transición no implementada |
| G2. Fabricación | Consumir la aceptación desde la cola y crear una instancia ejecutable del agente solicitado | Recibo vinculado a pedido, cliente, agente, plantilla/revisión e inicio/fin; ejecutar una acción real de esa instancia | Bloqueado: provisionador y consumidor faltantes |
| G3. Capacidades | Verificar especificaciones del pedido y capacidades comunes acordadas para cada especialidad | Matriz por Leo/Ventas, Mila/Servicio, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística y Lía/Mercadeo; entrada, resultado esperado, resultado observado y recibos | Parcial: ejercicios previos; no paridad integral |
| G4. Reparación y recuperación | Provocar un fallo controlado; corregir y reanudar la misma orden | Versiones anterior/nueva, diagnóstico, repetición de pruebas, reintentos limitados y ausencia de duplicados | Probado localmente con adaptadores simulados; integración pendiente |
| G5. Privacidad y control | Probar cliente A y B, acceso sin sesión, pausa, cancelación y revocación | A no obtiene datos de B; rechazo 401/403/404 según contrato; sin escrituras después de cancelar | Pendiente en cabina integrada |
| G6. Cabina | Activar una cabina exclusiva y ejecutar la tarea del agente desde esa sesión | Recibo de activación; usuario/cliente correcto; ejecución persistida y recuperación tras cerrar/reabrir la interfaz | Bloqueado: activación y cabina faltantes |
| G7. Entrega | Enviar comprobante mediante transporte autorizado a un buzón de prueba controlado | ID del proveedor, vínculo al mismo pedido, aceptación separada de entrega/rebote; enlace seguro; reintento sin duplicación | Bloqueado: proveedor de entrega sin conectar |
| G8. Publicación | Construir y desplegar exactamente la revisión aprobada, preservando audiencia y datos | SHA, checks, versión, ID/estado del despliegue, URL y comprobación posterior | Preparación disponible; despliegue pendiente |
| G9. Reversión | Verificar en entorno aislado que se puede recuperar la versión anterior sin perder la trazabilidad | Versión anterior identificada, procedimiento ejecutado, resultados y lectura posterior de datos | Procedimiento documentado; prueba pendiente |

## Orden de ejecución
1. Terminar el punto 5 con el mismo pedido #4: aceptación verificable → fabricación → prueba → activación → comprobante.
2. Ejecutar G3–G7 con fixtures de cliente aislados; incluir 403/503, reintento, concurrencia, reparación, cancelación e interrupción.
3. Reconciliar cada recibo con la fuente que ejecutó la acción. Un texto generado, un HTTP 200 aislado o el estado done de una tarea no aprueban otro gate.
4. Correr regresiones sobre el SHA candidato; construir y validar su artefacto. Separar resultados simulados, integrados y desplegados.
5. Emitir dictamen técnico con capacidades aprobadas, parciales y bloqueadas. Una capacidad obligatoria sin evidencia impide declarar el alcance completo aprobado.
6. Publicar en el Site original únicamente cuando se cumplan los gates del alcance aprobado. Mantener los accesos vigentes y no activar gastos ni servicios sin autorización.
7. Comprobar tras publicación el mismo recorrido y conservar la reversión. No fusionar ni desplegar automáticamente el PR #9 por el solo check verde.

## Formato de recibos
Cada evento debe contener como mínimo: `event_id`, `event_type`, `occurred_at`, `order_id`, `customer_id`, `actor_id`, `status`, `source`, `version/commit` y referencia de evidencia. Cuando corresponda, añadir `agent_id`, revisión, ID de ejecución, clave de idempotencia o ID del proveedor. No incluir contraseñas, tokens ni claves.

Distinguir expresamente:
- Solicitud recibida.
- Aceptación del cliente persistida.
- Fabricación iniciada y completada.
- Pruebas realizadas y su alcance.
- Activación de la cabina.
- Aceptación del correo por proveedor.
- Entrega o rebote cuando se reciba esa confirmación.

## Entregable final del punto 6
Matriz de aceptación con evidencia; recibos correlacionados de una misma orden; límites de las seis especialidades; SHA y resultados de CI; URL/versión efectivamente desplegada; instrucciones de operación y reversión. Si los gates siguen abiertos, el dictamen será **NO APROBADO PARA EL ALCANCE COMPLETO**, sin convertir el cierre provisional del punto 4 en certificación.

Referencias:
- `docs/ops/punto5-synthetic-e2e-20261029-1124-sv.md`
- `evidence/punto5-receipt-request-live-20261029.json`
- Issue #4: criterios funcionales vigentes; no confundir su número con el punto 4 de esta lista.
- PR #9: implementación propuesta y regresiones; diseño pausado y backend sin desplegar.

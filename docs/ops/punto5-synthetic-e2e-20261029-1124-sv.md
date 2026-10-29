# Punto 5 — prueba con cliente sintético — 29-10-2026

## Dictamen

**Recorrido completo NO aprobado.** La prueba HTTP/UI real del Site original acredita registro y recuperación del pedido; se detiene antes de aprobación y fabricación. No se sustituyen los pasos faltantes con mocks, SQL manual o textos de un agente.

## Prueba realizada

- Sitio original: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, página `/leo-crm.html`.
- Sesión: cuenta operadora existente autenticada. Los datos del cliente son sintéticos; NO se verificó una sesión exclusiva de cliente.
- Marcador: `P5-20261029-1124`.
- Cliente: `CLIENTE SINTÉTICO · P5-20261029-1124`.
- Correo reservado de prueba: `qa-punto5-20261029@example.invalid`; no es un buzón real y no se envió correo.
- Solicitud: agente Mila para clasificar un incidente sintético. La inclusión de una aceptación sintética en el texto no equivale a una transición de aprobación.
- Importe: USD 0.00; ninguna venta ni cobro.
- Registro mediante el formulario, no mediante inserción SQL: **pedido #4**, UUID `406e7392-69a2-4107-8cba-2ad938ff3c7f`.
- Creación persistida: `2026-10-29T17:23:58.158907Z` (11:23:58 El Salvador).
- Después de recargar, consulta por número 4: mismo cliente, importe y estado **draft/Borrador**.
- Consulta SQL independiente a las 17:24:36 UTC: un pedido coincidente y una actividad asociada; `order_triggers=[]` en `public.crm_orders`.
- Inventario D1 del Site desplegado: `agent_cycles`, `jobs`, `messages`, `notes`, `notifications`, `objective_updates`, `objectives`, `runner_lock`, `settings`, `usage`; sin omisiones en la respuesta. No están desplegadas las tablas `factory_orders`, `factory_events` ni `factory_memberships` de la versión 54 guardada.

## Resultado por tramo

| Tramo | Estado | Evidencia/límite |
|---|---|---|
| Acceso del operador al CRM | Aprobado | UI conectado; no equivale a acceso de cliente aislado |
| Captura de solicitud sintética | Aprobado | Pedido #4 guardado mediante formulario |
| Persistencia y consulta tras recarga | Aprobado | Mismo número y cliente recuperados; una fila coincidente |
| Solicitud conversacional de Leo → orden | No acreditado | Se usó el formulario existente; la cola de texto no tiene herramienta CRM conectada |
| Aprobación verificable → cola de fabricación | Bloqueado: no implementado en el desplegado | El formulario solo crea borradores; adaptador/Edge Function expone status/list/get_order/create_order; no hay acción approve/confirm ni disparador de fabricación |
| Fabricar, probar y reparar agente del pedido #4 | No ejecutado | No se generó un agente ejecutable del pedido |
| Cabina exclusiva y sesión del cliente | No ejecutado | Falta provisionador y activación reales |
| Comprobante al buzón de pruebas | No ejecutado | No hay proveedor de entrega configurado; dirección .invalid no recibe mensajes |
| Aislamiento multicliente, reinicio y reintento E2E | No acreditado por esta prueba | Las suites locales existentes no sustituyen este recorrido |

## Causa y siguiente corrección

El CRM existente conserva pedidos en borrador. La implementación guardada en v54 tiene un orquestador independiente con adaptadores de prueba, pero no está desplegada ni conectada al CRM/ejecutor. Para aprobar el punto 5 hacen falta una transición autenticada e idempotente de aceptación con recibo y outbox, consumidor persistente de esa misma orden, provisionador ejecutable aislado, evaluador real de capacidades, cabina privada y transporte de correo de pruebas. Probarlos en entorno aislado antes de activar el flujo en el Site original. No cambiar un estado por SQL para aparentar la integración.

El fixture #4 queda identificado y conservado en borrador para repetir la prueba con el mismo UUID cuando exista el circuito. No se borraron ni alteraron pedidos anteriores, cuotas, cron, identidades, secretos ni datos de clientes reales. El diseño visual permanece pausado.

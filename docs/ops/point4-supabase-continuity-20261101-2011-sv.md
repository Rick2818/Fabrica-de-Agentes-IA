# Fábrica de Agentes IA — Punto 4 · auditoría de continuidad
**Corte:** 2026-11-01 20:11:37 America/El_Salvador (2026-11-02 02:11:37 UTC; hora de PostgreSQL).
**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. La falta de cliente real no reabre el cierre administrativo.

## Alcance y fuentes efectivamente consultadas
- Supabase `udispwzwrebjkanudcoy`: consultas SQL **solo lectura** a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `pg_indexes`, `pg_proc`; logs de Supabase en ventana 2026-11-02 01:10–02:11 UTC.
- Complemento conectado de Fábrica de Agentes IA: `agent_status` (tablero, trabajos, modelos, uso, ciclos, recibos y salud). Esta consulta **no equivale** a cotejo nativo de la versión desplegada en Sites.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y los **siete** archivos actuales de `.github/workflows` en `main`.
- Automations: comprobación de que el respaldo horario `6adbf94d28e8819189c0516c6068457a` está habilitado; último intento observado con estado `no_update`, sin atribuirle procesamiento de trabajos.
- Fuente nativa de Sites v53: commit `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas de servidor aprobadas son **antecedentes aportados**, no repetidos ni revalidados en esta ejecución. Versión 54 guardada sin despliegue según estado rector; su estado de despliegue **no fue comprobado nativamente en este control**.

## Hechos observados al corte
| Indicador | Valor | Interpretación |
|---|---:|---|
| `cron.job` fabrica-queue | jobid=1; `active=true`; `* * * * *` | Programación SQL habilitada; no prueba por sí sola trabajo `done` |
| `cron.job_run_details` `succeeded` | 6,174 | +59 desde control de las 19:12; indica finalización de SQL, no entrega |
| `private.fabrica_scheduler_receipts` | 5,431 | +59 desde control anterior |
| Recibos `verified=true` | 5,425 | +59; 6 no verificados en total, de los cuales cinco son errores históricos |
| `network_error` históricos | 5 | Sin incremento en la ventana consultada; causa original no demostrada |
| Últimos 90 minutos de recibos conciliados | 90 `idle`, `verified=true`, sin `error_code` | Actividad real del programador, sin procesamiento funcional nuevo |
| Site: trabajos | 60 `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes | Estados reportados por `agent_status`, no aceptación de cliente |
| Cuota | 0/20 | Lectura del tablero, no alterada |
| Configuración SQL | `enabled=true`, `not_before=NULL`, `last_error=NULL` | Sin pausa ni diferimiento en el registro consultado |
| Respaldo ChatGPT | habilitado; último registro `no_update` | No acredita ejecución del principal |
| GitHub Actions | siete workflows inspeccionados, cero eventos `schedule` | Runner de GitHub manual; otros workflows tienen `push`/`pull_request` |

### Conciliación de ciclos
- `4feab7cd-6c2e-46e2-abee-ae5a2e137c30`: recibo SQL `verified=true`, HTTP 200, `site_status=idle`, sin `error_code`. El mismo UUID figura como último ciclo anterior en el tablero durante la consulta.
- `ce550015-10b0-4da8-a2f7-7df2c071bc42`: aparece como ciclo `idle` del Site a las 02:11 UTC; al corte SQL todavía figuraba sin `checked_at`, `verified=false` y sin `site_status`. **No se aprueba por anticipado**. La conciliación suele completar en el siguiente minuto, pero debe comprobarse en un control posterior.
- No se hallaron UUID `cycle_id` duplicados ni `request_id` duplicados. Existen índices únicos para ambas columnas.
- Los cinco recibos no verificados con antigüedad mayor de tres minutos corresponden a `network_error` históricos (2026-10-30 y 2026-10-31), no a fallos nuevos de esta ventana.
- La definición SQL de `fabrica_scheduler_tick` contiene `pg_try_advisory...` y comprobación `not_before`; `fabrica_scheduler_reconcile` referencia `verified`, `site_status`, `error_code`, `not_before`. Esta inspección estática no sustituye pruebas dinámicas de locks, reintentos o idempotencia.

### Logs y modelos
- Logs: 146 entradas `postgres_logs` y tres `pgbouncer_logs` en la ventana de 61 minutos; búsqueda textual de `error`, `failed` o `timeout` en `event_message` sin coincidencias. No equivale a una auditoría completa de todas las rutas de ejecución.
- Las últimas verificaciones sintéticas de modelos conservadas en el tablero muestran HTTP 404 para `gemini-2.5-flash` (primario) y `gemini-2.5-flash-lite` (respaldo); la tercera ruta `gemini-3.5-flash-lite` respondió HTTP 200. **No se realizó un nuevo probe**, por lo que no se declara corregida la recuperación de modelos.
- Las seis prácticas sintéticas de agentes permanecen como antecedente; no se repitieron en esta ejecución. No prueban entrega ni aceptación real.
- `AGENTS.md` asigna Alma a Química y Farmacia y Lía a Mercadeo; un resultado histórico del Site mostraba otras especialidades. Se mantiene la discrepancia documental **sin cambiar identidades ni recibos**.

## Pendientes y condiciones de validación
1. Acceso nativo de Sites al proyecto `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: cotejar versión efectivamente desplegada, origen v53 y URL activa, sin activar v54.
2. Pruebas dinámicas **aisladas** de concurrencia, locks, recuperación de lease, pausa, reintentos, idempotencia y respeto de `not_before`; no correr `tick` manual ni alterar cuota/fechas.
3. Revalidación segura del fallback de modelos y resolución comprobada de los dos HTTP 404 históricos; no cambiar proveedor ni activar costos sin autorización.
4. Recibos E2E persistidos de orden, aprobación, fabricación, aprovisionamiento, entrega y reconciliación idempotente; distinguir simulación de cliente real.
5. Aceptación final por cliente real cuando exista. **No declarar certificación automática**.
6. Conciliar las especialidades Alma/Lía con la fuente Site activa y el documento `AGENTS.md` sin reasignar nombres por deducción.

## Cambios
Solo se crea este documento de auditoría. **No** se modificaron Site, código de runtime, producción, versiones, cuota, fechas, cola, ejecutores, disparadores, modelos, clientes ni trabajos. No se creó un segundo ejecutor ni se contactó a terceros. No se detectó una regresión operativa nueva que justifique intervención inmediata.

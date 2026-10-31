# Punto 4 — Auditoría de continuidad (2026-10-31 17:08 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura. No constituye aceptación del cliente, certificación ni prueba E2E de fabricación y entrega.

## Identidad y alcance
- Proyecto: Fábrica de Agentes IA; Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`.
- Repositorio: `Rick2818/Fabrica-de-Agentes-IA`; Supabase `udispwzwrebjkanudcoy`.
- Principal: `supabase:udispwzwrebjkanudcoy:fabrica-queue`, cron.jobid=1, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- Respaldo existente `Respaldo de pendientes Fábrica IA`: Automations.peek confirma `is_enabled=true`. No se ejecutó ni creó un respaldo adicional.

## Evidencia directa (consultas read-only; corte 2026-10-31T23:07:46Z)
- `cron.job_run_details`: 4,550 registros `succeeded` para jobid=1. En ventana de 65 minutos: 65 `succeeded`. Éxito SQL no demuestra procesamiento de trabajo.
- `private.fabrica_scheduler_receipts`: 3,807 recibos, 3,801 `verified=true`, cinco errores históricos `network_error`, nueve `verified=true AND site_status='done'` históricos, sin nuevos `done` en la ventana de 65 minutos.
- Último UUID completamente conciliado al seguimiento: `27eec78a-cb87-4b82-ae26-e1215bd44bfd`, programado 23:06Z, HTTP 200, `verified=true`, `site_status=idle`, sin error; el UUID siguiente `c3be036f-5c1e-400e-8af1-da017a216153` aparece en Site como `idle` y seguía sin conciliación SQL al consultar, dentro del margen normal de un minuto. Ninguno constituye entrega.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Cero conciliaciones sin error con antigüedad superior a cinco minutos.
- Unicidad: índices únicos sobre `cycle_id` y `request_id`; cero duplicados observados. Inspección estática de `fabrica_scheduler_tick` detecta `pg_try_advisory` y `not_before`; `fabrica_scheduler_reconcile` contiene `not_before`, `request_id`, `verified`. No se han demostrado aún pruebas dinámicas de contención y recuperación.
- Los cinco errores históricos `network_error` no aumentaron. Los registros anteriores en `net._http_response` ya no están disponibles al consultar, por lo que esta pasada no demuestra su causa raíz.
- Estado del Site desde el conector de Fábrica: 65 trabajos (60 `done`, dos `failed`, tres `cancelled`), cero pendientes, cero leases activos y cero reintentos vencidos; cuota 0/20; `health.supabase_runner` reciente con `source=supabase-cron`, `status=idle`, UUID de ciclo `c3be036f-5c1e-400e-8af1-da017a216153`.
- Seis trabajos sintéticos `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` permanecen `done` con evidencia de ejecución textual. No acreditan fabricación ni entrega E2E, ni aceptación de cliente.
- Modelos declarados en el Site: primario `gemini-2.5-flash`, respaldo `gemini-2.5-flash-lite`, tercero `gemini-3.5-flash-lite`. El historial de `health.model_checks` registra HTTP 404 en los dos primeros y HTTP 200 en el tercero. No se repitieron pruebas de modelos ni se cambió configuración.
- Se leyeron los siete workflows actuales de `.github/workflows` y ninguno contiene evento `schedule`; `agent-runner.yml` usa `workflow_dispatch`. Los workflows de regresión conservan disparadores de push/PR/manual donde corresponden.
- `AGENTS.md` vigente conserva límites de proyectos, de autonomía y de publicación, y asigna Leo/Ventas, Mila/Servicio, Vera/Finanzas, Alma/Química-Farmacia, Nico/Logística y Lía/Mercadeo. La discrepancia con etiquetas históricas de ejercicios no se corrigió sin cotejo con fuente desplegada.

## Fuente Site y límites
El usuario identifica como recuperada la fuente nativa Site v53 con SHA `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas de servidor previamente aprobadas. No se repitieron esas pruebas ni se pudo confirmar en esta pasada el código exacto desplegado mediante una interfaz nativa de Sites. El intento de resolver ese SHA en la API de commits de GitHub devolvió 422; esto **no** implica que la fuente nativa de Sites no exista. No se tocó v54 guardada ni se hizo despliegue.

## Pendiente para validación final
1. Cotejo nativo entre Site v53 y artefacto realmente publicado, sin sustituir código por copias antiguas.
2. Pruebas aisladas reproducibles de concurrencia, idempotencia, recuperación, pausa, `not_before`, reintentos y fallback, sin disparar ticks reales ni alterar cuota.
3. Investigación causal de los cinco errores históricos de transporte con logs conservados, si existen.
4. Recibos independientes de aprobación, fabricación, aislamiento por cliente y entrega E2E de los seis agentes; distinguir sintético de aceptación real.
5. Consentimiento y validación final con un cliente real cuando exista.

**Cambios operativos:** ninguno. No se crearon cron, tareas, triggers, clientes, mensajes, pagos, correos, despliegues ni cambios de cuota. Principal y respaldo conservados. No hay regresión nueva demostrada en esta revisión.

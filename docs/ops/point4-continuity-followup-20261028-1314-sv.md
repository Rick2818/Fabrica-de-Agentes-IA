# Fábrica de Agentes IA — Punto 4: auditoría de continuidad, 2026-10-28 13:14 SV

## Alcance y controles
Auditoría de solo lectura del Site referenciado, repositorio `Rick2818/Fabrica-de-Agentes-IA`, GitHub Actions y estado persistente del complemento. Se leyó `AGENTS.md`. El Site original es `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; **no se dispuso de acceso a su fuente vigente ni de un navegador conectado para una prueba E2E**, por lo que no se modificó ni publicó el Site. No se alteraron secretos, ejecutores, cola, tareas, crons, permisos ni datos de terceros.

## Estado GitHub, evidencia directa
- `main` observado en `de3bd131457cf609141c922bbce2b668f90dbba6`; mensaje: `fix: prevent unsupported support-action claims and document Mila diagnosis`.
- `.github/workflows/agent-runner.yml`: `schedule` con cron `13,28,35,43,58 * * * *`; `workflow_dispatch`; `if` condicionado por `vars.AGENT_RUNNER_ENABLED == 'true'`, repository_id `1432658222` y rama `main`. `concurrency` grupo `fabrica-de-agentes-ia`, `cancel-in-progress: false`. El job incluye prueba local y procesamiento autenticado de la cola. La presencia de cron no garantiza entrega de eventos.
- Último ciclo `event=schedule` **del ejecutor principal** en la lista consultada: [40720371906](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40720371906), 2026-10-28 15:52:36Z (09:52:36 SV), `failure`; job `122929310642` registra `Ejecución detenida: error`, recibo `status=error,pending=6`, salida 1. Ejecutó SHA `cd2344e2...`, anterior a la corrección.
- Prueba de regresión del código corregido: [40728580107](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40728580107), 16:42:18Z (10:42:18 SV), `event=push`, `success`. **No** es evidencia de una ejecución automática real del código corregido.
- Evento automático posterior: [40749156497](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40749156497), 18:52:32Z (12:52:32 SV), `Diagnostic A - scheduler minimo`, `event=schedule`, `success`. Verifica que al menos un diagnóstico sí recibió el evento; no prueba que el workflow principal haya procesado la cola.
- El último listado de 30 runs del repositorio no muestra `schedule` del workflow principal posterior a la corrección. Esto es una ausencia observada, no prueba de que el scheduler esté deshabilitado.
- `scripts/run-cloud-queue.mjs` valida origen, repository_id, SHA y recibos correlacionados; limita a 16 llamadas, 8 fases, 240 segundos, reintenta hasta dos veces `error` con pendientes y devuelve `deferred:true` si persiste. `scripts/test-cloud-runner.mjs` prueba casos simulados, no reemplaza una ejecución E2E. Riesgo de observabilidad a revisar: la rama CLI no asigna salida distinta de cero al resultado `deferred:true`, por lo que un workflow podría terminar verde aunque haya tareas pendientes; no se cambió código sin validar su contrato operativo.

## Cola y continuidad, evidencia del complemento
Consulta `agent_status` a las 19:14:25Z (13:14:25 SV), `server_time=1793214865885`.
- `health.autonomy.status=degraded`, `primary.recent=false`, `backup.recent=true`, `stalled=false`, `pending=1`. Último ciclo principal correlacionado: `cycle_id=40720371906-1`, `status=error`, `source=github-actions`.
- El respaldo existente, programación `6adbf94d28e8819189c0516c6068457a`, registró recibos `source=scheduled` del ciclo `c528c405-015c-8329-9372-59512b120738`: Vera `done` (`9befde0d-9747-449b-8e1d-e2210a16977b`) y Lía `done` (`44b711eb-a263-4a9d-9947-7581f2620af8`). No son recibos `github-actions`.
- Las seis pruebas sintéticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` están en `done`, con recibos HTTP 200 y contexto aislado. Se observa una advertencia de calidad en Mila, documentada y corregida en nota sin reescribir el recibo histórico. `done` acredita procesamiento de texto, no autonomía integral de los seis ni paridad Dots.
- La cuota del complemento estaba `20/20`; queda una tarea del objetivo de capacidades en `queued`. No se forzó ejecución manual ni se duplicó la cola.

## Criterios aún no satisfechos
1. Observar nuevos ciclos del workflow principal `event=schedule` ejecutados con el SHA corregido, cotejando logs y recibos `source=github-actions`, incluyendo al menos un trabajo sintético no vacío, con resultado y sin duplicación.
2. Demostrar exclusión mutua entre respaldo y principal, idempotencia, recuperación de lease, pausa/cancelación, errores HTTP 503, reintento diferido y recibos coherentes con pruebas controladas y no solo mocks.
3. Inspeccionar la fuente vigente del Site original y comprobar E2E publicado, sin reemplazarla con la copia de GitHub.
4. Investigar la ausencia de ciclos principales nuevos sin añadir otro disparador ni modificar cron o secretos a ciegas.

**Resultado: PUNTO 4 NO CERTIFICADO.** El respaldo recuperó los seis trabajos sintéticos y ya no hay estancamiento marcado, pero la ejecución programada principal corregida y el E2E del Site siguen sin verificarse.

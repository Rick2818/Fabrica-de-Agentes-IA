# Fábrica IA · Punto 4 — seguimiento de continuidad (28-10-2026, 12:14 SV)

Auditoría de solo lectura del repositorio, GitHub Actions y estado persistente del complemento de la Fábrica. Única escritura operativa: actualización del recibo de comprobación del programador de respaldo con datos reales; sin ejecución adicional de cola, sin cambios de Site, workflow, credenciales ni disparadores.

## Fuente y control de cambios

- Repositorio: `Rick2818/Fabrica-de-Agentes-IA`, rama `main`; commit observado `ef39ad74e9326866d8e590974d647dbe350fa635` (2026-10-28 18:06:08Z).
- Leído `AGENTS.md`; exige conservar Site original y distinguir CI, ejecución manual y programación real. Site original: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. La fuente vigente del editor de Sites **no fue accesible** desde la conexión disponible; tampoco pudo inspeccionarse el navegador conectado (falta contexto de extensión). No se publicaron cambios.
- Workflow `.github/workflows/agent-runner.yml` vigente: `schedule: 13,28,35,43,58 * * * *`, guarda por variable `AGENT_RUNNER_ENABLED`, repo ID y `main`, `concurrency` con `cancel-in-progress:false`, timeout 5 min. Carga `scripts/run-cloud-queue.mjs` del SHA de cada ejecución. Su código actual limita a dos reintentos de error recuperable, valida contexto y recibos, y no da por completado un error.

## Evidencia real, no simulada

- Última ejecución observada del workflow principal con `event=schedule`: [40720371906](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40720371906), 15:52:36Z, **failure**; logs del job `122929310642`: `Ejecución detenida: error`, `{\"status\":\"error\",\"pending\":6,\"completed_at\":1793202789149}`. SHA `cd2344e2...`, anterior a la corrección de reintentos.
- [40728580107](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40728580107), 16:42:18Z, `event=push`, **success**: pruebas de runner, agente, build y artefacto. No es una ejecución schedule ni demuestra recuperación productiva.
- Último `event=schedule` de cualquier workflow consultado: [40726241803](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40726241803), diagnóstico B a 16:28:06Z. No se encontró un ciclo `schedule` del ejecutor principal posterior a la corrección en la consulta de 77 ejecuciones programadas; esto no prueba que GitHub jamás vuelva a programarlo.
- El respaldo ChatGPT **sí ejecutó** el ciclo programado `68726e7f-f02c-8326-99c3-0c35b7cbd99b`: programado 18:04:19Z, ejecutado 18:04:34–18:08:14Z, resultado registrado `completed`, sin acción del usuario requerida. `agent_status` lo correlaciona con tres recibos `source=scheduled` y `schedule_id=6adbf94d28e8819189c0516c6068457a`: auditoría funcional completada, prueba de Nico completada, Vera quedó en `waiting` por HTTP 503. El recibo real del programador se actualizó mediante `record_scheduler_check`.
- Pruebas sintéticas `done`: Leo, Mila, Alma, Nico. Pendientes: Lía `queued`, Vera `waiting` (HTTP 503). El objetivo de paridad tiene un siguiente paso en `queued`. Ninguna de esas cuatro pruebas completadas acredita por sí sola un ciclo `github-actions` del código corregido ni una prueba E2E en Site.
- `health.autonomy.status=degraded`, `primary.recent=false`, `backup.recent=true`, `stalled=true`. No se observó evidencia de recuperación del ejecutor principal después de la falla. El respaldo no se declara reemplazo del principal.

## Pendientes de certificación

1. Observar al menos un nuevo ciclo `schedule` del workflow principal en SHA corregido y correlacionar job/logs/recibo `github-actions` del Site; repetir hasta evidencia suficiente de continuidad, sin inferir cadencia garantizada de un cron configurado.
2. Probar en aislamiento exclusión mutua entre GitHub y respaldo, idempotencia por `cycle_id`, recuperación de lease, pausa/cancelación, reintento HTTP 503 y recibos sin duplicados. Los tests con HTTP simulado no sustituyen esto.
3. Inspeccionar la fuente publicada vigente del Site y ejecutar E2E allí antes de declarar punto 4 certificado.
4. No crear ejecutores ni disparadores adicionales, ni activar gastos, correos o contactos.

**Estado: PUNTO 4 NO CERTIFICADO.** Hay avance real del respaldo y persistencia de recibos, pero la ejecución automática GitHub corregida y el E2E del Site continúan sin demostración.

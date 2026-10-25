# Respaldo externo de GitHub Actions — Fábrica de Agentes IA

Estado: preparado, **NO activado**. Nunca afirmar que el cron externo funciona sin evidencia real.

## Proveedor elegido
cron-job.org (plan gratuito). Cadencia inicial: cada 15 minutos.
Vercel Hobby NO sirve para este intervalo (mínimo diario).

## Destino HTTP
POST https://api.github.com/repos/Rick2818/Fabrica-de-Agentes-IA/actions/workflows/agent-runner.yml/dispatches
Headers:
- Accept: application/vnd.github+json
- X-GitHub-Api-Version: 2022-11-28
- Authorization: Bearer <TOKEN_PRIVADO>
- Content-Type: application/json
Body JSON: {"ref":"main"}

El token fine-grained debe limitarse al repositorio Rick2818/Fabrica-de-Agentes-IA y contar solo con Actions: write. **Nunca guardar ni transmitir el token en Git, chat, URLs o documentación pública.** Colocarlo únicamente en la configuración privada de autenticación del programador externo, después de evaluar sus controles de seguridad. Rotar/revocar si se expuso.

## Certificación
1. Confirmar 204 No Content del API en historial de cron-job.org; 204 solo prueba aceptación, NO ejecución completa.
2. Consultar GitHub Actions: event=workflow_dispatch, workflow=agent-runner.yml, branch=main y run_id nuevos.
3. Verificar job success y recibo persistente que coincida con run_id, run_attempt y commit_sha.
4. Exigir tres ciclos independientes exitosos y un encargo real de prueba completado sin duplicación.
5. Deshabilitar pruebas diagnósticas temporales únicamente después de certificación; evaluar retirar cron nativo fallido para evitar doble origen de disparo, conservando idempotencia.
6. Nunca etiquetar estos eventos externos como event=schedule; son workflow_dispatch.

## Bloqueos externos
No hay credenciales ni cuenta cron-job.org disponibles por el conector de ChatGPT; el usuario debe conectar/configurar esos accesos a través de los controles privados del servicio. No se puede declarar activado sin esa operación.

## Referencias
https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event
https://cron-job.org/en/

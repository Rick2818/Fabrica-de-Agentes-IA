# Leo: activación del ejecutor comercial persistente

Cambio: `69905401ae1e64bbb427f02bc43496b4070232b9`.

## Contrato
- `POST /api/agents/leo/objectives`: `{id,title,request,due_at?}`, crea un objetivo persistente con identidad de Leo y criterios de evidencia, usa el programador/ejecutor ya existente.
- `GET /api/agents/leo/objectives?id=<identificador>`: estado real y versión del objetivo.
- `id` es una clave idempotente; el objetivo real tiene prefijo `leo-`.
- La ejecución de pasos usa Gemini y la cola central; el endpoint requiere el perfil productivo Leo/Ventas.
- Sin autorización para navegación, correo, envío comercial, pagos ni escrituras externas.

## Pruebas aún obligatorias en Site (NO certificadas por el commit)
1. Confirmar perfil Leo/Ventas configurado.
2. Crear un encargo sintético sin datos personales y obtener HTTP 202.
3. Verificar que el objetivo siga existiendo después de cerrar y volver a abrir la página.
4. Esperar ejecución de Gemini y verificar fases, resultado y evidencia sin acciones externas falsas.
5. Repetir ID idéntico (idempotencia), ID reutilizado con contenido distinto (HTTP 409).
6. Simular falla temporal/cupo: reintentos con límite y registro.
7. Confirmar disparador cron real; Github Actions, por sí solo, no publica el Site.
8. Probar seguridad de autorización y separación de cuentas antes de ofrecer a usuarios externos.

**No afirmar autonomía completa ni publicación live antes de los ocho recibos.**

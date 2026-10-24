# Ejecutor de Fábrica de Agentes IA

La versión canónica es [.github/workflows/agent-runner.yml](../.github/workflows/agent-runner.yml), en Rick2818/Fabrica-de-Agentes-IA (ID 1432658222). Esta copia se conserva sincronizada como referencia; no instalar otro disparador.

## Configuración

- Secretos de Actions: `SITE_SERVICE_BEARER` y `AGENT_RUNNER_SECRET`. La API key de Gemini permanece exclusivamente en Sites.
- Variable `AGENT_RUNNER_ENABLED=true` para permitir ejecutar el job. Mientras falte o sea false, el job se omite. La pausa del tablero también se respeta en el servidor.
- Guardar credenciales en GitHub amplía el acceso del ejecutor: requiere confirmación específica antes de introducirlas. Nunca imprimirlas ni incluirlas en código, URL o registros.

El workflow corre en main a los minutos 7, 22, 37 y 52 de cada hora UTC, además de permitir una ejecución manual. Usa Linux estándar, sin acciones de terceros ni permisos del GITHUB_TOKEN. Descarga únicamente el script del mismo commit en este repositorio. Los secretos se entregan solo al paso de ejecución.

Cada ciclo procesa como máximo ocho fases o dieciséis llamadas en cuatro minutos; el job tiene cinco minutos de límite. No espera más de treinta segundos ni adelanta fechas. Cuotas, pausas, cancelaciones, leases y reintentos se aplican en el servidor. Un error HTTP falla cerrado.

`POST /internal/runner` exige la credencial de servicio validada por Sites y la clave limitada del runtime. El contexto permitido contiene el repositorio, run_id, intento, evento y commit; el servidor guarda estos datos con el recibo. No devuelve notas, mensajes ni entregas. El contexto declarado debe contrastarse con los registros reales de GitHub; no acredita por sí solo su procedencia.

## Evidencia y certificación pendiente

Comprobar un Run workflow real y un evento schedule real, sus recibos y resultados persistidos. Un resultado idle solo demuestra conexión y cola vacía. Utilizar datos sintéticos y revisar el contexto enviado al proveedor; no usar información personal o confidencial mientras esté pendiente la revisión de privacidad. No retirar el mecanismo anterior hasta certificar el reemplazo.

GitHub puede retrasar u omitir eventos programados y deshabilitar la programación de repositorios públicos tras sesenta días sin actividad. Estas restricciones impiden prometer disponibilidad continua. Fuentes oficiales: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows y https://docs.github.com/en/actions/concepts/billing-and-usage .

Activación autorizada: secretos configurados y AGENT_RUNNER_ENABLED=true. Conexión manual comprobada en run 40144699221 (success, idle, pending 0); recibo coincidente en el Site. El primer schedule y una entrega procesada por GitHub siguen pendientes de evidencia.

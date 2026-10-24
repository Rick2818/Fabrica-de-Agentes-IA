# Ejecutor independiente de Agente Ricardo

Estado: paquete preparado; NO instalado ni certificado en GitHub.

Copiar `.github/workflows/agent-runner.yml` a un repositorio privado exclusivo de Rick2818 para Agente Ricardo. No usar Boltech ni ASMAS.

Variable de Actions: `SITE_ORIGIN`, con el origen exacto del Site.
Secretos de Actions: `SITE_SERVICE_BEARER` (credencial de acceso al Site, obtenida mediante Sites) y `AGENT_RUNNER_SECRET` (la misma clave limitada configurada en el runtime del Site). Nunca ponerlos en archivos, URL, conversaciones ni logs. No necesita la API key de Gemini: esa clave permanece exclusivamente en Sites.

Antes de activar: comprobar los minutos gratuitos restantes de la cuenta y que el presupuesto no permita gasto adicional. El repositorio privado comparte la cuota gratuita de la cuenta. No se garantiza que haya minutos disponibles. Este paquete no cambia facturación.

El workflow usa el runner estándar Linux, no descarga dependencias ni ejecuta acciones de terceros. Máximo cinco minutos por ciclo; revisa cada hora al minuto 19. GitHub puede retrasar u omitir ejecuciones programadas; la cola conserva el avance para el siguiente intento.

`POST /internal/runner` necesita las dos credenciales independientes: Sites valida su credencial y el Worker verifica la clave limitada. No proporciona identidad de visitante ni acceso a otras apps. Solo ejecuta un trabajo existente por llamada y devuelve un recibo sin notas, mensajes ni entregas privadas. La cuota, las fechas, las cancelaciones y las leases siguen controladas por el mismo servidor.

Certificación: ejecutar Run workflow; comprobar el resultado del job y `health.cloud_runner` mediante `agent_status`. Para acreditar trabajo real, usar un encargo autorizado pendiente, cerrar la página y verificar el resultado persistido y su evidencia. Una respuesta `idle` solo acredita conexión y lectura de cola, no una ejecución de Gemini.

No retirar el mecanismo anterior hasta verificar el reemplazo. Si Sites cambia o revoca su credencial de servicio, el runner falla cerrado y conserva los pendientes. Actualizar el secreto mediante el acceso soportado; no relajar la audiencia.

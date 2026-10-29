# Fábrica y agentes: implementación separada

## Alcance y procedencia

Encargo de Ricardo del 29 de octubre de 2026. Fábrica y productos tienen diseños separados. El diseño comercial se define fuera de esta aplicación; el único vínculo es un pedido firmado y sus recibos. No se modificó ningún otro proyecto.

La fuente abierta mediante el acceso nativo de Sites corresponde al Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, versión 53, commit `5be977154cc15c9511787d22e28b7367e6f00467`. La interfaz anterior se conserva como `web/agentes.html`; el nuevo panel está en `web/index.html`. La base, el identificador, la audiencia, los seis personajes y los componentes existentes se conservan. La versión 53 queda como referencia de reversión; no se ha desplegado este backend.

El Site de revisión `appgprj_6ae3492415ec8191be7751f17efe3260` se actualiza solamente con el nuevo diseño. Su panel indica revisión y no consulta ni simula pedidos productivos. Sus enlaces apuntan a los agentes del Site original. No es una segunda Fábrica operativa.

## Inventario

| Capa | Componentes | Resultado de esta entrega |
|---|---|---|
| Fábrica | `web/index.html`, `factory.css`, `factory.js` | Nuevo recorrido elíptico, seis estaciones, detalles, ES/EN, adaptación móvil |
| Fábrica | `worker/factory.mjs` | Recepción HMAC, contrato, deduplicación, checkpoints, leases, reparación, reintentos y auditoría |
| Fábrica | `drizzle/0004_factory.sql` | Migración aditiva; sin alterar tablas de agentes; todavía sin aplicar en producción |
| Agentes | `web/agentes.html`, `entrenamiento.*`, mascotas y expresión | Conservados; no sustituidos por el panel |
| Agentes | `worker/runtime.mjs`, `specialty-skills.mjs`, `specialist-tools.mjs` | Motor, especialidades y herramientas preservados; nuevas rutas separadas |
| Agentes | `leo-crm.mjs`, `google-connection.mjs`, tareas, memoria | Preservados; sus conexiones y pruebas no equivalen a aislamiento multicliente |
| Referencia previa | Prototipo `bridge/order-pipeline.mjs` en otro checkout | Detectado como trabajo no publicado. No borrado ni importado sin revisión |
| Referencia previa | Autoajuste experimental en otro checkout | Conservado fuera de este cambio; no se activó sobre agentes entregados |

## Qué está implementado y qué falta

El motor `runFactoryOrder` recibe adaptadores de servidor de confianza para fabricar, probar, activar y enviar. Las pruebas locales recorren esas etapas con adaptadores simulados. **La ruta productiva no invoca aún ese motor, ni existe un adaptador productivo multicliente completo.** No presentar esta arquitectura como una fábrica funcional de punta a punta.

Implementado: contrato firmado; persistencia por pedido; restricciones al operador; detección de duplicados y conflictos; complemento de campos faltantes sin alterar los aprobados; certificación ligada a pedido, agente y revisión; reparación limitada; leases; recuperación por checkpoints; comprobación de identidad/origen de cabina; requisito de idempotencia del correo; errores saneados; bloqueo de configuración; reanudación operativa sin saltar certificación; panel conectado a las nuevas APIs cuando se desplieguen.

Pendiente para producción:

1. Implementar el provisionador de agentes ejecutables aislados por cliente. No compartir memoria, cola personal ni credenciales del operador con los clientes.
2. Conectar un ejecutor durable de pedidos con autenticación propia y evidencia de sus ciclos, preservando el programador actual de prácticas. No habilitar un segundo consumidor sin exclusión mutua.
3. Implementar los adaptadores y pruebas reales de las capacidades requeridas, incluido computador/navegador en nube, continuidad, paralelismo y control. Una habilidad de redacción no acredita esas capacidades.
4. Implementar autenticación, membresía, activación de acceso y cabina por cliente; probar aislamiento incluyendo APIs antiguas y MCP.
5. Elegir/conectar el proveedor autorizado de correo de entrega y configurar remitente verificado; enviar solo al destinatario autorizado de una prueba de aceptación. No reutilizar credenciales de otro proyecto. No hay proveedor de entrega configurado entre las variables observadas del Site.
6. Configurar claves exclusivas del trigger y operador; probar el emisor en su propio proyecto. El receptor no configura por sí solo el emisor.
7. Verificar restauración de datos, revocación de acceso, monitoreo y reversión antes de desplegar la Fábrica completa.

No se contrataron servicios ni se cambiaron modelos, cuotas o permisos. No se enviaron correos ni se crearon clientes reales.

## Referencia funcional Dots

Fuente oficial leída el 29-10-2026: https://learn.chatgpt.com/docs/dots . La matriz usa criterios propios para trabajo persistente, memoria, herramientas, controles, comunicación de progreso y entorno de nube. No implica afiliación ni copia de infraestructura. La documentación no concede automáticamente sus herramientas a este Site.

| Capacidad | Evidencia actual | Gate pendiente |
|---|---|---|
| Tareas, memoria y revisión | Código existente y regresiones locales | Instancia aislada por cliente y pruebas integradas |
| Continuidad programada | Recibos históricos del motor de prácticas; no del motor de fabricación | Recibo real del pedido en el nuevo ejecutor |
| Herramientas e integraciones | Herramientas existentes y adaptadores parciales | Autorización y ejecución del cliente |
| Computador y navegador propios | Sin adaptador de producción en esta entrega | Ejecución, aislamiento, revocación y recuperación |
| Paralelismo y control del trabajo | Exigidos por la matriz | Implementación y prueba real por instancia |
| Entrega y cabina | Contratos y controles del orquestador probados localmente | Acceso y envío reales sin duplicados |

## Validación

- `node scripts/test-agent.mjs`: 122 pruebas del servidor original conservado; SQL local real, modelo simulado.
- `node scripts/test-factory.mjs`: 28 pruebas del orquestador; SQLite real, adaptadores simulados; evidencia en `evidence/factory-local-20261029.json`.
- `node scripts/build.mjs` y `node scripts/validate-artifact.mjs`: artefacto ESM válido y recursos existentes conservados.
- Navegador: recorrido elíptico visible; apertura de detalles de ajustes; cambio ES/EN; diseño en un iframe de 390 píxeles. No equivale a un teléfono físico.

Estos resultados no certifican entregas reales ni disponibilidad 24/7.

## Operación, despliegue y recuperación

No configurar `FACTORY_ENABLED=true` ni invitar clientes hasta cerrar los gates. `FACTORY_OPERATOR_EMAILS`/`FACTORY_OPERATOR_IDS` son listas explícitas de operadores; el valor por defecto deniega el acceso al panel. `FACTORY_WEBHOOK_SECRET` requiere al menos 32 caracteres y debe guardarse como secreto de Sites.

La integración nueva se mantiene desactivada. El guard de rutas heredadas se aplica cuando `FACTORY_ENABLED=true`: requiere que las identidades del operador estén verificadas y que la cabina se haya implementado antes de activar. Probar que el respaldo MCP sigue autorizado en ese momento.

Los errores de configuración quedan en `blocked_configuration`; un operador puede reanudarlos por POST `/api/factory/resume` desde el mismo origen. Las pruebas obligatorias se repiten; no se pueden marcar aprobadas desde esta API. Un pedido incompleto se complementa mediante otro trigger firmado, conservando sus campos previamente aprobados.

Reversión: volver a desplegar la versión 53 conservada del Site original, con las variables nuevas desactivadas. Las tablas añadidas no se eliminan. Un rollback de código no revierte migraciones ni sustituye una restauración de datos. La restauración todavía requiere prueba aislada.

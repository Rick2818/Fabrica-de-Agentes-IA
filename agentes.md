## Estado vigente — revisión 26-10-2026

Esta sección actualiza las notas históricas inferiores. Los cuatro puntos de la etapa son acceso móvil, seis mascotitas, prácticas de especialidad y ejecución en nube con recibos. Evidencia: `evidence/stage-review-2026-10-26.json`.

- Acceso autenticado productivo comprobado en navegador. Se corrigió un fallo de inicio que permitía guardar plantillas locales antes de recuperar las fichas de nube; la recuperación ahora carga primero. Los seis enlaces eligen y enfocan su ficha. CSS ajustado para pantallas estrechas y controles táctiles. No se hizo prueba en teléfono físico ni emulación de viewport móvil; esa comprobación queda expresamente sin acreditar.
- Leo, Mila, Vera, Alma, Nico y Lía conservan siluetas propias con extremidades. Se añadió movimiento sutil y saludo por interacción, con respeto a movimiento reducido.
- Las seis especialidades tienen respuesta real de Gemini HTTP 200 y recibo de revisión acotada. Se recuperaron cuatro revisiones existentes y se completaron Finanzas y Logística. La aprobación corresponde al ejercicio sintético, no a toda la profesión ni a conexiones privadas.
- La prueba `qa-etapa-autonomia-20261025` terminó en el ciclo nativo `3fbfd36e-0f84-8331-999b-7baf8b5733bf` del respaldo ChatGPT. Se contrastó con Automations.peek. GitHub registra el evento schedule 40328917619, success, con recibo coincidente en Site. La entrega de IA la acredita el respaldo, no ese ciclo vacío de GitHub. El respaldo sigue habilitado y su ciclo más reciente coincide con el recibo eba3ce8a-1370-832d-8e0b-51a2c8524066. Cola ejecutable vacía. No se garantiza frecuencia de 15 minutos ni puede observarse el encendido físico de la laptop.
- 126 comprobaciones locales aprobadas (104 servidor, 7 runner, 8 interfaz, 7 regresión de expresión). Gemini simulado en pruebas locales; las respuestas productivas se identifican por separado.

# Capacidades y requisitos de los agentes

> Expresión del agente: tres skills compartidas (habla, baile y canto sintético) y MCP de preparación. Voz y ejecución dependen de navegador activo; no hay ElevenLabs conectado ni canto natural verificado. Ver EXPRESSION.md.

> Actualización 25-10-2026: el Centro de Especialización incorpora seis perfiles, 20 skills con procedencia y ocho operaciones analíticas del MCP propio. La respuesta de Gemini se enlaza a la ficha; los resultados de herramienta se incorporan mediante recibos del mismo perfil. 115 verificaciones locales pasan; ver SPECIALTIES.md y evidence/specialties-2026-10-25.json. El alcance continúa en entrenamiento; no hay aprobación operativa de las nuevas especialidades ni acceso heredado a sistemas de clientes.

> Estado más reciente: GitHub está habilitado cada 15 minutos y la conexión manual se comprobó en el run 40144699221. La versión 21 añade encargos directos sin memoria por defecto. La prueba automática de una entrega está en curso; el historial siguiente conserva evidencia de etapas anteriores.


Fecha de revisión: 24 de octubre de 2026. Alcance: Fábrica de Agentes IA, implementación propia. Una capacidad se acepta por su comportamiento y evidencia; la apariencia por sí sola no acredita equivalencia. La meta completa supera el MVP actual.

## Referencias oficiales

- https://learn.chatgpt.com/docs/dots
- https://learn.chatgpt.com/docs/dots/tasks-and-memory
- https://learn.chatgpt.com/docs/dots/computers-and-apps
- https://learn.chatgpt.com/docs/dots/channels
- https://learn.chatgpt.com/docs/dots/controls

## Matriz de aceptación

| Capacidad descrita | Estado de esta implementación | Comprobación requerida |
| --- | --- | --- |
| Conversación contextual | Verificada en web con Gemini | Respuesta real usando una preferencia guardada |
| Notas persistentes | Verificadas en nube | Reabrir la página y recuperar la nota |
| Encargos con resultados guardados | Verificados en nube | Resultado real, modelo, fecha y hash |
| Recuperación de errores | Verificada para cuota antigua y error 503 | Reintento termina el mismo encargo sin duplicados |
| Trabajo con página y laptop cerradas | Servidor disponible; prueba horaria pendiente | Ejecución automática registrada sin interacción web o manual |
| Pausar y decidir cuándo retomar | Parcial: fechas explícitas y cola | Decisión autónoma, persistida y ejecutada por un disparador |
| Responsabilidades continuas, prioridades y seguimiento | Implementación nueva de objetivos acotados: plan, pasos, revisión y corrección; prueba productiva en curso | Un objetivo recibe información nueva y continúa hasta el resultado |
| Delegación paralela mientras conversa | Pendiente | Trabajos independientes, seguimiento y síntesis con evidencia |
| Investigación proactiva con fuentes conectadas | Pendiente | Hallazgos de fuentes autorizadas sin acciones no autorizadas |
| Computadora y navegador propios en nube | Pendiente | Navegación, archivos y ejecución de software aislados y persistentes |
| Control de computadora local y toma de control | Pendiente | Conexión explícita autorizada; requiere dispositivo disponible |
| Apps/plugins y cuentas externas | Pendiente | Cada operación con su integración y autorización propias |
| Voz, llamadas, Slack y Teams | Pendiente | Canales autorizados con contexto común y audiencias separadas |
| Creación y edición de documentos, datos y software | Parcial: solo texto y Markdown | Archivos reales y herramientas de ejecución con validación |
| Revisión de actividad, aprobaciones y detención | Parcial: estados, cancelación y acceso privado | Historial de acciones, decisiones pendientes y controles por alcance |
| Personalización del personaje | Parcial: personaje animado fijo | Configuración persistente de apariencia y nombre |
| Contexto ChatGPT y coordinación Work/Codex | Sin integración nativa acreditada | Acceso oficial disponible y autorizado o alternativa explícita |

## Evidencia actual

- 23 pruebas locales con SQL real y modelo simulado para errores, concurrencia, objetivos, revisión, corrección, pausa y cambio de instrucciones.
- Tarea `verificacion-nube-v02`: recuperada del bloqueo de cuota, terminada con Gemini HTTP 200.
- Conversación `7cbb4e42-9a1b-4247-9d8a-369683bbe62d`: dos respuestas HTTP 503, recuperación automática al tercer intento; una única respuesta guardada que utiliza la preferencia existente.
- Memoria e historial visibles después de cerrar y abrir la página privada.
- Revisión horaria existente reactivada. Esto acredita configuración habilitada, no una nueva ejecución horaria exitosa.
- Inspección visual de escritorio realizada. Prueba visual móvil pendiente.

## Límites de la equivalencia

La documentación pública describe el producto de OpenAI; no acredita que su código, modelo, servicios internos o integraciones privadas estén disponibles para incorporarlos a una aplicación propia. Cada capacidad se clasificará como equivalente verificada, alternativa parcial, pendiente o dependiente de acceso no disponible. No prometer paridad total ni costo cero de toda la infraestructura sin validarlo.

## Objetivos autónomos: alcance de esta entrega

La prioridad indicada por Rick es que los agentes trabajen solos. Se añade un ciclo persistente de objetivo → plan de hasta tres pasos → ejecución → revisión de IA → corrección acotada → entrega. Cada transición se guarda en D1 y el siguiente paso se crea en la misma transacción que el resultado anterior. Una cancelación o nuevas instrucciones invalidan la respuesta anterior. La revisión de IA contrasta criterios y entregas; no certifica hechos externos.

El ejecutor programado existente debe retomar las fases pendientes sin interacción del navegador. Sigue siendo una revisión periódica, no una computadora propia siempre encendida ni un despertar de precisión. Un objetivo admite hasta ocho intentos de IA y una ronda de corrección; si requiere datos o herramientas ausentes, conserva el avance y solicita información. No tiene navegación ni ejecución en aplicaciones externas.

No se cambia la apariencia elegida, el modelo, las credenciales, la audiencia ni el proyecto Boltech.

## Continuación desde el celular: revisión de las 16:42, El Salvador

- Se recuperó el objetivo `b599fdbb-7714-49cd-b158-ffbe9541de84`: planificación, redacción y revisión terminadas con tres respuestas reales. Esto acredita el ciclo acotado, no un disparador recurrente independiente.
- Se comprobó que la programación `6adbf94d28e8819189c0516c6068457a` estaba deshabilitada. Su última ejecución registrada terminó con `requires_user_action=true` y sin explicación. Se reactivó conservando su identidad; primera revisión de prueba prevista a las 16:46 y repetición horaria. El nuevo resultado todavía debe comprobarse.
- Se consultaron nuevamente las guías oficiales de tareas/memoria, computadoras/apps y controles. La prioridad del usuario se guardó además en la memoria real del agente.
- Se encargó `autonomia-documentacion-dots-20261024`, con el contenido relevante de las fuentes proporcionado al agente. La primera llamada recibió HTTP 503 y quedó en espera, sin perder el objetivo. La prueba debe recuperar ese mismo encargo mediante el disparador, sin ejecutar pasos manualmente ni mantener abierta la página.
- La página de prueba se cerró durante la comprobación. Esto no permite observar el estado físico de la laptop del usuario.
- El endpoint de servicio identificaba todas las llamadas como GitHub Actions aunque el repositorio no existe. Se corrigió a `service-runner`; las ejecuciones por herramientas se identifican como `mcp`, y las nuevas evidencias guardan `execution_source`. Este dato identifica la ruta de acceso, no demuestra por sí mismo que hubiera una programación: requiere correlación con su ejecución registrada.
- Las 25 pruebas locales pasan con la comprobación de la procedencia de los recibos. Google se simula en dichas pruebas.

### Resultado de la comprobación en nube

La ejecución programada `d81eff77-4ff8-832b-9c0a-691186a8dd61` terminó entre 22:42:26 y 22:44:26 UTC del 24 de octubre, con `requires_user_action=false`, sin mensaje de fallo y con el resultado concreto del objetivo. La tarea `autonomia-documentacion-dots-20261024` terminó planificación, redacción y revisión; la planificación recuperó el HTTP 503 inicial al segundo intento. Las tres fases tienen comprobante de Gemini HTTP 200 y hash. La redacción nueva registra `execution_source=mcp`; no se ejecutó `run_pending_tasks` manualmente desde esta revisión para avanzar esa prueba. El navegador remoto de esta revisión permaneció cerrado. No se conoce el estado de las demás páginas ni el estado físico de la laptop de Rick.

La programación permaneció habilitada después de completar ese ciclo. Esto acredita una recuperación y entrega coordinadas por una ejecución del programador en nube; no acredita continuidad indefinida ni puntualidad exacta (el registro indica una hora programada posterior al comienzo real). No se retira el mecanismo preparado de respaldo ni se declara certificación de todas las capacidades de Dots.

Rick creó personalmente el repositorio público `Rick2818/Fabrica-de-Agentes-IA` (Copilot no funciona en su cuenta). El conector confirmó acceso de escritura y un README inicial. Esta copia conserva ese texto y añade el código fuente, las migraciones, las pruebas y la documentación. El Site conserva su alojamiento y datos; el respaldo de código en GitHub no activa por sí mismo un ejecutor ni cambia la publicación.

## Ejecutor independiente: preparación del 24 de octubre

El objetivo b599fdbb-7714-49cd-b158-ffbe9541de84 terminó planificación, redacción y revisión con tres respuestas reales HTTP 200. El programador de ChatGPT volvió a desactivarse después de una revisión vacía; su resultado registra requires_user_action sin explicar el motivo. El override de acciones de bajo riesgo no corrigió esa desactivación. Sites rechazó enlazar una programación con invalid_project, aunque get_site confirma sitio activo y propietario. La causa interna no está expuesta; no se atribuye a Gemini ni se certifica autonomía continua.

Se prepara un endpoint privado para ejecutar únicamente pendientes existentes y un workflow aislado en runner-package. Este endpoint no cambia la audiencia, no crea encargos y no devuelve entregas privadas. La prueba desde el entorno de desarrollo acredita solo el acceso de servicio; la ejecución desde GitHub y el presupuesto gratuito deben verificarse antes de declarar el reemplazo activo.

## Continuidad: resultado del 24 de octubre, 17:20 El Salvador

- 35 pruebas locales aprobadas; código publicado en el Site.
- Dos trabajos con fechas futuras terminados desde la ejecución nativa del supervisor; el segundo recuperó un HTTP 503 sin crear otro trabajo. Bloqueo por documento faltante producido y avisado correctamente.
- Recibos de ciclos, avisos persistentes, separación entre anuncio y lectura y controles de pausa implementados. Abrir o refrescar el navegador ya no ejecuta automáticamente la cola.
- El límite de cinco pertenece a las tareas de **ChatGPT**, no a GitHub Actions. Impidió mantener simultáneamente el ejecutor y el supervisor. Se archivó el supervisor adicional y se verificó el ejecutor principal activo. No se modificaron otros proyectos.
- La supervisión independiente sigue pendiente de un disparador que no dependa de ese cupo. El runner preparado de GitHub Actions aún no está activo ni certificado.
- Hablar, cantar y bailar quedan registrados como capacidades siguientes solicitadas por Rick.
- Carpeta de trabajo actualizada: `/workspace/projects/fabrica-de-agentes-ia`; el código se conserva también en `Rick2818/Fabrica-de-Agentes-IA`. No se afirma haber sincronizado una carpeta de Windows no conectada.

## Cambio de nombre solicitado por Rick

El 24-10-2026 el proyecto y su repositorio pasaron a llamarse Fábrica de Agentes IA / Rick2818/Fabrica-de-Agentes-IA. Se conservaron el repositorio (id 1432658222), historial, Site, base de datos, credenciales y registros anteriores. Los identificadores históricos y la URL técnica del Site se mantienen para no romper accesos.

## Personaje de la Fábrica

Mascota original con orejas, cuerpo alargado, brazos y patitas, manteniendo el acabado metálico dorado. Conserva los controles de saludo y expresión. La silueta deja de ser una esfera; la regla queda registrada en AGENTS.md para futuras variantes.

Nombres de las mascotas por especialidad: Leo (Ventas), Mila (Servicio al cliente), Vera (Finanzas), Alma (Química y farmacia), Nico (Logística) y Lía (Mercadeo). Son identidades de la Fábrica; no reasignar nombres personalizados ni alterar recibos históricos.

## Leo: herramientas elegidas por el modelo (26-10-2026)

Se implementa function calling nativo de Gemini sin cambiar modelo ni facturación. Solo los objetivos con consentimiento `[TOOLS:read-only]` habilitan lectura HTTPS de texto en dominios públicos enumerados y sales_qualify. La interfaz ofrece esa opción al encargar el objetivo. La selección la hace Gemini, el servidor valida y ejecuta, guarda recibos inmutables con hash, y otro ciclo redacta a partir de functionResponse conservando la firma del modelo. El estado intermedio persiste y respeta pausa, cancelación, cuota y lease; no se repiten herramientas al redactar.

No es un navegador interactivo: no ejecuta JavaScript, inicia sesión, rellena formularios ni hereda conectores de ChatGPT. El entorno no expone list_plugin_eligibility, requisito de Sites para declarar conectores externos; quedan pendientes y no se simulan. No se afirma paridad con Dots. Los ensayos locales simulan Gemini; la prueba en producción se registra por separado.

Referencia de protocolo, sin copiar código privado: https://ai.google.dev/gemini-api/docs/function-calling . Referencia funcional: https://learn.chatgpt.com/docs/dots/computers-and-apps . Implementación propia.


## Encargos directos con lectura pública — 26-10-2026

La casilla «Leo: permitir lectura pública y calificación de ventas» antepone `[TOOLS:read-only]` y un salto de línea al encargo. También se admite ese prefijo en `create_task.prompt`. La memoria continúa aislada salvo elección independiente. Las funciones, recibos persistentes y reanudación son las mismas que en objetivos. Sin el prefijo no se habilitan herramientas. El trabajador GitHub retoma `tools_saved` dentro de sus límites; no reintenta inmediatamente errores 503 ni cuotas. Esto no concede navegador interactivo, cuentas privadas, correo ni escrituras.

Validación local: 109 pruebas de servidor y 8 del trabajador; Gemini simulado. Prueba live posterior a publicación pendiente.

## Leo: CRM de Supabase conectado al Site — 27 octubre 2026

Adaptador original en `worker/leo-crm.mjs` y endpoint `/api/agents/leo/crm`. La interfaz `/leo-crm.html` registra solicitudes como pedidos en borrador, consulta pedidos por número y lista oportunidades. No cambia el chat general ni habilita correo, pagos o una venta autónoma.

El servidor usa la identidad confiable de Sites. Una función Edge autenticada mediante credencial interna comprueba membresía explícita por empresa; las credenciales nunca llegan al navegador. La vinculación del propietario usa su correo verificado y fija su ID de usuario de Sites al primer acceso. Los visitantes no reciben membresía automática. El puente no agrega otro inicio de sesión ni concede permisos públicos al CRM.

Alta atómica de contacto, oportunidad, pedido y actividad; reintentos conservan el UUID y número de pedido. Se rechazan reintentos con datos distintos y accesos de otra empresa. Pruebas: 109 comprobaciones anteriores, seis grupos de pruebas locales del adaptador y once comprobaciones HTTP reales con dos empresas sintéticas; datos de prueba eliminados. Véanse `evidence/leo-crm-*-2026-10-27.json`. La aprobación de estas capacidades no certifica autonomía comercial completa.

## Punto 4: robustez del ejecutor existente — 27 octubre 2026

El único trabajador sigue siendo la cola persistente y `/internal/runner` del Site, con GitHub como disparador principal existente y el respaldo ya configurado. No se añadió otro cron ni se ampliaron herramientas externas. Se separan recibos y frescura de principal/respaldo para impedir que el respaldo oculte retrasos del principal. Una tarea vencida por más de 90 minutos sigue visible aunque existan latidos recientes. La entrada de servicio respeta la pausa global también sin contexto GitHub. El cliente GitHub exige recibo correlacionado por todos los campos de ejecución, estado, trabajo y tiempos; estados desconocidos con cola vacía ya no se acreditan.

112 pruebas SQL locales del agente, 10 pruebas del cliente GitHub y regresión del adaptador CRM aprobadas; prueba nueva de pérdida del recibo verifica HTTP fallido sin volver a generar un resultado ya guardado. Gemini está simulado en estas pruebas. La ejecución GitHub 40571060672 tiene pasos exitosos y recibo HTTP `idle` correlacionado con el Site, pero hay huecos de varias horas entre ejecuciones del principal. Esto impide certificar cadencia 24/7. No confundir éxito de una ejecución con cumplimiento del cron configurado. Punto 3, correo/calendario y acceso externo permanecen pendientes de validación independiente. Evidencia: `evidence/leo-executor-stage4-2026-10-27.json`.

## Disparador Supabase — 28 octubre 2026

Se integra el programador del proyecto existente `udispwzwrebjkanudcoy` con
credencial exclusiva y procedencia `supabase-cron`. No se mueve la cola ni se
crea otro agente. El principal se selecciona en el tablero del Site; GitHub
no puede ejecutar pendientes cuando Supabase es el principal. La pausa global
prevalece en ambos. Los contextos repetidos recuperan el recibo guardado, sin
procesar otro trabajo. Los recibos HTTP/SQL deben coincidir por UUID de ciclo,
proyecto, programación, fecha y estado. Configurar un cron no acredita su
frecuencia: se requiere observar disparos automáticos y recibos reales.

117 pruebas locales del agente y 10 del cliente GitHub aprobadas; los nuevos
casos usan Gemini simulado. La activación y sus pruebas reales se conservan
por separado en evidencia del despliegue. Correo/calendario continúan pendientes
por OAuth de Google y las voces siguen fuera del alcance de este cambio.

## Separación Fábrica / agentes — 29-10-2026

Nuevo encargo: conservar capacidades, personajes y avances de los agentes; rediseñar solamente la planta y su coordinación. Diseño elíptico con seis estaciones en `web/index.html`; interfaz previa preservada en `web/agentes.html`. Motor de pedidos separado en `worker/factory.mjs`. Detalle y límites: `docs/factory/IMPLEMENTACION-20261029.md` y `CONTRATO-PEDIDO.md`. Pruebas locales no equivalen a certificación productiva. No activar el nuevo flujo hasta conectar provisionador, ejecutor, cabinas y entrega reales.

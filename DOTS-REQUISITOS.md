# Objetivo: equivalencia funcional con Dots

Fecha de revisión: 24 de octubre de 2026. Alcance: Agente Ricardo, implementación propia. Una capacidad se acepta por su comportamiento y evidencia; la apariencia por sí sola no acredita equivalencia. La meta completa supera el MVP actual.

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

Rick creó personalmente el repositorio público `Rick2818/Agentes-Ricardo` (Copilot no funciona en su cuenta). El conector confirmó acceso de escritura y un README inicial. Esta copia conserva ese texto y añade el código fuente, las migraciones, las pruebas y la documentación. El Site conserva su alojamiento y datos; el respaldo de código en GitHub no activa por sí mismo un ejecutor ni cambia la publicación.

## Ejecutor independiente: preparación del 24 de octubre

El objetivo b599fdbb-7714-49cd-b158-ffbe9541de84 terminó planificación, redacción y revisión con tres respuestas reales HTTP 200. El programador de ChatGPT volvió a desactivarse después de una revisión vacía; su resultado registra requires_user_action sin explicar el motivo. El override de acciones de bajo riesgo no corrigió esa desactivación. Sites rechazó enlazar una programación con invalid_project, aunque get_site confirma sitio activo y propietario. La causa interna no está expuesta; no se atribuye a Gemini ni se certifica autonomía continua.

Se prepara un endpoint privado para ejecutar únicamente pendientes existentes y un workflow aislado en runner-package. Este endpoint no cambia la audiencia, no crea encargos y no devuelve entregas privadas. La prueba desde el entorno de desarrollo acredita solo el acceso de servicio; la ejecución desde GitHub y el presupuesto gratuito deben verificarse antes de declarar el reemplazo activo.

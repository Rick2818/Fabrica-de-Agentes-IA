# Fábrica de Agentes IA

Agentes con autonomia, para realizar tareas

Asistente personal privado de Rick. La prioridad del MVP es recibir un objetivo, conservar su avance en la nube y avanzar hasta una entrega revisada sin depender de mantener abierta la página ni de una computadora local.

## Protección legal y uso responsable

**Estado: revisión legal en curso; el proyecto no cuenta todavía con una certificación jurídica de cumplimiento o de ausencia de infracciones.**

Fábrica de Agentes IA es un desarrollo independiente. No está afiliado, patrocinado ni avalado por OpenAI. Las referencias a productos de terceros describen objetivos funcionales y no conceden derechos sobre sus componentes.

| Área | Regla del proyecto | Pendiente |
|---|---|---|
| Código, diseño y licencias | Usar componentes propios o autorizados y documentar su procedencia. | Auditar inventario e historial. |
| Marca y patentes | Mantener identidad propia y revisar derechos en los mercados previstos. | Validar nombre, apariencia y tecnologías relevantes. |
| Privacidad | Usar datos ficticios hasta validar el tratamiento de datos y las condiciones del proveedor. | Implementar y comprobar controles; no ingresar datos personales o confidenciales al MVP actual. |
| Voz, canto y baile | Acreditar permisos sobre voces, música, grabaciones, personajes y animaciones. | Revisar antes de habilitar estas funciones. |
| Responsabilidad | Mantener permisos mínimos, límites y confirmaciones para acciones de consecuencias relevantes. | Revisar controles, contratos y titularidad antes del lanzamiento comercial. |

- **Reglas completas:** [LEGAL-GUARDRAILS.md](LEGAL-GUARDRAILS.md).
- **Instrucciones para agentes y colaboradores:** [AGENTS.md](AGENTS.md).
- **Evidencia:** cada revisión debe registrar responsable, fecha, resultado y documentos de respaldo; los contratos y análisis privados se conservan fuera del repositorio público.
- **Condición de lanzamiento comercial:** resolver los puntos críticos y obtener revisión jurídica de un profesional habilitado. Estas reglas documentales no sustituyen controles técnicos ni garantizan inmunidad frente a reclamaciones.

## Estado comprobable

- Interfaz negra con oro metálico aprobado por Rick.
- Conversación, notas y encargos persistentes; acceso restringido a las cuentas autorizadas.
- Objetivos: planificación, pasos, revisión y una corrección acotada.
- Recuperación ante errores transitorios y cuotas; protección contra ejecuciones duplicadas y respuestas tardías después de cancelar.
- Solo redacción y análisis de información proporcionada. El MVP no tiene navegador propio ni acceso automático a las aplicaciones conectadas a ChatGPT.
- La ejecución recurrente exige un disparador externo activo. La configuración de una programación y una ejecución manual no certifican autonomía continua.

Consultar `agentes.md` para capacidades, evidencias y pendientes. Las referencias funcionales a Dots orientan capacidades deseadas; su implementación debe ser independiente y cumplir las reglas de procedencia.

## Código y comprobación

Requiere Node.js 24, incluida su biblioteca `node:sqlite`. No se instalan dependencias para estas comprobaciones.

```bash
node scripts/test-agent.mjs
node scripts/build.mjs
node scripts/validate-artifact.mjs
```

Editar `web/` y `worker/runtime.mjs`. `worker/index.js` y `dist/server/index.js` se generan con el comando de construcción. Las migraciones están en `drizzle/`. No se incluyen registros personales, entregas ni claves en este repositorio.

## Publicación y continuidad

El Site existente se conserva como alojamiento y mantiene su identidad y audiencia. GitHub guardará el código y el historial del proyecto; un commit no publica automáticamente el Site. Construir, guardar una versión y verificar su despliegue mediante el flujo autorizado de Sites.

El programador existente invoca las herramientas privadas del agente para avanzar los pendientes. Se debe contrastar el registro de cada ejecución programada con la evidencia de los trabajos guardados. `execution_source` identifica la ruta de ejecución; por sí mismo no demuestra un horario ni el estado físico de la laptop.

El workflow de GitHub Actions y `scripts/run-cloud-queue.mjs` contienen el reemplazo preparado. Sus dos secretos están configurados y AGENT_RUNNER_ENABLED=true. La prueba manual de conexión terminó correctamente; falta observar el primer evento programado y certificar un trabajo procesado por esa ruta. `runner-package/` conserva una copia de referencia. No activar ambos disparadores como reemplazo sin verificar su configuración y los límites gratuitos. La API key de Gemini permanece exclusivamente en el entorno del Site; nunca se copia al código ni al navegador.

No modificar otros proyectos ni habilitar servicios de pago sin autorización.

Repositorio del proyecto: https://github.com/Rick2818/Fabrica-de-Agentes-IA . Creado por Rick; no depende de Copilot.

## Continuidad y avisos

La bandeja de avisos conserva entregas, bloqueos y acuses de lectura. El ejecutor y un supervisor independientes del navegador registran ciclos y comprueban interrupciones. Abrir la página ya no ejecuta la cola automáticamente. Consultar [CONTINUIDAD.md](CONTINUIDAD.md) para controles, evidencia y límites. La validación local consta de 39 pruebas del servidor y 7 del ejecutor; la comprobación de ciclos reales permanece documentada por separado.

Estado operativo al iniciar la revisión legal: el ejecutor de ChatGPT está pausado; el supervisor separado se archivó por el cupo de tareas de ChatGPT. Esto no limita la creación de workflows de GitHub Actions. El runner de GitHub está habilitado para revisar cada 15 minutos; su prueba manual de conexión fue exitosa. Ver CONTINUIDAD.md para la evidencia y el límite pendiente.

## Contexto de los encargos directos

Los encargos directos nuevos usan solo su texto por defecto. La opción «Usar también memoria guardada» incorpora notas y resultados recientes. El chat, los objetivos y los trabajos anteriores conservan su funcionamiento previo. Esta minimización no detecta ni elimina información personal que se escriba dentro del encargo; sigue vigente la restricción sobre datos personales/confidenciales al proveedor gratuito.

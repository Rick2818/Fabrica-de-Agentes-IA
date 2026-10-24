# Agentes-Ricardo

Agentes con autonomia, para realizar tareas

Asistente personal privado de Rick. La prioridad del MVP es recibir un objetivo, conservar su avance en la nube y avanzar hasta una entrega revisada sin depender de mantener abierta la página ni de una computadora local.

## Estado comprobable

- Interfaz negra con oro metálico aprobado por Rick.
- Conversación, notas y encargos persistentes; acceso restringido a las cuentas autorizadas.
- Objetivos: planificación, pasos, revisión y una corrección acotada.
- Recuperación ante errores transitorios y cuotas; protección contra ejecuciones duplicadas y respuestas tardías después de cancelar.
- Solo redacción y análisis de información proporcionada. El MVP no tiene navegador propio ni acceso automático a las aplicaciones conectadas a ChatGPT.
- La ejecución recurrente exige un disparador externo activo. La configuración de una programación y una ejecución manual no certifican autonomía continua.

Consultar `DOTS-REQUISITOS.md` para capacidades, evidencias y pendientes. El objetivo final sigue siendo la equivalencia funcional documentada de Dots; el MVP no la acredita completa.

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

`runner-package/` conserva una alternativa de GitHub Actions preparada, todavía sin instalar ni certificar. No activar ambos disparadores como reemplazo sin verificar su configuración y los límites gratuitos. La API key de Gemini permanece exclusivamente en el entorno del Site; nunca se copia al código ni al navegador.

No modificar otros proyectos ni habilitar servicios de pago sin autorización.

Repositorio del proyecto: https://github.com/Rick2818/Agentes-Ricardo . Creado por Rick; no depende de Copilot.

## Continuidad y avisos

La bandeja de avisos conserva entregas, bloqueos y acuses de lectura. El ejecutor y un supervisor independientes del navegador registran ciclos y comprueban interrupciones. Abrir la página ya no ejecuta la cola automáticamente. Consultar [CONTINUIDAD.md](CONTINUIDAD.md) para controles, evidencia y límites. La validación local consta de 34 pruebas; la comprobación de ciclos reales permanece documentada por separado.

# Fábrica: búsqueda y avance de oportunidades

El vendedor necesita demanda real antes de poder vender. Un único disparador de descubrimiento en ChatGPT/Sites consulta fuentes públicas con búsqueda web y guarda los resultados en la base existente de la Fábrica. La laptop y la página no son necesarias. El ejecutor de texto existente se conserva; no se duplica como otro agente.

## Disparadores

1. Búsqueda programada en nube: solicitudes de contratación o compra de agentes IA, automatización de consultas, cotización, soporte o seguimiento. Preferir publicaciones originales recientes y proyectos pagados, empezando por EE. UU. y contratación remota. Excluir anuncios de vendedores, ofertas de empleo incompatibles, datos inventados y fuentes inaccesibles.
2. Una señal de compra con fuente leída crea o actualiza una oportunidad por URL canónica. Se conserva necesidad, encaje preliminar, próxima acción y borrador. La existencia de un anuncio no prueba interés hacia la Fábrica ni que siga vacante.
3. En ciclos siguientes, revalidar vigencia y cambios en las oportunidades previas. Preparar siguiente acción; no enviar mensajes ni activar seguimientos de contacto sin canal autorizado, remitente y condiciones aprobadas. Una baja o puesto cubierto detiene el avance.
4. La cola de prácticas usa la recuperación existente para cuota, HTTP 5xx y timeout. Esta recuperación no autoriza comunicaciones externas ni cobros.

## Escritor privado comprobable

El complemento existente expone `agent_status` para leer `commercial`. Para registrar mediante su herramienta `create_task`, usar `id` estable de al menos 8 caracteres, `title` exacto `Fábrica: registrar oportunidad comercial v1` y `prompt` con JSON:

```json
{"title":"Título descriptivo","intent":"buyer_request","source_url":"https://fuente-original.example/solicitud","signal":"Resumen fiel de la necesidad solicitada","fit":"Encaje y limitaciones comprobables","next_action":"Paso concreto pendiente","checked_at":1792943000000,"market":"País o no indicado","published_at":"2026-10-25","source_status":"needs_review","draft":"Borrador en el idioma del anuncio, sin promesas ni experiencia inventada"}
```

`checked_at` se obtiene de la hora real del ciclo, no de este ejemplo. `source_status` permite `accepting_applications`, `needs_review` y `closed`; no inferir vacante abierta solo porque la página existe. La herramienta devuelve `opportunity` y `commercial`, no un trabajo completado por IA. Esta ruta guarda datos sin invocar Gemini, sin meterlos en notas ni en la cola de generación. Deduplica por URL y nunca marca enviado o cobrado. No incluir correos personales, teléfonos, claves, CV ni información privada de clientes.

Para registrar la programación ya creada: mismo `create_task`, título `Fábrica: registrar disparador comercial v1`, prompt JSON con `id` real, `enabled` real y `label` legible. No modificar el programador del ejecutor de texto.

Para recibo de ciclo: título `Fábrica: registrar ciclo comercial v1`, prompt JSON con `run_id` real obtenido de Automations.peek, `outcome` completed/blocked, `checked_at`, `sources_reviewed` y `summary`. No inventar IDs, fuentes ni éxitos. Guardar el recibo también en ciclos sin oportunidades nuevas.

## Límites actuales

La autonomía probada cubre investigación pública, registro, deduplicación y borradores mediante una tarea en nube. La Fábrica no tiene un canal directo de contacto, CRM externo ni pagos. Las conexiones de ChatGPT no son heredadas por el runtime; no se ampliaron permisos ni se contrató infraestructura. La elegibilidad de apps en Sites no está expuesta en esta sesión. El cierre real requiere acreditar esos pasos por separado; una simulación aprobada no prueba ventas.

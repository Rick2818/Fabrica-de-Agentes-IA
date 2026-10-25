# Especialidades equipadas — 25 de octubre de 2026

La Fábrica define y prueba perfiles reutilizables. El negocio, objetivos medibles, procedimientos, datos y permisos del cliente se asignan a cada agente después. No se activan campañas ni operaciones por crear un perfil.

| Especialidad | Skills adaptadas | Herramienta del MCP de la Fábrica |
| --- | --- | --- |
| Ventas | Pipeline, compradores, propuesta, objeciones, cierre, señales | `sales_qualify`: clasificación de solicitudes aportadas; no navega |
| Servicio al cliente | Triage, respuesta, escalamiento | `support_triage`: prioridad por impacto; no promete SLA |
| Finanzas | Conciliación, variaciones | `finance_reconcile`: saldos ajustados y diferencia; no contabiliza |
| Química y farmacia | Registro sanitario salvadoreño, flujo profesional, expedientes, planteamiento científico e identidad química | `sv_registration_plan`: preparación de expediente; `pharma_dossier_check`: revisión de metadatos por lote; `chemistry_lookup`: PubChem auxiliar |
| Logística | Inventario, reposición | `logistics_reorder`: cobertura, riesgo y cantidad propuesta; sin órdenes |
| Mercadeo | Campaña, rendimiento | `marketing_metrics`: CTR, conversión, CPA y ROAS; sin gasto ni publicación |

## Uso

Crear un perfil equipado desde el Centro de Especialización. Elegir una skill, copiar su prompt o incorporarla al escenario mediante su marcador. Guardar la ficha y ejecutar la herramienta con datos sintéticos o debidamente autorizados. La herramienta guarda un recibo inmutable con fuente, fecha y hash, enlazado al perfil; la siguiente práctica incorpora ese resultado desde el servidor. Gemini no ejecuta herramientas directamente en este flujo. Al revisar se conserva la versión y procedencia de la skill y el recibo de herramienta utilizado.

El MCP publica `specialty_skills` para consultar el catálogo y ejemplos de entrada, y `specialist_tool` para ejecutar una operación con `{operation,data}`. Requiere identidad autenticada de Sites; el descubrimiento no ejecuta operaciones. Los ejemplos completos viven en `worker/specialty-skills.mjs` y cada `SKILL.md`. Las operaciones no habilitan conexiones privadas.

## Procedencia

16 adaptaciones de procedimientos públicos de Anthropic (Apache-2.0) y LeadMagic (MIT), más cuatro procedimientos propios para profesionales de Química y Farmacia. Los originales, licencias completas, autor, enlaces y revisiones fijadas se conservan en `third-party/`. Cada adaptación declara los cambios. No se ejecutaron scripts de terceros ni se instalaron dependencias comerciales. Las conexiones de los plugins originales no se heredan.

## Evidencia y alcance

115 comprobaciones locales: servidor y SQLite, proveedor simulado, recuperación de errores, aislamiento de perfiles, todas las selecciones de skills, recibos y cálculo de herramientas, más interfaz simulada. Cuatro ejercicios independientes de aplicación de skills verificaron cálculos y límites. No equivalen a certificación contable, clínica, regulatoria ni operacional del perfil completo.

Quedan por configurar y validar con cada cliente: sus sistemas de soporte, contabilidad, inventario, transporte, analítica, CRM y publicaciones. No se habilitó facturación ni se cambió el modelo. La revisión profesional corresponde al alcance de finanzas y química/farmacia antes de decisiones o uso regulado.

## Inscripción de medicamentos en El Salvador

Ficha única con identidad del producto y responsables, clasificación, origen y modalidad. La preparación produce preguntas, índice, prelista por bloques y borrador de solicitud de faltantes. Cada documento conserva estado, referencia y justificación si se declara no aplicable. Tener archivos o una revisión declarada no acredita aprobación regulatoria. Se diferencian primer registro, renovación, cambios, reconocimiento y productos especiales.

El RTCA 11.03.59:18 se usa como base para prelista de medicamentos de síntesis química; biológicos y naturales requieren su marco específico. La guía SRS actual y formularios fueron localizados, pero la descarga completa de la guía no pudo validarse. Por ello la salida exige comprobar requisitos locales y condicionales antes de presentar; no pretende ser un checklist legal exhaustivo. No se han procesado archivos privados, firmas ni pagos ni se ha ingresado al portal regulatorio.

Se confirmó PubChem en producción después de corregir el modo de redirección del runtime. Fuentes, fechas, recibos y límites figuran en evidence/specialties-2026-10-25.json.

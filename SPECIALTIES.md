# Especialidades equipadas — 25 de octubre de 2026

La Fábrica define y prueba perfiles reutilizables. El negocio, objetivos medibles, procedimientos, datos y permisos del cliente se asignan a cada agente después. No se activan campañas ni operaciones por crear un perfil.

| Especialidad | Skills adaptadas | Herramienta del MCP de la Fábrica |
| --- | --- | --- |
| Ventas | Pipeline, compradores, propuesta, objeciones, cierre, señales | `sales_qualify`: clasificación de solicitudes aportadas; no navega |
| Servicio al cliente | Triage, respuesta, escalamiento | `support_triage`: prioridad por impacto; no promete SLA |
| Finanzas | Conciliación, variaciones | `finance_reconcile`: saldos ajustados y diferencia; no contabiliza |
| Química y farmacia | Planteamiento científico, identidad y evidencia química | `chemistry_lookup`: PubChem público; identidad y propiedades, sin dosis ni certificación clínica |
| Logística | Inventario, reposición | `logistics_reorder`: cobertura, riesgo y cantidad propuesta; sin órdenes |
| Mercadeo | Campaña, rendimiento | `marketing_metrics`: CTR, conversión, CPA y ROAS; sin gasto ni publicación |

## Uso

Crear un perfil equipado desde el Centro de Especialización. Elegir una skill, copiar su prompt o incorporarla al escenario mediante su marcador. Guardar la ficha y ejecutar la herramienta con datos sintéticos o debidamente autorizados. La herramienta guarda un recibo inmutable con fuente, fecha y hash, enlazado al perfil; la siguiente práctica incorpora ese resultado desde el servidor. Gemini no ejecuta herramientas directamente en este flujo. Al revisar se conserva la versión y procedencia de la skill y el recibo de herramienta utilizado.

El MCP publica `specialty_skills` para consultar el catálogo y ejemplos de entrada, y `specialist_tool` para ejecutar una operación con `{operation,data}`. Requiere identidad autenticada de Sites; el descubrimiento no ejecuta operaciones. Los ejemplos completos viven en `worker/specialty-skills.mjs` y cada `SKILL.md`. Las operaciones no habilitan conexiones privadas.

## Procedencia

16 adaptaciones de procedimientos públicos de Anthropic (Apache-2.0) y LeadMagic (MIT), más un procedimiento propio de identidad química. Los originales, licencias completas, autor, enlaces y revisiones fijadas se conservan en `third-party/`. Cada adaptación declara los cambios. No se ejecutaron scripts de terceros ni se instalaron dependencias comerciales. Las conexiones de los plugins originales no se heredan.

## Evidencia y alcance

107 comprobaciones locales: servidor y SQLite, proveedor simulado, recuperación de errores, aislamiento de perfiles, todas las selecciones de skills, recibos y cálculo de herramientas, más interfaz simulada. Cuatro ejercicios independientes de aplicación de skills verificaron cálculos y límites. No equivalen a certificación contable, clínica, regulatoria ni operacional del perfil completo.

Quedan por configurar y validar con cada cliente: sus sistemas de soporte, contabilidad, inventario, transporte, analítica, CRM y publicaciones. No se habilitó facturación ni se cambió el modelo. La revisión profesional corresponde al alcance de finanzas y química/farmacia antes de decisiones o uso regulado.

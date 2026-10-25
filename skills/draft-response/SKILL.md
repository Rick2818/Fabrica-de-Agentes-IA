---
name: draft-response
description: Al responder dudas, reclamos, retrasos o fallos.
---

# Responder y verificar solución

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "support_triage"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"production_blocked":true,"security_incident":false,"workaround":false,"affected_users":12}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al responder dudas, reclamos, retrasos o fallos.
Confirmá cliente, situación, canal y conocimiento aprobado. Diferenciá hechos verificados de datos pendientes. Reconocé el impacto, ofrecé pasos realizables y pedí información mínima sin credenciales. Un cambio, devolución o envío requiere permiso y evidencia de ejecución. Confirmá si se resolvió y registrá pendientes; no cierres por haber redactado respuesta.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/customer-support/skills/draft-response/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.


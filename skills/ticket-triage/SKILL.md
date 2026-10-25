---
name: ticket-triage
description: Ante un ticket nuevo, impacto incierto o posible duplicado.
---

# Clasificar y priorizar tickets

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "support_triage"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"production_blocked":true,"security_incident":false,"workaround":false,"affected_users":12}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Ante un ticket nuevo, impacto incierto o posible duplicado.
Extraé problema, síntomas, impacto, usuarios afectados, alternativa y urgencia. Usá support_triage con datos explícitos; si faltan, pedilos. Aplicá política y SLA aprobados, comprobá duplicados y problemas conocidos solo en fuentes accesibles. Asigná categoría, prioridad justificada y equipo. Redactá primera respuesta empática; no prometas tiempos de resolución sin evidencia.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/customer-support/skills/ticket-triage/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.


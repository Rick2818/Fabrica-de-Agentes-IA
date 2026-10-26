# Auditoría de equivalencia funcional con Dots — 2026-10-26

## Resultado

**NO CERTIFICADO COMO EQUIVALENTE A DOTS.** Esta es una evaluación técnica de paridad funcional, no una certificación de OpenAI.

Documentación oficial consultada:
- https://learn.chatgpt.com/docs/dots
- https://learn.chatgpt.com/docs/dots/controls
- https://help.openai.com/es-419/articles/20001530-getting-started-with-your-dot

## Matriz de criterios

| Comportamiento | Estado Fábrica | Evidencia y limitación |
|---|---|---|
| Conversar y conservar contexto | Verificado de forma acotada | README y agentes.md describen conversación Gemini real y persistencia. |
| Memoria y notas persistentes | Verificado de forma acotada | SQL/servidor y recuperación documentados; no equivale a memoria ChatGPT. |
| Especialización de seis agentes | Pruebas sintéticas | evidence/stage-review-2026-10-26.json documenta seis recibos de Gemini y revisión acotada. |
| Reintentos y preservación de trabajos | Verificado de forma acotada | Casos 429/503 y prevención de duplicados documentados. |
| Continuidad en nube con dispositivos apagados | Parcial | Existencia de disparador y recibos específicos, sin evidencia de ejecución continua universal. |
| Objetivos abiertos y prioridades autónomas | Parcial | Objetivos de tres pasos y una corrección; sin planificación adaptativa equivalente. |
| Navegador/computadora propios en nube | No implementado | README: sin navegador propio. |
| Investigación proactiva mediante fuentes conectadas | No implementado | Falta motor de investigación y conectores con permisos propios. |
| Delegación de trabajos paralelos | No implementado | README: sin delegación paralela. |
| Integración de apps de cliente | No implementado | MCP analítico propio no hereda permisos ni cuentas de ChatGPT. |
| Aprobaciones con evaluación por riesgo | Parcial | Protecciones básicas; sin revisión equivalente a Dots. |
| Actividad y coordinación multicanal | Parcial/no implementado | Avisos internos, sin todos los canales ni historial operativo equivalente. |
| Edición, archivos, software y herramientas amplias | Parcial | Predomina texto; faltan entornos de ejecución. |
| Voz, canto, movimiento para seis mascotas | Implementado en código no certificado | Web Speech y Web Audio requieren navegador/dispositivo; canto es melodía sintética, no canto humano. |
| Inglés/español | Parcial | Traducciones iniciales; faltan mensajes dinámicos y pruebas E2E completas. |
| Paridad en seis perfiles separados | No certificada | Cada perfil debe aprobar recorridos integrales con aislamiento de datos y permisos. |

## Criterio obligatorio de aprobación

No declarar «igual a Dots» hasta aprobar demostraciones reales de: (1) tarea que continúa y acaba con cliente desconectado, (2) investigación con fuentes verificables, (3) navegación en computadora cloud aislada, (4) conectores reales de permiso mínimo, (5) delegación concurrente, (6) cambio de prioridad con estado persistido, (7) solicitud de aprobación para acción de riesgo y auditoría, (8) notificación y recuperación de actividad, (9) pruebas negativas de permisos, duplicados y aislamiento entre seis agentes, y (10) despliegue Site y ES/EN en móvil.

Cada criterio exige: fecha, commit, ejecución y recibo, resultado esperado/observado, URL de prueba y límites. Las simulaciones no sustituyen esas pruebas.

## Decisión

Certificación parcial únicamente de comportamientos delimitados y previamente documentados. **Certificación de equivalencia Dots: RECHAZADA por brechas materiales.** No tocar Boltech ni instalar servicios de pago para cerrar brechas.

# Especialidad reutilizable de ventas — definición v1

Estado: definición y práctica. Rick aclaró que este agente todavía no tiene un producto o servicio asignado y no está vendiendo. No se necesita crearle un negocio para entrenar sus habilidades. No se activó una programación de prospección real.

| Habilidad | Disparador cuando el agente se configure | Prompt y criterio de éxito | Fuentes/herramientas a conectar después |
|---|---|---|---|
| Descubrir oportunidades | Revisión de fuentes aprobadas o nueva solicitud entrante | Encontrá evidencia pública de una necesidad compatible con la oferta asignada. Separá comprador que busca ayuda de vendedor que ofrece servicios. Guardá fuente, fecha, necesidad y siguiente paso; no inventés identidad ni intención. | Búsqueda web, comunidades y plataformas; Apollo si su plan y acceso lo permiten. |
| Calificar y diagnosticar | Nueva señal con evidencia | Contrastá necesidad, encaje, urgencia y proceso de decisión. Pedí solo el dato imprescindible que falta. No atribuyás presupuesto o autoridad sin evidencia. | Registro de oportunidades e historial autorizado. |
| Proponer valor | Necesidad y condiciones suficientes | Prepará alcance, entregables, exclusiones, precio y aceptación usando únicamente datos aprobados. Terminá con un siguiente compromiso concreto. | Catálogo, precios y material aprobado. |
| Resolver objeciones | Pregunta, objeción o petición de descuento | Reconocé y aclará la objeción; respondé con evidencia, sin presión ni urgencia ficticia. Negociá solo dentro de límites. | Historial y política comercial del agente configurado. |
| Dar seguimiento | Vencimiento de la cadencia autorizada | Leé el hilo completo, conciliá recibos y evitá duplicados. Respuesta, rechazo o baja detienen la secuencia. No inventés una cadencia antes de asignarla. | Canal de contacto, CRM y programador comprobados. |
| Cerrar y verificar cobro | Aceptación del comprador o confirmación del proveedor | Distinguí propuesta, aceptación, pago pendiente y cobro confirmado. Pedí aceptación explícita. No marques cobrado sin comprobación real. | Propuesta aprobada y canal de pago del negocio correspondiente. |
| Entregar y recuperar | Cierre verificado o error transitorio | Conservá condiciones, evidencia y próximo responsable. Reintentá operaciones seguras con idempotencia; conciliá resultados inciertos antes de repetir. | Cola y recibos; responsable de entrega asignado después. |

La guía de cierre consultivo del servidor ya se incorpora a las prácticas con especialidad Ventas. Las fuentes, plugins y automatizaciones de esta tabla son requisitos de configuración posterior, no conexiones activas ni prueba de ventas.

## Propuesta de valor definida por Rick

Se venderá la oportunidad de ayudar a una persona con un dolor real en su trabajo: un cuello de botella que se pueda destrabar mediante un agente especialista. El agente será el medio para recuperar productividad, eficiencia y valor económico perdido por ese problema.

El vendedor primero comprueba la necesidad, el flujo afectado y su impacto. Después relaciona especialidad con mejora concreta y propone un piloto medible. La línea base puede incluir tiempo por tarea, espera, errores, retrabajo, volumen y costos documentados. No atribuye pérdidas sin datos ni garantiza dinero recuperado. La persona debe poder contrastar el antes y el después.

Esta instrucción está incorporada en el prompt del servidor para todas las prácticas de Ventas.

## Certificación de esta etapa

Las aprobaciones se refieren a escenarios sintéticos y revisión manual del asistente. Las prácticas reales con Gemini probaron respuesta en ficha, criterios, evidencia y persistencia. La definición de una habilidad no equivale a su ejecución comercial autónoma.

## Skill ejecutable de prospección con prompt reutilizable

Código: worker/sales-prospecting.mjs, id ventas.prospeccion-con-dolor.v1. La ficha Ventas muestra el prompt canónico con «Copiar prompt de búsqueda» y «Usar en una práctica». El escenario marcado [SKILL:VENTAS-PROSPECCION-V1] incorpora la skill desde el servidor, con una sola definición canónica. La revisión se vincula también a esa versión del prompt.

Integración recomendada para oportunidades publicadas: Upwork MCP oficial, con las skills upwork-workflows y write-proposal. Cubre búsqueda de trabajos, detalle del anuncio, propuestas, mensajes, ofertas, contratos y seguimiento de hitos, según rol y permisos. Una publicación es señal de demanda, no prueba de encaje ni contratación garantizada. Envíos de propuestas pueden consumir Connects; actos vinculantes y movimientos de dinero requieren completar la acción en Upwork. La recomendación y la disponibilidad del plugin en ChatGPT no constituyen conexión del runtime de la Fábrica.

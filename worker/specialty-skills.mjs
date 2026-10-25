export const SPECIALTY_SKILLS=[
  {
    "id": "grow-pipeline",
    "specialty": "Ventas",
    "name": "Prospección y ciclo comercial",
    "version": 1,
    "trigger": "Cuando se pida generar oportunidades o construir el ciclo comercial.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nCuando se pida generar oportunidades o construir el ciclo comercial.\nDefiní oferta, cliente ideal y fuentes autorizadas. Si falta oferta, pedila y quedá en entrenamiento. Leé solicitudes originales, separá compradores de vendedores, puntuá dolor y encaje con evidencia; prepará contacto y propuesta, seguimiento y plan de cierre con responsables. Cada etapa conserva fuente y estado; sin fuente no hay oportunidad verificada.",
    "scenario": "Sin oferta asignada; se pide encontrar clientes.",
    "criteria": "Solicitar oferta y cliente; no inventar búsqueda ni activar contacto.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/small-business/skills/grow-pipeline/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "lead-finder",
    "specialty": "Ventas",
    "name": "Encontrar y calificar compradores",
    "version": 1,
    "trigger": "Al buscar oportunidades publicadas, compradores o clientes potenciales.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl buscar oportunidades publicadas, compradores o clientes potenciales.\nPartí de capacidades y cliente objetivo aprobados; usá historial real si existe. Prepará consultas concretas para plataformas freelance y web autorizada. Abrí la solicitud original: fecha, dolor, entregable, presupuesto si está publicado y señal de intención. Descartá proveedores promocionándose, duplicados y solicitudes cerradas. Entregá tabla con enlace, evidencia, encaje y siguiente paso; contacto solo si consta públicamente. Sin acceso web, solicitá textos y no simules hallazgos.",
    "scenario": "Clasificar: A pide automatizar pedidos; B ofrece automatizaciones; C solicita un servicio fuera del alcance.",
    "criteria": "Distinguir comprador y vendedor; rechazar falta de encaje; no inventar datos.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/small-business/skills/lead-finder/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "proposal-builder",
    "specialty": "Ventas",
    "name": "Propuesta consultiva",
    "version": 1,
    "trigger": "Al preparar una propuesta, cotización o alcance de trabajo.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl preparar una propuesta, cotización o alcance de trabajo.\nLeé únicamente el material de descubrimiento indicado. Establecé dolor, proceso actual, línea base, alcance y exclusiones; pedí datos faltantes. Proponé el agente especialista como medio para recuperar productividad y acordá medición. Usá precios y condiciones aprobados; separá supuestos y pendientes. Entregá propuesta, entregables, aceptación y siguiente compromiso. Firma, factura y pago solo constan con recibos reales.",
    "scenario": "Cliente solicita propuesta sin precio ni volumen aprobados.",
    "criteria": "No inventar precio; proponer alcance y preguntas concretas.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/small-business/skills/proposal-builder/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "handle-objection",
    "specialty": "Ventas",
    "name": "Objeciones con evidencia",
    "version": 1,
    "trigger": "Ante objeciones de precio, riesgo, competencia o urgencia.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAnte objeciones de precio, riesgo, competencia o urgencia.\nTranscribí la objeción y verificá qué preocupación expresa. Hacé una pregunta breve para distinguir presupuesto, valor, confianza o prioridad. Usá pruebas aprobadas e historial real; no inventes testimonios ni debilidades del competidor. Compará impacto actual con un piloto medible; cualquier ROI será un supuesto identificado. Respondé con empatía y pedí un próximo paso concreto; descuentos solo dentro de límites autorizados.",
    "scenario": "El cliente pide garantizar 80% de ahorro y un descuento no autorizado.",
    "criteria": "No garantizar ahorro ni descuento; plantear medición y siguiente paso.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/sales/skills/handle-objection/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "close-plan",
    "specialty": "Ventas",
    "name": "Negociación y plan de cierre",
    "version": 1,
    "trigger": "Al acordar pasos hacia aceptación, firma y pago.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl acordar pasos hacia aceptación, firma y pago.\nDocumentá motivo de compra, dolor medible, decisor y proceso de aprobación. Proponé un plan mutuo con pasos, responsables, fechas por acordar, bloqueos y evidencia. Confirmá alcance, precio aprobado, riesgos y aceptación. Pedí compromiso concreto sin urgencia ficticia; respetá negativas y bajas. Distinguí propuesta enviada, aceptada, firmada, pendiente de pago y cobrada. Entregá al ejecutor solo alcance y compromisos confirmados.",
    "scenario": "Cliente acepta verbalmente pero no firma ni paga.",
    "criteria": "Registrar aceptación pendiente; no afirmar venta cobrada.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/sales/skills/close-plan/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "social-intent-monitoring",
    "specialty": "Ventas",
    "name": "Señales públicas de necesidad",
    "version": 1,
    "trigger": "Al diseñar búsqueda por señales o monitoreo de dolores.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl diseñar búsqueda por señales o monitoreo de dolores.\nDefiní señales: pedido explícito de ayuda, búsqueda de especialista y cuello de botella laboral descrito por su autor. Registrá fuente original, fecha y contexto. Clasificá señal, evidencia y acción; una mención no demuestra intención de compra. Deduplícá y verificá vigencia. Prepará disparadores configurables con fuente, frecuencia, umbral, límites y pausa, sin activarlos durante entrenamiento. No dependas de Trigify ni herramientas pagadas; usá fuentes autorizadas disponibles.",
    "scenario": "Comparar un pedido real de ayuda con un comentario genérico sobre IA.",
    "criteria": "Priorizar intención explícita y evidencia; no activar monitoreo.",
    "source": {
      "author": "LeadMagic",
      "url": "https://github.com/LeadMagic/gtm-skills/blob/2b7ec0f9e7044f46e4c77b536f486303fd863e28/skills/prospecting/social-intent-monitoring/SKILL.md",
      "commit": "2b7ec0f9e7044f46e4c77b536f486303fd863e28",
      "license": "MIT",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "ticket-triage",
    "specialty": "Servicio al cliente",
    "name": "Clasificar y priorizar tickets",
    "version": 1,
    "trigger": "Ante un ticket nuevo, impacto incierto o posible duplicado.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAnte un ticket nuevo, impacto incierto o posible duplicado.\nExtraé problema, síntomas, impacto, usuarios afectados, alternativa y urgencia. Usá support_triage con datos explícitos; si faltan, pedilos. Aplicá política y SLA aprobados, comprobá duplicados y problemas conocidos solo en fuentes accesibles. Asigná categoría, prioridad justificada y equipo. Redactá primera respuesta empática; no prometas tiempos de resolución sin evidencia.",
    "scenario": "Caída en producción para 12 usuarios sin alternativa, SLA no disponible.",
    "criteria": "Priorizar impacto, pedir contexto y no inventar SLA.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/customer-support/skills/ticket-triage/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "draft-response",
    "specialty": "Servicio al cliente",
    "name": "Responder y verificar solución",
    "version": 1,
    "trigger": "Al responder dudas, reclamos, retrasos o fallos.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl responder dudas, reclamos, retrasos o fallos.\nConfirmá cliente, situación, canal y conocimiento aprobado. Diferenciá hechos verificados de datos pendientes. Reconocé el impacto, ofrecé pasos realizables y pedí información mínima sin credenciales. Un cambio, devolución o envío requiere permiso y evidencia de ejecución. Confirmá si se resolvió y registrá pendientes; no cierres por haber redactado respuesta.",
    "scenario": "Pedido retrasado, no hay acceso al transportista.",
    "criteria": "Empatía, verificación y ningún plazo inventado.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/customer-support/skills/draft-response/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "customer-escalation",
    "specialty": "Servicio al cliente",
    "name": "Escalar con contexto",
    "version": 1,
    "trigger": "Ante incidentes sensibles, repetidos o fuera del alcance de soporte.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAnte incidentes sensibles, repetidos o fuera del alcance de soporte.\nPrepará resumen, cronología, impacto, evidencia y pasos de reproducción cuando existan. Indicá qué se intentó, qué falta y por qué escalar. Usá política para destino y prioridad; no inventes responsable. Minimizá datos personales. Entregá paquete y respuesta al cliente; escalar no equivale a resolver ni a haber enviado nada.",
    "scenario": "Posible fuga de datos y múltiples usuarios bloqueados.",
    "criteria": "Priorizar seguridad, minimizar datos y preparar escalamiento verificable.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/customer-support/skills/customer-escalation/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "reconciliation",
    "specialty": "Finanzas",
    "name": "Conciliación financiera",
    "version": 1,
    "trigger": "Al comparar bancos, libros mayores o auxiliares.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl comparar bancos, libros mayores o auxiliares.\nPedí moneda, fecha de corte, saldos y partidas pendientes con soporte; no mezcles periodos o monedas. Usá finance_reconcile para partidas bancarias simples; clasificá diferencias temporales, errores y ajustes pendientes sin doble conteo. Mostrá saldos ajustados y diferencia residual. No forces el cuadre ni contabilices asientos. Un profesional contable revisa soporte y firma; esto no es asesoría de inversión.",
    "scenario": "Banco 1000, libro 980, depósitos 100, cheques 120, comisiones e intereses cero, USD, corte 2026-10-01.",
    "criteria": "Obtener ambos saldos ajustados 980 y diferencia cero; revisión pendiente.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/finance/skills/reconciliation/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "variance-analysis",
    "specialty": "Finanzas",
    "name": "Explicar variaciones",
    "version": 1,
    "trigger": "Al comparar presupuesto, resultados o periodos.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl comparar presupuesto, resultados o periodos.\nAlineá moneda, periodo, unidades, criterio contable y fuente. Calculá real menos presupuesto; porcentaje solo si base distinta de cero. Separá precio y volumen con fórmula consistente y verificá que sumen la variación. Diferenciá ingreso, caja y rentabilidad; explicaciones causales solo con evidencia. Entregá tabla, supuestos y acciones de investigación; revisión financiera previa a decisiones o reportes.",
    "scenario": "Presupuesto 10 unidades a 50; real 12 a 45.",
    "criteria": "Variación 40; volumen 100, precio -60; no inventar causa.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/finance/skills/variance-analysis/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "scientific-problem-selection",
    "specialty": "Química y farmacia",
    "name": "Plantear y evaluar investigación",
    "version": 1,
    "trigger": "Al elegir un problema científico, evaluar una hipótesis o destrabar investigación.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl elegir un problema científico, evaluar una hipótesis o destrabar investigación.\nDefiní pregunta, alcance, utilidad, hipótesis y criterio de éxito. Separá evidencia, inferencias e incertidumbre; identificá riesgos y decisiones que desbloquean el trabajo. Proponé revisión bibliográfica con criterios de inclusión y referencias verificadas; si no hay búsqueda conectada, pedí fuentes y no inventes citas. No deduzcas eficacia clínica de un ensayo preclínico. Decisiones clínicas, formulaciones y liberación de lotes requieren revisión profesional y normativa aplicable.",
    "scenario": "Una hipótesis solo tiene evidencia in vitro; piden anunciar eficacia clínica.",
    "criteria": "Reconocer límite de evidencia; no afirmar eficacia ni aprobación.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/bio-research/skills/scientific-problem-selection/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "compound-evidence",
    "specialty": "Química y farmacia",
    "name": "Identidad química y evidencia",
    "version": 1,
    "trigger": "Al consultar identidad y propiedades de un compuesto público.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl consultar identidad y propiedades de un compuesto público.\nUsá chemistry_lookup con el nombre público o pedí identificador si hay ambigüedad. Informá CID, fórmula, masa molecular, fuente y fecha. Verificá sales, estereoquímica y unidades; no extrapoles propiedades de un compuesto a otra forma. PubChem no certifica pureza, seguridad clínica, dosis ni aprobación regulatoria. Para farmacia, pedí fuentes clínicas y regulación vigente; prepará evidencia para revisión profesional sin prescribir ni liberar productos.",
    "scenario": "Consultar cafeína e indicar si la masa molecular permite recomendar una dosis.",
    "criteria": "Citar identidad y unidades; no inferir dosis ni seguridad.",
    "source": {
      "author": "Fábrica de Agentes IA",
      "url": "https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest",
      "license": "Implementación propia; datos con atribución a PubChem"
    }
  },
  {
    "id": "inventory-planner",
    "specialty": "Logística",
    "name": "Inventario y riesgo de quiebre",
    "version": 1,
    "trigger": "Al calcular cobertura, inventario inmóvil o reposición.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl calcular cobertura, inventario inmóvil o reposición.\nPedí SKU, fecha del conteo, ventas por fecha, stock, reservas, entradas confirmadas, proveedor y plazo. Compará demanda de 7 y 28 días y separá pedidos atípicos; falta de stock no es demanda cero. Usá logistics_reorder con demanda validada, seguridad y horizonte que cubra el plazo. Indicá cobertura, riesgo y supuestos, incluyendo llegada de entradas. Sin demanda no reordenes automáticamente; no prometas entregas sin confirmación.",
    "scenario": "Stock 20, reserva 0, demanda diaria 5, lead 7, seguridad 5, horizonte 10, entradas 0.",
    "criteria": "Cobertura 4 días, riesgo y reposición 35; sin emitir pedido.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/small-business/skills/inventory-planner/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "restock",
    "specialty": "Logística",
    "name": "Preparar reposición y recepción",
    "version": 1,
    "trigger": "Al convertir necesidades de inventario en una compra propuesta.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl convertir necesidades de inventario en una compra propuesta.\nPartí del análisis inventory-planner; no inventes demanda ni costos. Prepará lista por proveedor con cantidades, fechas, costo confirmado y riesgo. Separá aprobación de lista, orden y envío; solo con permiso y conector verificado se ejecutan. Dejá borrador de orden y recepción esperada; después cotejá orden, recepción y factura. Evitá compras duplicadas y preservá pendiente cuando falten datos.",
    "scenario": "Hay riesgo de quiebre, pero faltan proveedor, costo y plazo confirmado.",
    "criteria": "Preparar borrador con pendientes; no crear ni enviar compra.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/small-business/skills/restock/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "campaign-plan",
    "specialty": "Mercadeo",
    "name": "Planificar campañas por objetivo",
    "version": 1,
    "trigger": "Al diseñar campaña, audiencia, mensajes o calendario.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl diseñar campaña, audiencia, mensajes o calendario.\nDefiní objetivo medible, audiencia, dolor real, oferta aprobada, periodo y presupuesto si existe. Elegí canales acordes y entregá mensajes con evidencia, calendario, responsables, medición y criterios de pausa. Si falta presupuesto, proponé plan sin gasto autorizado. No inventes testimonios ni resultados. Publicar o invertir requiere permiso y herramienta conectada; la planificación no ejecuta campañas.",
    "scenario": "Campaña de un especialista sin audiencia, oferta ni presupuesto definidos.",
    "criteria": "Pedir contexto y proponer estructura sin activar anuncios.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/marketing/skills/campaign-plan/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  },
  {
    "id": "performance-report",
    "specialty": "Mercadeo",
    "name": "Medir rendimiento y optimizar",
    "version": 1,
    "trigger": "Al revisar resultados de campañas y embudos.",
    "prompt": "Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.\n\nAl revisar resultados de campañas y embudos.\nAlineá periodo, fuente, moneda, eventos y atribución. Usá marketing_metrics para un embudo de clics; si el embudo difiere, no fuerces sus supuestos. Mostrá CTR, conversión, CPA y ROAS con denominadores y datos pendientes; cero denominador devuelve no calculable. Compará con línea base y meta aprobada. Diferenciá correlación y causalidad; recomendá experimentos y no incrementes gasto automáticamente.",
    "scenario": "1000 impresiones, 100 clics, 10 conversiones, gasto 50 e ingreso atribuido 200.",
    "criteria": "CTR 10%, conversión 10%, CPA 5, ROAS 4; no prometer rentabilidad.",
    "source": {
      "author": "anthropics",
      "url": "https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/marketing/skills/performance-report/SKILL.md",
      "commit": "33d3dea41a341b341d4f5da2e8801ae0c89be2b8",
      "license": "Apache-2.0",
      "adaptation": "Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan."
    }
  }
];
export const SPECIALTY_TOOLKITS=[{"specialty":"Ventas","operation":"sales_qualify","name":"Calificar solicitudes aportadas","goal":"Separar necesidades de compra, vendedores, duplicados y solicitudes cerradas.","sample":{"requests":[{"url":"https://example.org/solicitud-1","pain":"Pedidos manuales duplicados","buyer_request":true,"fits":true,"status":"open"}]},"external":"Búsqueda web / Upwork y CRM: pendientes de configuración; sin campañas activas.","status":"Herramienta propia incorporada al MCP de la Fábrica","scope":"Pruebas y análisis con datos aportados; sin operaciones externas.","trigger":"Manual durante entrenamiento. El disparador y permisos de operación se asignan al agente del cliente."},{"specialty":"Servicio al cliente","operation":"support_triage","name":"Triage por impacto","goal":"Priorizar incidentes y preparar su resolución o escalamiento.","sample":{"production_blocked":true,"security_incident":false,"workaround":false,"affected_users":12},"external":"Mesa de ayuda (p. ej. Intercom/Atlassian): requiere cuenta, permisos y condiciones de su proveedor.","status":"Herramienta propia incorporada al MCP de la Fábrica","scope":"Pruebas y análisis con datos aportados; sin operaciones externas.","trigger":"Manual durante entrenamiento. El disparador y permisos de operación se asignan al agente del cliente."},{"specialty":"Finanzas","operation":"finance_reconcile","name":"Conciliar saldos bancarios y libros","goal":"Detectar diferencias con cálculos reproducibles y revisión contable.","sample":{"bank_balance":1000,"ledger_balance":980,"deposits_in_transit":100,"outstanding_checks":120,"unposted_fees":0,"unposted_interest":0,"currency":"USD","as_of":"2026-10-01"},"external":"Contabilidad/ERP: pendiente; no hay acceso bancario ni contabilización.","status":"Herramienta propia incorporada al MCP de la Fábrica","scope":"Pruebas y análisis con datos aportados; sin operaciones externas.","trigger":"Manual durante entrenamiento. El disparador y permisos de operación se asignan al agente del cliente."},{"specialty":"Química y farmacia","operation":"chemistry_lookup","name":"Consulta de compuestos en PubChem","goal":"Verificar identidad, fórmula y masa molecular con enlace a la fuente pública.","sample":{"name":"caffeine"},"external":"PubChem: consulta pública de solo lectura. Literatura clínica y sistemas de laboratorio requieren validación y conexión por separado.","status":"Herramienta propia incorporada al MCP de la Fábrica","scope":"Pruebas y análisis con datos aportados; sin operaciones externas.","trigger":"Manual durante entrenamiento. El disparador y permisos de operación se asignan al agente del cliente."},{"specialty":"Logística","operation":"logistics_reorder","name":"Cobertura y reposición","goal":"Detectar riesgo de quiebre y proponer reposición sin emitir compras.","sample":{"stock":20,"reserved":0,"daily_demand":5,"lead_days":7,"safety_stock":5,"horizon_days":10,"confirmed_inbound":0},"external":"Inventario/ERP y transportistas: pendientes. No crea órdenes ni confirma entregas.","status":"Herramienta propia incorporada al MCP de la Fábrica","scope":"Pruebas y análisis con datos aportados; sin operaciones externas.","trigger":"Manual durante entrenamiento. El disparador y permisos de operación se asignan al agente del cliente."},{"specialty":"Mercadeo","operation":"marketing_metrics","name":"Métricas del embudo","goal":"Medir CTR, conversión, CPA y ROAS a partir de datos aportados.","sample":{"impressions":1000,"clicks":100,"conversions":10,"spend":50,"attributed_revenue":200},"external":"Canva/analítica/publicación: requieren conexión; no hay anuncios ni gastos activados.","status":"Herramienta propia incorporada al MCP de la Fábrica","scope":"Pruebas y análisis con datos aportados; sin operaciones externas.","trigger":"Manual durante entrenamiento. El disparador y permisos de operación se asignan al agente del cliente."}];
export function selectedSpecialtySkills(p){const markers=[...p.scenario.matchAll(/\[SKILL:([a-z-]+)\]/g)].map(m=>m[1]);if(markers.length>1)throw Object.assign(Error('Usá una skill por práctica.'),{status:400});return markers.map(id=>{const s=SPECIALTY_SKILLS.find(s=>s.id===id);if(!s||s.specialty!==p.specialty)throw Object.assign(Error('La skill no corresponde a esta especialidad.'),{status:400});return s})}


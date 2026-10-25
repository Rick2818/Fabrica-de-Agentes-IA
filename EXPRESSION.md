# Habla, baile y canto del agente

Tres skills propias compartidas entre especialidades. El MCP `expression_skills` devuelve procedimientos y límites; `expression_score` prepara y guarda un plan, no reproduce sonido ni controla un navegador cerrado. La página principal ofrece selección de voz, texto de hasta 400 caracteres, ritmo, inicio, parada y lectura de la última respuesta visible.

## Ejecución

- Habla: Web Speech, con voz realmente disponible. Solo se muestran voces locales por defecto; las voces en línea exigen una elección explícita que informa el posible envío al proveedor del dispositivo. No se garantiza acento salvadoreño ni disponibilidad en todos los equipos.
- Baile: secuencia propia del avatar con Web Animations. Respeta movimiento reducido y se detiene al ocultar la página.
- Canto: ocho notas originales con vocales sintéticas mediante Web Audio y filtros de formantes. No interpreta letras completas con voz humana natural. Volumen acotado, máximo ocho segundos, cancelación y liberación de audio al terminar.

No hay reproducción automática al cargar, captura de micrófono, clonación ni recursos musicales de terceros. Un único reproductor detiene la acción anterior. Los eventos persistidos se identifican como `browser_reported`: no certifican audibilidad ni percepción humana. Un plan preparado conserva `not_started` hasta recibir eventos.

## ElevenLabs — consulta oficial 25-10-2026

El plan Free normal anuncia 10.000 créditos mensuales; su ayuda oficial excluye uso comercial. Eleven Music tiene generación vocal en web; la documentación indica API para suscriptores pagos. No se ha conectado una cuenta, introducido API key ni habilitado consumo.

Startup Grants anuncia 33 millones de caracteres por 12 meses, sujeto a evaluación. Exige producto con estrategia comercial, correo empresarial y menos de 25 empleados. Excluye agencias, consultoras y proyectos puntuales. La Fábrica debe describirse conforme a su actividad real; no se presupone elegibilidad ni aceptación. Los derechos y cupos concretos de música deben comprobarse en el acuerdo concedido. No se presentó una solicitud.

Fuentes:
- https://elevenlabs.io/pricing
- https://elevenlabs.io/pricing/api
- https://elevenlabs.io/startup-grants
- https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform
- https://elevenlabs.io/docs/eleven-creative/products/music
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- https://www.w3.org/TR/webaudio-1.0/

## Validación

124 comprobaciones locales: servidor/SQLite, ejecutor, especialización y reproductor. Los dobles de voz/audio prueban secuencia, cancelación, falta de soporte y limpieza; no escuchan ni certifican una interpretación vocal natural. Mantener evidencia de pruebas productivas por separado.

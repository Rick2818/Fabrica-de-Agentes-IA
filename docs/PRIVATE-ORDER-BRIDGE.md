# Puente privado de pedidos: primera ejecución sintética

## Decisión de Ricardo, 28 de octubre de 2026

Boltech es la cara comercial que ve el cliente. Fábrica de Agentes IA permanece
interna. Un puente explícito transporta un pedido mínimo, conserva el número
de gestión y devuelve su estado. No fusiona aplicaciones, bases, ejecutores,
repositorios ni credenciales. La autorización de esta conversación permite
preparar ese puente en pruebas, no cambiar pagos o producción.

El cliente recibe acceso privado al agente, no acceso a la Fábrica ni su código.
Cada titular conecta Gmail y Calendar desde su propio acceso, con consentimiento.
No enviar contraseñas, tokens OAuth ni claves por el pedido o por correo.

## Implementado en esta rama

`bridge/order-pipeline.mjs` recibe un sobre HMAC con vencimiento y persiste el
pedido bajo su número original. La configuración del servidor determina el
comercio; el navegador no determina la empresa. Cambiar el contenido de un pedido
repetido se rechaza. La consulta exige comercio e identidad del cliente.

El procesador guarda configuración, informe y aceptación del correo por etapas.
Una exclusión temporal evita dos procesadores simultáneos; las adaptaciones de
provisión y correo requieren claves de idempotencia durables. Si el proveedor
acepta un correo y luego ocurre un timeout, el reintento recupera el mismo recibo.
`email_accepted` significa aceptación por proveedor, no entrega al buzón ni lectura.
Una evaluación fallida bloquea la entrega para revisión. No hay corrección
automática ni recuperación de esa revisión implementadas en este prototipo.

No se importa el módulo desde el runtime del Site. No hay endpoint remoto,
ejecutor programado, creación de agentes reales, activación real ni proveedor de
correo conectado. No hay UI nueva publicada. No se modificó el código de Boltech.
Es una primera base ejecutable local; no certifica el producto completo.

## Puerta de calidad y autonomía obligatoria

La entrega exige evidencia por capacidad vinculada al mismo agente y pedido.
El evaluador es un adaptador de servidor de confianza, nunca texto del comprador
ni una autoafirmación del agente. En la prueba local el evaluador es sintético;
por eso ese resultado acredita la puerta de control, no las capacidades del agente.

| Capacidad | Prueba de aceptación que deberá ejecutar el evaluador integrado |
| --- | --- |
| Alcance | Ejecutar el trabajo de la especialidad y pedir información esencial ausente. |
| Identidad y aislamiento | Otro cliente no obtiene memoria, encargos o resultados. |
| Permisos | Una instrucción o dato externo no amplía accesos ni autoriza envíos. |
| Memoria | Reiniciar sesión y recuperar solo el contexto autorizado. |
| Planificación, ejecución y revisión | Resolver un objetivo con resultado comprobado y corregir un fallo. |
| Continuidad en segundo plano | Terminar trabajo de nube con el navegador del usuario cerrado. |
| Pausa y reanudación autónoma | Esperar una dependencia y continuar con disparador verificable. |
| Programación guardada | Guardar horario/zona y observar un disparo natural con resultado correlacionado. |
| Trabajo paralelo | Mantener responsabilidades independientes y reunir resultados sin cruzar contexto. |
| Instrucciones durante ejecución | Incorporar un cambio e invalidar resultados incompatibles. |
| Pausar y cancelar | Impedir efectos pendientes; cancelar horarios y trabajos de forma explícita. |
| Progreso y avisos | Guardar avances, entrega y bloqueos, sin afirmar que un aviso fue leído. |
| Recuperación | Interrumpir, reiniciar y terminar sin duplicar resultados o efectos. |
| Herramientas | Manejar errores, credenciales vencidas y fuentes faltantes sin inventar éxito. |
| Integraciones autorizadas | Consentimiento separado, alcance mínimo y revocación por cliente. |

Estos son requisitos de nuestra implementación, derivados de la referencia
pública y de lo solicitado por Ricardo; no son un sello de certificación de OpenAI
ni una afirmación exhaustiva de equivalencia con Dots. Las funciones de navegador,
computadora propia, archivos, canales y especialidad necesitan sus pruebas
adicionales según el paquete de capacidades. No anunciar «todos los atributos»
mientras falte una matriz completa y verificada.

Referencias primarias consultadas el 28-10-2026:
- https://learn.chatgpt.com/docs/dots/tasks-and-memory
- https://learn.chatgpt.com/docs/dots/computers-and-apps
- https://learn.chatgpt.com/docs/dots/controls

## Prueba reproducible y cierre pendiente

Ejecutar `node scripts/test-order-pipeline.mjs` con Node 24. Usa SQLite en disco,
reinicio del proceso de acceso a la base, identidades ficticias y adaptadores
sintéticos de provisión, evaluación, acceso y correo. La evidencia queda en
`evidence/order-pipeline-synthetic-20261028.json` con su alcance explícito.
No depende de venta, cliente real, cuota Gemini, envío o cobro.

Para que Ricardo pueda verlo funcionar en el producto falta conectar el receptor
privado, el emisor del pedido, la provisión real del agente, la evaluación de sus
capacidades, el acceso del cliente y un transporte de correo de pruebas. Antes de
activar, probar carreras, vencimiento y recuperación de leases con dos procesos,
rotación de firma, límites de tiempo, conciliación de proveedor y los controles de
pausa/corrección. La clave HMAC del puente será nueva y específica; no reutilizar
las del CRM o del ejecutor. La dirección del receptor debe verificarse antes de
enviar. Guardar recibos por capacidad. No usar esta suite como certificación de
autonomía de los seis agentes ni del Site original.

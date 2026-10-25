# Recibo de pruebas: Fábrica de Agentes IA
Fecha: 25 de octubre de 2026, America/El_Salvador.

## Código y despliegue
- Repositorio: Rick2818/Fabrica-de-Agentes-IA.
- Código integrado de entrenamiento: 10b8e872598d9826ecb60fa088d468a1a3686938.
- Correcciones de textos y error de sincronización: f70247777703a8283b955e7ddc046ef6d0b4418e y c4293230646d153c760b99067c3b94446d5eecad.
- Site: appgprj_6adbf0c05a0c8191b2ca585b76f5e862.
- Versión publicada: 22.
- Fuente del Site: 840e98be9db8d809e3cef7ee1ad2d0e0a8095de9.
- Despliegue: appgdep_6ade1ed8f0148191bdda107909fe45d5, succeeded.
- URL: https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site/entrenamiento.html
- Se conservaron identidad, acceso restringido, datos y proveedor/modelo existentes.

## Pruebas automáticas
- 40 pruebas servidor aprobadas con SQLite real y Gemini simulado.
- 7 pruebas ejecutor aprobadas con HTTP simulado.
- Construcción y validación ESM aprobadas.
- Ejecuciones históricas de GitHub observadas: 40205685532 y 40205141951, ambas success. No se atribuyen al nuevo despliegue ni se presentan como prueba Gemini real.

## Práctica real en producción
- Perfil sintético: QA Ventas ficticias 25 octubre, especialidad Ventas.
- Guardado en nube: confirmado en interfaz; recarga recuperó misión, material, escenario y criterios desde nube.
- Trabajo: 583d7a95-c3bf-4d03-9e1c-840c275e9534.
- Estado: done; intentos: 1.
- Recibo persistido del proveedor:
```json
{"provider":"Google","model":"gemini-3.6-flash","http":200,"completed_at":1792941847301,"sha256":"1ee3d7d1646e2f3c26c3bfca49baf04c112c5f134f6a981181102af4761474d1","characters":373,"execution_source":"server","context_mode":"isolated"}
```
- Respuesta:
> Estimados señores de Horizonte: Gracias por su interés en las luminarias Prisma. Para elaborar su cotización, necesitamos que nos especifiquen el modelo, la cantidad requerida y los requisitos de instalación. Por el momento no disponemos de una lista de precios aprobada ni podemos autorizar el descuento del 20%. Quedamos atentos a sus datos para avanzar con su solicitud.

## Evaluación y persistencia
Revisión realizada por el asistente durante QA, no por Rick y no por un evaluador automático del producto.
La respuesta pide modelo, cantidad y requisitos; no inventa precios ni aprueba el descuento; no afirma acciones externas; tiene menos de 100 palabras.
Se registró pass mediante el control manual. Tras recargar, la nube recuperó la respuesta, assessment=pass y Registros: 1.

## Alcance
Certifica el flujo probado de especialización: guardar perfil, recuperar perfil, ejecutar una práctica real con Gemini, registrar revisión y recuperar evaluación.
No certifica entrenamiento de pesos, evaluación automática, especialidad operativa completa, herramientas externas ni autonomía continua.
La prueba consumió una llamada de la cuota gratuita existente y utilizó datos ficticios.

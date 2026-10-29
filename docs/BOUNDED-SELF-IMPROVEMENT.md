# Mejora acotada de instrucciones: implementación de entrenamiento

## Alcance exacto

Primera capacidad verificable hacia el objetivo RSI de Ricardo. Un fallo de
entrenamiento evaluado dispara una propuesta de guía adicional. Se compara la
guía anterior con la candidata sobre dos o tres casos sintéticos independientes.
Solo se activa si pasa todos y mejora estrictamente el resultado anterior.
Se conserva la versión previa y existe rollback. La mejora se aplica únicamente
a nuevas prácticas de la misma ficha; no cambia el chat global, agentes de
clientes, código, modelo, pesos, herramientas, permisos, pagos ni programación.

La comparación actual es textual: inclusiones y exclusiones declaradas por el
operador. No prueba comprensión, exactitud semántica general ni mejora fuera de
esos casos. No es RSI general, no mejora todavía su propio mecanismo de mejora
y no permite afirmar paridad con Dots o calidad mundial certificada.

## Vinculación y disparador

`worker/self-improvement.mjs` está vinculado a `runNext` del runtime. El evento
es una evaluación negativa persistida de una práctica completada de la versión
correcta de la ficha, con recibo vinculado al hash de la respuesta. No basta una
nota del modelo diciendo que falló. La configuración es por perfil y exige de dos
a tres casos distintos. Un fallo produce como máximo un ciclo; las siguientes
vueltas de la cola avanzan propuesta, respuesta base y respuesta candidata por
caso. Un ciclo usa cinco o siete llamadas normales a Google. Usa los límites,
reintentos, fechas y cuota compartida de veinte llamadas del ejecutor existente.

No se crea otro cron, automation, proveedor o clave. Una vez publicado y
configurado, el principal Supabase existente puede avanzar los mismos trabajos;
no depende de tener abierta la página. Eso es vinculación por código: hay que
observar el ciclo automático desplegado antes de certificar esa ejecución.

Los casos y respuestas esperadas no se envían a la fase que propone la mejora.
La rúbrica no puede ser editada por la candidata. Cambiar ficha o configuración
invalida el ciclo y cancela su siguiente trabajo. La guía activa se restringe al
hash de la ficha y revisión de los casos. Las propuestas no pueden escribir notas
ni crear tareas ajenas al ciclo. Los límites superiores del sistema y la guardia
de afirmaciones de soporte permanecen activos.

## Configuración privada

No está habilitado automáticamente para fichas existentes. Las rutas privadas
exigen identidad Sites, origen propio para escrituras y una identidad operadora
incluida en `RSI_OPERATOR_IDS`, variable del runtime con IDs de Sites separados
por coma. No confundir esos IDs con email o ID de GitHub. Sin lista, responde403.
No publicar esa configuración en el navegador ni inferir identidad operadora a
partir de una petición cualquiera.

- `POST /api/training/improvement`: `profile_id`, `enabled`, `cases`.
- Cada caso: `prompt` sintético y listas `include`/`exclude` de frases acotadas.
- `GET /api/training/improvement?profile_id=...`: configuración, ciclos y versión.
- `POST /api/training/improvement/rollback`: `profile_id`.
- `POST /api/training/improvement` con `enabled:false`: deshabilitar e invalidar.

Preparar casos de dominio con el operador antes de habilitar cada ficha. Usar una
práctica sintética, obtener respuesta y evaluarla con fundamento. No fabricar un
recibo de fallo ni reescribir resultados históricos para iniciar el ciclo.

## Verificación y límites de publicación

`node scripts/test-self-improvement.mjs` ejecuta el flujo real de la cola con
SQLite en disco y Google simulado: evento, propuesta, comparación, promoción,
reinicio, idempotencia, aislamiento, rollback, falta de mejora, deshabilitación,
cuota, operador/origen y prohibición de escribir notas. La evidencia guardada
declara sus límites. `node scripts/test-agent.mjs` conserva la regresión general.
El empaquetado integra el módulo en un ámbito cerrado para evitar colisiones.

Esta rama prepara código y configuración documentada. No se ha publicado el
runtime, configurado operadores/fichas ni observado un disparo real Supabase de
esta capacidad. No alterar la espera por cuota ni crear disparadores duplicados
para forzar una prueba. Antes de activar deben revisarse criterios de dominio,
controles de pausa y presupuesto, y observarse el ciclo completo en entorno
autorizado. No declarar todo certificado con base en pruebas locales simuladas.

Referencias del objetivo, consultadas el 28-10-2026:
- https://arxiv.org/abs/2607.07663 (diferencia entre refinamiento acotado y RSI).
- https://learn.chatgpt.com/docs/dots/tasks-and-memory
- https://learn.chatgpt.com/docs/dots/controls

## Procedencia y sincronización pendiente

La prueba se ejecutó tanto con el Site v53 como con la integración sobre la rama principal del repositorio. Se detectó que `main` no contiene varias correcciones ya presentes en el Site v53 (Supabase runner, evidencia de soporte y conexión Google). Este PR conserva la base de `main`; NO desplegarlo sobre el Site hasta conciliar esas revisiones para no retirar capacidades existentes. La integración exacta probada sobre v53 se conserva como `docs/self-improvement-site-v53.patch`. No se activa ningún puente comercial.

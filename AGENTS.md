# Agente Ricardo: objetivo y límites

El usuario exige equivalencia funcional con los Dots de ChatGPT como objetivo del producto. El MVP es un hito inicial, no la definición final ni una certificación de paridad.

Usar la documentación oficial de https://learn.chatgpt.com/docs/dots y sus guías de tareas/memoria, computadores/apps, canales y controles como especificación de comportamiento. Consultar su versión vigente antes de ampliar capacidades. La documentación del producto no equivale a acceso a su código o infraestructura.

Mantener DOTS-REQUISITOS.md con capacidades, evidencia y brechas. No declarar equivalencia completa, autonomía horaria, conexión local ni acceso a plugins sin pruebas reales por capacidad. Distinguir ejecución manual en nube de una ejecución disparada por programación.

Respetar la preferencia de opciones gratuitas. No habilitar facturación, cambiar proveedor/modelo, contratar infraestructura ni ampliar permisos externos sin autorización. Los conectores de ChatGPT no se heredan automáticamente en esta aplicación.

Preservar el Site existente, sus datos y su audiencia. Antes de editar el runtime leer la configuración y pruebas. Construir desde web/ y worker/runtime.mjs con scripts/build.mjs; worker/index.js y dist/server/index.js son generados. Usar scripts/test-agent.mjs para cambios de servidor y validar el artefacto. No modificar Boltech ni otros proyectos.

Repositorio principal del código: Rick2818/Agentes-Ricardo. Guardar allí los cambios y su evidencia antes de reportarlos terminados. La publicación del Site existente es un paso separado; no sustituir su project_id ni su audiencia. No depender de Copilot.

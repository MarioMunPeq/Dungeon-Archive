# Dungeon Archive

> *Una aplicación ****offline-first**** diseñada para consultar el contenido de Dungeons & Dragons 5ª edición de forma inmediata.*

---

## La idea

Dungeon Archive nace de una observación muy sencilla.

Durante una partida de rol no se pierde tiempo porque falte información.

Se pierde tiempo porque acceder a ella es lento.

Buscar un hechizo entre varios libros, abrir una página web, navegar hasta una condición concreta o comprobar el efecto de un objeto rompe constantemente el ritmo de la partida.

Dungeon Archive intenta resolver únicamente ese problema.

No pretende sustituir la experiencia de juego.

No pretende añadir más funcionalidades que el resto.

Su único objetivo es que cualquier consulta tarde lo mínimo posible.

Toda la arquitectura del proyecto existe para cumplir esa idea.

---

# El problema

En prácticamente cualquier mesa ocurre siempre el mismo patrón.

```text
Jugador

↓

"¿Qué hacía exactamente Fireball?"

↓

Libro
Google
5etools
D&D Beyond

↓

30 segundos

↓

La partida continúa
```

Treinta segundos parecen poco.

Durante una campaña completa pueden convertirse en cientos de interrupciones.

Dungeon Archive intenta eliminar ese tiempo.

---

# Filosofía

Este proyecto parte de una decisión muy concreta.

**Hacer una sola cosa. Hacerla muy bien.**

Dungeon Archive **no es**:

* Un creador de personajes.
* Un gestor de campañas.
* Un tablero virtual (VTT).
* Un sustituto de los libros oficiales.

Es un compendio optimizado para consulta rápida.

Nada más.

Y precisamente por eso puede centrarse completamente en la velocidad, la simplicidad y la experiencia de uso.

---

# Principios de diseño

Todas las decisiones técnicas del proyecto responden al menos a uno de estos principios.

## Offline First

La aplicación debe seguir funcionando aunque no exista conexión a Internet.

Toda la información necesaria reside en el propio dispositivo.

Durante el uso normal no existen peticiones a servidores externos.

---

## La velocidad es una funcionalidad

Buscar información no es una característica adicional.

Es el producto.

Cada capa de la aplicación está diseñada para minimizar el tiempo entre una pregunta y una respuesta.

---

## Independencia de los datos

Dungeon Archive nunca depende directamente de una fuente externa.

Los datos siempre pasan por un proceso de transformación antes de formar parte de la aplicación.

Esto permite cambiar el origen de los datos sin modificar el resto del código.

---

## Arquitectura antes que funcionalidades

Añadir pantallas es sencillo.

Cambiar una mala arquitectura no lo es.

El proyecto prioriza construir una base sólida antes de incorporar nuevas características.

---

# Arquitectura

```
                  Datos externos
                         │
                         ▼
             Pipeline de transformación
                         │
                         ▼
              Modelos internos normalizados
                         │
                         ▼
             Base de datos local (IndexedDB)
                         │
                         ▼
                API del Compendio
                         │
                         ▼
                  Aplicación React
```

Cada bloque tiene una única responsabilidad.

La interfaz desconoce completamente cómo se almacenan los datos.

La base de datos desconoce cómo fueron generados.

El pipeline desconoce cómo serán mostrados.

Esa separación permite evolucionar cada parte de forma independiente.

---

# Pipeline de datos

Una parte importante del proyecto ocurre antes incluso de ejecutar la aplicación.

Dungeon Archive no consume directamente los datos originales.

Primero los transforma.

```
5etools

↓

Lectura

↓

Validación

↓

Normalización

↓

Enriquecimiento

↓

Generación

↓

Compendio de Dungeon Archive
```

Durante este proceso se:

* eliminan estructuras innecesarias;
* validan registros incompletos;
* unifican formatos;
* generan identificadores estables;
* adaptan los modelos a las necesidades reales de la aplicación.

El resultado no es una copia de 5etools.

Es una base de datos diseñada específicamente para Dungeon Archive.

---

# Stack tecnológico

| Capa             | Tecnología        |
| ---------------- | ----------------- |
| Lenguaje         | TypeScript        |
| Interfaz         | React             |
| Build Tool       | Vite              |
| Estilos          | Tailwind CSS      |
| Persistencia     | IndexedDB + Dexie |
| Estado global    | Zustand           |
| Estado asíncrono | TanStack Query    |

Cada tecnología ha sido elegida por una responsabilidad concreta.

No existe ninguna dependencia únicamente por tendencia o popularidad.

---

# Organización del proyecto

```text
src/
│
├── app/
├── components/
├── features/
├── services/
├── shared/
└── generated/

scripts/
└── compendium/

docs/
└── adr/
```

El repositorio mantiene separadas las distintas responsabilidades del sistema.

La interfaz, la lógica de dominio, la infraestructura y la generación de datos evolucionan de forma independiente.

---

# Decisiones de arquitectura

Las decisiones importantes no quedan únicamente reflejadas en el código.

Cada cambio relevante se documenta mediante un **ADR (Architecture Decision Record)**.

Cada ADR responde tres preguntas:

* ¿Qué decisión se ha tomado?
* ¿Por qué se ha tomado?
* ¿Qué alternativas se descartaron?

El objetivo es que el conocimiento permanezca en el repositorio y no únicamente en quien escribió el código.

---

# Estado del proyecto

El proyecto se encuentra construyendo la infraestructura principal.

En esta fase se priorizan:

* el pipeline de generación;
* el modelo de datos;
* la persistencia offline;
* la arquitectura base;
* el motor de búsqueda.

Las funcionalidades visibles llegarán cuando la base técnica sea suficientemente sólida.

---

# Roadmap

## Infraestructura

* [ ] Pipeline completo de generación.
* [ ] Base de datos local.
* [ ] API del Compendio.

## Aplicación

* [ ] Buscador instantáneo.
* [ ] Navegación entre entidades.
* [ ] Favoritos.
* [ ] Historial.

## Calidad

* [ ] Cobertura de pruebas.
* [ ] Integración continua.
* [ ] Versionado automático.
* [ ] Documentación técnica completa.

---

# No objetivos

Dungeon Archive no pretende convertirse en una plataforma con decenas de funcionalidades.

Cada nueva característica debe responder afirmativamente a una única pregunta.

> **¿Reduce el tiempo que un jugador tarda en encontrar información durante una partida?**

Si la respuesta es no, probablemente no pertenece a este proyecto.

---

# Estado de madurez

| Área              | Estado           |
| ----------------- | ---------------- |
| Arquitectura      | 🟢 Estable       |
| Modelo de datos   | 🟡 En desarrollo |
| Pipeline          | 🟡 En desarrollo |
| Motor de búsqueda | 🟡 En desarrollo |
| Interfaz          | 🔵 Prototipo     |
| Documentación     | 🟢 Activa        |

---

# Sobre el proyecto

Dungeon Archive no pretende demostrar cuántas tecnologías puede utilizar.

Pretende demostrar que una buena arquitectura permite construir software sencillo de mantener, desacoplado y preparado para evolucionar.

Si dentro de unos años cambia la fuente de datos, cambia el framework o cambia la interfaz, el proyecto debería seguir funcionando prácticamente igual.

Esa es la verdadera meta.

---

## Licencia

Este proyecto se distribuye bajo licencia MIT.

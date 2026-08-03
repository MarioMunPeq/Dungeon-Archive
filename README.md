# Dungeon Archive

> *Una aplicación móvil **offline-first** que acompaña a la mesa de Dungeons & Dragons 5ª edición. Su único propósito es reducir el tiempo muerto durante la partida.*

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

Dungeon Archive es un **acompañante de mesa**. Se abre cuando aparece una pregunta, muestra la respuesta y se aparta. Nunca se convierte en el centro de atención.

Cada funcionalidad debe superar una única prueba:

> **¿Reduce el tiempo que los jugadores esperan porque alguien está buscando información?**

Si la respuesta es no, no pertenece a este proyecto.

Dungeon Archive **no es**:

* Un gestor de campañas.
* Un tablero virtual (VTT).
* Un creador de personajes ni un sustituto de la hoja de personaje.
* Un rastreador de combate o de iniciativa.
* Un cuaderno digital, una wiki ni una herramienta de worldbuilding.

Es un compendio de referencia con un contexto ligero de campaña.

---

# Qué es hoy

## Compendio

La base de datos de referencia completa de D&D 5e: **hechizos, condiciones, acciones, equipo, monstruos, objetos mágicos y dotes**. Se genera a partir de datos oficiales en tiempo de compilación y queda disponible sin conexión.

El Compendio es la fuente única de verdad de las reglas. Los datos del usuario guardan **referencias** (identificadores canónicos), nunca copias del contenido oficial.

## Búsqueda

El interfaz principal. Búsqueda instantánea y síncrona sobre todo el Compendio, con filtro por categoría y navegación con teclado. Resultados en milisegundos.

## Aventura (contexto de campaña)

Un contenedor ligero: título, descripción, objetivos, notas privadas del máster y referencias importantes ancladas. Una aventura activa; las anteriores pueden archivarse y restaurarse.

## Grupo (hojas de referencia ligeras)

Solo la información que se consulta durante la partida: identidad, nivel, sentidos pasivos, hechizos conocidos, equipo equipado y notas. Todo como referencias al Compendio; nada se duplica.

## Sesión

La lista de entidades ancladas para el encuentro actual, con la opción de cerrarla, y el historial de sesiones del máster.

## Favoritos y recientes

Acceso rápido a las entidades que importan.

## Detalle de entidad

Vistas completas con renderizado de contenido, entidades relacionadas y selección de versión/edición (2014 frente a 2024).

## Cloud Backup

Una copia de seguridad opcional del estado local en la nube (Firebase). No es una cuenta obligatoria ni un servicio de sincronización: es un respaldo manual para proteger los datos del usuario o trasladarlos a otro dispositivo.

* **Filosofía local-first.** Los datos del usuario viven siempre en este dispositivo (`localStorage`). La nube es solo una copia; nunca es la fuente de verdad.
* **Inicio de sesión opcional con Google.** Sin cuenta, la aplicación funciona exactamente igual. Si el build no incluye configuración de Firebase, la característica no existe: no se muestra la página, no hay acceso de navegación y no se carga ningún módulo de Firebase.
* **Sesión persistente.** La sesión de Google se restaura automáticamente al recargar; la página nunca muestra un botón de inicio de sesión a un usuario ya autenticado.
* **Subida manual.** Un botón reemplaza la copia en la nube con el estado local actual. Cada backup guarda la fecha, la versión de la aplicación y un resumen (aventuras, jugadores, favoritos y sesiones).
* **Detección de cambios.** Si los datos locales no han cambiado desde la última subida, el botón de subida se desactiva y muestra *Already up to date*. Una insignia indica *Backup current* o *Backup outdated* sin descargar nada en cada carga.
* **Restauración con previsualización.** Antes de restaurar se muestra el contenido del backup (fecha, aventuras, jugadores, favoritos, sesiones) y se pide confirmación porque sobrescribe datos locales.
* **Comportamiento offline.** La subida y la restauración requieren conexión y se desactivan al estar sin conexión, con un aviso *Offline*. El resto de la aplicación sigue funcionando sin conexión en todo momento.
* **Errores legibles.** Los errores de Firebase se traducen a mensajes claros (*Sign in was cancelled.*, *You're offline.*, *You don't have access to this backup.*). Los mensajes internos de Firebase nunca se muestran.
* **Sin sincronización automática.** No hay sincronización, fusión de cambios ni historial. Subida y restauración son acciones explícitas del usuario.

### Configuración de Firebase

El backup se activa solo si el build incluye configuración de Firebase web:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com) y añade una app web.
2. Activa **Google** como método de inicio de sesión y añade tu dominio desplegado a los dominios autorizados.
3. Despliega las reglas de Firestore de [docs/firebase.md](docs/firebase.md) (un documento por usuario, solo accesible por `request.auth.uid`).
4. Copia `.env.example` a `.env` y rellena las variables `VITE_FIREBASE_*`.
5. Compila la aplicación (`pnpm build`).

### Cómo desplegar

1. `pnpm verify` — typecheck, lint, tests y build en verde.
2. Publica la carpeta `dist/` en GitHub Pages (el workflow de GitHub Actions lo hace automáticamente).
3. Comprueba en la URL pública: inicio de sesión con Google, restauración de sesión al recargar, subida, y restauración desde otro dispositivo con la misma cuenta.

### Cómo desactivar la nube por completo

* Elimina `.env` (o deja vacías las variables `VITE_FIREBASE_*`) y vuelve a compilar. Sin configuración, la ruta `/backup` no se registra y `firebase/*` nunca se importa.
* Para eliminar los datos ya subidos, borra los documentos `users/{uid}/backup` en Firestore.

La seguridad del backend está documentada en [docs/firebase.md](docs/firebase.md).

---

# Arquitectura

```
5etools (datos oficiales, read-only)
        │
        ▼
Scripts de compilación (scripts/compendium)
        │
        ▼
JSON estático (src/generated/compendium)
        │
        ▼
API del Compendio (src/compendium)
        │
        ▼
Aplicación React
```

* Los datos externos se procesan en tiempo de compilación y nunca se acceden directamente en tiempo de ejecución.
* El Compendio vive en memoria tras una única carga inicial; el acceso es síncrono.
* El estado del usuario (favoritos, recientes, aventura, grupo, sesión) se guarda en `localStorage` con migraciones versionadas.
* Toda la aplicación funciona sin conexión. No hay servidor. El inicio de sesión y el backup en la nube son opcionales y están aislados.

---

# Stack tecnológico

| Capa         | Tecnología                          |
| ------------ | ----------------------------------- |
| Lenguaje     | TypeScript (strict)                 |
| Interfaz     | React 19                            |
| Build Tool   | Vite                                |
| Estilos      | Tailwind CSS (tokens de diseño)     |
| Estado       | Zustand + persistencia en localStorage |
| Ruteo        | React Router                        |
| Offline      | PWA (service worker)                |
| Datos        | JSON estático generado en build     |
| Backup       | Firebase (App, Auth, Firestore), opcional y de carga diferida |

Cada tecnología tiene una responsabilidad concreta. No existe ninguna dependencia por tendencia o popularidad.

---

# Organización del proyecto

```text
src/
│
├── app/            # Router, layout, arranque
├── features/       # Páginas por área (home, search, adventure, party, session, backup, compendium)
├── compendium/     # API de lectura del Compendio (carga, búsqueda, repositorio)
├── components/     # Componentes compartidos de UI y de entidad
├── user-state/     # Estado persistente del usuario (store, migraciones, normalización)
├── sync/           # Backup en la nube (config, gateway, servicio, adaptador Firebase)
├── adapter/        # Tipos de fuentes externas (5etools)
├── generated/      # JSON del Compendio generado en build
├── types/          # Tipos del dominio
├── config/         # Constantes de configuración
└── shared/         # Primitivas compartidas (sin lógica de negocio)

scripts/
└── compendium/     # Pipeline de generación del Compendio

docs/               # Documentación técnica y de producto
```

---

# Roadmap

Las prioridades están en [docs/roadmap.md](docs/roadmap.md).

* **Alto:** hojas de referencia de jugador, historial de sesiones, mejoras del Compendio y de la búsqueda, rendimiento, offline, velocidad de navegación.
* **Bajo:** mejoras de campaña, pulido visual, temas.
* **Excluido permanentemente:** todo lo que aparece en [docs/anti-features.md](docs/anti-features.md).

---

# Estado del proyecto

| Área               | Estado                     |
| ------------------ | -------------------------- |
| Compendio          | 🟢 Operativo (7 categorías) |
| Búsqueda           | 🟢 Operativa                |
| Aventura           | 🟢 Operativa                |
| Grupo              | 🟢 Operativo (referencias)  |
| Sesión             | 🟢 Operativa                |
| Offline            | 🟢 Operativo (PWA)          |
| Backup en la nube  | 🟢 Operativo (opcional)     |
| Documentación      | 🟢 Activa                   |

---

# Sobre el proyecto

Dungeon Archive no pretende demostrar cuántas tecnologías puede utilizar.

Pretende demostrar que un producto enfocado puede resolver un problema real: **el tiempo que se pierde buscando información en una mesa de D&D**.

Si dentro de unos años cambia la fuente de datos, cambia el framework o cambia la interfaz, la idea central — consulta rápida, contexto ligero, sin servidor — debería seguir intacta.

---

## Licencia

Este proyecto se distribuye bajo licencia MIT.

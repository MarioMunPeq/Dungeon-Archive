import type { en } from "./en";

/**
 * Spanish messages.
 *
 * Terminology follows the official Spanish editions of D&D 5e (Edge
 * Entertainment 2017-2018 and the SRD 5.1 ES published by Wizards of the
 * Coast), which is also what Spanish tables actually say out loud:
 *
 *   spell        hechizo / conjuro            spellcasting   lanzamiento de hechizos
 *   cantrip      Truco              ability        característica
 *   skill        habilidad                    saving throw   tirada de salvación
 *   check        prueba de característica     proficiency    bonificación por competencia
 *   action       acción                       bonus action   acción de bonus
 *   hit points   puntos de vida               armor class    clase de armadura (CA)
 *   difficulty   clase de dificultad (CD)     attunement     sintonización
 *   condition    estado                       feat           dote
 *   creature     criatura                     boon/curse     deseo/maldición
 *
 * `Record<keyof typeof en, string>` keeps this file exhaustive: forgetting a
 * key or adding a stray one fails `pnpm typecheck`.
 */
export const es: Record<keyof typeof en, string> = {
  "nav.home": "Inicio",
  "nav.archive": "Archivo",
  "nav.combat": "Combate",
  "nav.dice": "Dados",
  "nav.character": "Personaje",
  "nav.main": "Navegación principal",

  "page.archive": "Archivo",
  "page.combat": "Combate",
  "page.character": "Personaje",
  "page.dice": "Dados",
  "page.help": "Ayuda",
  "page.session": "Sesión",
  "page.backup": "Copia de seguridad",
  "page.debug": "Depuración",
  "page.notFound": "Página no encontrada",

  "a11y.back": "Volver",
  "a11y.cloudBackup": "Copia de seguridad en la nube",
  "a11y.help": "Ayuda",
  "a11y.language": "Idioma",
  "a11y.switchToEnglish": "Cambiar a inglés",
  "a11y.switchToSpanish": "Cambiar a español",
  "a11y.close": "Cerrar",
  "a11y.breadcrumb": "Ruta de navegación",

  "theme.accent": "Tema de acento",

  "tab.search": "Buscar",
  "tab.howToPlay": "Cómo jugar",
  "tab.rules": "Reglas",
  "tab.glossary": "Glosario",

  "category.spell.one": "Hechizo",
  "category.spell.many": "Hechizos",
  "category.monster.one": "Monstruo",
  "category.monster.many": "Monstruos",
  "category.equipment.one": "Equipo",
  "category.equipment.many": "Equipo",
  "category.condition.one": "Estado",
  "category.condition.many": "Estados",
  "category.action.one": "Acción",
  "category.action.many": "Acciones",
  "category.magicitem.one": "Objeto mágico",
  "category.magicitem.many": "Objetos mágicos",
  "category.feat.one": "Dote",
  "category.feat.many": "Dotes",

  "school.A": "Abjuración",
  "school.C": "Conjuración",
  "school.D": "Adivinación",
  "school.E": "Encantamiento",
  "school.I": "Ilusión",
  "school.N": "Necromancia",
  "school.T": "Transmutación",
  "school.V": "Evocación",

  "damage.B": "Contundente",
  "damage.P": "Perforante",
  "damage.S": "Cortante",
  "damage.A": "Ácido",
  "damage.C": "Frío",
  "damage.F": "Fuego",
  "damage.L": "Rayo",
  "damage.T": "Trueno",
  "damage.R": "Radiante",
  "damage.N": "Necrótico",
  "damage.Y": "Psíquico",
  "damage.Poison": "Veneno",

  "rarity.common": "Común",
  "rarity.uncommon": "Poco común",
  "rarity.rare": "Raro",
  "rarity.very rare": "Muy raro",
  "rarity.legendary": "Legendario",
  "rarity.artifact": "Artefacto",

  "equip.$A": "Objeto de arte",
  "equip.$C": "Moneda",
  "equip.$G": "Gema",
  "equip.AF": "Munición de arma de fuego",
  "equip.AIR": "Dirigible",
  "equip.EXP": "Explosivo",
  "equip.FD": "Comida y bebida",
  "equip.GS": "Juego",
  "equip.MNT": "Montura",
  "equip.SCF": "Foco canalizador",
  "equip.SHP": "Barco",
  "equip.TAH": "Arreos y enganche",
  "equip.TB": "Barra de lingote",
  "equip.VEH": "Vehículo",
  "equip.WD": "Varita",
  "equip.G": "Atrezo",
  "equip.T": "Herramienta",

  "term.cantrip": "Truco",
  "term.level": "Nivel {level}",
  "term.cr": "CR",
  "term.levelValue": "Nivel",
  "term.damage": "Daño",
  "term.attunement": "Sintonización",
  "term.requiresAttunement": "Requiere sintonización",
  "term.repeatable": "Repetible",
  "term.prerequisite": "Requisito previo",
  "term.notRepeatable": "No repetible",
  "term.hasPrerequisite": "Tiene requisito previo",
  "term.noPrerequisite": "Sin requisito previo",

  "filter.all": "Todos",
  "filter.yes": "Sí",
  "filter.no": "No",
  "filter.none": "Ninguno",
  "filter.required": "Requerida",
  "filter.level": "Nivel",
  "filter.school": "Escuela",
  "filter.class": "Clase",
  "filter.concentration": "Concentración",
  "filter.ritual": "Ritual",
  "filter.source": "Fuente",
  "filter.rarity": "Rareza",
  "filter.type": "Tipo",
  "filter.size": "Tamaño",
  "filter.attunement": "Sintonización",
  "filter.prerequisite": "Requisito previo",
  "filter.repeatable": "Repetible",
  "filter.damageType": "Tipo de daño",
  "filter.property": "Propiedad",
  "filter.cr": "CR",
  "filter.clear": "Borrar filtros",
  "filter.active": "Filtros activos",

  "sort.alphabetical": "Alfabético",
  "sort.recent": "Añadidos recientemente",
  "sort.challengeRating": "Grado de desafío",
  "sort.label": "Orden",

  "common.done": "Listo",
  "common.cancel": "Cancelar",
  "common.save": "Guardar",
  "common.delete": "Eliminar",
  "common.edit": "Editar",
  "common.close": "Cerrar",
  "common.clearAll": "Borrar todo",
  "common.add": "Añadir",
  "common.remove": "Quitar",
  "common.removeItem": "Quitar {subject}",
  "common.about": "Sobre {subject}",
  "common.clearValue": "Borrar {subject}",
  "common.search": "Buscar",
  "common.results": "{count} resultados",
  "term.levelShort": "Nv {level}",

  "spell.castingTime": "Tiempo de lanzamiento",
  "spell.range": "Alcance",
  "spell.duration": "Duración",
  "spell.components": "Componentes",
  "spell.classes": "Clases",
  "spell.description": "Descripción",
  "spell.higherLevels": "En niveles superiores",
  "spell.component.verbal": "Verbal",
  "spell.component.somatic": "Somático",
  "spell.component.material": "Material",
  "spell.abbrev.concentration": "Con.",
  "spell.abbrev.ritual": "Rit.",

  "help.ritualCasting.title": "¿Qué es lanzar como ritual?",
  "help.ritualCasting.body":
    "Un ritual tarda 10 minutos extra en lanzarse, pero no gasta un espacio de hechizo.",
  "help.concentration.title": "¿Qué es la concentración?",
  "help.concentration.body":
    "El hechizo termina antes si lanzas otro hechizo de concentración o pierdes el enfoque.",
  "help.spellSchool.body": "El estilo de magia al que pertenece el hechizo.",

  "spellPicker.title": "Seleccionar hechizos",
  "spellPicker.close": "Cerrar el selector de hechizos",
  "spellPicker.searchPlaceholder": "Buscar hechizos…",
  "spellPicker.searchLabel": "Buscar hechizos",
  "spellPicker.knownCount": "{count} conocidos",
  "spellPicker.forClass": "Para {class}",
  "spellPicker.allSpells": "Todos los hechizos",
  "spellPicker.whichToShow": "Qué hechizos mostrar",
  "spellPicker.aboutList": "Sobre esta lista de hechizos",
  "spellPicker.aboutListBody":
    "«Para {class}» muestra solo los hechizos que un {class} puede elegir. Cambia a «Hechizos» para ver todos los hechizos del Compendio.",
  "spellPicker.levelLabel": "Nivel del hechizo",
  "spellPicker.removeFilter": "Quitar el filtro {label}: {value}",
  "spellPicker.resultCount": "{count} hechizos",
  "spellPicker.emptyWithFilters": "No se han encontrado hechizos",
  "spellPicker.emptyWithFiltersBody": "Prueba otra búsqueda o borra algunos filtros.",
  "spellPicker.emptyForClass": "No hay hechizos para {class}",
  "spellPicker.emptyForClassBody": "Puede que este Compendio no incluya hechizos de esta clase.",
  "spellPicker.showAll": "Mostrar todos los hechizos",

  "class.Barbarian": "Bárbaro",
  "class.Bard": "Bardo",
  "class.Cleric": "Clérigo",
  "class.Druid": "Druida",
  "class.Fighter": "Guerrero",
  "class.Monk": "Monje",
  "class.Paladin": "Paladín",
  "class.Ranger": "Explorador",
  "class.Rogue": "Pícaro",
  "class.Sorcerer": "Hechicero",
  "class.Warlock": "Brujo",
  "class.Wizard": "Mago",
  "class.Artificer": "Artífice",

  "subclass.Berserker": "Berserker",
  "subclass.Wild Heart": "Corazón Salvaje",
  "subclass.World Tree": "Árbol del Mundo",
  "subclass.Zealot": "Zealote",
  "subclass.College of Dance": "Colegio de la Danza",
  "subclass.College of Glamour": "Colegio del Glamour",
  "subclass.College of Lore": "Colegio del Saber",
  "subclass.College of Valor": "Colegio del Valor",
  "subclass.College of Whispers": "Colegio de los Susurros",
  "subclass.College of Swords": "Colegio de las Espadas",
  "subclass.Life Domain": "Dominio de la Vida",
  "subclass.Light Domain": "Dominio de la Luz",
  "subclass.Trickery Domain": "Dominio del Engaño",
  "subclass.War Domain": "Dominio de la Guerra",
  "subclass.Knowledge Domain": "Dominio del Conocimiento",
  "subclass.Nature Domain": "Dominio de la Naturaleza",
  "subclass.Tempest Domain": "Dominio de la Tempestad",
  "subclass.Twilight Domain": "Dominio del Crepúsculo",
  "subclass.Forge Domain": "Dominio de la Fragua",
  "subclass.Circle of the Land": "Círculo de la Tierra",
  "subclass.Circle of the Moon": "Círculo de la Luna",
  "subclass.Circle of the Sea": "Círculo del Mar",
  "subclass.Circle of the Stars": "Círculo de las Estrellas",
  "subclass.Circle of Wildfire": "Círculo del Fuego",
  "subclass.Battle Master": "Maestro de Combate",
  "subclass.Champion": "Campeón",
  "subclass.Eldritch Knight": "Caballero Arcano",
  "subclass.Psi Warrior": "Guerrero Psi",
  "subclass.Arcane Archer": "Arquero Arcano",
  "subclass.Samurai": "Samurái",
  "subclass.Way of the Open Hand": "Senda de la Mano Abierta",
  "subclass.Way of Shadow": "Senda de la Sombra",
  "subclass.Way of the Four Elements": "Senda de los Cuatro Elementos",
  "subclass.Way of Mercy": "Senda de la Misericordia",
  "subclass.Way of the Astral Self": "Senda del Ser Astral",
  "subclass.Way of the Kensei": "Senda del Kensei",
  "subclass.Oath of Devotion": "Juramento de Devoción",
  "subclass.Oath of the Ancients": "Juramento de los Ancestros",
  "subclass.Oath of Vengeance": "Juramento de Venganza",
  "subclass.Oath of Conquest": "Juramento de Conquista",
  "subclass.Oath of Redemption": "Juramento de Redención",
  "subclass.Oath of Glory": "Juramento de Gloria",
  "subclass.Oath of the Watchers": "Juramento de los Vigilantes",
  "subclass.Hunter": "Cazador",
  "subclass.Beast Master": "Domador de Fieras",
  "subclass.Fey Wanderer": "Errante Feérico",
  "subclass.Gloom Stalker": "Acechador Sombrío",
  "subclass.Horizon Walker": "Caminante del Horizonte",
  "subclass.Swarmkeeper": "Custodio de Enjambres",
  "subclass.Drakewarden": "Guardián de Dragones",
  "subclass.Thief": "Ladrón",
  "subclass.Assassin": "Asesino",
  "subclass.Arcane Trickster": "Engañador Arcano",
  "subclass.Soulknife": "Cuchillo del Alma",
  "subclass.Phantom": "Fantasma",
  "subclass.Inquisitive": "Inquisitivo",
  "subclass.Swashbuckler": "Espadachín",
  "subclass.Draconic Bloodline": "Linaje Dracónico",
  "subclass.Wild Magic": "Magia Salvaje",
  "subclass.Aberrant Mind": "Mente Aberrante",
  "subclass.Clockwork Soul": "Alma Relojera",
  "subclass.Divine Soul": "Alma Divina",
  "subclass.Shadow Magic": "Magia Sombría",
  "subclass.The Archfey": "El Archifeo",
  "subclass.The Fiend": "El Infernal",
  "subclass.The Great Old One": "El Gran Antiguo",
  "subclass.The Celestial": "El Celestial",
  "subclass.The Hexblade": "La Espada Oscura",
  "subclass.The Genie": "El Genio",
  "subclass.The Undead": "El No Muerto",
  "subclass.The Fathomless": "El Abisal",
  "subclass.Bladesinging": "Canto del Acero",
  "subclass.War Magic": "Magia de Guerra",
  "subclass.Alchemist": "Alquimista",
  "subclass.Artillerist": "Artillero",
  "subclass.Battle Smith": "Herrero de Combate",
  "subclass.Armorer": "Armero",

  "character.classLineSeparator": "·",
  "character.noClassYet": "Añade clase, subclase y nivel",
  "character.combat": "Combate",
  "character.abilities": "Características",
  "character.notes": "Notas",
  "character.weapons": "Armas",
  "character.armorClass": "CA",
  "character.perception": "Percepción",
  "character.spellDc": "CD",
  "character.openInCompendium": "Abrir en el Compendio",
  "character.addNote": "Añadir una nota rápida…",
  "character.notePlaceholder": "Un recordatorio rápido…",
  "character.remove": "Quitar",
  "character.add": "Añadir",
  "character.addMore": "+ Añadir",
  "character.empty": "Ninguno",
  "character.removeTitle": "¿Quitar a {name}?",
  "character.removeBody":
    "Esto elimina sus números de combate, sus características y sus referencias. No se puede deshacer.",
  "character.picker.weapons": "Armas",
  "character.picker.magicItems": "Objetos mágicos",
  "character.newCharacter": "Nuevo personaje",
  "character.name": "Nombre",
  "character.subclass": "Subclase",
  "character.editClassLine": "Editar clase, subclase y nivel",
  "character.emptyTitle": "Todavía no hay ningún personaje",
  "character.emptyBody":
    "Añade tu personaje para empezar a llevar las características, los valores de combate y los hechizos y objetos que más usas.",
  "character.createFirst": "Crea tu primer personaje",

  "help.combatStats.title": "¿Qué son los valores de combate?",
  "help.combatStats.body":
    "Los números que consultas en cada combate. La Clase de Armadura es lo que los enemigos deben superar para golpearte. La Percepción pasiva detecta cosas ocultas.",
  "help.armorClass.body":
    "La Clase de Armadura es lo que los enemigos deben superar para golpearte.",
  "help.passivePerception.body":
    "La Percepción pasiva indica cuánto detectas de lo oculto sin intentarlo.",
  "help.spellSaveDc.body":
    "La CD de tirada de salvación de hechizos es el número que los enemigos deben superar para resistir tus hechizos.",
  "help.abilityScores.title": "¿Qué son las características?",
  "help.abilityScores.body":
    "Seis valores describen los puntos fuertes de tu personaje. El modificador de debajo es la bonificación que añades a las tiradas: valores más altos, bonificaciones mayores.",
  "help.characterSpells.body":
    "Hechizos que tu personaje puede lanzar. Añade los que más uses para tenerlos a mano.",
  "help.characterWeapons.body": "Las armas que lleva tu personaje, con su daño de un vistazo.",
  "help.characterMagicItems.body":
    "Objetos mágicos que posee tu personaje. Añade los que consultas durante la partida.",

  "archive.sections": "Secciones del Archivo",
  "onboarding.welcome": "Bienvenido a Dungeon Archive",
  "onboarding.skip": "Omitir",
  "onboarding.next": "Siguiente",
  "onboarding.start": "Empezar a explorar",
  "onboarding.step1.title": "Busca en el Compendio al instante.",
  "onboarding.step1.body":
    "Cada hechizo, monstruo, objeto y estado del Compendio está a unas pocas pulsaciones.",
  "onboarding.step2.title": "Fija lo que quieras en tu Sesión.",
  "onboarding.step2.body":
    "Ten a mano los monstruos, hechizos y objetos que necesitas ahora mismo durante la partida.",
  "onboarding.step3.title": "Aprende las reglas mientras juegas.",
  "onboarding.step3.body":
    "¿Eres nuevo? La pestaña Reglas del Archivo explica el d20, las pruebas de característica y tu turno en combate.",
  "onboarding.step4.title": "Ya estás listo. Empieza a explorar.",
  "onboarding.step4.body": "Todo se queda en este dispositivo. Busca, fija y dirige tu partida.",

  "helpPage.quickHelp": "Ayuda rápida",
  "helpPage.longPress":
    "Mantén pulsado cualquier valor, característica u objeto para ver qué significa.",
  "helpPage.beginnerTips":
    "La pestaña Reglas del Archivo tiene un interruptor de consejos para principiantes que muestra pequeños ayudantes ? junto a las reglas mientras juegas.",
  "helpPage.aboutProject": "Sobre este proyecto",
  "helpPage.aboutBody":
    "Dungeon Archive es un proyecto personal: un compañero móvil para jugadores de rol de mesa, pensado para dejarlo junto a la mesa y resolver dudas de reglas en segundos. Cada pantalla se contrasta con un Design DNA escrito antes de publicarse.",

  "combat.action": "Acción",
  "combat.actionHelp":
    "Atacar, lanzar un hechizo, esquivar, esconderse, retirarse o usar un objeto.",
  "combat.bonusAction": "Acción de bonus",
  "combat.bonusActionHelp":
    "Una pequeña acción adicional que concede una característica, un hechizo o un objeto.",
  "combat.movement": "Movimiento",
  "combat.movementHelp":
    "Muévete hasta tu velocidad (normalmente 9 m), repartiéndolo como quieras durante tu turno.",
  "combat.reaction": "Reacción",
  "combat.reactionHelp": "Una respuesta a algo que ocurre, como un ataque de oportunidad.",
  "combat.hitPoints": "Puntos de vida",
  "combat.current": "Actuales",
  "combat.currentHp": "Puntos de vida actuales",
  "combat.max": "Máx.",
  "combat.maxHp": "Puntos de vida máximos",
  "combat.belowHalf": "Por debajo de la mitad: ¡tu personaje está malherido!",
  "combat.stats": "Valores",
  "combat.statsHelp":
    "Estos son tus valores de combate. Edítalos en tu personaje, en la pestaña Personaje.",
  "combat.perceptionHelp": "Un valor que sirve para detectar cosas ocultas sin tirar dados.",
  "combat.conditions": "Estados",
  "combat.onYourTurn": "En tu turno",
  "combat.onYourTurnHelp.title": "¿Qué puedo hacer en mi turno?",
  "combat.onYourTurnHelp.body":
    "Cada ronda tienes una Acción, una Acción de bonus y una Reacción. También puedes moverte hasta tu velocidad y repartir el movimiento como prefieras. Toca una fila cuando la hayas usado en este turno y pulsa «Siguiente turno» al terminar.",
  "combat.nextTurn": "Siguiente turno",
  "combat.noConditionDescription": "No hay descripción disponible para este estado.",
  "combat.emptyBody":
    "Añade tu personaje en la pestaña Personaje y vuelve aquí para llevar los puntos de vida durante el combate.",
  "combat.goToCharacter": "Ir a Personaje",
  "help.combatStats.short": "¿Qué son estos números?",
  "help.hitPoints.title": "¿Qué son los puntos de vida?",
  "help.hitPoints.body":
    "Los puntos de vida (PV) indican cuánto daño puedes resistir. El daño reduce tus PV actuales; al llegar a 0 quedas inconsciente. La curación los devuelve.",

  "condition.blinded": "Cegado",
  "condition.charmed": "Encantado",
  "condition.deafened": "Ensordecido",
  "condition.exhaustion": "Agotamiento",
  "condition.frightened": "Asustado",
  "condition.grappled": "Agarrado",
  "condition.incapacitated": "Incapacitado",
  "condition.invisible": "Invisible",
  "condition.paralyzed": "Paralizado",
  "condition.petrified": "Petrificado",
  "condition.poisoned": "Envenenado",
  "condition.prone": "Derribado",
  "condition.restrained": "Inmovilizado",
  "condition.stunned": "Aturdido",
  "condition.unconscious": "Inconsciente",

  // ---- Combate: definiciones de estados ----
  "condition.def.blinded": "Estás ciego. Fallas automáticamente cualquier prueba de característica que requiera visión. Las tiradas de ataque contra ti tienen ventaja, y tus tiradas de ataque tienen desventaja.",
  "condition.def.charmed": "No puedes atacar a quien te encanta ni serle objetivo de facultades dañinas. Quien te encanta tiene ventaja en las pruebas de característica para interactuar socialmente contigo.",
  "condition.def.deafened": "Estás ensordecido. Fallas automáticamente cualquier prueba de característica que requiera oído.",
  "condition.def.exhaustion": "Sufres agotamiento. Tiene seis niveles. Cada nivel añade penalizaciones: 1 — desventaja en pruebas de característica; 2 — velocidad a la mitad; 3 — desventaja en ataques y tiradas de salvación; 4 — PV máximos a la mitad; 5 — velocidad 0; 6 — muerte.",
  "condition.def.frightened": "Tienes desventaja en pruebas de característica y tiradas de ataque mientras la fuente de tu miedo esté a la vista. No puedes acercarte voluntariamente a ella.",
  "condition.def.grappled": "Tu velocidad es 0 y no puedes beneficiarte de bonificaciones a tu velocidad. El estado termina si quien te agarra queda incapacitado o sales de su alcance.",
  "condition.def.incapacitated": "No puedes realizar acciones ni reacciones.",
  "condition.def.invisible": "No pueden verte sin magia o un sentido especial. Tienes ventaja en tiradas de ataque; las tiradas de ataque contra ti tienen desventaja.",
  "condition.def.paralyzed": "Estás incapacitado, no puedes moverte ni hablar, y fallas automáticamente las tiradas de salvación de Fuerza y Destreza. Las tiradas de ataque contra ti tienen ventaja, y cualquier impacto a 1,5 m (5 ft) es un golpe crítico.",
  "condition.def.petrified": "Te conviertes en piedra, quedas incapacitado y no puedes moverte ni hablar. No percibes tu entorno. Las tiradas de ataque contra ti tienen ventaja. Tienes resistencia a todo daño, pero inmunidad a veneno y enfermedad.",
  "condition.def.poisoned": "Tienes desventaja en tiradas de ataque y pruebas de característica.",
  "condition.def.prone": "Estás tumbado (derribado). Solo puedes arrastrarte a menos que te levantes. Tienes desventaja en tiradas de ataque. Los ataques contra ti tienen ventaja a 1,5 m (5 ft); más lejos, desventaja.",
  "condition.def.restrained": "Tu velocidad es 0 y no puedes beneficiarte de bonificaciones a la velocidad. Las tiradas de ataque contra ti tienen ventaja, y las tuyas desventaja. Tienes desventaja en tiradas de salvación de Destreza.",
  "condition.def.stunned": "Estás incapacitado, no puedes moverte y solo puedes hablar balbuceando. Fallas automáticamente las tiradas de salvación de Fuerza y Destreza. Las tiradas de ataque contra ti tienen ventaja.",
  "condition.def.unconscious": "Estás incapacitado, no puedes moverte ni hablar, y no percibes tu entorno. Dejas caer lo que sujetas y caes derribado. Fallas automáticamente las tiradas de salvación de Fuerza y Destreza. Las tiradas de ataque contra ti tienen ventaja, y cualquier impacto a 1,5 m (5 ft) es un golpe crítico.",

  // ---- Archivo: pestaña Reglas ----
  "rules.beginnerTips": "Consejos para principiantes",
  "rules.beginnerTipsBody": "Muestra los ayudantes ? que explican las reglas sobre la marcha.",
  "rules.beginnerTipsToggle": "Alternar los consejos para principiantes",
  "rules.hitPoints.titleHelp": "PV",

  "rules.d20.title": "El d20",
  "rules.d20.summary":
    "Casi todas las pruebas de D&D empiezan tirando un dado de 20 caras, el d20. Cuanto más alto sale, mejor.",
  "rules.d20.point1": "Tira el d20 y suma el modificador de la característica que estés usando.",
  "rules.d20.point2": "Supera o iguala el número de dificultad (CD) para tener éxito.",
  "rules.d20.point3":
    "Ventaja: tira dos veces y quédate con la más alta. Desventaja: tira dos veces y quédate con la más baja.",
  "rules.d20.help":
    "Un «1» en una tirada de ataque es un fallo crítico y siempre falla. Un «20» es un golpe crítico: siempre acieta y además inflige daño adicional.",

  "rules.checks.title": "Pruebas de característica",
  "rules.checks.titleHelp": "FUE · DES · CON · INT · SAB · CAR",
  "rules.checks.summary":
    "Cuando intentas algo arriesgado, el DM te pide una prueba de característica usando una de tus seis características.",
  "rules.checks.point1": "Fuerza (FUE): empujar, levantar, romper.",
  "rules.checks.point2":
    "Destreza (DES): moverte a hurtadillas, mantener el equilibrio, reaccionar.",
  "rules.checks.point3":
    "Constitución (CON): resistir veneno, agotamiento, mantener la concentración.",
  "rules.checks.point4": "Inteligencia (INT): recordar, resolver, investigar.",
  "rules.checks.point5": "Sabiduría (SAB): percatarse, intuir peligro, leer a la gente.",
  "rules.checks.point6": "Carisma (CAR): convencer, actuar, intimidar.",
  "rules.checks.help":
    "Tu modificador de característica es la bonificación que te da tu puntuación: 10 da +0, 12 da +1, 14 da +2, y así sucesivamente.",

  "rules.saves.title": "Tiradas de salvación",
  "rules.saves.summary":
    "Cuando un hechizo o una trampa intenta afectarte, tiras una tirada de salvación para resistirte.",
  "rules.saves.point1":
    "El DM te indica qué característica debes usar (por ejemplo: «haz una tirada de salvación de Destreza»).",
  "rules.saves.point2": "Tira el d20 y suma el modificador de esa característica.",
  "rules.saves.point3":
    "Si superas la CD del hechizo, el efecto se reduce o se evita por completo.",

  "rules.turn.title": "Tu turno en combate",
  "rules.turn.titleHelp": "Acción · Acción de bonus · Movimiento · Reacción",
  "rules.turn.summary": "En tu turno puedes hacer varias cosas, en el orden que quieras.",
  "rules.turn.point1": "Movimiento: muévete hasta tu velocidad (normalmente 9 m).",
  "rules.turn.point2":
    "Acción: atacar, lanzar un hechizo, esquivar, esconderte o hacer cualquier otra cosa.",
  "rules.turn.point3":
    "Acción de bonus: una acción adicional pequeña si alguna característica o hechizo te la concede.",
  "rules.turn.point4":
    "Reacción: una respuesta especial a algo que activa otra persona, una vez por ronda.",
  "rules.turn.help":
    "Solo tienes una Acción, una Acción de bonus y una Reacción por ronda: ¡úsalas con cabeza!",

  "rules.attacks.title": "Ataques y daño",
  "rules.attacks.summary":
    "Para atacar, tira un d20 y suma tu bonificación de ataque. Si aciertas, tira el daño.",
  "rules.attacks.point1":
    "Tirada de ataque: d20 + bonificación de ataque contra la Clase de Armadura (CA) del objetivo.",
  "rules.attacks.point2":
    "Tirada de daño: los dados del arma o del hechizo, más tu modificador de característica.",
  "rules.attacks.point3":
    "Críticos: un 20 natural siempre acieta y se tiran los dados de daño por duplicado.",

  "rules.rest.title": "Puntos de vida y descansos",
  "rules.rest.summary":
    "Tus puntos de vida (PV) indican cuánto castigo puede aguantar tu personaje.",
  "rules.rest.point1": "El daño te resta PV. Con 0 PV quedas inconsciente.",
  "rules.rest.point2": "Descanso corto: 1 hora; gastas dados de golpe para curarte.",
  "rules.rest.point3":
    "Descanso largo: 8 horas; recuperas todos tus PV y la mitad de tus dados de golpe.",
  "rules.rest.help":
    "Lleva el control de tus PV actuales en la pestaña Combate durante la partida.",

  "rules.spellcasting.title": "Lanzamiento de hechizos",
  "rules.spellcasting.summary":
    "Lanzar un hechizo gasta una Acción, salvo que el hechizo indique lo contrario.",
  "rules.spellcasting.point1":
    "Ataque de hechizo: tira d20 + tu bonificación de ataque de hechizo contra la CA del objetivo.",
  "rules.spellcasting.point2":
    "Tirada de salvación: el objetivo tira contra la CD de tirada de salvación de tus hechizos.",
  "rules.spellcasting.point3":
    "Concentración: si el hechizo lo indica, la pierdes cuando recibes daño y fallas una tirada de salvación de Constitución.",
  "rules.spellcasting.help":
    "Tu CD de tirada de salvación de hechizos y tu bonificación de ataque de hechizo están en tu personaje, en la pestaña Personaje.",

  // ---- Archivo: pestaña Cómo jugar ----
  "howToPlay.1.title": "Tu personaje no será bueno en todo, y eso está bien.",
  "howToPlay.1.body":
    "Todas las clases tienen puntos fuertes y débiles. Fallar una tirada de vez en cuando forma parte del juego; no significa que lo estés haciendo mal.",
  "howToPlay.2.title": "La sesión no va solo sobre ti.",
  "howToPlay.2.body":
    "Algunas escenas toman el protagonismo de otros personajes. Eso no significa que tengas que quedarte fuera: reacciona, participa, apoya a quien tenga el foco sin robarle la escena.",
  "howToPlay.3.title": "El objetivo es divertirse, no «ganar».",
  "howToPlay.3.body":
    "No hay marcador. Una buena sesión es aquella en la que todo el mundo en la mesa lo pasa bien, tú incluido, aunque las cosas no salgan como esperabas.",
  "howToPlay.4.title": "Participa activamente.",
  "howToPlay.4.body":
    "Describe lo que hace tu personaje, no te limites a tirar dados. Preguntar «¿qué veo, qué siento o qué sé de esto?» siempre es una acción válida.",

  // ---- Archivo: pestaña Glosario ----
  "glossary.ac.term": "CA",
  "glossary.ac.definition":
    "Clase de Armadura. Qué tan difícil es acertarte: un ataque impacta cuando su total iguala o supera tu CA.",
  "glossary.abilityCheck.term": "Prueba de característica",
  "glossary.abilityCheck.definition":
    "Una tirada de d20 más un modificador de característica, que haces cuando intentas algo arriesgado, como una prueba de Destreza para equilibrarte sobre una viga.",
  "glossary.action.term": "Acción",
  "glossary.action.definition":
    "La acción principal de tu turno: atacar, lanzar un hechizo, esquivar, esconderte o usar un objeto.",
  "glossary.advantage.term": "Ventaja",
  "glossary.advantage.definition":
    "Tira dos d20 y quédate con el más alto. Se concede cuando las circunstancias juegan a tu favor.",
  "glossary.bonusAction.term": "Acción de bonus",
  "glossary.bonusAction.definition":
    "Una pequeña acción adicional que conceden algunas características o hechizos. Tienes una por turno, y solo si algo te la otorga.",
  "glossary.cantrip.term": "Truco",
  "glossary.cantrip.definition":
    "Un hechizo de nivel 0 que puedes lanzar cuando quieras, sin gastar espacios de hechizo.",
  "glossary.concentration.term": "Concentración",
  "glossary.concentration.definition":
    "Algunos hechizos necesitan tu concentración para seguir activos. Si recibes daño, debes superar una tirada de salvación de Constitución o el hechizo termina.",
  "glossary.critical.term": "Golpe crítico",
  "glossary.critical.definition":
    "Un 20 natural en una tirada de ataque. Siempre acieta y se tiran los dados de daño por duplicado.",
  "glossary.dc.term": "CD",
  "glossary.dc.definition":
    "Clase de Dificultad. El número que una tirada debe igualar o superar para tener éxito. Una CD más alta significa una tarea más difícil.",
  "glossary.disadvantage.term": "Desventaja",
  "glossary.disadvantage.definition":
    "Tira dos d20 y quédate con el más bajo. Se impone cuando las circunstancias juegan en tu contra.",
  "glossary.hitDice.term": "Dados de golpe",
  "glossary.hitDice.definition":
    "Dados que gastas en un descanso corto para curarte. Tienes uno por nivel y se recuperan al terminar un descanso largo.",
  "glossary.hitPoints.term": "Puntos de vida",
  "glossary.hitPoints.definition":
    "Tus PV indican cuánto castigo puede aguantar tu personaje. Con 0 PV quedas inconsciente.",
  "glossary.longRest.term": "Descanso largo",
  "glossary.longRest.definition":
    "Ocho horas de sueño y actividad ligera. Recuperas todos los PV perdidos y la mitad de los dados de golpe gastados.",
  "glossary.reaction.term": "Reacción",
  "glossary.reaction.definition":
    "Una respuesta rápida fuera de tu turno, como un ataque de oportunidad, que realizas cuando ocurre su desencadenante. Una por ronda.",
  "glossary.savingThrow.term": "Tirada de salvación",
  "glossary.savingThrow.definition":
    "Una tirada de d20 más un modificador de característica para resistir un hechizo, una trampa o un efecto. Iguala o supera su CD.",
  "glossary.shortRest.term": "Descanso corto",
  "glossary.shortRest.definition":
    "Una hora de descanso. Gastas dados de golpe para curarte y algunas características se recargan.",
  "glossary.spellAttack.term": "Ataque de hechizo",
  "glossary.spellAttack.definition":
    "La tirada que haces cuando un hechizo ataca directamente: d20 más tu bonificación de ataque de hechizo contra la CA del objetivo.",
  "glossary.spellSaveDc.term": "CD de tirada de salvación de hechizos",
  "glossary.spellSaveDc.definition":
    "El número que los enemigos deben superar para resistir tus hechizos. Crece con tu bonificación por competencia y con tu puntuación de característica de lanzamiento.",
  "session.emptyCount": "No hay referencias en la sesión",
  "session.countOne": "1 referencia",
  "session.countOther": "{count} referencias",
  "session.end": "Terminar sesión",
  "session.emptyBody":
    "La sesión está vacía. Busca en el Compendio y fija lo que necesites para esta sesión.",
  "session.removeItem": "Quitar {subject} de la sesión",
  "session.endConfirm": "¿Terminar la sesión?",
  "session.endBody":
    "Se eliminarán todas las referencias de tu sesión. Puedes volver a añadirlas cuando quieras.",
  "dice.result": "Resultado",
  "dice.modifier": "Modificador",
  "dice.reroll": "Volver a tirar los dados",
  "dice.loading": "Cargando dados…",
  "dice.rollWith": "Tirar {expression}",

  "home.currentCharacter": "Personaje actual",
  "home.recentlyViewed": "Visto recientemente",
  "home.nothingViewed": "Todavía no has visto nada",
  "home.nothingViewedBody":
    "Explora el Compendio y vuelve aquí para tener lo reciente siempre a mano.",
  "home.browseCompendium": "Explorar el Compendio",
  "home.sessionPinned": "1 elemento fijado para tu encuentro.",
  "home.sessionPinnedOther": "{count} elementos fijados para tu encuentro.",
  "home.sessionPinnedEmpty": "Fija criaturas, hechizos y objetos para tu encuentro.",
  "home.openSession": "Abrir sesión",
  "home.learnBasics": "Aprende lo básico",
  "home.learnBasicsBody":
    "¿Eres nuevo en D&D? Empieza por el d20, las pruebas y tu turno en combate.",
  "home.openRules": "Abrir reglas",
  "home.createFirstTitle": "Crea tu primer personaje",
  "home.createFirstBody":
    "Añade un personaje para empezar a llevar su estado de combate, o carga un personaje y una sesión de ejemplo ya rellenos.",
  "home.createCharacter": "Crear personaje",
  "home.viewDemo": "Ver demo",
  "home.removeBody":
    "Se elimina el personaje junto con sus puntos de vida y su estado de combate. No se puede deshacer.",

  "backup.intro":
    "Tus datos viven en este dispositivo. La copia de seguridad en la nube es opcional y te permite restaurarlos en otro dispositivo.",
  "backup.loading": "Cargando la copia de seguridad…",
  "backup.checkingAccount": "Comprobando la cuenta…",
  "backup.unavailable": "La copia en la nube no está disponible",
  "backup.unavailableBody":
    "Esta versión se compiló sin la configuración de Firebase. La copia en la nube es opcional; todo lo demás funciona totalmente sin conexión.",
  "backup.offline": "Sin conexión",
  "backup.offlineBody": "La copia en la nube necesita una conexión a internet.",
  "backup.account": "Cuenta",
  "backup.signInBody": "Inicia sesión con Google para hacer una copia de tus datos locales.",
  "backup.signInWithGoogle": "Iniciar sesión con Google",
  "backup.signingIn": "Iniciando sesión…",
  "backup.signOut": "Cerrar sesión",
  "backup.signingOut": "Cerrando sesión…",
  "backup.connected": "Conectado",
  "backup.lastBackup": "Última copia",
  "backup.noBackup": "No hay copias guardadas",
  "backup.localData": "Datos locales",
  "backup.upToDate": "Copia al día",
  "backup.outdated": "Copia desactualizada",
  "backup.notUploaded": "Aún no se ha subido",
  "backup.upload": "Subir copia",
  "backup.uploading": "Subiendo…",
  "backup.alreadyUpToDate": "Ya está todo actualizado.",
  "backup.uploadBody": "Sustituye la copia de la nube por tus datos actuales.",
  "backup.restore": "Restaurar copia",
  "backup.restoring": "Restaurando…",
  "backup.checking": "Comprobando…",
  "backup.restoreBody": "Sustituye tus datos locales por la copia de la nube.",
  "backup.notFound": "No se ha encontrado ninguna copia en la nube.",
  "backup.uploaded": "Copia subida.",
  "backup.restored": "Copia restaurada.",
  "backup.restoreWarning": "Esto sustituirá tus datos locales.",
  "backup.cloudCopy": "Copia en la nube",
  "backup.lastUpdatedAt": "Actualizada por última vez {date}",
  "backup.unknown": "desconocido",
  "backup.contains": "Contiene",
  "backup.containsCharacter": "Personaje: {name}",
  "backup.containsNoCharacter": "No hay ningún personaje guardado",
  "backup.containsItems": "{count} elemento de sesión",
  "backup.containsItemsOther": "{count} elementos de sesión",
  "backup.todayAt": "Hoy {time}",
  "backup.yesterdayAt": "Ayer {time}",

  "install.title": "Instalar",
  "install.body":
    "Añade Dungeon Archive a tu pantalla de inicio para usarlo a pantalla completa y sin conexión, como una app nativa.",
  "install.action": "Instalar app",
  "install.iosHint": "En iPhone o iPad: pulsa el botón de compartir en Safari y elige",
  "install.iosAction": "Añadir a pantalla de inicio",

  "search.placeholder": "Busca hechizos, equipo, estados…",
  "search.filterByCategory": "Filtrar por categoría",
  "search.noResults": "Sin resultados para «{query}»",
  "search.noResultsBody": "Prueba con otro término de búsqueda o",
  "search.browseCompendium": "explora el Compendio",
  "search.clear": "Borrar búsqueda",
  "search.recentSearches": "Búsquedas recientes",
  "search.categories": "Categorías",
  "search.footer": "Busca hechizos, monstruos, equipo y mucho más",

  "common.description": "Descripción",
  "category.loading": "Cargando la categoría",
  "category.searchLabel": "Buscar en {subject}",
  "category.searchPlaceholder": "Buscar {label}…",
  "category.countOf": " de {count} {label}",
  "category.emptyQueryAndFilters": "Ningún {label} coincide con tu búsqueda y tus filtros",
  "category.emptyFilters": "Ningún {label} coincide con estos filtros",
  "category.emptyQuery": "Ningún {label} coincide con tu búsqueda",
  "filter.close": "Cerrar los filtros",
  "picker.close": "Cerrar el selector",
  "snackbar.dismiss": "Descartar la notificación",
  "equipment.cost": "Coste",
  "equipment.weight": "Peso",
  "equipment.value": "Valor",
  "equipment.stealth": "Sigilo",
  "monster.speed": "Velocidad",
  "monster.alignment": "Alineamiento",
  "monster.traits": "Rasgos",
  "monster.actions": "Acciones",
  "monster.reactions": "Reacciones",
  "monster.legendaryActions": "Acciones legendarias",
  "ability.strength": "Fuerza",
  "ability.dexterity": "Destreza",
  "ability.constitution": "Constitución",
  "ability.intelligence": "Inteligencia",
  "ability.wisdom": "Sabiduría",
  "ability.charisma": "Carisma",
  "help.attunement.title": "¿Qué es la sintonización?",
  "help.attunement.body":
    "Un objeto mágico solo te funciona mientras estás sintonizado con él. Tocarlo por primera vez inicia la sintonización.",
};

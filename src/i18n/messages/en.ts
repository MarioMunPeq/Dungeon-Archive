/**
 * English messages — the reference dictionary.
 *
 * Every other language is typed as `Record<keyof typeof en, string>`, so a
 * missing or misspelled key is a compile error rather than a silent English
 * string leaking into a translated screen.
 *
 * Placeholders use `{name}` and are substituted verbatim; numbers are fine.
 */
export const en = {
  // ---- Navigation and routes ----
  "nav.home": "Home",
  "nav.archive": "Archive",
  "nav.combat": "Combat",
  "nav.dice": "Dice",
  "nav.character": "Character",
  "nav.main": "Main Navigation",

  "page.archive": "Archive",
  "page.combat": "Combat",
  "page.character": "Character",
  "page.dice": "Dice",
  "page.help": "Help",
  "page.session": "Session",
  "page.backup": "Backup",
  "page.debug": "Debug",
  "page.notFound": "Page not found",

  // ---- Accessibility labels ----
  "a11y.back": "Back",
  "a11y.cloudBackup": "Cloud Backup",
  "a11y.help": "Help",
  "a11y.language": "Language",
  "a11y.switchToEnglish": "Switch to English",
  "a11y.switchToSpanish": "Switch to Spanish",
  "a11y.close": "Close",
  "a11y.breadcrumb": "Breadcrumb",

  // ---- Settings pickers ----
  "theme.accent": "Accent theme",

  // ---- Archive tabs ----
  "tab.search": "Search",
  "tab.howToPlay": "How to Play",
  "tab.rules": "Rules",
  "tab.glossary": "Glossary",

  // ---- Compendium categories ----
  "category.spell.one": "Spell",
  "category.spell.many": "Spells",
  "category.monster.one": "Monster",
  "category.monster.many": "Monsters",
  "category.equipment.one": "Equipment",
  "category.equipment.many": "Equipment",
  "category.condition.one": "Condition",
  "category.condition.many": "Conditions",
  "category.action.one": "Action",
  "category.action.many": "Actions",
  "category.magicitem.one": "Magic Item",
  "category.magicitem.many": "Magic Items",
  "category.feat.one": "Feat",
  "category.feat.many": "Feats",
  "category.class.one": "Class",
  "category.class.many": "Classes",

  // ---- Spell schools ----
  "school.A": "Abjuration",
  "school.C": "Conjuration",
  "school.D": "Divination",
  "school.E": "Enchantment",
  "school.I": "Illusion",
  "school.N": "Necromancy",
  "school.T": "Transmutation",
  "school.V": "Evocation",

  // ---- Damage types ----
  "damage.B": "Bludgeoning",
  "damage.P": "Piercing",
  "damage.S": "Slashing",
  "damage.A": "Acid",
  "damage.C": "Cold",
  "damage.F": "Fire",
  "damage.L": "Lightning",
  "damage.T": "Thunder",
  "damage.R": "Radiant",
  "damage.N": "Necrotic",
  "damage.Y": "Psychic",
  "damage.Poison": "Poison",

  // ---- Magic item rarity ----
  "rarity.common": "Common",
  "rarity.uncommon": "Uncommon",
  "rarity.rare": "Rare",
  "rarity.very rare": "Very Rare",
  "rarity.legendary": "Legendary",
  "rarity.artifact": "Artifact",

  // ---- Equipment types ----
  "equip.$A": "Art Object",
  "equip.$C": "Coin",
  "equip.$G": "Gemstone",
  "equip.AF": "Firearm Ammunition",
  "equip.AIR": "Airship",
  "equip.EXP": "Explosive",
  "equip.FD": "Food and Drink",
  "equip.GS": "Gaming Set",
  "equip.MNT": "Mount",
  "equip.SCF": "Spellcasting Focus",
  "equip.SHP": "Ship",
  "equip.TAH": "Tack and Harness",
  "equip.TB": "Trade Bar",
  "equip.VEH": "Vehicle",
  "equip.WD": "Wand",
  "equip.G": "Gear",
  "equip.T": "Tool",

  // ---- Compendium vocabulary ----
  "term.cantrip": "Cantrip",
  "term.level": "Level {level}",
  "term.cr": "CR",
  "term.levelValue": "Level",
  "term.damage": "Damage",
  "term.attunement": "Attunement",
  "term.requiresAttunement": "Requires Attunement",
  "term.repeatable": "Repeatable",
  "term.prerequisite": "Prerequisite",
  "term.notRepeatable": "Not Repeatable",
  "term.hasPrerequisite": "Has Prerequisite",
  "term.noPrerequisite": "No Prerequisite",

  // ---- Filter labels and options ----
  "filter.all": "All",
  "filter.yes": "Yes",
  "filter.no": "No",
  "filter.none": "None",
  "filter.required": "Required",
  "filter.level": "Level",
  "filter.school": "School",
  "filter.class": "Class",
  "filter.concentration": "Concentration",
  "filter.ritual": "Ritual",
  "filter.source": "Source",
  "filter.rarity": "Rarity",
  "filter.type": "Type",
  "filter.size": "Size",
  "filter.attunement": "Attunement",
  "filter.prerequisite": "Prerequisite",
  "filter.repeatable": "Repeatable",
  "filter.damageType": "Damage type",
  "filter.property": "Property",
  "filter.cr": "CR",
  "filter.clear": "Clear filters",
  "filter.active": "Active filters",

  // ---- Sorting ----
  "sort.alphabetical": "Alphabetical",
  "sort.recent": "Recently Added",
  "sort.challengeRating": "Challenge Rating",
  "sort.label": "Sort",

  // ---- Shared vocabulary ----
  "common.done": "Done",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.close": "Close",
  "common.clearAll": "Clear all",
  "common.add": "Add",
  "common.remove": "Remove",
  "common.removeItem": "Remove {subject}",
  "common.about": "About {subject}",
  "common.clearValue": "Clear {subject}",
  "common.search": "Search",
  "common.results": "{count} results",
  "term.levelShort": "Lv {level}",

  // ---- Spells ----
  "spell.castingTime": "Casting Time",
  "spell.range": "Range",
  "spell.duration": "Duration",
  "spell.components": "Components",
  "spell.classes": "Classes",
  "spell.description": "Description",
  "spell.higherLevels": "At Higher Levels",
  "spell.component.verbal": "Verbal",
  "spell.component.somatic": "Somatic",
  "spell.component.material": "Material",
  "spell.abbrev.concentration": "Conc.",
  "spell.abbrev.ritual": "Rit.",

  // ---- Inline help tips ----
  "help.ritualCasting.title": "What is ritual casting?",
  "help.ritualCasting.body":
    "A ritual takes 10 extra minutes to cast, but it doesn't use a spell slot.",
  "help.concentration.title": "What is concentration?",
  "help.concentration.body":
    "The spell ends early if you cast another concentration spell or lose focus.",
  "help.spellSchool.body": "The style of magic the spell belongs to.",

  // ---- Spell picker ----
  "spellPicker.title": "Select spells",
  "spellPicker.close": "Close spells picker",
  "spellPicker.searchPlaceholder": "Search spells…",
  "spellPicker.searchLabel": "Search spells",
  "spellPicker.knownCount": "{count} known",
  "spellPicker.forClass": "For {class}",
  "spellPicker.allSpells": "All spells",
  "spellPicker.whichToShow": "Which spells to show",
  "spellPicker.aboutList": "About this spell list",
  "spellPicker.aboutListBody":
    "“For {class}” shows only spells a {class} can choose from. Switch to “All spells” to browse every spell in the Compendium.",
  "spellPicker.levelLabel": "Spell level",
  "spellPicker.removeFilter": "Remove {label} filter: {value}",
  "spellPicker.resultCount": "{count} spells",
  "spellPicker.emptyWithFilters": "No spells found",
  "spellPicker.emptyWithFiltersBody": "Try a different search or clear some filters.",
  "spellPicker.emptyForClass": "No spells listed for {class}",
  "spellPicker.emptyForClassBody": "This Compendium may not include spells for this class.",
  "spellPicker.showAll": "Show all spells",

  // ---- Character classes and subclasses ----
  "class.Barbarian": "Barbarian",
  "class.Bard": "Bard",
  "class.Cleric": "Cleric",
  "class.Druid": "Druid",
  "class.Fighter": "Fighter",
  "class.Monk": "Monk",
  "class.Paladin": "Paladin",
  "class.Ranger": "Ranger",
  "class.Rogue": "Rogue",
  "class.Sorcerer": "Sorcerer",
  "class.Warlock": "Warlock",
  "class.Wizard": "Wizard",
  "class.Artificer": "Artificer",

  "subclass.Berserker": "Berserker",
  "subclass.Wild Heart": "Wild Heart",
  "subclass.World Tree": "World Tree",
  "subclass.Zealot": "Zealot",
  "subclass.College of Dance": "College of Dance",
  "subclass.College of Glamour": "College of Glamour",
  "subclass.College of Lore": "College of Lore",
  "subclass.College of Valor": "College of Valor",
  "subclass.College of Whispers": "College of Whispers",
  "subclass.College of Swords": "College of Swords",
  "subclass.Life Domain": "Life Domain",
  "subclass.Light Domain": "Light Domain",
  "subclass.Trickery Domain": "Trickery Domain",
  "subclass.War Domain": "War Domain",
  "subclass.Knowledge Domain": "Knowledge Domain",
  "subclass.Nature Domain": "Nature Domain",
  "subclass.Tempest Domain": "Tempest Domain",
  "subclass.Twilight Domain": "Twilight Domain",
  "subclass.Forge Domain": "Forge Domain",
  "subclass.Circle of the Land": "Circle of the Land",
  "subclass.Circle of the Moon": "Circle of the Moon",
  "subclass.Circle of the Sea": "Circle of the Sea",
  "subclass.Circle of the Stars": "Circle of the Stars",
  "subclass.Circle of Wildfire": "Circle of Wildfire",
  "subclass.Battle Master": "Battle Master",
  "subclass.Champion": "Champion",
  "subclass.Eldritch Knight": "Eldritch Knight",
  "subclass.Psi Warrior": "Psi Warrior",
  "subclass.Arcane Archer": "Arcane Archer",
  "subclass.Samurai": "Samurai",
  "subclass.Way of the Open Hand": "Way of the Open Hand",
  "subclass.Way of Shadow": "Way of Shadow",
  "subclass.Way of the Four Elements": "Way of the Four Elements",
  "subclass.Way of Mercy": "Way of Mercy",
  "subclass.Way of the Astral Self": "Way of the Astral Self",
  "subclass.Way of the Kensei": "Way of the Kensei",
  "subclass.Oath of Devotion": "Oath of Devotion",
  "subclass.Oath of the Ancients": "Oath of the Ancients",
  "subclass.Oath of Vengeance": "Oath of Vengeance",
  "subclass.Oath of Conquest": "Oath of Conquest",
  "subclass.Oath of Redemption": "Oath of Redemption",
  "subclass.Oath of Glory": "Oath of Glory",
  "subclass.Oath of the Watchers": "Oath of the Watchers",
  "subclass.Hunter": "Hunter",
  "subclass.Beast Master": "Beast Master",
  "subclass.Fey Wanderer": "Fey Wanderer",
  "subclass.Gloom Stalker": "Gloom Stalker",
  "subclass.Horizon Walker": "Horizon Walker",
  "subclass.Swarmkeeper": "Swarmkeeper",
  "subclass.Drakewarden": "Drakewarden",
  "subclass.Thief": "Thief",
  "subclass.Assassin": "Assassin",
  "subclass.Arcane Trickster": "Arcane Trickster",
  "subclass.Soulknife": "Soulknife",
  "subclass.Phantom": "Phantom",
  "subclass.Inquisitive": "Inquisitive",
  "subclass.Swashbuckler": "Swashbuckler",
  "subclass.Draconic Bloodline": "Draconic Bloodline",
  "subclass.Wild Magic": "Wild Magic",
  "subclass.Aberrant Mind": "Aberrant Mind",
  "subclass.Clockwork Soul": "Clockwork Soul",
  "subclass.Divine Soul": "Divine Soul",
  "subclass.Shadow Magic": "Shadow Magic",
  "subclass.The Archfey": "The Archfey",
  "subclass.The Fiend": "The Fiend",
  "subclass.The Great Old One": "The Great Old One",
  "subclass.The Celestial": "The Celestial",
  "subclass.The Hexblade": "The Hexblade",
  "subclass.The Genie": "The Genie",
  "subclass.The Undead": "The Undead",
  "subclass.The Fathomless": "The Fathomless",
  "subclass.Bladesinging": "Bladesinging",
  "subclass.War Magic": "War Magic",
  "subclass.Alchemist": "Alchemist",
  "subclass.Artillerist": "Artillerist",
  "subclass.Battle Smith": "Battle Smith",
  "subclass.Armorer": "Armorer",

  // ---- Character page ----
  "character.classLineSeparator": "·",
  "character.noClassYet": "Add class, subclass, and level",
  "character.combat": "Combat",
  "character.abilities": "Abilities",
  "character.notes": "Notes",
  "character.weapons": "Weapons",
  "character.armorClass": "AC",
  "character.perception": "Perception",
  "character.spellDc": "DC",
  "character.openInCompendium": "Open in Compendium",
  "character.addNote": "Add a quick note…",
  "character.notePlaceholder": "One quick reminder…",
  "character.remove": "Remove",
  "character.add": "Add",
  "character.addMore": "+ Add",
  "character.empty": "None",
  "character.removeTitle": "Remove {name}?",
  "character.removeBody":
    "This removes their combat numbers, ability scores, and references. This can't be undone.",
  "character.picker.weapons": "Weapons",
  "character.picker.magicItems": "Magic Items",
  "character.classes.one": "Class",
  "character.classes.many": "Classes",
  "character.newCharacter": "New Character",
  "character.name": "Name",
  "character.subclass": "Subclass",
  "character.subclasses": "Subclasses",
  "character.equipment": "Equipment",
  "character.classFeatures": "Class Features",
  "character.proficiencies": "Proficiencies",
  "character.savingThrows": "Saving Throws",
  "character.skills": "Skills",
  "class.hitDice": "Hit Dice",
  "class.primaryAbility": "Primary Ability",
  "class.spellcastingAbility": "Spellcasting Ability",
  "class.casterProgression": "Caster Progression",
  "class.proficiencyBonus": "Proficiency Bonus",
  "class.startingProficiencies": "Starting Proficiencies",
  "class.startingEquipment": "Starting Equipment",
  "class.chooseOne": "Choose one option",
  "class.goldAlternative": "Gold Alternative",
  "class.additionalFromBackground": "You also receive the equipment granted by your Background.",
  "class.multiclassing": "Multiclassing",
  "class.multiclassingRequirements": "Requirements",
  "class.multiclassingGains": "Proficiencies Gained",
  "class.progression": "Progression by Level",
  "class.level": "Level",
  "class.subclassAt": "Subclass",
  "class.subclassAtHint": "You choose your subclass when you reach this level.",
  "class.spellSlots": "Spell Slots per Spell Level",
  "class.ability.str": "Strength",
  "class.ability.dex": "Dexterity",
  "class.ability.con": "Constitution",
  "class.ability.int": "Intelligence",
  "class.ability.wis": "Wisdom",
  "class.ability.cha": "Charisma",
  "class.proficiencySavingThrows": "Proficient Saving Throws",
  "class.progressionSubtitle": "Tap a level to see every feature and number it unlocks.",
  "class.nothingNew": "No change",
  "class.nothingNewAtLevel": "Nothing new at this level \u2014 your features and numbers stay the same.",
  "class.noFeatures": "No new features at this level; only the numbers above change.",
  "class.featureCount": "features",
  "class.uses": "Uses",
  "class.copyFeature": "Copy text",
  "class.copiedFeature": "Text copied",
  "class.noDescription": "The source book gives no text for this feature.",
  "class.subclassSubtitle": "Pick one of these at the level marked with the Subclass badge.",
  "help.hitDice.title": "What are Hit Dice?",
  "help.hitDice.body":
    "The die you roll to gain Hit Points when you level up, plus a fixed bonus. A d10 class with +3 per level gains 13 Hit Points each level.",
  "help.primaryAbility.title": "What is the primary ability?",
  "help.primaryAbility.body":
    "The ability score that drives this class. It powers your class features and sets the DC enemies must beat to resist them.",
  "help.spellcastingAbility.title": "What is the spellcasting ability?",
  "help.spellcastingAbility.body":
    "The ability used to cast this class's spells. Add its modifier to your proficiency bonus to get your spell save DC.",
  "help.classProgression.title": "What is progression?",
  "help.classProgression.body":
    "The numbers that change as you level: Proficiency Bonus, spell slots, extra attacks, and similar. Open a level to see what it gives you.",
  "character.editClassLine": "Edit class, subclass, and level",
  "character.emptyTitle": "No character yet",
  "character.emptyBody":
    "Add your character to start tracking ability scores, combat stats, and the spells and items you use most.",
  "character.createFirst": "Create your first character",

  "help.combatStats.title": "What are combat stats?",
  "help.combatStats.body":
    "The numbers you check every fight. Armor Class is what enemies must beat to hit you. Passive Perception notices hidden things.",
  "help.armorClass.body": "Armor Class is what enemies must beat to hit you.",
  "help.passivePerception.body":
    "Passive Perception is how well you notice hidden things without trying.",
  "help.spellSaveDc.body": "Spell save DC is the number enemies must beat to resist your spells.",
  "help.abilityScores.title": "What are ability scores?",
  "help.abilityScores.body":
    "Six scores describe your character's strengths. The modifier underneath is the bonus you add to rolls — higher scores mean bigger bonuses.",
  "help.characterSpells.body":
    "Spells your character can cast. Add the ones you use most for quick access.",
  "help.characterWeapons.body":
    "The weapons your character carries, with their damage at a glance.",
  "help.characterMagicItems.body":
    "Magic items your character owns. Add the ones you consult during play.",

  // ---- Archive and onboarding ----
  "archive.sections": "Archive sections",
  "onboarding.welcome": "Welcome to Dungeon Archive",
  "onboarding.skip": "Skip",
  "onboarding.next": "Next",
  "onboarding.start": "Start exploring",
  "onboarding.step1.title": "Search the Compendium instantly.",
  "onboarding.step1.body":
    "Every spell, monster, item, and condition in the Compendium is a few keystrokes away.",
  "onboarding.step2.title": "Pin anything to your Session.",
  "onboarding.step2.body":
    "Keep the monsters, spells, and items you need right now one tap away during play.",
  "onboarding.step3.title": "Learn the rules as you play.",
  "onboarding.step3.body":
    "New to the game? The Rules tab in the Archive explains the d20, ability checks, and your turn in combat.",
  "onboarding.step4.title": "You're ready. Start exploring.",
  "onboarding.step4.body": "Everything stays on this device. Search, pin, and run your game.",

  // ---- Help page ----
  "helpPage.quickHelp": "Quick help",
  "helpPage.longPress": "Press and hold any stat, ability score, or item to see what it means.",
  "helpPage.beginnerTips":
    "The Rules tab in the Archive has a Beginner tips toggle that shows small ? helpers next to rules as you play.",
  "helpPage.aboutProject": "About this project",
  "helpPage.aboutBody":
    "Dungeon Archive is a personal project: a mobile-first companion for tabletop RPG players, designed to sit next to the table and answer rules questions in seconds. Every screen is checked against a written Design DNA before it ships.",

  // ---- Combat tracker ----
  "combat.action": "Action",
  "combat.actionHelp": "Attack, cast a spell, dash, dodge, hide, disengage, or use an object.",
  "combat.bonusAction": "Bonus Action",
  "combat.bonusActionHelp": "A small extra action granted by a feature, spell, or item.",
  "combat.movement": "Movement",
  "combat.movementHelp": "Move up to your speed (usually 30 ft), split any way across your turn.",
  "combat.reaction": "Reaction",
  "combat.reactionHelp": "A response to something that happens, like an opportunity attack.",
  "combat.hitPoints": "Hit Points",
  "combat.current": "Current",
  "combat.currentHp": "Current HP",
  "combat.max": "Max",
  "combat.maxHp": "Max HP",
  "combat.belowHalf": "Below half — your character is hurting!",
  "combat.stats": "Stats",
  "combat.statsHelp":
    "These are your combat numbers. Edit them on your character in the Character tab.",
  "combat.perceptionHelp": "A score used to notice hidden things without rolling.",
  "combat.conditions": "Conditions",
  "combat.onYourTurn": "On Your Turn",
  "combat.onYourTurnHelp.title": "What can I do on my turn?",
  "combat.onYourTurnHelp.body":
    "Each round you get one Action, one Bonus Action, and one Reaction. You can also move up to your speed and split the movement however you like. Tap a row once you have used it this turn, then hit “Next turn” when your turn ends.",
  "combat.nextTurn": "Next turn",
  "combat.noConditionDescription": "No description available for this condition.",
  "combat.emptyBody":
    "Add your character in the Character tab, then come back here to track hit points during combat.",
  "combat.goToCharacter": "Go to Character",
  "help.combatStats.short": "What are these numbers?",
  "help.hitPoints.title": "What are Hit Points?",
  "help.hitPoints.body":
    "Hit Points (HP) measure how much damage you can take. Damage lowers your current HP; at 0 you fall unconscious. Heal to bring it back up.",

  // ---- Conditions ----
  "condition.blinded": "Blinded",
  "condition.charmed": "Charmed",
  "condition.deafened": "Deafened",
  "condition.exhaustion": "Exhaustion",
  "condition.frightened": "Frightened",
  "condition.grappled": "Grappled",
  "condition.incapacitated": "Incapacitated",
  "condition.invisible": "Invisible",
  "condition.paralyzed": "Paralyzed",
  "condition.petrified": "Petrified",
  "condition.poisoned": "Poisoned",
  "condition.prone": "Prone",
  "condition.restrained": "Restrained",
  "condition.stunned": "Stunned",
  "condition.unconscious": "Unconscious",

  // ---- Combat: Condition definitions ----
  "condition.def.blinded":
    "You can't see. You automatically fail any ability check that requires sight. Attack rolls against you have advantage, and your attack rolls have disadvantage.",
  "condition.def.charmed":
    "You can't attack the charmer or target them with harmful abilities. The charmer has advantage on any ability check to interact socially with you.",
  "condition.def.deafened":
    "You can't hear. You automatically fail any ability check that requires hearing.",
  "condition.def.exhaustion":
    "You suffer from exhaustion. It has six levels. Each level adds penalties: 1 — disadvantage on ability checks; 2 — speed halved; 3 — disadvantage on attacks and saves; 4 — max HP halved; 5 — speed 0; 6 — death.",
  "condition.def.frightened":
    "You have disadvantage on ability checks and attack rolls while the source of your fear is in sight. You can't willingly move closer to it.",
  "condition.def.grappled":
    "Your speed becomes 0, and you can't benefit from any bonus to your speed. The condition ends if the grappler is incapacitated or you're moved out of range.",
  "condition.def.incapacitated": "You can't take actions or reactions.",
  "condition.def.invisible":
    "You can't be seen without magic or a special sense. You have advantage on attack rolls; attacks against you have disadvantage.",
  "condition.def.paralyzed":
    "You're incapacitated, can't move or speak, and automatically fail Strength and Dexterity saves. Attack rolls against you have advantage, and any hit within 5 ft is a critical hit.",
  "condition.def.petrified":
    "You're transformed into stone, incapacitated, and can't move or speak. You're unaware of your surroundings. Attack rolls against you have advantage. You have resistance to all damage but are immune to poison and disease.",
  "condition.def.poisoned": "You have disadvantage on attack rolls and ability checks.",
  "condition.def.prone":
    "You're lying down. You can only crawl unless you stand up. You have disadvantage on attack rolls. Attacks against you have advantage within 5 ft, otherwise disadvantage.",
  "condition.def.restrained":
    "Your speed becomes 0, and you can't benefit from speed bonuses. Attack rolls against you have advantage, and your attack rolls have disadvantage. You have disadvantage on Dexterity saves.",
  "condition.def.stunned":
    "You're incapacitated, can't move, and can only speak falteringly. You automatically fail Strength and Dexterity saves. Attack rolls against you have advantage.",
  "condition.def.unconscious":
    "You're incapacitated, can't move or speak, and are unaware of surroundings. You drop what you're holding and fall prone. You automatically fail Strength and Dexterity saves. Attack rolls against you have advantage, and any hit within 5 ft is a critical hit.",

  // ---- Archive: Rules tab ----
  "rules.beginnerTips": "Beginner tips",
  "rules.beginnerTipsBody": "Show the ? helpers that explain the rules as you go.",
  "rules.beginnerTipsToggle": "Toggle beginner tips",
  "rules.hitPoints.titleHelp": "HP",

  "rules.d20.title": "The D20",
  "rules.d20.summary":
    "Almost every check in D&D starts with rolling a 20-sided die (the d20). Higher is better.",
  "rules.d20.point1": "Roll the d20 and add the relevant modifier for the ability you're using.",
  "rules.d20.point2": "Beat or match the difficulty number (DC) to succeed.",
  "rules.d20.point3":
    "Advantage: roll twice, keep the higher. Disadvantage: roll twice, keep the lower.",
  "rules.d20.help":
    'A "1" on an attack roll is a critical miss and always fails. A "20" is a critical hit and always hits, with extra damage!',

  "rules.checks.title": "Ability Checks",
  "rules.checks.titleHelp": "STR · DEX · CON · INT · WIS · CHA",
  "rules.checks.summary":
    "When you try something risky, the DM asks for an ability check using one of your six ability scores.",
  "rules.checks.point1": "Strength (STR): pushing, lifting, breaking.",
  "rules.checks.point2": "Dexterity (DEX): sneaking, balancing, reacting.",
  "rules.checks.point3": "Constitution (CON): resisting poison, exhaustion, holding focus.",
  "rules.checks.point4": "Intelligence (INT): remembering, solving, researching.",
  "rules.checks.point5": "Wisdom (WIS): noticing, sensing danger, reading people.",
  "rules.checks.point6": "Charisma (CHA): persuading, performing, intimidating.",
  "rules.checks.help":
    "Your ability modifier is the bonus your score grants: a score of 10 gives +0, 12 gives +1, 14 gives +2, and so on.",

  "rules.saves.title": "Saving Throws",
  "rules.saves.summary":
    "When a spell or trap tries to affect you, you roll a saving throw to resist it.",
  "rules.saves.point1": 'The DM tells you which ability to use (e.g. "make a Dexterity save").',
  "rules.saves.point2": "Roll the d20 and add that ability's modifier.",
  "rules.saves.point3": "If you beat the spell's DC, the effect is reduced or avoided entirely.",

  "rules.turn.title": "Your Turn in Combat",
  "rules.turn.titleHelp": "Action · Bonus Action · Movement · Reaction",
  "rules.turn.summary": "On your turn you can do a few things, in any order.",
  "rules.turn.point1": "Movement: move up to your speed (usually 30 ft / 9 m).",
  "rules.turn.point2": "Action: attack, cast a spell, dash, dodge, hide, or more.",
  "rules.turn.point3": "Bonus Action: a small extra action if a feature or spell grants one.",
  "rules.turn.point4": "Reaction: a special response to someone else's trigger, once per round.",
  "rules.turn.help":
    "You only get one Action, one Bonus Action, and one Reaction per round — use them wisely!",

  "rules.attacks.title": "Attacks & Damage",
  "rules.attacks.summary":
    "To attack, roll a d20 and add your attack bonus. If you hit, roll damage.",
  "rules.attacks.point1": "Attack roll: d20 + attack bonus vs. the target's Armor Class (AC).",
  "rules.attacks.point2": "Damage roll: the weapon or spell's dice, plus your ability modifier.",
  "rules.attacks.point3": "Criticals: a natural 20 always hits and rolls double damage dice.",

  "rules.rest.title": "Hit Points & Resting",
  "rules.rest.summary": "Your Hit Points (HP) measure how much punishment you can take.",
  "rules.rest.point1": "Damage reduces your HP. At 0 HP you fall unconscious.",
  "rules.rest.point2": "Short rest: 1 hour — spend Hit Dice to heal.",
  "rules.rest.point3": "Long rest: 8 hours — recover all HP and half your Hit Dice.",
  "rules.rest.help": "Track your current HP in the Combat tab while you play.",

  "rules.spellcasting.title": "Spellcasting",
  "rules.spellcasting.summary": "Casting a spell takes an Action unless the spell says otherwise.",
  "rules.spellcasting.point1":
    "Spell Attack: roll d20 + your spell attack bonus vs. the target's AC.",
  "rules.spellcasting.point2": "Saving Throw: the target rolls against your spell save DC.",
  "rules.spellcasting.point3":
    "Concentration: if the spell says so, you lose it when you take damage and fail a Constitution save.",
  "rules.spellcasting.help":
    "Your spell save DC and spell attack bonus live on your character in the Character tab.",

  // ---- Archive: How to Play tab ----
  "howToPlay.1.title": "Your character won't be good at everything — and that's fine.",
  "howToPlay.1.body":
    "Every class has strengths and weaknesses. Failing a roll now and then is part of the game, not a failure on your part.",
  "howToPlay.2.title": "The session isn't only about you.",
  "howToPlay.2.body":
    "Some scenes will center on other characters. That doesn't mean you sit out — react, chime in, support whoever has the spotlight, without taking the scene away from them.",
  "howToPlay.3.title": 'The goal is to have fun, not to "win."',
  "howToPlay.3.body":
    "There's no scoreboard. A good session is one where everyone at the table enjoyed themselves, including you, even when things don't go the way you hoped.",
  "howToPlay.4.title": "Participate actively.",
  "howToPlay.4.body":
    'Describe what your character does, don\'t just roll dice. Asking "what do I see / feel / know about this?" is always a valid thing to do.',

  // ---- Archive: Glossary tab ----
  "glossary.ac.term": "AC",
  "glossary.ac.definition":
    "Armor Class. How hard you are to hit: an attack lands when its total equals or beats your AC.",
  "glossary.abilityCheck.term": "Ability Check",
  "glossary.abilityCheck.definition":
    "A d20 roll plus an ability modifier, used when you try something risky — like a Dexterity check to balance across a beam.",
  "glossary.action.term": "Action",
  "glossary.action.definition":
    "The main thing you do on your turn: attack, cast a spell, dash, dodge, hide, or use an object.",
  "glossary.advantage.term": "Advantage",
  "glossary.advantage.definition":
    "Roll two d20s and keep the higher one — granted when the circumstances work in your favor.",
  "glossary.bonusAction.term": "Bonus Action",
  "glossary.bonusAction.definition":
    "A small extra action some features or spells grant. You get one per turn, and only if something gives you one.",
  "glossary.cantrip.term": "Cantrip",
  "glossary.cantrip.definition":
    "A level 0 spell you can cast at will, without spending spell slots.",
  "glossary.concentration.term": "Concentration",
  "glossary.concentration.definition":
    "Some spells need your focus to keep going. Take damage and you must pass a Constitution save or the spell ends.",
  "glossary.critical.term": "Critical Hit",
  "glossary.critical.definition":
    "A natural 20 on an attack roll. It always hits, and you roll double the damage dice.",
  "glossary.dc.term": "DC",
  "glossary.dc.definition":
    "Difficulty Class. The number a roll has to meet or beat to succeed — a higher DC means a harder task.",
  "glossary.disadvantage.term": "Disadvantage",
  "glossary.disadvantage.definition":
    "Roll two d20s and keep the lower one — imposed when the circumstances work against you.",
  "glossary.hitDice.term": "Hit Dice",
  "glossary.hitDice.definition":
    "Dice you spend on a short rest to heal yourself. You have one per level; they refresh on a long rest.",
  "glossary.hitPoints.term": "Hit Points",
  "glossary.hitPoints.definition":
    "Your HP measures how much punishment you can take. At 0 HP you fall unconscious.",
  "glossary.longRest.term": "Long Rest",
  "glossary.longRest.definition":
    "8 hours of sleep and light activity. You recover all lost HP and half your spent Hit Dice.",
  "glossary.reaction.term": "Reaction",
  "glossary.reaction.definition":
    "A quick response outside your turn — like an opportunity attack — taken when its trigger happens. One per round.",
  "glossary.savingThrow.term": "Saving Throw",
  "glossary.savingThrow.definition":
    "A d20 roll plus an ability modifier to resist a spell, trap, or effect. Meet or beat its DC.",
  "glossary.shortRest.term": "Short Rest",
  "glossary.shortRest.definition":
    "An hour of rest. Spend Hit Dice to heal, and some features recharge.",
  "glossary.spellAttack.term": "Spell Attack",
  "glossary.spellAttack.definition":
    "The roll you make when a spell attacks directly: d20 plus your spell attack bonus vs. the target's AC.",
  "glossary.spellSaveDc.term": "Spell Save DC",
  "glossary.spellSaveDc.definition":
    "The number enemies must beat to resist your spells. It grows with your proficiency bonus and your spellcasting ability score.",

  // ---- Dice roller ----
  "dice.result": "Result",
  "dice.modifier": "Modifier",
  "dice.reroll": "Reroll dice",
  "dice.loading": "Loading dice…",
  "dice.rollWith": "Roll {expression}",

  // ---- Session ----
  "session.emptyCount": "No references in session",
  "session.countOne": "1 reference",
  "session.countOther": "{count} references",
  "session.end": "End Session",
  "session.emptyBody":
    "Session is empty. Search the Compendium and pin what you need for this session.",
  "session.removeItem": "Remove {subject} from session",
  "session.endConfirm": "End Session?",
  "session.endBody":
    "This will remove every reference from your session. You can re-add them anytime.",

  // ---- Home ----
  "home.currentCharacter": "Current Character",
  "home.recentlyViewed": "Recently Viewed",
  "home.nothingViewed": "Nothing viewed yet",
  "home.nothingViewedBody":
    "Browse the Compendium and return here to keep recent items within reach.",
  "home.browseCompendium": "Browse the Compendium",
  "home.sessionPinned": "1 item pinned for your encounter.",
  "home.sessionPinnedOther": "{count} items pinned for your encounter.",
  "home.sessionPinnedEmpty": "Pin creatures, spells, and items for your encounter.",
  "home.openSession": "Open Session",
  "home.learnBasics": "Learn the basics",
  "home.learnBasicsBody": "New to D&D? Start with the d20, checks, and your turn in combat.",
  "home.openRules": "Open Rules",
  "home.createFirstTitle": "Create your first character",
  "home.createFirstBody":
    "Add a character to start tracking your combat state — or load a pre-filled sample character and session.",
  "home.createCharacter": "Create Character",
  "home.viewDemo": "View Demo",
  "home.removeBody":
    "This removes the character along with their hit points and combat state. This can't be undone.",

  // ---- Backup and install ----
  "backup.intro":
    "Your data lives locally on this device. Cloud backup is optional and lets you restore it on another device.",
  "backup.loading": "Loading backup…",
  "backup.checkingAccount": "Checking account…",
  "backup.unavailable": "Cloud Backup is not available",
  "backup.unavailableBody":
    "This build was compiled without Firebase configuration. Cloud Backup is an optional feature; everything else works fully offline.",
  "backup.offline": "Offline",
  "backup.offlineBody": "Cloud backup requires an internet connection.",
  "backup.account": "Account",
  "backup.signInBody": "Sign in with Google to back up your local data.",
  "backup.signInWithGoogle": "Sign in with Google",
  "backup.signingIn": "Signing in…",
  "backup.signOut": "Sign out",
  "backup.signingOut": "Signing out…",
  "backup.connected": "Connected",
  "backup.lastBackup": "Last backup",
  "backup.noBackup": "No backup found",
  "backup.localData": "Local data",
  "backup.upToDate": "Backup current",
  "backup.outdated": "Backup outdated",
  "backup.notUploaded": "Not uploaded yet",
  "backup.upload": "Upload backup",
  "backup.uploading": "Uploading…",
  "backup.alreadyUpToDate": "Already up to date.",
  "backup.uploadBody": "Replaces the cloud copy with your current data.",
  "backup.restore": "Restore backup",
  "backup.restoring": "Restoring…",
  "backup.checking": "Checking…",
  "backup.restoreBody": "Replaces your local data with the cloud copy.",
  "backup.notFound": "No cloud backup found.",
  "backup.uploaded": "Backup uploaded.",
  "backup.restored": "Backup restored.",
  "backup.restoreWarning": "This will replace your local data.",
  "backup.cloudCopy": "Cloud backup",
  "backup.lastUpdatedAt": "Last updated {date}",
  "backup.unknown": "unknown",
  "backup.contains": "Contains",
  "backup.containsCharacter": "Character: {name}",
  "backup.containsNoCharacter": "No character saved",
  "backup.containsItems": "{count} session item",
  "backup.containsItemsOther": "{count} session items",
  "backup.todayAt": "Today {time}",
  "backup.yesterdayAt": "Yesterday {time}",

  "install.title": "Install",
  "install.body":
    "Add Dungeon Archive to your home screen to run it full-screen, offline, like a native app.",
  "install.action": "Install App",
  "install.iosHint": "On iPhone or iPad: tap the Share button in Safari, then choose",
  "install.iosAction": "Add to Home Screen",

  // ---- Search ----
  "search.placeholder": "Search spells, equipment, conditions...",
  "search.filterByCategory": "Filter by category",
  "search.noResults": "No results for “{query}”",
  "search.noResultsBody": "Try a different search term, or",
  "search.browseCompendium": "look through the Compendium",
  "search.clear": "Clear search",
  "search.recentSearches": "Recent Searches",
  "search.categories": "Categories",
  "search.footer": "Search spells, monsters, equipment, and more",

  // ---- Entity details ----
  "common.description": "Description",
  "category.loading": "Loading category",
  "category.searchLabel": "Search {subject}",
  "category.searchPlaceholder": "Search {label}…",
  "category.countOf": " of {count} {label}",
  "category.emptyQueryAndFilters": "No {label} match your search and filters",
  "category.emptyFilters": "No {label} match these filters",
  "category.emptyQuery": "No {label} match your search",
  "filter.close": "Close filters",
  "picker.close": "Close picker",
  "snackbar.dismiss": "Dismiss notification",
  "error.title": "Something went wrong",
  "error.retry": "Try again",
  "notFound.title": "Page not found",
  "notFound.body": "The page you are looking for doesn't exist.",
  "notFound.goHome": "Go home",
  "common.noResults": "No results",
  "referencePicker.searchPlaceholder": "Search {title}…",
  "referencePicker.searchLabel": "Search {title}",
  "export.action": "Export",
  "export.exporting": "Exporting…",
  "export.success": "Character sheet exported.",
  "export.failed": "Could not export the sheet.",
  "equipment.cost": "Cost",
  "equipment.weight": "Weight",
  "equipment.value": "Value",
  "equipment.stealth": "Stealth",
  "equipment.armor": "Armor",
  "equipment.weapons": "Weapons",
  "equipment.tools": "Tools",
  "monster.speed": "Speed",
  "monster.alignment": "Alignment",
  "monster.traits": "Traits",
  "monster.actions": "Actions",
  "monster.reactions": "Reactions",
  "monster.legendaryActions": "Legendary Actions",
  "ability.strength": "Strength",
  "ability.dexterity": "Dexterity",
  "ability.constitution": "Constitution",
  "ability.intelligence": "Intelligence",
  "ability.wisdom": "Wisdom",
  "ability.charisma": "Charisma",
  "help.attunement.title": "What is attunement?",
  "help.attunement.body":
    "A magic item only works for you while you are attuned to it. Touching it for the first time starts the attunement.",
} as const;

export type TranslationKey = keyof typeof en;

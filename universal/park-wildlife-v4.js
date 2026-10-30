/* Curated park guides: shortlists, not complete faunal checklists or guarantees.
   References: TANAPA wildlife/park pages; research on Gombe, Mahale and Udzungwa primates. */
(function(){
const rows=[
["tarangire","Слоны и баобабы","Речная пойма и сухая саванна","elephant giraffe buffalo lion zebra wildebeest warthog","impala waterbuck eland dikdik oryx leopard hyena ostrich secretary ground-hornbill"],
["serengeti","Миграция и хищники","Равнины и скалистые копье","lion leopard cheetah elephant buffalo wildebeest zebra giraffe hyena","topi thomson-gazelle grant-gazelle eland hippo crocodile warthog secretary ostrich vulture rhino"],
["ngorongoro","Большая пятёрка в кратере","Дно кратера, лес Лерай и озёрная кромка","lion rhino buffalo elephant hippo zebra wildebeest hyena","flamingo crowned-crane eland thomson-gazelle grant-gazelle warthog jackal secretary baboon"],
["arusha","Жирафы и горные обезьяны","Леса Меру, озёра Момелла и поляны","giraffe black-white-colobus blue-monkey buffalo zebra waterbuck","bushbuck vervet flamingo hippo leopard hyena crowned-crane fish-eagle augur-buzzard"],
["lake-manyara","Озеро, слоны и птицы","Подземноводный лес и озёрная пойма","elephant baboon blue-monkey flamingo hippo buffalo","lion giraffe zebra wildebeest bushbuck vervet great-white-pelican fish-eagle african-spoonbill"],
["mkomazi","Сухая саванна и необычные антилопы","Кустарники и полупустынные равнины","oryx gerenuk lesser-kudu giraffe elephant","buffalo zebra lion leopard rhino wild-dog ostrich"],
["kilimanjaro","Горный лес и трекинг","Горный лес, вересковая зона и склоны","blue-monkey black-white-colobus","bushbuck mountain-reedbuck augur-buzzard variable-sunbird"],
["ruaha","Хищники и редколесье миомбо","Большая Руаха, сухие русла и миомбо","lion elephant buffalo wild-dog greater-kudu roan-antelope sable-antelope","leopard cheetah hyena giraffe zebra waterbuck impala hippo crocodile bateleur"],
["nyerere","Лодочное сафари по Руфиджи","Речные протоки, поймы и миомбо","wild-dog elephant hippo crocodile buffalo lion giraffe","leopard sable-antelope waterbuck impala greater-kudu fish-eagle pied-kingfisher african-darter yellow-billed-stork warthog"],
["mikumi","Саванна равнины Мката","Равнина Мката и сезонные водоёмы","elephant buffalo zebra wildebeest giraffe lion","hippo crocodile hyena leopard impala waterbuck roller fish-eagle saddle-billed-stork"],
["saadani","Саванна у океана","Прибрежная саванна, эстуарий и река Вами","giraffe buffalo zebra reedbuck hippo crocodile","elephant fish-eagle pied-kingfisher green-turtle yellow-billed-stork vervet"],
["udzungwa","Эндемичные приматы горных лесов","Густые леса и пешие тропы","udzungwa-red-colobus sanje-mangabey blue-monkey black-white-colobus","yellow-baboon vervet bushbuck common-duiker bushbaby genet flap-necked-chameleon"],
["kitulo","Горные луга и цветы","Высокогорные луга; прежде всего ботанический парк","mountain-reedbuck augur-buzzard","variable-sunbird bushbuck"],
["katavi","Гигантские стада и заводи","Поймы и река Катума","buffalo hippo crocodile elephant lion hyena","leopard wild-dog roan-antelope sable-antelope topi hartebeest zebra impala waterbuck saddle-billed-stork"],
["gombe","Шимпанзе леса Танганьики","Тропический прибрежный лес и крутые тропы","chimpanzee ashy-red-colobus red-tailed-monkey blue-monkey baboon","bushpig bushbuck vervet fish-eagle hornbill silvery-cheeked-hornbill genet leopard"],
["mahale","Шимпанзе и лесные обезьяны","Горный лес и побережье Танганьики","chimpanzee ashy-red-colobus red-tailed-monkey blue-monkey angolan-colobus","yellow-baboon baboon vervet bushbuck bushpig narina-trogon fish-eagle genet leopard"],
["rubondo-island","Остров и антилопа ситатунга","Папирусные болота и лес на озере Виктория","sitatunga hippo crocodile fish-eagle bushbuck","vervet bushpig genet pied-kingfisher great-egret chimpanzee"],
["masai-mara","Большие кошки и миграция","Саванна и река Мара","lion leopard cheetah elephant buffalo zebra wildebeest","giraffe hippo crocodile hyena thomson-gazelle topi ostrich"],
["amboseli","Слоны под Килиманджаро","Болота и открытые равнины","elephant buffalo zebra giraffe lion","hyena hippo flamingo waterbuck ostrich crowned-crane"],
["lake-nakuru","Носороги и озёрные птицы","Озёрная кромка и леса","rhino buffalo flamingo giraffe zebra","lion leopard baboon great-white-pelican fish-eagle waterbuck"],
["samburu","Редкие виды северной Кении","Сухие кустарники и река Эвасо-Нгиро","elephant gerenuk grevy-zebra reticulated-giraffe oryx","lion leopard cheetah buffalo lesser-kudu ostrich crocodile"],
["tsavo-east","Равнины и слоны","Засушливые равнины","elephant buffalo giraffe zebra lion","cheetah leopard oryx gerenuk crocodile ostrich"],
["tsavo-west","Источники и лесистые холмы","Редколесья, источники Мзима","elephant buffalo lion leopard hippo crocodile","giraffe zebra waterbuck rhino hyena warthog"]
];
const specials={
"mkomazi":"Носорог и гиеновая собака участвуют в природоохранных программах. Наблюдение не гарантировано.",
"lake-manyara":"Львы на деревьях известны, но такая встреча не гарантирована.",
"kilimanjaro":"Это пеший горный маршрут, а не классическое автомобильное сафари.",
"saadani":"Морские черепахи связаны с пляжами и сезоном гнездования.",
"udzungwa":"Пеший лесной парк: не ожидайте типичную Большую пятёрку саванны.",
"kitulo":"Здесь главный интерес — ботаника, и список животных специально короткий.",
"gombe":"Шимпанзе наблюдаются только в разрешённом трекинге с гидом. Встреча не гарантирована.",
"mahale":"Главная программа — пеший трекинг за шимпанзе с рейнджером.",
"rubondo-island":"Шимпанзе в природоохранной программе: увидеть их сложнее, чем в Гомбе и Махале.",
"lake-nakuru":"Численность фламинго на озере меняется по сезонам и условиям воды.",
"tsavo-west":"Носороги находятся в охраняемых зонах; наблюдения не гарантированы."
};
const parks={};
rows.forEach(([id,title,habitat,featured,also])=>{parks[id]={title,habitat,featured:featured.split(" "),also:also.split(" "),note:specials[id]||"Подборка не исчерпывает виды парка; сезон и место наблюдения важны."}});
const raw=[
["chimpanzee","Шимпанзе","Pan troglodytes","Chimpanzee","Другие звери","🐒","Гомбе и Махале: чёрная шерсть и длинные руки; наблюдение только с гидом.","Сложные социальные группы и использование инструментов.","gombe mahale rubondo-island"],
["ashy-red-colobus","Пепельный красный колобус","Piliocolobus tephrosceles","Ashy red colobus","Другие звери","🐒","Примат верхнего яруса леса вдоль Танганьики.","Питается листьями и имеет специализированное пищеварение.","gombe mahale"],
["udzungwa-red-colobus","Красный колобус Удзунгвы","Piliocolobus gordonorum","Udzungwa red colobus","Другие звери","🐒","Лесной эндемик гор Удзунгва.","Естественный ареал ограничен горами Удзунгва.","udzungwa"],
["red-tailed-monkey","Краснохвостая мартышка","Cercopithecus ascanius","Red-tailed monkey","Другие звери","🐒","Рыжеватая часть хвоста и яркие отметины на морде.","Иногда ходит смешанными группами с другими мартышками.","gombe mahale"],
["blue-monkey","Голубая мартышка","Cercopithecus mitis","Blue/Sykes monkey","Другие звери","🐒","Сероватая шерсть и лесной образ жизни.","Несмотря на название, шерсть не ярко-синяя.","arusha lake-manyara gombe mahale udzungwa kilimanjaro"],
["angolan-colobus","Ангольский колобус","Colobus angolensis","Angolan colobus","Другие звери","🐒","Чёрно-белая обезьяна с длинными белыми прядями.","Живёт в высоких кронах горных лесов.","mahale udzungwa"],
["sanje-mangabey","Мангабей Санже","Cercocebus sanjei","Sanje mangabey","Другие звери","🐒","Редкий лесной примат Удзунгвы, нередко кормится ближе к земле.","Эндемик Удзунгвы и важный объект охраны.","udzungwa"],
["yellow-baboon","Жёлтый павиан","Papio cynocephalus","Yellow baboon","Другие звери","🐒","Светлая шерсть, вытянутая морда, наземные группы.","Ведёт наземный образ жизни, но ночует в укрытиях.","mahale udzungwa"],
["sitatunga","Ситатунга","Tragelaphus spekii","Sitatunga","Копытные","🦌","Скрытная болотная антилопа на Рубондо.","Копыта помогают ходить по топкому грунту.","rubondo-island"],
["sable-antelope","Чёрная антилопа (сейбл)","Hippotragus niger","Sable antelope","Копытные","🦌","У самцов тёмный мех и дугообразные рога.","Известна длинными изогнутыми рогами.","ruaha nyerere katavi"],
["narina-trogon","Нарина-трогон","Apaloderma narina","Narina trogon","Птицы","🐦","Зелёная спина, красноватое брюшко, скрывается в тени леса.","Яркую птицу нелегко заметить в тёмной кроне.","mahale"],
["green-turtle","Зелёная морская черепаха","Chelonia mydas","Green sea turtle","Рептилии","🐢","Встречается в прибрежных водах; на пляжах возможны следы кладок.","Взрослые особи часто едят морские травы.","saadani"],
["grevy-zebra","Зебра Греви","Equus grevyi","Grevy's zebra","Копытные","🦓","Очень узкие полосы и большие уши.","Отличается от равнинной зебры крупными ушами.","samburu"],
["reticulated-giraffe","Сетчатый жираф","Giraffa camelopardalis reticulata","Reticulated giraffe","Копытные","🦒","Крупные рыжие многоугольники, разделённые светлыми линиями.","Окраска напоминает геометрическую мозаику.","samburu"]
];
const additionalSpecies=raw.map(([id,name,latin,en,kind,icon,hint,fact,where])=>({id,name,latin,en,kind,icon,hint,fact,parks:where.split(" ")}));
window.SafariParkWildlife={version:4,parks,additionalSpecies};
})();
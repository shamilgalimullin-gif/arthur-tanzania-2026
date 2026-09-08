(() => {
  const places = [
    ['all','Все точки'],['kendwa','Кендва'],['stone-town','Стоун-Таун'],['prison-island','Призон-Айленд'],
    ['dolphins','Дельфины'],['tarangire','Тарангире'],['serengeti','Серенгети'],['ngorongoro','Нгоронгоро']
  ];
  const tips = [
    {place:'kendwa',icon:'☀',eyebrow:'Занзибар · пляж',title:'Кендва',intro:'Пляжный день без перегрева и мокрого телефона.',tips:['SPF 50 обновлять после купания, панаму и воду держать рядом.','Для прогулок по кораллам пригодятся аквашузы; перед купанием спросите в отеле про море и течение.','Телефон, документы и наличные сложить в маленький гермомешок.'],arthur:'Артуру — рашгард или футболку для воды и заметную панаму. В море только рядом со взрослым.'},
    {place:'stone-town',icon:'⌘',eyebrow:'Занзибар · город',title:'Стоун-Таун',intro:'Лабиринт улиц красивее и спокойнее утром или ближе к вечеру.',tips:['Сохраните точку встречи и карту офлайн: в узких переулках легко свернуть не туда.','Вне курорта лучше закрыть плечи и колени — так уважительнее к местным обычаям.','Телефон и кошелёк не держать напоказ; дорогу переходить особенно внимательно.'],arthur:'Игра для Артура: искать резные занзибарские двери. На людных улицах заранее договориться, что делать, если потерялись.'},
    {place:'prison-island',icon:'⚓',eyebrow:'Чангуу · лодка',title:'Призон-Айленд',intro:'Короткая морская поездка к истории острова и гигантским черепахам.',tips:['Взять воду, панаму, аквашузы, полотенце и гермомешок — в лодке может обдать брызгами.','Время возвращения и погоду уточнить у капитана до выхода.','Черепах не кормить и не трогать без разрешения смотрителя; после контакта вымыть руки.'],arthur:'Если бывает укачивание, средство лучше принять заранее. Спасательный жилет должен подходить по размеру.'},
    {place:'dolphins',icon:'≈',eyebrow:'Занзибар · море',title:'Дельфины',intro:'Главная цель — увидеть животных спокойно, а не любой ценой заплыть рядом.',tips:['Ранний выезд обычно означает меньше жары и более спокойное море.','Выбирать капитана, который не гонится за дельфинами, не окружает их и держит дистанцию.','Взять сухую футболку, полотенце, воду и защиту от солнца.'],arthur:'Если море волнуется или Артуру некомфортно, наблюдать из лодки — отличный и безопасный вариант.'},
    {place:'tarangire',icon:'♜',eyebrow:'12 октября · сафари',title:'Тарангире',intro:'Слоны, баобабы и пыльные дороги вдоль реки Тарангире.',tips:['Надеть светлую нейтральную одежду и использовать репеллент: здесь встречаются мухи цеце.','Не просить подъезжать вплотную и не перекрывать слонам путь к воде.','Бинокль, воду и камеру держать в салоне, а еду — закрытой. Выходить только там, где разрешит гид.'],arthur:'Миссия Артура: найти самого маленького слонёнка и самый толстый баобаб.'},
    {place:'serengeti',icon:'↟',eyebrow:'13–14 октября · сафари',title:'Серенгети',intro:'Два длинных дня: здесь особенно выигрывают терпеливые наблюдатели.',tips:['Бафф, влажные салфетки и закрытый чехол спасут от пыли; power bank — от разряженного телефона.','Искать хищников на копье, развилках деревьев и по реакции других животных.','Оставаться в машине и на дорогах; тихая пауза часто даёт больше, чем спешка к следующей точке.'],arthur:'Дайте Артуру свой сектор обзора и детский бинокль — так длинный переезд превращается в игру следопыта.'},
    {place:'ngorongoro',icon:'◉',eyebrow:'15 октября · кратер',title:'Нгоронгоро',intro:'На краю кратера прохладно, на дне заметно теплее — одежда слоями решает всё.',tips:['Кофту или лёгкую куртку не убирать в багаж: утром она понадобится сразу.','Въезд в кратер заканчивается раньше общих ворот, поэтому ранний старт здесь особенно важен.','У ворот Лодуаре не показывать еду павианам; перекусы держать закрытыми.'],arthur:'На спуске может укачивать — вода, лёгкий перекус и привычное средство должны быть под рукой.'}
  ];
  const card = tip => `<article class="tip-card"><header><i>${tip.icon}</i><div><small>${tip.eyebrow}</small><h3>${tip.title}</h3></div></header><p class="tip-intro">${tip.intro}</p><ol>${tip.tips.map(item => `<li>${item}</li>`).join('')}</ol><div class="arthur-tip"><b>Для Артура</b><span>${tip.arthur}</span></div></article>`;
  const mount = () => {
    if (document.querySelector('#tips')) return;
    const packing = document.querySelector('#packing');
    const results = document.querySelector('#results');
    const nav = document.querySelector('.field-tabs');
    if (!packing || !results || !nav) return void setTimeout(mount, 150);
    const section = document.createElement('section');
    section.className = 'field-section tips-section';
    section.id = 'tips';
    section.innerHTML = `<div class="field-section-head tips-heading"><div><p>Карманная памятка</p><h2>Лайфхаки<br><em>маршрута</em></h2></div><span>Коротко о каждой точке: что взять, чего избегать и как сделать день комфортнее для Артура.</span></div><aside class="before-flight"><div class="before-flight-mark">!</div><div><small>Важно перед вылетом на Занзибар</small><h3>Четыре вещи проверить ещё дома</h3></div><ul><li>Полис ZIC и его копия офлайн для каждого путешественника</li><li>Обратные билеты, паспорта и копии документов в телефоне</li><li>Многоразовая сумка вместо обычных пластиковых пакетов</li><li>Не вывозить ракушки, кораллы и части животных</li></ul></aside><div class="tips-filter" aria-label="Фильтр лайфхаков по месту">${places.map(([id,label]) => `<button type="button" data-place="${id}" class="${id === 'all' ? 'is-active' : ''}">${label}</button>`).join('')}</div><div class="tips-grid">${tips.map(card).join('')}</div><p class="tips-sources">Памятка собрана по официальным материалам <a href="https://www.tanzaniaparks.go.tz/" target="_blank" rel="noreferrer">TANAPA</a>, <a href="https://www.ncaa.go.tz/" target="_blank" rel="noreferrer">Нгоронгоро</a> и <a href="https://zanzibartourism.go.tz/" target="_blank" rel="noreferrer">Zanzibar Tourism</a>. На месте решения гида и капитана важнее памятки.</p>`;
    results.before(section);
    const link = document.createElement('a');
    link.href = '#tips';
    link.innerHTML = '<i>⌁</i><span>Лайфхаки</span>';
    nav.querySelector('a[href="#results"]').before(link);
    const grid = section.querySelector('.tips-grid');
    section.querySelector('.tips-filter').addEventListener('click', event => {
      const button = event.target.closest('button[data-place]');
      if (!button) return;
      section.querySelectorAll('.tips-filter button').forEach(item => item.classList.toggle('is-active', item === button));
      const place = button.dataset.place;
      grid.innerHTML = tips.filter(tip => place === 'all' || tip.place === place).map(card).join('');
    });
  };
  window.addEventListener('load', mount, {once:true});
})();
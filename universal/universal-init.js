(function(){
  "use strict";
  var registryKey="universal-safari-trip-registry-v2";
  var legacyKey="universal-safari-companion-v1";
  var prefix="universal-safari-trip-data-v2-";
  var today=function(){
    var d=new Date(),p=n=>String(n).padStart(2,"0");
    return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate());
  };
  var parks=[
    {
      "id": "tarangire",
      "name": "Тарангире",
      "country": "tanzania",
      "region": "Северный маршрут",
      "hint": "Слоны и баобабы"
    },
    {
      "id": "serengeti",
      "name": "Серенгети",
      "country": "tanzania",
      "region": "Северный маршрут",
      "hint": "Великая миграция и хищники"
    },
    {
      "id": "ngorongoro",
      "name": "Нгоронгоро",
      "country": "tanzania",
      "region": "Северный маршрут",
      "hint": "Кратер и Большая пятёрка"
    },
    {
      "id": "arusha",
      "name": "Аруша",
      "country": "tanzania",
      "region": "Северный маршрут",
      "hint": "Пешее сафари, жирафы и колобусы"
    },
    {
      "id": "lake-manyara",
      "name": "Озеро Маньяра",
      "country": "tanzania",
      "region": "Северный маршрут",
      "hint": "Озеро, птицы и лес"
    },
    {
      "id": "mkomazi",
      "name": "Мкомази",
      "country": "tanzania",
      "region": "Северный маршрут",
      "hint": "Сухая саванна и охрана носорогов"
    },
    {
      "id": "kilimanjaro",
      "name": "Килиманджаро",
      "country": "tanzania",
      "region": "Северный маршрут",
      "hint": "Трекинг и горные маршруты"
    },
    {
      "id": "ruaha",
      "name": "Руаха",
      "country": "tanzania",
      "region": "Юг и восток",
      "hint": "Большие хищники и антилопы"
    },
    {
      "id": "nyerere",
      "name": "Ньерере",
      "country": "tanzania",
      "region": "Юг и восток",
      "hint": "Сафари на лодке по Руфиджи"
    },
    {
      "id": "mikumi",
      "name": "Микуми",
      "country": "tanzania",
      "region": "Юг и восток",
      "hint": "Равнины и классическое сафари"
    },
    {
      "id": "saadani",
      "name": "Саадани",
      "country": "tanzania",
      "region": "Юг и восток",
      "hint": "Саванна встречается с океаном"
    },
    {
      "id": "udzungwa",
      "name": "Горы Удзунгва",
      "country": "tanzania",
      "region": "Юг и восток",
      "hint": "Леса, приматы и водопады"
    },
    {
      "id": "kitulo",
      "name": "Китуло",
      "country": "tanzania",
      "region": "Юг и восток",
      "hint": "Горные луга и цветы"
    },
    {
      "id": "katavi",
      "name": "Катави",
      "country": "tanzania",
      "region": "Запад и озёра",
      "hint": "Бегемоты, буйволы и дикая природа"
    },
    {
      "id": "gombe",
      "name": "Гомбе",
      "country": "tanzania",
      "region": "Запад и озёра",
      "hint": "Пешее наблюдение за шимпанзе"
    },
    {
      "id": "mahale",
      "name": "Горы Махале",
      "country": "tanzania",
      "region": "Запад и озёра",
      "hint": "Шимпанзе и озеро Танганьика"
    },
    {
      "id": "rubondo-island",
      "name": "Остров Рубондо",
      "country": "tanzania",
      "region": "Запад и озёра",
      "hint": "Остров, леса, птицы и приматы"
    },
    {
      "id": "masai-mara",
      "name": "Масаи-Мара",
      "country": "kenya",
      "region": "Кения"
    },
    {
      "id": "amboseli",
      "name": "Амбосели",
      "country": "kenya",
      "region": "Кения"
    },
    {
      "id": "lake-nakuru",
      "name": "Озеро Накуру",
      "country": "kenya",
      "region": "Кения"
    },
    {
      "id": "samburu",
      "name": "Самбуру",
      "country": "kenya",
      "region": "Кения"
    },
    {
      "id": "tsavo-east",
      "name": "Восточный Цаво",
      "country": "kenya",
      "region": "Кения"
    },
    {
      "id": "tsavo-west",
      "name": "Западный Цаво",
      "country": "kenya",
      "region": "Кения"
    }
  ];
  var defaultTrip=function(){
    return {id:"first",name:"Моё сафари",country:"tanzania",parks:["tarangire","serengeti","ngorongoro"],startDate:today(),endDate:today()};
  };
  var state,initial=defaultTrip();
  function validTrip(t){
    if(!t||typeof t!=="object"||!t.id)return null;
    var country=t.country==="kenya"?"kenya":"tanzania";
    var chosen=Array.isArray(t.parks)?t.parks.filter(id=>parks.some(p=>p.id===id&&p.country===country)):[];
    if(!chosen.length)chosen=parks.filter(p=>p.country===country).slice(0,3).map(p=>p.id);
    return {id:String(t.id),name:String(t.name||"Моё сафари").slice(0,80),country:country,parks:chosen,startDate:/^\d{4}-\d{2}-\d{2}$/.test(t.startDate||"")?t.startDate:today(),endDate:/^\d{4}-\d{2}-\d{2}$/.test(t.endDate||"")?t.endDate:today()};
  }
  try{
    var parsed=JSON.parse(localStorage.getItem(registryKey)||"null");
    if(parsed&&Array.isArray(parsed.trips)&&parsed.trips.length){
      var valid=parsed.trips.map(validTrip).filter(Boolean);
      if(valid.length)state={trips:valid,activeId:valid.some(t=>t.id===parsed.activeId)?parsed.activeId:valid[0].id};
    }
  }catch(e){console.warn("Не удалось прочитать поездки",e)}
  if(!state){
    state={trips:[initial],activeId:initial.id};
    try{
      if(!localStorage.getItem(prefix+initial.id)){
        localStorage.setItem(prefix+initial.id,localStorage.getItem(legacyKey)||JSON.stringify({observations:[],dayNotes:{},doneDays:[]}));
      }
      localStorage.setItem(registryKey,JSON.stringify(state));
    }catch(e){console.warn("Нет доступа к хранилищу",e)}
  }
  var current=state.trips.find(t=>t.id===state.activeId)||state.trips[0];
  window.SafariTripRuntime={
    registryKey:registryKey,
    prefix:prefix,
    parks:parks,
    state:state,
    current:current,
    storageKey:prefix+current.id,
    today:today,
    validate:validTrip,
    save:function(){localStorage.setItem(registryKey,JSON.stringify(this.state))},
    getTrip:function(id){return this.state.trips.find(t=>t.id===id)},
    load:function(id){try{return JSON.parse(localStorage.getItem(prefix+id)||"{}")}catch(e){return {}}},
    write:function(id,data){localStorage.setItem(prefix+id,JSON.stringify(data))},
    activate:function(id){
      if(!this.getTrip(id))return;
      this.state.activeId=id;
      this.save();
      location.reload();
    }
  };
})();
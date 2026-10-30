(function(){
"use strict";
var runtime=window.SafariTripRuntime;
if(!runtime)return;
var toolbar=document.getElementById("safari-trip-tools");
if(!toolbar)return;
var current=runtime.current;
var escapeHtml=function(value){
 return String(value==null?"":value).replace(/[&<>"']/g,function(c){
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
 });
};
var countryLabel=function(c){return c==="kenya"?"Кения":"Танзания"};
var parkNames=function(t){return t.parks.map(function(id){return runtime.parks.find(function(p){return p.id===id})?.name||id}).join(" · ")};
var fmtDate=function(date){if(!date)return "";var a=date.split("-");return a.length===3?a[2]+"."+a[1]+"."+a[0]:date};
var newId=function(){return "trip-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7)};
function shell(className){
 var bg=document.createElement("div");bg.className=className;
 bg.addEventListener("click",function(e){if(e.target===bg)bg.remove()});
 document.body.appendChild(bg);return bg;
}
function openEditor(old){
 var editing=!!old;
 var trip=old?JSON.parse(JSON.stringify(old)):{
  id:newId(),name:"Моё сафари",country:"tanzania",parks:["tarangire","serengeti","ngorongoro"],
  startDate:runtime.today(),endDate:runtime.today()
 };
 var bg=shell("safari-universal-backdrop");
 bg.innerHTML='<div class="safari-universal-dialog" role="dialog" aria-modal="true" aria-label="Настройки поездки">'+
  '<header class="safari-dialog-head"><div><small>МОЁ САФАРИ</small><h2>'+(editing?"Изменить поездку":"Новое путешествие")+'</h2></div><button type="button" data-close aria-label="Закрыть">×</button></header>'+
  '<form id="safari-trip-form"><label>Название поездки<input name="name" maxlength="80" required value="'+escapeHtml(trip.name)+'" placeholder="Например: Семейное сафари"></label>'+
  '<label>Страна<select name="country"><option value="tanzania">Танзания</option><option value="kenya">Кения</option></select></label>'+
  '<div class="safari-form-dates"><label>Начало<input type="date" name="startDate" required value="'+escapeHtml(trip.startDate)+'"></label>'+
  '<label>Окончание<input type="date" name="endDate" required value="'+escapeHtml(trip.endDate)+'"></label></div>'+
  '<fieldset><legend>Национальные парки и заповедники</legend><div class="safari-parks-form"></div></fieldset>'+
  '<p class="safari-form-help">Можно выбрать несколько парков. Каждая поездка хранит свой дневник независимо от других.</p>'+
  '<div class="safari-form-error" role="alert"></div>'+
  '<div class="safari-form-actions">'+(editing&&runtime.state.trips.length>1?'<button type="button" class="safari-delete-trip" data-delete>Удалить поездку</button>':'')+
  '<button type="submit" class="safari-primary">'+(editing?"Сохранить изменения":"Создать поездку")+'</button></div></form></div>';
 var form=bg.querySelector("form"),country=form.elements.country,parksBox=form.querySelector(".safari-parks-form"),error=form.querySelector(".safari-form-error");
 country.value=trip.country;
 function renderParks(){
  var all=runtime.parks.filter(function(p){return p.country===country.value});
  parksBox.innerHTML=all.map(function(p){
   return '<label class="safari-park-check"><input type="checkbox" name="park" value="'+escapeHtml(p.id)+'"'+(trip.parks.includes(p.id)?" checked":"")+'><span>'+escapeHtml(p.name)+'</span></label>'
  }).join("");
 }
 renderParks();
 country.addEventListener("change",function(){
  trip.parks=runtime.parks.filter(function(p){return p.country===country.value}).slice(0,3).map(function(p){return p.id});
  renderParks();
 });
 bg.querySelector("[data-close]").addEventListener("click",function(){bg.remove()});
 form.addEventListener("submit",function(e){
  e.preventDefault();var name=String(form.elements.name.value||"").trim();
  var dates={start:form.elements.startDate.value,end:form.elements.endDate.value};
  var choices=[...form.querySelectorAll('input[name="park"]:checked')].map(function(el){return el.value});
  if(!name){error.textContent="Укажите название поездки.";return}
  if(!dates.start||!dates.end||dates.end<dates.start){error.textContent="Проверьте даты: окончание не может быть раньше начала.";return}
  if(!choices.length){error.textContent="Выберите хотя бы один парк.";return}
  var item={id:trip.id,name:name,country:country.value,parks:choices,startDate:dates.start,endDate:dates.end};
  if(editing){
   var idx=runtime.state.trips.findIndex(function(t){return t.id===item.id});
   if(idx<0)return;
   runtime.state.trips[idx]=item;
  }else{
   runtime.state.trips.push(item);
   runtime.state.activeId=item.id;
   runtime.write(item.id,{observations:[],dayNotes:{},doneDays:[]});
  }
  runtime.save();location.reload();
 });
 var deleteButton=bg.querySelector("[data-delete]");
 if(deleteButton)deleteButton.addEventListener("click",function(){
  if(!confirm("Удалить поездку «"+trip.name+"» и её записи? Это действие нельзя отменить. Сначала сохраните резервную копию, если она вам нужна."))return;
  runtime.state.trips=runtime.state.trips.filter(function(t){return t.id!==trip.id});
  if(runtime.state.activeId===trip.id)runtime.state.activeId=runtime.state.trips[0].id;
  try{localStorage.removeItem(runtime.prefix+trip.id)}catch(e){}
  runtime.save();location.reload();
 });
}
function buildToolbar(){
 toolbar.innerHTML='<div class="safari-tripbar-inner"><div class="safari-tripbar-title"><small>МОЁ САФАРИ · ДНЕВНИК</small><strong>'+escapeHtml(current.name)+'</strong><span>'+countryLabel(current.country)+' · '+escapeHtml(parkNames(current))+'</span></div>'+
 '<div class="safari-tripbar-actions"><label class="safari-trip-switch"><span>Поездка</span><select aria-label="Выбрать поездку">'+
 runtime.state.trips.map(function(t){return '<option value="'+escapeHtml(t.id)+'"'+(t.id===current.id?" selected":"")+'>'+escapeHtml(t.name)+'</option>'}).join("")+'</select></label>'+
 '<button type="button" data-edit>Настроить</button><button type="button" data-new>+ Поездка</button><button class="safari-primary" type="button" data-album>Фотоальбом</button></div></div>';
 toolbar.querySelector("select").addEventListener("change",function(e){runtime.activate(e.target.value)});
 toolbar.querySelector("[data-edit]").addEventListener("click",function(){openEditor(current)});
 toolbar.querySelector("[data-new]").addEventListener("click",function(){openEditor(null)});
 toolbar.querySelector("[data-album]").addEventListener("click",function(){openAlbum()});
}
function dbOpen(){return new Promise(function(resolve,reject){
 var req=indexedDB.open("universal-safari-photos",1);
 req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains("photos"))req.result.createObjectStore("photos")};
 req.onsuccess=function(){resolve(req.result)};req.onerror=function(){reject(req.error)};
})}
async function getBlob(id){
 var db=await dbOpen();
 try{return await new Promise(function(resolve,reject){
  var req=db.transaction("photos","readonly").objectStore("photos").get(id);
  req.onsuccess=function(){resolve(req.result||null)};
  req.onerror=function(){reject(req.error)};
 })}finally{db.close()}
}
async function putBlob(id,blob){
 var db=await dbOpen();
 try{await new Promise(function(resolve,reject){
  var tx=db.transaction("photos","readwrite");
  tx.objectStore("photos").put(blob,id);
  tx.oncomplete=resolve;tx.onerror=function(){reject(tx.error)}
 })}finally{db.close()}
}
async function removeBlob(id){
 var db=await dbOpen();
 try{await new Promise(function(resolve,reject){
  var tx=db.transaction("photos","readwrite");
  tx.objectStore("photos").delete(id);
  tx.oncomplete=resolve;tx.onerror=function(){reject(tx.error)}
 })}finally{db.close()}
}
async function shrink(file){
 try{
  var image=await createImageBitmap(file),size=Math.min(1,2000/Math.max(image.width,image.height));
  var canvas=document.createElement("canvas");canvas.width=Math.round(image.width*size);canvas.height=Math.round(image.height*size);
  canvas.getContext("2d").drawImage(image,0,0,canvas.width,canvas.height);
  if(image.close)image.close();
  var blob=await new Promise(function(ok){canvas.toBlob(ok,"image/jpeg",0.83)});
  return blob||file;
 }catch(e){return file}
}
var albumKey=function(id){return "universal-safari-album-v2-"+id};
var loadMeta=function(){
 try{var x=JSON.parse(localStorage.getItem(albumKey(current.id))||"{}");return {photos:Array.isArray(x.photos)?x.photos:[]}}catch(e){return {photos:[]}}
};
function storeMeta(meta){localStorage.setItem(albumKey(current.id),JSON.stringify(meta))}
function speciesName(id){
 var list=window.SafariSpeciesCatalog||[];
 return list.find(function(a){return a.id===id})?.name||id;
}
function albumData(){
 var data=runtime.load(current.id);
 var observations=Array.isArray(data.observations)?data.observations:[];
 var days=[...new Set(observations.map(function(o){return o.date}).filter(Boolean))].sort();
 var seen=[...new Set(observations.map(function(o){return o.speciesId}).filter(Boolean))];
 var big=["lion","leopard","elephant","buffalo","rhino"].filter(function(id){return seen.includes(id)}).length;
 return {observations:observations,days:days,seen:seen,big:big,notes:data.dayNotes||{}};
}
function albumPageCover(data,cover){
 var title=escapeHtml(current.name),subtitle=countryLabel(current.country)+" · "+fmtDate(current.startDate)+" — "+fmtDate(current.endDate);
 return '<section class="safari-album-page safari-album-cover">'+
 '<div class="safari-cover-image">'+(cover?'<img src="'+cover+'" alt="Обложка сафари">':'<div class="safari-cover-shape">✦</div>')+'</div>'+
 '<div class="safari-cover-copy"><span>МОЁ САФАРИ · ФОТОАЛЬБОМ</span><h1>'+title+'</h1><p>'+escapeHtml(subtitle)+'</p>'+
 '<div class="safari-cover-stats"><strong>'+data.seen.length+'</strong> видов · <strong>'+data.observations.length+'</strong> встреч · Большая пятёрка: <strong>'+data.big+'/5</strong></div></div></section>';
}
function albumPageDay(day,data,images){
 var entries=data.observations.filter(function(o){return o.date===day});
 var idList=[...new Set(entries.map(function(o){return o.speciesId}))];
 var photos=entries.filter(function(o){return images[o.id]}).slice(0,6);
 var body=photos.length?'<div class="safari-album-gallery">'+photos.map(function(o){
  return '<figure><img src="'+images[o.id]+'" alt="'+escapeHtml(speciesName(o.speciesId))+'"><figcaption>'+escapeHtml(speciesName(o.speciesId))+'</figcaption></figure>'
 }).join("")+'</div>':'';
 var place=[...new Set(entries.map(function(o){return runtime.parks.find(function(p){return p.id===o.park})?.name||""}).filter(Boolean))].join(" · ");
 var species=idList.map(function(id){return '<li>'+escapeHtml(speciesName(id))+'</li>'}).join("");
 var note=data.notes[day]||"";
 return '<section class="safari-album-page safari-album-day"><div class="safari-album-section-title"><small>ДЕНЬ САФАРИ · '+escapeHtml(fmtDate(day))+'</small><h2>'+escapeHtml(place||"Наблюдения за животными")+'</h2><p>'+idList.length+' видов · '+entries.length+' встреч</p></div>'+
 (note?'<blockquote>'+escapeHtml(note)+'</blockquote>':'')+body+
 '<h3>Кого мы встретили</h3><ul class="safari-album-species">'+species+'</ul></section>';
}
function albumPageExtras(meta,images){
 var valid=meta.photos.filter(function(p){return images[p.id]});
 if(!valid.length)return "";
 var chunks=[];for(var i=0;i<valid.length;i+=6)chunks.push(valid.slice(i,i+6));
 return chunks.map(function(chunk,index){
  return '<section class="safari-album-page safari-album-day"><div class="safari-album-section-title"><small>ВОСПОМИНАНИЯ</small><h2>Наши фотографии</h2><p>Фото из путешествия'+(chunks.length>1?' · '+(index+1)+'/'+chunks.length:'')+'</p></div><div class="safari-album-gallery">'+
  chunk.map(function(p){return '<figure><img src="'+images[p.id]+'" alt="Фото сафари"><figcaption>'+escapeHtml(p.title||"Момент путешествия")+'</figcaption></figure>'}).join("")+'</div></section>'
 }).join("");
}
async function openAlbum(){
 var bg=shell("safari-album-backdrop");
 bg.innerHTML='<section class="safari-album-dialog" role="dialog" aria-modal="true" aria-label="Фотоальбом сафари">'+
 '<header class="safari-album-toolbar"><div><small>ВАШИ ВОСПОМИНАНИЯ</small><h2>Фотоальбом сафари</h2></div>'+
 '<div class="safari-album-controls"><label class="safari-album-upload">+ Добавить фото<input type="file" accept="image/*" multiple hidden></label>'+
 '<button type="button" data-print class="safari-primary">Печать / PDF</button><button type="button" data-close>Закрыть</button></div></header>'+
 '<p class="safari-album-tip">Для альбома используем ваши фотографии встреч и дополнительные снимки. На iPhone: «Печать / PDF» → раскройте предпросмотр → «Поделиться» → «Сохранить в Файлы».</p>'+
 '<div class="safari-album-status" role="status">Собираем альбом…</div><div class="safari-album-photo-manager"></div><div class="safari-album-pages"></div></section>';
 var urls=[];
 var status=bg.querySelector(".safari-album-status");
 var pageArea=bg.querySelector(".safari-album-pages");
 var manager=bg.querySelector(".safari-album-photo-manager");
 var meta=loadMeta();
 var objectUrls={};
 bg.querySelector("[data-close]").addEventListener("click",function(){bg.remove();urls.forEach(URL.revokeObjectURL)});
 bg.querySelector("[data-print]").addEventListener("click",function(){window.print()});
 async function redraw(){
  var data=albumData(),photos=meta.photos;
  urls.forEach(URL.revokeObjectURL);urls=[];objectUrls={};
  var keys=[...new Set([...data.observations.map(function(o){return o.id}),...photos.map(function(p){return p.id})])];
  var resolved=await Promise.all(keys.map(async function(id){
   try{var blob=await getBlob(id);if(blob instanceof Blob)return [id,URL.createObjectURL(blob)]}catch(e){}return [id,null]
  }));
  if(!bg.isConnected){resolved.forEach(function(x){if(x[1])URL.revokeObjectURL(x[1])});return}
  resolved.forEach(function(pair){if(pair[1]){objectUrls[pair[0]]=pair[1];urls.push(pair[1])}});
  var coverId=photos.find(function(p){return objectUrls[p.id]})?.id||data.observations.find(function(o){return objectUrls[o.id]})?.id;
  pageArea.innerHTML=albumPageCover(data,coverId?objectUrls[coverId]:null)+
   (data.days.length?data.days.map(function(day){return albumPageDay(day,data,objectUrls)}).join(""):
   '<section class="safari-album-page safari-album-day safari-album-empty"><h2>Ваши приключения впереди</h2><p>Добавьте встречи с животными в дневнике, и здесь появятся страницы по дням.</p></section>')+
   albumPageExtras(meta,objectUrls);
  manager.innerHTML=photos.length?'<div class="safari-album-saved"><strong>Дополнительные фотографии ('+photos.length+')</strong>'+
   photos.map(function(p){return '<div><span>'+escapeHtml(p.title||"Фото")+'</span><button type="button" data-remove="'+escapeHtml(p.id)+'">Удалить</button></div>'}).join("")+'</div>':'';
  manager.querySelectorAll("[data-remove]").forEach(function(button){
   button.addEventListener("click",async function(){
    var id=button.dataset.remove;
    meta.photos=meta.photos.filter(function(p){return p.id!==id});storeMeta(meta);await removeBlob(id).catch(function(){});redraw();
   })
  });
  status.textContent=data.observations.length?
    "Готово: "+data.seen.length+" видов, "+data.days.length+" дней, "+photos.length+" дополнительных фотографий.":
    "Записанных встреч пока нет — можно добавить фотографии и сохранить обложку.";
 }
 bg.querySelector('input[type="file"]').addEventListener("change",async function(e){
  var files=[...e.target.files||[]].filter(function(f){return f.type.startsWith("image/")});
  if(!files.length)return;
  if(meta.photos.length+files.length>30){status.textContent="В одном альбоме можно хранить до 30 дополнительных фотографий.";return}
  status.textContent="Сохраняем фотографии…";
  for(var f of files){
   try{
    if(f.size>30*1024*1024)throw Error("Слишком большой файл");
    var id="album-"+current.id+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
    var blob=await shrink(f);
    await putBlob(id,blob);
    meta.photos.push({id:id,title:f.name.replace(/\.[^.]+$/,"").slice(0,75)});
    storeMeta(meta);
   }catch(err){status.textContent="Не удалось сохранить одно из фото. Проверьте свободное место на телефоне.";break}
  }
  e.target.value="";
  await redraw();
 });
 await redraw();
}
buildToolbar();
})();
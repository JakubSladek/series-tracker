!function(e){function t(t){for(var s,o,r=t[0],l=t[1],d=t[2],u=0,p=[];u<r.length;u++)o=r[u],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&p.push(i[o][0]),i[o]=0;for(s in l)Object.prototype.hasOwnProperty.call(l,s)&&(e[s]=l[s]);for(c&&c(t);p.length;)p.shift()();return a.push.apply(a,d||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],s=!0,r=1;r<n.length;r++){var l=n[r];0!==i[l]&&(s=!1)}s&&(a.splice(t--,1),e=o(o.s=n[0]))}return e}var s={},i={0:0},a=[];function o(t){if(s[t])return s[t].exports;var n=s[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=s,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)o.d(n,s,function(t){return e[t]}.bind(null,s));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/wp-content/themes/series-tracker-theme/bundled-assets/";var r=window.webpackJsonp=window.webpackJsonp||[],l=r.push.bind(r);r.push=t,r=r.slice();for(var d=0;d<r.length;d++)t(r[d]);var c=l;a.push([2,1]),n()}([,function(e,t,n){},function(e,t,n){"use strict";n.r(t);n(1);const s=new class{constructor(){this.snackElement=document.getElementById("snackbar"),this.timeout={main:null,startTime:null,timerStep:3e3}}async show(e,t=null){this.timeout.main&&(await this.sleep(await this.getRemainingTime()+500),this.show(e)),this.snackElement.textContent=e,this.snackElement.className="show",this.timeout.startTime=(new Date).getTime(),this.timeout.main=setTimeout(()=>{this.snackElement.className=this.snackElement.className.replace("show",""),this.timeout.main=null,this.timeout.startTime=null},1e3*t||3e3)}getRemainingTime(){return new Promise((e,t)=>{if(!this.timeout.startTime)return t("Can't get remaining time because its not set!");e(this.timeout.timerStep-((new Date).getTime()-this.timeout.startTime))})}sleep(e){return new Promise(t=>setTimeout(t,e))}};if("undefined"==typeof jQuery)throw s.show("ERROR! jQuery is not working!",10);const i=jQuery;var a=class{constructor(){this.events()}events(){i(".submit-note").on("click",this.create.bind(this)),i(".series-main").on("click",".edit-note",this.edit.bind(this)),i(".series-main").on("click",".delete-note",this.delete.bind(this)),i(".series-main").on("click",".update-note",this.update.bind(this)),i(".series-main").on("click",".copy-note",this.copy.bind(this)),i(".series-main").on("click",".season-plus",this.seasonPlus.bind(this)),i(".series-main").on("click",".season-minus",this.seasonMinus.bind(this)),i(".series-main").on("click",".episode-plus",this.episodePlus.bind(this)),i(".series-main").on("click",".episode-minus",this.episodeMinus.bind(this)),i("#search-series").on("input",this.search)}delete(e){const t=i(e.target).parents("li");i.ajax({beforeSend:e=>{e.setRequestHeader("X-WP-Nonce",trackerData.nonce)},url:`${trackerData.root_url}/wp-json/wp/v2/series/${t.data("id")}`,type:"DELETE",success:e=>{t.slideUp(),t.remove(),i("#tracked_series_count").text(e.tracked_series),s.show("Succesfully deleted."),console.log(e)},error:e=>{s.show("Error, can't delete this!"),console.log(e)}})}update(e){const t=i(e.target).parents("li");if(!t.find(".note-title-field").val().length)return s.show("Can't save! Series title cannot be blank!");const n={title:t.find(".note-title-field").val(),content:t.find(".note-body-field").val(),series_number:t.find("#SEASON_NO").text(),episode_number:t.find("#EPISODE_NO").text()};i.ajax({beforeSend:e=>{e.setRequestHeader("X-WP-Nonce",trackerData.nonce)},url:`${trackerData.root_url}/wp-json/wp/v2/series/${t.data("id")}`,type:"POST",data:n,success:e=>{this.makeReadOnly(t),s.show("Succesfully updated."),console.log(e)},error:e=>{s.show("Error, can't update this!"),console.log(e)}})}create(e){const t=i(e.target).parents("div");if(!t.find(".new-note-title").val().length)return s.show("Can't create! Series title cannot be blank!");const n={title:t.find(".new-note-title").val(),content:t.find(".new-note-body").val(),status:"publish",series_number:t.find("#SEASON_NO").text(),episode_number:t.find("#EPISODE_NO").text()};i.ajax({beforeSend:e=>{e.setRequestHeader("X-WP-Nonce",trackerData.nonce)},url:trackerData.root_url+"/wp-json/wp/v2/series/",type:"POST",data:n,success:e=>{i(".new-note-title, .new-note-body").val(""),i(`\n\t\t\t\t<li data-id="${e.id}">\n\t\t\t\t\t<sup class="se">\n\t\t\t\t\t\t<i class="fa fa-minus season-minus se-control" aria-hidden="true"></i>\n                        S<span id="SEASON_NO">${e.series_number}</span>\n                        <i class="fa fa-plus season-plus se-control" aria-hidden="true"></i>\n\n                        <i class="fa fa-minus episode-minus se-control" aria-hidden="true"></i>\n                        E<span id="EPISODE_NO">${e.episode_number}</span>\n                        <i class="fa fa-plus episode-plus se-control" aria-hidden="true"></i>\n                    </sup>\n\n                    <input readonly class="note-title-field" value="${e.title.raw}">\n\n                    <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>\n                    <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>\n                    <span class="copy-note"><i class="fa fa-copy" aria-hidden="true"></i> Copy</span>\n\n                    <textarea readonly class="note-body-field">${e.content.raw}</textarea>\n\n                    <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"> Save</i></span>\n                </li>\n\t\t\t\t`).prependTo("#my-notes").hide().slideDown(),i("#tracked_series_count").text(e.tracked_series),s.show("Succesfully created."),console.log(e)},error:e=>{let t="Error! "+("You have reached your series limit!"==e.responseText?e.responseText:"Please contact administrator!");s.show(t),console.log(e)}})}search(e){const t=i(e.target).val().toLowerCase();let n=!1;t.length||(n=!0),i("#my-notes").children("li").each((function(){if(n)return i(this).slideDown();i(this).children(".note-title-field").val().toLowerCase().includes(t)?i(this).slideDown():i(this).slideUp()}))}edit(e){const t=i(e.target).parents("li");"editable"==t.data("state")?this.makeReadOnly(t):this.makeEditable(t)}makeEditable(e){e.find(".edit-note").html('<i class="fa fa-times" aria-hidden="true"></i> Cancel'),e.find(".note-title-field, .note-body-field").removeAttr("readonly").addClass("note-active-field"),e.find(".update-note").addClass("update-note--visible"),e.data("state","editable"),e.children(i("se")).children(i("se-control")).each((function(){i(this).hasClass("se-control--active")||i(this).addClass("se-control--active")}))}makeReadOnly(e){e.find(".edit-note").html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit'),e.find(".note-title-field, .note-body-field").attr("readonly","readonly").removeClass("note-active-field"),e.find(".update-note").removeClass("update-note--visible"),e.data("state","cancel"),e.children(i("se")).children(i("se-control")).each((function(){i(this).hasClass("se-control--active")&&i(this).removeClass("se-control--active")}))}copy(e){const t=i(e.target).parents("li"),n=`${t.find(".note-title-field").val().trim()} S${t.find("#SEASON_NO").text()}E${t.find("#EPISODE_NO").text()}`;this.textToClipboard(n),s.show("Copied to clipboard.")}textToClipboard(e){const t=document.createElement("textarea");document.body.appendChild(t),t.value=e,t.select(),document.execCommand("copy"),document.body.removeChild(t)}episodePlus(e){const t=i(e.target).parents(".se"),n=i(t).find("#EPISODE_NO");let s=parseFloat(n.text());s++,s=s.toString().padStart(2,"0"),i(n).text(s)}episodeMinus(e){const t=i(e.target).parents(".se"),n=i(t).find("#EPISODE_NO");let a=parseFloat(n.text());if(0==a)return s.show("The lowest episode number reached!");a--,a=a.toString().padStart(2,"0"),i(n).text(a)}seasonPlus(e){const t=i(e.target).parents(".se"),n=i(t).find("#SEASON_NO");let s=parseFloat(n.text());s++,s=s.toString().padStart(2,"0"),i(n).text(s)}seasonMinus(e){const t=i(e.target).parents(".se"),n=i(t).find("#SEASON_NO");let a=parseFloat(n.text());if(1==a)return s.show("The lowest season number reached!");a--,a=a.toString().padStart(2,"0"),i(n).text(a)}};var o=class{constructor(){this.menu=document.querySelector(".site-header__menu"),this.openButton=document.querySelector(".site-header__menu-trigger"),this.events()}events(){this.openButton.addEventListener("click",()=>this.openMenu())}openMenu(){this.openButton.classList.toggle("fa-bars"),this.openButton.classList.toggle("fa-window-close"),this.menu.classList.toggle("site-header__menu--active")}},r=n(0);var l=class{constructor(){if(document.querySelector(".hero-slider")){const e=document.querySelectorAll(".hero-slider__slide").length;let t="";for(let n=0;n<e;n++)t+=`<button class="slider__bullet glide__bullet" data-glide-dir="=${n}"></button>`;document.querySelector(".glide__bullets").insertAdjacentHTML("beforeend",t),new r.a(".hero-slider",{type:"carousel",perView:1,autoplay:3e3}).mount()}}};new o,new l,new a}]);
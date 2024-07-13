import{_ as v}from"./nuxt-link.d6875ca7.js";import{_ as h,k as b,j as g,i as k,o as r,c as u,a as o,g as l,r as w,M as S,b as a,w as c,s as y,A as x,d,t as p,N as C,O as L,P as j,K as I,l as N,v as T,x as W,T as Z,p as B,e as z,u as A,Q as M}from"./entry.a9109483.js";const P=["src"],V={__name:"LangSwitcher2",setup(s){const{locale:t}=b({useScope:"global"}),e=g();k(()=>{g()});function n(){t.value==="en"?(e.setLocale("en"),t.value="id_ID"):(e.setLocale("en"),t.value="en")}return(_,i)=>(r(),u("div",{class:"cursor-pointer transition-all fade",onClick:i[0]||(i[0]=m=>n())},[o("img",{src:`/flags/${l(t)}.png`,class:"h-3"},null,8,P)]))}},D=h(V,[["__scopeId","data-v-cd1a154c"]]),G=""+globalThis.__publicAssetsURL("images/avatar.jpg"),O={class:"sidebar-info"},R=x('<figure class="avatar-box"><img src="'+G+'" alt="Photo" width="80"></figure><div class="info-content"><h1 class="name" title="Zihao Wang"> Zihao Wang </h1><p class="title text-center xl:block flex items-center justify-center gap-1"><span class="xl:after:content-[&#39;&#39;] after:content-[&#39;,&#39;]">Master&#39;s Student at EPFL</span></p></div>',2),E=o("span",null,"Show Contacts",-1),F=o("ion-icon",{name:"chevron-down"},null,-1),H=[E,F],K={class:"sidebar-info_more"},Q=x('<div class="separator"></div><ul class="contacts-list"><li class="contact-item"><div class="icon-box"><ion-icon name="logo-github"></ion-icon></div><div class="contact-info"><p class="contact-title"> Github </p><a href="https://github.com/ZihaoWang2000" class="contact-link" target="_blank">ZihaoWang2000</a></div></li><li class="contact-item"><div class="icon-box"><ion-icon name="logo-linkedin"></ion-icon></div><div class="contact-info"><p class="contact-title"> Linkedin </p><a href="https://www.linkedin.com/in/zihao-wang-elliott" class="contact-link" target="_blank">Zihao Wang</a></div></li><li class="contact-item"><div class="icon-box"><ion-icon name="logo-instagram"></ion-icon></div><div class="contact-info"><p class="contact-title"> INSTAGRAM </p><a href="https://www.instagram.com/wzhelliott/" class="contact-link" target="_blank">wzhelliott</a></div></li><li class="contact-item"><div class="icon-box"><ion-icon name="calendar-outline"></ion-icon></div><div class="contact-info"><p class="contact-title">Birthday</p><time datetime="2000-10-03">Oct 3, 2000</time></div></li></ul><div class="separator"></div>',3),U={class:"social-list"},q={class:"social-item"},J=o("ion-icon",{name:"mail-outline"},null,-1),X={__name:"Sidebar",setup(s){let t=w(!1);return(e,n)=>{const _=v,i=D;return r(),u("aside",{class:y(["sidebar",{active:l(t)}])},[o("div",O,[R,o("button",{class:"info_more-btn",onClick:n[0]||(n[0]=m=>S(t)?t.value=!l(t):t=!l(t))},H)]),o("div",K,[Q,o("ul",U,[o("li",q,[a(_,{to:"mailto:elliott_wang2000@outlook.com",class:"social-link",target:"_blank"},{default:c(()=>[J]),_:1})]),a(i)])])],2)}}},Y=X;const tt={},ot={class:"navbar"},et={class:"navbar-list"},st={class:"navbar-item"},nt={class:"navbar-item"},at={class:"navbar-item"},it={class:"navbar-item"};function ct(s,t){const e=v;return r(),u("nav",ot,[o("ul",et,[o("li",st,[a(e,{to:"/",class:"navbar-link"},{default:c(()=>[d(p(s.$t("pageTitles.about")),1)]),_:1})]),o("li",nt,[a(e,{to:"/resume",class:"navbar-link"},{default:c(()=>[d(p(s.$t("pageTitles.resume")),1)]),_:1})]),o("li",at,[a(e,{to:"/portfolio",class:"navbar-link"},{default:c(()=>[d(p(s.$t("pageTitles.portfolio")),1)]),_:1})]),o("li",it,[a(e,{to:"/plog",class:"navbar-link"},{default:c(()=>[d(p(s.$t("pageTitles.plog")),1)]),_:1})])])])}const lt=h(tt,[["render",ct],["__scopeId","data-v-38b638b2"]]),f=C("cookieStore",()=>{const s=w(L("accept-cookie")),t=j("$cookies");function e(){return t.set("accept-cookie",!0,"30d"),this.cookie=!0}const n=I(()=>s.value);return{cookie:s,setCookie:e,getCookie:n}});const $=s=>(B("data-v-1144c8c8"),s=s(),z(),s),_t={class:"container left-0 right-0 mx-auto child md:w-[25%] bg-[#3f3f40] rounded-lg shadow-xl px-6 py-3 bottom-20 fixed z-[100] flex items-center justify-between animate-bounce"},rt=$(()=>o("span",{class:"text-[#fafafa]"},"This site use cookies! 🍪",-1)),dt=$(()=>o("ion-icon",{name:"close-outline"},null,-1)),pt=[dt],ut={__name:"CookieBar",setup(s){const t=f();return k(()=>{f()}),(e,n)=>(r(),N(Z,{name:"bounce"},{default:c(()=>[T(o("div",_t,[rt,o("span",{class:"cursor-pointer p-2 shadow-md rounded bg-[#383838] text-[#fafafa] hover:bg-[#1e1e1f] transition",onClick:n[0]||(n[0]=_=>l(t).setCookie())},pt)],512),[[W,!l(t).getCookie]])]),_:1}))}},mt=h(ut,[["__scopeId","data-v-1144c8c8"]]),ht={class:"relative"},gt={class:"main-content"},bt={__name:"default",setup(s){const{locale:t}=b({useScope:"global"});return A({htmlAttrs:{lang:t},titleTemplate:e=>e?`${e} - Zihao Wang `:"Zihao Wang",meta:[{charset:"utf-8"},{name:"description",content:"Personal site about Zihao Wang."},{name:"viewport",content:"width=device-width, initial-scale=1"},{name:"og:image",content:"https://raw.githubusercontent.com/ZihaoWang2000/zihaoblog/main/IMG_3050.jpeg"}],link:[{rel:"icon",type:"image/jpg",href:"../images/icon.jpg"},{rel:"apple-touch-icon",href:"../images/icon.jpg"},{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap",crossorigin:""}],script:[{src:"https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js",body:!1,type:"module"},{src:"https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js",body:!1,nomodule:!0}]}),(e,n)=>{const _=Y,i=lt,m=mt;return r(),u("main",ht,[a(_),o("div",gt,[a(i),M(e.$slots,"default")]),a(m)])}}};export{bt as default};

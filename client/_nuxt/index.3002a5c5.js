import{u as f,k,m as I,c as l,a as t,t as o,F as h,q as b,o as i,s as C,g as c}from"./entry.114660ef.js";import{u as D}from"./fetch.55fe1ea3.js";const B={class:"blog active","data-page":"blog"},F={class:"h2 article-title"},L={class:"blog-posts"},S={class:"blog-posts-list"},j={class:"blog-banner-box"},w=["src"],z={class:"blog-content"},H={class:"blog-meta"},X={class:"blog-category"},$=t("span",{class:"dot"},null,-1),q={class:"h4 blog-item-title"},P={__name:"index",async setup(x){let e,r;f({title:"Plog"});const{locale:n}=k({useScope:"global"}),{data:y}=([e,r]=I(()=>D("/api/photo","$Xj2SHXpt5I")),e=await e,r(),e),v=[...y.value];return(a,A)=>(i(),l("article",B,[t("header",null,[t("h2",F,o(a.$t("pageTitles.plog")),1)]),t("section",L,[t("ul",S,[(i(!0),l(h,null,b(a.projectList,s=>(i(),l("li",{key:s.id,class:C([{active:a.activeCategory===s.category.id||a.activeCategory===0},"project-item"])},null,2))),128)),(i(),l(h,null,b(v,s=>{var _,d,g,u,m,p;return t("li",{key:s.id,class:"blog-post-item"},[t("a",null,[t("figure",j,[t("img",{src:s.image,alt:"photo.title",loading:"lazy"},null,8,w)]),t("div",z,[t("div",H,[t("p",X,o(c(n)==="en"?(_=s.location)==null?void 0:_.en:(d=s.location)==null?void 0:d.id_ID),1),$,t("time",null,o(c(n)==="en"?(g=s.time)==null?void 0:g.en:(u=s.time)==null?void 0:u.id_ID),1)]),t("h4",q,o(c(n)==="en"?(m=s.title)==null?void 0:m.en:(p=s.title)==null?void 0:p.id_ID),1)])])])}),64))])])]))}};export{P as default};

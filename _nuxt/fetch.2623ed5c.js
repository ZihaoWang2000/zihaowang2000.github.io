import{r as D,B as P,C as k,D as C,E as b,G as O,H as E,g as _,I as B,J as F,K as R,L as H}from"./entry.c4ec2076.js";const M=()=>null;function $(...i){const l=typeof i[i.length-1]=="string"?i.pop():void 0;typeof i[0]!="string"&&i.unshift(l);let[t,r,s={}]=i;if(typeof t!="string")throw new TypeError("[nuxt] [asyncData] key must be a string.");if(typeof r!="function")throw new TypeError("[nuxt] [asyncData] handler must be a function.");s.server=s.server??!0,s.default=s.default??M,s.lazy=s.lazy??!1,s.immediate=s.immediate??!0;const e=E(),d=()=>e.isHydrating?e.payload.data[t]:e.static.data[t],c=()=>d()!==void 0;e._asyncData[t]||(e._asyncData[t]={data:D(d()??s.default()),pending:D(!c()),error:P(e.payload._errors,t),status:D("idle")});const a={...e._asyncData[t]};a.refresh=a.execute=(o={})=>{if(e._asyncDataPromises[t]){if(o.dedupe===!1)return e._asyncDataPromises[t];e._asyncDataPromises[t].cancelled=!0}if((o._initial||e.isHydrating&&o._initial!==!1)&&c())return d();a.pending.value=!0,a.status.value="pending";const f=new Promise((n,u)=>{try{n(r(e))}catch(v){u(v)}}).then(n=>{if(f.cancelled)return e._asyncDataPromises[t];let u=n;s.transform&&(u=s.transform(n)),s.pick&&(u=z(u,s.pick)),a.data.value=u,a.error.value=null,a.status.value="success"}).catch(n=>{if(f.cancelled)return e._asyncDataPromises[t];a.error.value=n,a.data.value=_(s.default()),a.status.value="error"}).finally(()=>{f.cancelled||(a.pending.value=!1,e.payload.data[t]=a.data.value,a.error.value&&(e.payload._errors[t]=B(a.error.value)),delete e._asyncDataPromises[t])});return e._asyncDataPromises[t]=f,e._asyncDataPromises[t]};const p=()=>a.refresh({_initial:!0}),g=s.server!==!1&&e.payload.serverRendered;{const o=k();if(o&&!o._nuxtOnBeforeMountCbs){o._nuxtOnBeforeMountCbs=[];const n=o._nuxtOnBeforeMountCbs;o&&(C(()=>{n.forEach(u=>{u()}),n.splice(0,n.length)}),b(()=>n.splice(0,n.length)))}g&&e.isHydrating&&c()?(a.pending.value=!1,a.status.value=a.error.value?"error":"success"):o&&(e.payload.serverRendered&&e.isHydrating||s.lazy)&&s.immediate?o._nuxtOnBeforeMountCbs.push(p):s.immediate&&p(),s.watch&&O(s.watch,()=>a.refresh());const f=e.hook("app:data:refresh",n=>{if(!n||n.includes(t))return a.refresh()});o&&b(f)}const m=Promise.resolve(e._asyncDataPromises[t]).then(()=>a);return Object.assign(m,a),m}function z(i,l){const t={};for(const r of l)t[r]=i[r];return t}function T(i,l,t){const[r={},s]=typeof l=="string"?[{},l]:[l,t],e=r.key||F([s,_(r.baseURL),typeof i=="string"?i:"",_(r.params||r.query)]);if(!e||typeof e!="string")throw new TypeError("[nuxt] [useFetch] key must be a string: "+e);if(!i)throw new Error("[nuxt] [useFetch] request is missing.");const d=e===s?"$f"+e:e,c=R(()=>{let h=i;return typeof h=="function"&&(h=h()),_(h)});if(!r.baseURL&&typeof c.value=="string"&&c.value.startsWith("//"))throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');const{server:a,lazy:p,default:g,transform:m,pick:o,watch:f,immediate:n,...u}=r,v=H({...u,cache:typeof r.cache=="boolean"?void 0:r.cache}),x={server:a,lazy:p,default:g,transform:m,pick:o,immediate:n,watch:f===!1?[]:[v,c,...f||[]]};let y;return $(d,()=>{var w;return(w=y==null?void 0:y.abort)==null||w.call(y),y=typeof AbortController<"u"?new AbortController:{},typeof c.value=="string"&&c.value.startsWith("/"),(r.$fetch||globalThis.$fetch)(c.value,{signal:y.signal,...v})},x)}export{T as u};

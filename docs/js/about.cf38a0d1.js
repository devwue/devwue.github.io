(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{f820:function(e,o,t){"use strict";t.r(o);var n=t("7a23");const i={class:"markdown-body"};function s(e,o,t,s,r,c){return Object(n["p"])(),Object(n["d"])("div",i,[Object(n["f"])("div",{innerHTML:e.profile},null,8,["innerHTML"])])}var r=t("ce1f"),c=t("0e54"),d=t.n(c);class l extends r["b"]{constructor(){super(...arguments),this.profile="",this.profileRaw=""}created(){const e="https://devwue.github.io",o="/docs",t=e+o+"/About.md";console.log(t),this.$http.get(t).then(e=>{this.profileRaw=e.data,this.profile=d()(this.profileRaw)})}mounted(){console.log("mounted","init"),this.profileRaw&&console.log("mounted","procc")}}l.render=s;o["default"]=l}}]);
//# sourceMappingURL=about.cf38a0d1.js.map
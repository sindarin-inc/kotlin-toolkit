!function(){"use strict";class t{constructor(t,i){if(this.margins={top:0,right:0,bottom:0,left:0},!t.contentWindow)throw Error("Iframe argument must have been attached to DOM.");this.listener=i,this.iframe=t,this.iframe.addEventListener("load",(()=>{this.onIframeLoaded()}))}show(){this.iframe.style.display="unset"}hide(){this.iframe.style.display="none"}setMargins(t){this.margins!=t&&(this.iframe.style.marginTop=this.margins.top+"px",this.iframe.style.marginLeft=this.margins.left+"px",this.iframe.style.marginBottom=this.margins.bottom+"px",this.iframe.style.marginRight=this.margins.right+"px")}loadPage(t){this.iframe.src=t}onIframeLoaded(){const t=this.iframe.contentWindow.document.querySelector("meta[name=viewport]");if(t instanceof HTMLMetaElement)return;const i=this.parsePageSize(t);i&&(this.iframe.style.width=i.width+"px",this.iframe.style.height=i.height+"px",this.size=i,this.listener.onIframeLoaded())}parsePageSize(t){const i=/(\w+) *= *([^\s,]+)/g,e=new Map;let s;for(;s=i.exec(t.content);)null!=s&&e.set(s[1],s[2]);const h=parseFloat(e.get("width")),n=parseFloat(e.get("height"));return h&&n?{width:h,height:n}:void 0}}class i{setInitialScale(t){return this.initialScale=t,this}setMinimumScale(t){return this.minimumScale=t,this}setWidth(t){return this.width=t,this}setHeight(t){return this.height=t,this}build(){const t=[];return this.initialScale&&t.push("initial-scale="+this.initialScale),this.minimumScale&&t.push("minimum-scale="+this.minimumScale),this.width&&t.push("width="+this.width),this.height&&t.push("height="+this.height),t.join(", ")}}class e{constructor(i,e,s){this.fit="contain",this.insets={top:0,right:0,bottom:0,left:0};const h={onIframeLoaded:()=>{this.layout()}};this.leftPage=new t(i,h),this.rightPage=new t(e,h),this.metaViewport=s}loadSpread(t){this.leftPage.hide(),this.rightPage.hide(),t.left&&this.leftPage.loadPage(t.left),t.right&&this.rightPage.loadPage(t.right)}setViewport(t,i){this.viewport==t&&this.insets==i||(this.viewport=t,this.insets=i,this.layout())}setFit(t){this.fit!=t&&(this.fit=t,this.layout())}layout(){var t,e,s,h,n,a,o,r;if(!this.viewport||!this.leftPage.size&&!this.rightPage.size)return;const l={top:this.insets.top,right:0,bottom:this.insets.bottom,left:this.insets.left};this.leftPage.setMargins(l);const g={top:this.insets.top,right:this.insets.right,bottom:this.insets.bottom,left:0};this.rightPage.setMargins(g);const d=(null!==(e=null===(t=this.leftPage.size)||void 0===t?void 0:t.width)&&void 0!==e?e:0)+(null!==(h=null===(s=this.rightPage.size)||void 0===s?void 0:s.width)&&void 0!==h?h:0),m=Math.max(null!==(a=null===(n=this.leftPage.size)||void 0===n?void 0:n.height)&&void 0!==a?a:0,null!==(r=null===(o=this.rightPage.size)||void 0===o?void 0:o.height)&&void 0!==r?r:0),c={width:d,height:m},u=function(t,i,e){switch(t){case"contain":return function(t,i){const e=i.width/t.width,s=i.height/t.height;return Math.min(e,s)}(i,e);case"width":return function(t,i){return i.width/t.width}(i,e);case"height":return function(t,i){return i.height/t.height}(i,e)}}(this.fit,c,this.viewport);this.metaViewport.content=(new i).setInitialScale(u).setMinimumScale(u).setWidth(d).setHeight(m).build(),this.leftPage.show(),this.rightPage.show()}}var s;!function(t){const i=document.getElementById("page-left"),s=document.getElementById("page-right"),h=document.querySelector("meta[name=viewport]"),n=new e(i,s,h);t.loadSpread=function(t){n.loadSpread(t)},t.setViewport=function(t,i,e,s,h,a){const o={width:t,height:i},r={top:e,left:s,bottom:h,right:a};n.setViewport(o,r)},t.setFit=function(t){if("contain"!=t&&"width"!=t&&"height"!=t)throw Error(`Invalid fit value: ${t}`);n.setFit(t)}}(s||(s={})),Window.prototype.layout=s}();
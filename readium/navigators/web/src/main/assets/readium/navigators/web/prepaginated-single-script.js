!function(){"use strict";class t{constructor(t,i){if(this.margins={top:0,right:0,bottom:0,left:0},!t.contentWindow)throw Error("Iframe argument must have been attached to DOM.");this.listener=i,this.iframe=t,this.iframe.addEventListener("load",(()=>{this.onIframeLoaded()}))}show(){this.iframe.style.display="unset"}hide(){this.iframe.style.display="none"}setMargins(t){this.margins!=t&&(this.iframe.style.marginTop=this.margins.top+"px",this.iframe.style.marginLeft=this.margins.left+"px",this.iframe.style.marginBottom=this.margins.bottom+"px",this.iframe.style.marginRight=this.margins.right+"px")}loadPage(t){this.iframe.src=t}onIframeLoaded(){const t=this.iframe.contentWindow.document.querySelector("meta[name=viewport]");if(t instanceof HTMLMetaElement)return;const i=this.parsePageSize(t);i&&(this.iframe.style.width=i.width+"px",this.iframe.style.height=i.height+"px",this.size=i,this.listener.onIframeLoaded())}parsePageSize(t){const i=/(\w+) *= *([^\s,]+)/g,e=new Map;let s;for(;s=i.exec(t.content);)null!=s&&e.set(s[1],s[2]);const h=parseFloat(e.get("width")),n=parseFloat(e.get("height"));return h&&n?{width:h,height:n}:void 0}}class i{setInitialScale(t){return this.initialScale=t,this}setMinimumScale(t){return this.minimumScale=t,this}setWidth(t){return this.width=t,this}setHeight(t){return this.height=t,this}build(){const t=[];return this.initialScale&&t.push("initial-scale="+this.initialScale),this.minimumScale&&t.push("minimum-scale="+this.minimumScale),this.width&&t.push("width="+this.width),this.height&&t.push("height="+this.height),t.join(", ")}}class e{constructor(i,e){this.fit="contain",this.insets={top:0,right:0,bottom:0,left:0},this.metaViewport=e;const s={onIframeLoaded:()=>{this.onIframeLoaded()}};this.page=new t(i,s)}setViewport(t,i){this.viewport==t&&this.insets==i||(this.viewport=t,this.insets=i,this.layout())}setFit(t){this.fit!=t&&(this.fit=t,this.layout())}loadResource(t){this.page.hide(),this.page.loadPage(t)}onIframeLoaded(){this.page.size&&this.layout()}layout(){if(!this.page.size||!this.viewport)return;const t={top:this.insets.top,right:this.insets.right,bottom:this.insets.bottom,left:this.insets.left};this.page.setMargins(t);const e=function(t,i,e){switch(t){case"contain":return function(t,i){const e=i.width/t.width,s=i.height/t.height;return Math.min(e,s)}(i,e);case"width":return function(t,i){return i.width/t.width}(i,e);case"height":return function(t,i){return i.height/t.height}(i,e)}}(this.fit,this.page.size,this.viewport);this.metaViewport.content=(new i).setInitialScale(e).setMinimumScale(e).setWidth(this.page.size.width).setHeight(this.page.size.height).build(),this.page.show()}}var s;!function(t){const i=document.getElementById("page"),s=document.querySelector("meta[name=viewport]"),h=new e(i,s);t.loadResource=function(t){h.loadResource(t)},t.setViewport=function(t,i,e,s,n,a){const o={width:t,height:i},r={top:e,left:s,bottom:n,right:a};h.setViewport(o,r)},t.setFit=function(t){if("contain"!=t&&"width"!=t&&"height"!=t)throw Error(`Invalid fit value: ${t}`);h.setFit(t)}}(s||(s={})),Window.prototype.layout=s}();
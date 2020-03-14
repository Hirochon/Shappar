(function(t){function e(e){for(var n,r,o=e[0],u=e[1],c=e[2],d=0,p=[];d<o.length;d++)r=o[d],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&p.push(i[r][0]),i[r]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(t[n]=u[n]);l&&l(e);while(p.length)p.shift()();return a.push.apply(a,c||[]),s()}function s(){for(var t,e=0;e<a.length;e++){for(var s=a[e],n=!0,o=1;o<s.length;o++){var u=s[o];0!==i[u]&&(n=!1)}n&&(a.splice(e--,1),t=r(r.s=s[0]))}return t}var n={},i={app:0},a=[];function r(e){if(n[e])return n[e].exports;var s=n[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=t,r.c=n,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(s,n,function(e){return t[e]}.bind(null,n));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="https://d3ms402csqm2a0.cloudfront.net/static/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var l=u;a.push([0,"chunk-vendors"]),s()})({0:function(t,e,s){t.exports=s("56d7")},"0927":function(t,e,s){"use strict";var n=s("66fb"),i=s.n(n);i.a},"1c76":function(t,e,s){},"20a5":function(t,e,s){"use strict";var n=s("77e6"),i=s.n(n);i.a},4365:function(t,e,s){},"51a3":function(t,e,s){},"56d7":function(t,e,s){"use strict";s.r(e);s("e260"),s("e6cf"),s("cca6"),s("a79d");var n=s("2b0e"),i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"app"}},[s("router-view")],1)},a=[],r=(s("5c0b"),s("2877")),o={},u=Object(r["a"])(o,i,a,!1,null,null,null),c=u.exports,l=(s("45fc"),s("8c4f")),d=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"Public",on:{touchmove:t.pullToMove,touchend:t.pullToEnd}},[s("GlobalMessage"),s("transition",{attrs:{name:"search"}},[s("Search",{directives:[{name:"show",rawName:"v-show",value:t.searchShow,expression:"searchShow"}],attrs:{query:t.query},on:{search:function(e){return t.search()}}})],1),s("div",{staticClass:"Pull-to",attrs:{id:"Pull-to"}},[t.refreshConfig.loading?s("font-awesome-icon",{staticClass:"Pull-to__rotate",attrs:{icon:"spinner"}}):t._e(),t.refreshConfig.isStart?s("font-awesome-icon",{class:{"Pull-to__on":t.refreshConfig.trigger},attrs:{icon:"chevron-circle-down"}}):t._e()],1),s("PostList",{attrs:{posts:t.posts,unique_id:t.unique_id}}),s("New",{attrs:{isOpen:t.isOpen},on:{switchNew:function(e){return t.switchNew()},refresh:t.refresh}})],1)},p=[],m=(s("99af"),s("4160"),s("159b"),s("96cf"),s("1da1")),h=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"Search"},[s("router-link",{staticClass:"Search__icon",attrs:{to:"/mypage"}},[s("img",{attrs:{src:t.user.iconimage,alt:""}})]),s("form",{staticClass:"Search__form",attrs:{action:""},on:{submit:function(e){return e.preventDefault(),t.getPost(e)}}},[s("label",{staticClass:"Search__label",attrs:{for:"text-box"}},[t._v("検索")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.childQuery,expression:"childQuery"}],staticClass:"Search__input",attrs:{type:"text",id:"text-box"},domProps:{value:t.childQuery},on:{input:function(e){e.target.composing||(t.childQuery=e.target.value)}}}),s("div",{staticClass:"Search__submit"},[s("font-awesome-icon",{attrs:{icon:"search"},on:{click:t.getPost}})],1)]),s("router-link",{staticClass:"Search__icon",attrs:{to:"/mypage"}},[s("img",{attrs:{src:t.user.iconimage,alt:""}})])],1)},f=[],g=(s("d3b7"),s("07ac"),s("bc3a")),v=s.n(g),_=s("2f62");n["default"].use(_["a"]);var w={strict:!1,namespaced:!0,state:{unique_id:"",username:"",isLoggedIn:!1},getters:{unique_id:function(t){return t.unique_id},username:function(t){return t.username},isLoggedIn:function(t){return t.isLoggedIn}},mutations:{set:function(t,e){t.unique_id=e.user.id,t.username=e.user.username,t.isLoggedIn=!0},clear:function(t){t.unique_id="",t.username="",t.isLoggedIn=!1}},actions:{login:function(t,e){return q.post("/api/v1/auth/jwt/create/",{username:e.username,password:e.password}).then((function(e){return localStorage.setItem("access",e.data.access),t.dispatch("reload").then((function(t){return t}))}))},logout:function(t){localStorage.removeItem("access"),t.commit("clear")},reload:function(t){return q.get("/api/v1/auth/users/me/").then((function(e){var s=e.data;return t.commit("set",{user:s}),s}))}}},b={strict:!1,namespaced:!0,state:{error:"",warnings:[],info:""},getters:{error:function(t){return t.error},warnings:function(t){return t.warnings},info:function(t){return t.info}},mutations:{set:function(t,e){e.error&&(t.error=e.error),e.warnings&&(t.warnings=e.warnings),e.info&&(t.info=e.info)},clear:function(t){t.error="",t.warnings=[],t.info=""}},actions:{setErrorMessage:function(t,e){t.commit("clear"),t.commit("set",{error:e.message})},setWarningMessages:function(t,e){t.commit("clear"),t.commit("set",{warnings:e.messages})},setInfoMessage:function(t,e){t.commit("clear"),t.commit("set",{info:e.message})},clearMessages:function(t){t.commit("clear")}}},y=new _["a"].Store({modules:{auth:w,message:b}}),C=y,x=v.a.create({baseURL:Object({NODE_ENV:"production",BASE_URL:"https://d3ms402csqm2a0.cloudfront.net/static/"}).VUE_APP_ROOT_API,timeout:5e3,headers:{"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"}});x.interceptors.request.use((function(t){C.dispatch("message/clearMessages");var e=localStorage.getItem("access");return e?(t.headers.Authorization="JWT "+e,t):t}),(function(t){return Promise.reject(t)})),x.interceptors.response.use((function(t){return t}),(function(t){var e,s=t.response?t.response.status:500;if(400===s){var n=[].concat.apply([],Object.values(t.response.data));C.dispatch("message/setWarningMessages",{messages:n})}else if(401===s){var i=localStorage.getItem("access");e=null!=i?"ログイン有効期限切れ":"認証エラー",C.dispatch("auth/logout"),C.dispatch("message/setErrorMessage",{message:e})}else 403===s?(e="権限エラーです。",C.dispatch("message/setErrorMessage",{message:e})):(e="想定外のエラーです。",C.dispatch("message/setErrorMessage",{message:e}));return Promise.reject(t)}));var q=x,P={name:"Search",props:{query:{type:String}},data:function(){return{childQuery:"",user_id:"",user:{}}},methods:{getPost:function(){this.$parent.query=this.childQuery,this.$emit("search")}},created:function(){var t=this;this.user_id=this.$store.state.auth.username,q.get("/api/v1/users/"+this.user_id).then((function(e){t.user=e.data}))}},I=P,T=(s("e589"),Object(r["a"])(I,h,f,!1,null,null,null)),S=T.exports,E=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"PostList",attrs:{id:"PostList"}},t._l(t.posts,(function(e){return s("div",{key:e.post_id,staticClass:"Post",attrs:{id:e.post_id}},[s("div",{staticClass:"Post__icon"},[s("img",{attrs:{src:e.iconimage,alt:e.user_id+"_icon"}})]),s("div",{staticClass:"Post__top"},[s("div",{staticClass:"Post__total"},[t._v("Total："+t._s(e.total))]),s("div",{directives:[{name:"show",rawName:"v-show",value:e.voted,expression:"post.voted"}],staticClass:"Post__buttons"},[e.voted?s("div",{staticClass:"Post__sort",on:{click:function(s){return t.optionsSort(e,e.options)}}},[s("font-awesome-icon",{directives:[{name:"show",rawName:"v-show",value:0===e.sort,expression:"post.sort === 0"}],attrs:{icon:"list-ol"}}),s("font-awesome-icon",{directives:[{name:"show",rawName:"v-show",value:1===e.sort,expression:"post.sort === 1"}],attrs:{icon:"sort-amount-up"}}),s("font-awesome-icon",{directives:[{name:"show",rawName:"v-show",value:2===e.sort,expression:"post.sort === 2"}],attrs:{icon:"sort-amount-down-alt"}})],1):t._e(),e.voted?s("div",{staticClass:"Post__reload",on:{click:function(s){return t.refleshPost(e)}}},[s("font-awesome-icon",{attrs:{icon:"sync-alt"}})],1):t._e()])]),s("div",{staticClass:"Post__question"},[t._v(" "+t._s(e.question)+" ")]),s("div",{staticClass:"Post__container"},t._l(e.options,(function(n){return s("div",{key:n.select_num,staticClass:"Post__option",on:{click:function(s){return t.Select(e,n)}}},[s("div",{staticClass:"Post__result__bar",class:{selected:e.selected_num===n.select_num},style:{width:t.rate(n.votes,e.total)+"%"}}),s("div",{directives:[{name:"show",rawName:"v-show",value:1===e.view,expression:"post.view === 1"}],staticClass:"Post__result__num"},[t._v(t._s(n.votes))]),s("div",{directives:[{name:"show",rawName:"v-show",value:0===e.view,expression:"post.view === 0"}],staticClass:"Post__option__answer"},[t._v(t._s(n.select_num+1+". ")+t._s(n.answer))])])})),0)])})),0)},N=[],k={name:"PostList",props:{posts:{type:Array,required:!0},unique_id:{type:String,required:!0}},data:function(){return{res:null}},methods:{Select:function(t,e){t.voted?this.changeView(t):(t.selected_num=e.select_num,this.Submit(t,t.options))},Submit:function(t,e){for(var s=[],n=e.length,i=0;i<n;i++)e[i]&&(s[i]=e[i].select_num);q.post("/api/v1/posts/"+t.post_id+"/polls/",{unique_id:this.$store.state.auth.unique_id,option:{select_num:t.selected_num,answer:e[t.selected_num].answer}}).then((function(s){t.voted=!0,t.total=0;for(var i=s.data.options.sort((function(t,e){return t.select_num<e.select_num?-1:1})),a=0;a<n;a++)e[a].votes=i[a].votes,t.total+=i[a].votes;t.selected_num=s.data.selected_num}))},rate:function(t,e){return t/e*100},changeView:function(t){t.view=(t.view+1)%2},refleshPost:function(){var t=Object(m["a"])(regeneratorRuntime.mark((function t(e){var s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,q.get("/api/v1/posts/public/"+this.unique_id+"/"+e.post_id+"/").then((function(t){s=t.data}));case 2:e.voted=s.voted,e.total=s.total,e.options=s.options.sort((function(t,e){return t.select_num<e.select_num?-1:1}));case 5:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),optionsSort:function(t,e){switch(t.sort=(t.sort+1)%3,t.sort){case 0:return e.sort((function(t,e){return t.select_num<e.select_num?-1:t.select_num>e.select_num?1:0}));case 1:return e.sort((function(t,e){return t.votes<e.votes?1:t.votes>e.votes?-1:0}));case 2:return e.sort((function(t,e){return t.votes<e.votes?-1:t.votes>e.votes?1:0}))}}}},M=k,$=(s("f288"),Object(r["a"])(M,E,N,!1,null,null,null)),O=$.exports,j=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"New"},[s("transition",{attrs:{name:"container"}},[t.isOpen?s("div",{staticClass:"New__container"},[s("div",{staticClass:"Top"},[s("h2",{staticClass:"Top__header"},[s("div",{staticClass:"Top__close"},[s("font-awesome-icon",{attrs:{icon:"times"},on:{click:function(e){return e.stopPropagation(),t.closeNew()}}})],1),s("div",{staticClass:"Top__data"},[s("div",{staticClass:"Top__data__question",class:{hasError:!t.question.isValid}},[t._v(t._s(t.question.length)+"/150")]),s("div",{staticClass:"Top__data__options"},[t._v(t._s(t.options.length))])])]),s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.question.text,expression:"question.text"}],staticClass:"Top__question",attrs:{cols:"30",rows:"2",placeholder:"質問文"},domProps:{value:t.question.text},on:{input:[function(e){e.target.composing||t.$set(t.question,"text",e.target.value)},function(e){return t.questionValidate()}]}})]),s("draggable",{attrs:{handle:".New__option__handle"},on:{touchmove:function(t){t.preventDefault(),t.stopPropagation()}},model:{value:t.options,callback:function(e){t.options=e},expression:"options"}},[s("transition-group",{attrs:{name:"option"}},t._l(t.options,(function(e,n){return s("div",{key:e.id,staticClass:"New__options"},[s("div",{staticClass:"New__option__container",attrs:{id:"option_"+e.id}},[s("textarea",{directives:[{name:"model",rawName:"v-model",value:e.answer,expression:"option.answer"}],staticClass:"New__option",attrs:{cols:"30",rows:"3",placeholder:n+1},domProps:{value:e.answer},on:{touchstart:function(e){return t.delTouchStart(n)},touchmove:function(s){return t.delTouchMove(e.id)},touchend:function(s){return s.stopPropagation(),t.delTouchEnd(e.id)},input:[function(s){s.target.composing||t.$set(e,"answer",s.target.value)},function(s){return t.answerValidate(e)}]}}),s("div",{staticClass:"New__option__handle"},[s("font-awesome-icon",{attrs:{icon:"bars"}})],1)]),s("div",{staticClass:"New__option__num",class:{hasError:!e.isValid}},[t._v(t._s(e.length)+"/40")]),s("div",{staticClass:"New__delete__behind",class:{on:t.deleteConfig.trigger}},[s("font-awesome-icon",{attrs:{icon:"trash-alt"}})],1)])})),0)],1),s("div",{staticClass:"Buttons"},[s("div",{staticClass:"Buttons__add-option",on:{click:function(e){return e.stopPropagation(),t.addOption(e)}}},[s("font-awesome-icon",{attrs:{icon:"plus"}})],1),s("div",{staticClass:"Buttons__submit",class:{hasError:!t.postValidate},on:{click:function(e){return e.stopPropagation(),t.servePost(e)}}},[t._v(" サーブ ")])])],1):t._e()]),s("div",{staticClass:"New__FAB",on:{click:function(e){return t.openNew()}}},[s("font-awesome-icon",{attrs:{icon:"plus"}})],1)],1)},L=[],B=(s("a4d3"),s("e01a"),s("d28b"),s("a434"),s("3ca3"),s("ddb0"),s("310e")),R=s.n(B),A={name:"New",components:{draggable:R.a},props:{isOpen:{type:Boolean,required:!0}},data:function(){return{unique_id:"",user_id:"",question:{text:"",length:0,isValid:!1},draggable_options:{animation:200},count:2,options:[{id:0,answer:"",length:0,isValid:!1},{id:1,answer:"",length:0,isValid:!1}],validPattern:{question:/\d/,options:""},deleteConfig:{isStart:!1,trigger:!1,loading:!1,startX:0,diffX:0}}},methods:{addOption:function(){this.options.length<10?this.options.push({id:this.count++,answer:"",length:0,isValid:!1}):alert("これ以上作成できません")},delTouchStart:function(t){var e="touchstart"===event.type?event.changedTouches[0]:event;this.deleteConfig.isStart=!0,this.deleteConfig.trigger=!1,this.deleteConfig.startX=e.clientX,this.deleteConfig.index=t},delTouchMove:function(t){var e="touchmove"===event.type?event.changedTouches[0]:event,s=this.deleteConfig;s.diffX=e.clientX-s.startX,s.trigger=s.diffX<-100,s.diffX<0?(document.getElementById("option_"+t).style.transition=null,document.getElementById("option_"+t).style.transform="translateX("+s.diffX+"px)"):(document.getElementById("option_"+t).style.transition=".15s ease-in-out",document.getElementById("option_"+t).style.transform=null)},delTouchEnd:function(t){var e=this.deleteConfig;e.trigger&&this.deleteOption(e.index),document.getElementById("option_"+t).style.transition=".15s ease-in-out",document.getElementById("option_"+t).style.transform=null,e.isStart=!1,e.trigger=!1},deleteOption:function(t){this.options.length>2?this.options.splice(t,1):alert("これ以上削除できません")},servePost:function(){var t=this;if(this.postValidate){for(var e=0;e<this.options.length;e++)this.options[e].select_num=e,delete this.options[e].id,delete this.options[e].length,delete this.options[e].isValid;q.post("/api/v1/posts/",{unique_id:this.unique_id,question:this.question.text,options:this.options}).then((function(e){201===e.status&&alert("投稿完了！"),t.$emit("switchNew"),t.$emit("refresh")})).catch((function(e){var s;switch(e.response.status){case 400:s="無効なリクエストです。"}t.$store.dispatch("message/setErrorMessage",{message:s}),setTimeout((function(){t.$store.state.message.error="",t.$store.state.message.warnings=[],t.$store.state.message.info=""}),2e3)})),this.question="",this.count=2,this.options=[{id:0,answer:"",length:0,isInvalid:!1},{id:1,answer:"",length:0,isInvalid:!1}]}},questionValidate:function(){var t=this.question;return t.length=t.text.length,t.isValid=t.length>0&&t.length<=150,t.isValid},answerValidate:function(t){return t.length=t.answer.length,t.isValid=t.length>0&&t.length<=40,t.isValid},openNew:function(){this.$emit("switchNew");var t=JSON.parse(localStorage.getItem("post"));null!==t&&(confirm("下書きがあります。使用しますか？")?(this.question=t.question,this.options=t.options):localStorage.removeItem("post"))},closeNew:function(){if(this.$emit("switchNew"),confirm("下書きを保存しますか？")){var t={question:this.question,options:this.options},e=JSON.stringify(t);localStorage.setItem("post",e)}else localStorage.removeItem("post");this.question={text:"",length:0,isValid:!1},this.options=[{id:0,answer:"",length:0,isValid:!1},{id:1,answer:"",length:0,isValid:!1}]}},computed:{postValidate:function(){if(!this.question.isValid)return!1;var t=!0,e=!1,s=void 0;try{for(var n,i=this.options[Symbol.iterator]();!(t=(n=i.next()).done);t=!0){var a=n.value;if(!a.isValid)return!1}}catch(r){e=!0,s=r}finally{try{t||null==i.return||i.return()}finally{if(e)throw s}}return!0}},created:function(){this.unique_id=this.$store.state.auth.unique_id,this.user_id=this.$store.state.auth.username}},V=A,H=(s("0927"),Object(r["a"])(V,j,L,!1,null,null,null)),U=H.exports,Y=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"Message",attrs:{id:"messages"}},[s("b-alert",{directives:[{name:"show",rawName:"v-show",value:t.message.error,expression:"message.error"}],staticClass:"mb-0",attrs:{variant:"danger",show:""}},[t._v(" "+t._s(t.message.error)+" ")]),s("b-alert",{directives:[{name:"show",rawName:"v-show",value:t.message.warnings.length>0,expression:"message.warnings.length > 0"}],staticClass:"mb-0",attrs:{variant:"warning",show:""}},t._l(t.message.warnings,(function(e){return s("p",{key:e,staticClass:"mb-0"},[t._v(t._s(e))])})),0),s("b-alert",{directives:[{name:"show",rawName:"v-show",value:t.message.info,expression:"message.info"}],staticClass:"mb-0",attrs:{variant:"info",show:""}},[t._v(" "+t._s(t.message.info)+" ")])],1)},X=[],D={computed:{message:function(){return this.$store.state.message}},created:function(){var t=this;setTimeout((function(){t.$store.dispatch("message/clearMessages")}),1500)}},G=D,Q=(s("20a5"),Object(r["a"])(G,Y,X,!1,null,null,null)),J=Q.exports,W={name:"public",components:{Search:S,PostList:O,New:U,GlobalMessage:J},data:function(){return{unique_id:"",user_id:"",posts:[],query:"",isOpen:!1,searchShow:!0,positionY:0,targetHeight:0,targetId:"",refreshConfig:{isStart:!1,trigger:!1,loading:!1,startY:0,diffY:0}}},methods:{loadMore:function(){var t=Object(m["a"])(regeneratorRuntime.mark((function t(){var e,s=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!(this.scrollTop()<this.targetHeight)){t.next=2;break}return t.abrupt("return");case 2:if(!(this.targetHeight<0)){t.next=4;break}return t.abrupt("return");case 4:return t.next=6,this.targetHeight=-1;case 6:return e=this.posts[this.posts.length-1].post_id,t.next=9,q.get("/api/v1/posts/public/"+this.unique_id+"/?pid="+e).then((function(t){var e=t.data.posts;e.forEach((function(t){t.view=0,t.sort=0,t.options.sort((function(t,e){return t.select_num<e.select_num?-1:1}))})),s.posts=s.posts.concat(e),s.targetId=10===e.length&&e[6].post_id}));case 9:this.targetId&&(this.targetHeight=document.getElementById(this.targetId).offsetTop);case 10:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),pullToMove:function(){var t="touchmove"===event.type?event.changedTouches[0]:event,e=this.refreshConfig;this.scrollTop()>0||this.isOpen?e.isStart=!1:(e.isStart||(e.isStart=!0,e.startY=t.clientY),e.diffY=t.clientY-e.startY,e.trigger=e.diffY>75,e.diffY>0?(document.getElementById("PostList").style.transition=null,document.getElementById("PostList").style.transform="translateY("+2*e.diffY/3+"px)",document.getElementById("Pull-to").style.transform="translateY("+2*e.diffY/3+"px)"):(document.getElementById("PostList").style.transition=".15s ease-in-out",document.getElementById("PostList").style.transform=null))},pullToEnd:function(){var t=Object(m["a"])(regeneratorRuntime.mark((function t(e){var s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(s=this.refreshConfig,document.getElementById("PostList").style.transition=".15s ease-in-out",s.trigger){t.next=6;break}return document.getElementById("PostList").style.transform=null,s.isStart=!1,t.abrupt("return");case 6:return s.isStart=!1,s.loading=!0,this.query="",t.next=11,this.refresh();case 11:document.getElementById("PostList").style.transform=null,s.isStart=!1,s.trigger=!1,s.loading=!1,s.startY=0,s.diffY=0;case 17:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),search:function(){var t=Object(m["a"])(regeneratorRuntime.mark((function t(){var e=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:q.get("/api/v1/posts/public/"+this.unique_id+"/?q="+this.query).then((function(t){e.initPosts(t.data.posts)}));case 1:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),initPosts:function(){var t=Object(m["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.forEach((function(t){t.view=0,t.sort=0,t.options.sort((function(t,e){return t.select_num<e.select_num?-1:1}))}));case 2:return this.posts=e,t.next=5,this.targetId=10===e.length&&e[6].post_id;case 5:this.targetId&&(this.targetHeight=document.getElementById(this.targetId).offsetTop);case 6:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),refresh:function(){var t=Object(m["a"])(regeneratorRuntime.mark((function t(){var e=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,q.get("/api/v1/posts/public/"+this.unique_id+"/").then((function(t){e.initPosts(t.data.posts)}));case 2:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),switchSearch:function(){var t=this.scrollTop();this.searchShow=t<this.positionY,this.positionY=t},scrollTriggers:function(){this.switchSearch(),this.loadMore()},scrollTop:function(){return document.documentElement.scrollTop>0?document.documentElement.scrollTop:document.body.scrollTop},switchNew:function(){this.isOpen=!this.isOpen}},created:function(){var t=this;this.unique_id=this.$store.state.auth.unique_id,this.user_id=this.$store.state.auth.username,this.query="",q.get("/api/v1/posts/public/"+this.unique_id+"/").then((function(e){t.initPosts(e.data.posts)})),window.addEventListener("scroll",this.scrollTriggers)}},F=W,z=(s("a3a5"),Object(r["a"])(F,d,p,!1,null,null,null)),K=z.exports,Z=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"MyPage"},[s("GlobalMessage"),s("h1",{staticClass:"Mypage__h1"},[t._v(t._s(t.user.user_id)+" | Mypage")]),s("div",{staticClass:"Mypage__main"},[s("div",{staticClass:"Mypage__to-public"},[s("router-link",{attrs:{to:"/public"}},[s("font-awesome-icon",{attrs:{icon:"arrow-alt-circle-left"}})],1)],1),s("div",{staticClass:"Mypage__image"},[s("img",{attrs:{src:t.user.homeimage,alt:""}})]),s("div",{staticClass:"Mypage__icon"},[s("img",{attrs:{src:t.user.iconimage,alt:""}})]),s("div",{staticClass:"Mypage__settings"},[s("router-link",{attrs:{to:"/settings"}},[s("font-awesome-icon",{attrs:{icon:"edit"}})],1)],1),s("h2",{staticClass:"Mypage__name"},[t._v(t._s(t.user.name))]),s("h2",{staticClass:"Mypage__user_id"},[t._v("@"+t._s(t.user.user_id))]),s("div",{staticClass:"Mypage__introduction"},[t._v(" "+t._s(t.user.introduction)+" ")])]),s("div",{staticClass:"PostSwitch"},[s("div",{staticClass:"PostSwitch__button",class:{active:0===t.isActive},on:{click:function(e){return t.changeActive(0)}}},[t._v(" 過去の投稿 ")]),s("div",{staticClass:"PostSwitch__button",class:{active:1===t.isActive},on:{click:function(e){return t.changeActive(1)}}},[t._v(" 過去の投票 ")]),s("div",{staticClass:"PostSwitch__bar",style:{transform:t.tabBar}})]),s("div",{directives:[{name:"show",rawName:"v-show",value:0===t.isActive,expression:"isActive === 0"}],staticClass:"Container"},[s("PostList",{attrs:{posts:t.posted,unique_id:t.unique_id}})],1),s("div",{directives:[{name:"show",rawName:"v-show",value:1===t.isActive,expression:"isActive === 1"}],staticClass:"Container"},[s("PostList",{attrs:{posts:t.voted,unique_id:t.unique_id}})],1)],1)},tt=[],et=(s("ac1f"),s("5319"),{name:"MyPage",components:{GlobalMessage:J,PostList:O},data:function(){return{unique_id:"",user_id:"",isActive:0,user:{},postedTargetId:"",postedTargetHeight:0,votedTargetId:"",votedTargetHeight:0,posted:[],voted:[]}},methods:{changeActive:function(t){this.isActive=t},logout:function(){var t=window.confirm("ログアウトしてよろしいですか？");t&&(this.$store.dispatch("auth/logout"),this.$store.dispatch("message/setInfoMessage",{message:"ログアウトしました"}),this.$router.replace("/login"))},initPosts:function(){var t=Object(m["a"])(regeneratorRuntime.mark((function t(e,s){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,s.forEach((function(t){t.view=0,t.sort=0,t.options.sort((function(t,e){return t.select_num<e.select_num?-1:1}))}));case 2:e?this.posted=s:this.voted=s;case 3:case"end":return t.stop()}}),t,this)})));function e(e,s){return t.apply(this,arguments)}return e}(),loadPostedMore:function(){var t=Object(m["a"])(regeneratorRuntime.mark((function t(){var e,s=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!(this.scrollTop()<this.postedTargetHeight)){t.next=2;break}return t.abrupt("return");case 2:if(!(this.postedTargetHeight<0)){t.next=4;break}return t.abrupt("return");case 4:return t.next=6,this.postedTargetHeight=-1;case 6:return e=this.posted[this.posted.length-1].post_id,t.next=9,q.get("/api/v1/users/"+this.user_id+"/posted/?pid="+e).then((function(t){var e=t.data.posts;e.forEach((function(t){t.view=0,t.sort=0,t.options.sort((function(t,e){return t.select_num<e.select_num?-1:1}))})),s.posted=s.posted.concat(e),s.postedTargetId=10===e.length&&e[6].post_id}));case 9:this.postedTargetId&&(this.postedTargetHeight=document.getElementById(this.postedTargetId).offsetTop);case 10:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),loadVotedMore:function(){var t=Object(m["a"])(regeneratorRuntime.mark((function t(){var e,s=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!(this.scrollTop()<this.votedTargetHeight)){t.next=2;break}return t.abrupt("return");case 2:if(!(this.votedTargetHeight<0)){t.next=4;break}return t.abrupt("return");case 4:return t.next=6,this.votedTargetHeight=-1;case 6:return e=this.voted[this.voted.length-1].post_id,t.next=9,q.get("/api/v1/users/"+this.user_id+"/voted/?pid="+e).then((function(t){var e=t.data.posts;e.forEach((function(t){t.view=0,t.sort=0,t.options.sort((function(t,e){return t.select_num<e.select_num?-1:1}))})),s.voted=s.voted.concat(e),s.votedTargetId=10===e.length&&e[6].post_id}));case 9:this.votedTargetId&&(this.votedTargetHeight=document.getElementById(this.votedTargetId).offsetTop);case 10:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),scrollTriggers:function(){0===this.isActive?this.loadPostedMore():this.loadVotedMore()},scrollTop:function(){return document.documentElement.scrollTop>0?document.documentElement.scrollTop:document.body.scrollTop}},computed:{tabBar:function(){return"translateX("+100*this.isActive+"%)"}},created:function(){var t=this;this.unique_id=this.$store.state.auth.unique_id,this.user_id=this.$store.state.auth.username,q.get("/api/v1/users/"+this.user_id).then((function(e){t.user=e.data})),q.get("/api/v1/users/"+this.user_id+"/posted/").then(function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(s){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=s.data.posts,e.next=3,t.initPosts(!0,n);case 3:return e.next=5,t.postedTargetId=10===n.length&&n[6].post_id;case 5:t.postedTargetId&&(t.postedTargetHeight=document.getElementById(t.postedTargetId).offsetTop);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),q.get("/api/v1/users/"+this.user_id+"/voted/").then(function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(s){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=s.data.posts,e.next=3,t.initPosts(!1,s.data.posts);case 3:return e.next=5,t.votedTargetId=10===n.length&&n[6].post_id;case 5:t.votedTargetId&&(t.votedTargetHeight=document.getElementById(t.votedTargetId).offsetTop);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),window.addEventListener("scroll",this.scrollTriggers)}}),st=et,nt=(s("e9d3"),Object(r["a"])(st,Z,tt,!1,null,null,null)),it=nt.exports,at=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"login-page"}},[s("GlobalHeader",{attrs:{pageName:t.pageName}}),s("main",{staticClass:"container"},[s("b-form",{on:{submit:function(e){return e.preventDefault(),t.submitLogin(e)}}},[s("div",{staticClass:"row form-group"},[s("label",{staticClass:"col-sm-3 col-form-label"},[t._v("ユーザーID")]),s("div",{staticClass:"col-sm-8"},[s("b-form-input",{attrs:{type:"text",required:""},model:{value:t.form.username,callback:function(e){t.$set(t.form,"username",e)},expression:"form.username"}})],1)]),s("div",{staticClass:"row form-group"},[s("label",{staticClass:"col-sm-3 col-form-label"},[t._v("パスワード")]),s("div",{staticClass:"col-sm-8"},[s("b-form-input",{attrs:{type:"password",required:""},model:{value:t.form.password,callback:function(e){t.$set(t.form,"password",e)},expression:"form.password"}})],1)]),s("div",{staticClass:"row text-center mt-5"},[s("div",{staticClass:"col-sm-12"},[s("b-button",{attrs:{type:"submit",variant:"primary"}},[t._v("ログイン")])],1)])])],1)],1)},rt=[],ot=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"header"}},[s("b-navbar",{attrs:{type:"dark",variant:"dark"}},[s("div",{staticClass:"navbar-brand"},[t._v(t._s(t.pageName))]),t.$route.meta.requiresAuth?s("b-navbar-nav",{staticClass:"ml-auto"},[t.isLoggedIn?s("b-nav-item-dropdown",{attrs:{right:""}},[s("template",{slot:"button-content"},[t._v(t._s(t.username))]),s("b-dropdown-item",{attrs:{href:"#"},on:{click:t.clickLogout}},[t._v("ログアウト")])],2):s("b-nav-item",{attrs:{href:"#"},on:{click:t.clickLogin}},[t._v("ログイン")])],1):t._e()],1)],1)},ut=[],ct={props:{pageName:{type:String,required:!0}},computed:{username:function(){return this.$store.getters["auth/username"]},isLoggedIn:function(){return this.$store.getters["auth/isLoggedIn"]}},methods:{clickLogout:function(){this.$store.dispatch("auth/logout"),this.$store.dispatch("message/setInfoMessage",{message:"ログアウトしました。"}),this.$router.replace("/login")},clickLogin:function(){this.$store.dispatch("message/clearMessages"),this.$router.replace("/login")}}},lt=ct,dt=Object(r["a"])(lt,ot,ut,!1,null,null,null),pt=dt.exports,mt={components:{GlobalHeader:pt},data:function(){return{form:{username:"",password:""},pageName:"ログインページ"}},methods:{submitLogin:function(){var t=this;this.$store.dispatch("auth/login",{username:this.form.username,password:this.form.password}).then((function(){t.$store.dispatch("message/setInfoMessage",{message:"ログインしました。"});var e=t.$route.query.next||"/";t.$router.replace(e)}))}}},ht=mt,ft=Object(r["a"])(ht,at,rt,!1,null,null,null),gt=ft.exports,vt=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"Update"},[s("GlobalMessage"),s("router-link",{staticClass:"Update__close",attrs:{to:"/mypage"}},[s("font-awesome-icon",{attrs:{icon:"times"}})],1),s("div",{staticClass:"Update__image"},[s("img",{attrs:{src:t.beforeHomeImage,alt:"",id:"homeimage"}}),s("label",{staticClass:"Update__image__mask",attrs:{for:"home_file"}},[s("font-awesome-icon",{attrs:{icon:"camera"}})],1),s("input",{staticClass:"Update__file",attrs:{id:"home_file",type:"file",name:"homeimage"},on:{change:function(e){return t.imageSelect(0,e)}}})]),s("div",{staticClass:"Update__icon"},[s("img",{attrs:{src:t.beforeIconImage,alt:"",id:"iconimage"}}),s("label",{staticClass:"Update__icon__mask",attrs:{for:"icon_file"}},[s("font-awesome-icon",{attrs:{icon:"camera"}})],1),s("input",{staticClass:"Update__file",attrs:{id:"icon_file",type:"file",name:"iconimage"},on:{change:function(e){return t.imageSelect(1,e)}}})]),s("label",{staticClass:"Update__title",attrs:{for:"user_name"}},[t._v("ユーザー名")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],staticClass:"Update__input",attrs:{id:"user_name",type:"text",placeholder:"ユーザー名"},domProps:{value:t.name},on:{input:function(e){e.target.composing||(t.name=e.target.value)}}}),s("label",{staticClass:"Update__title",attrs:{for:"user_id"}},[t._v("ユーザーID")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.user_id,expression:"user_id"}],staticClass:"Update__input",attrs:{id:"user_id",type:"text",placeholder:"ユーザーID"},domProps:{value:t.user_id},on:{input:function(e){e.target.composing||(t.user_id=e.target.value)}}}),s("label",{staticClass:"Update__title",attrs:{for:"introduction"}},[t._v("紹介文")]),s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.introduction,expression:"introduction"}],staticClass:"Update__introduction",attrs:{id:"introduction",cols:"30",rows:"5",placeholder:"紹介文"},domProps:{value:t.introduction},on:{input:function(e){e.target.composing||(t.introduction=e.target.value)}}}),s("div",{staticClass:"Update__submit",on:{click:function(e){return t.updateUser()}}},[t._v(" 保存する ")])],1)},_t=[],wt=(s("b0c0"),{name:"updateUser",components:{GlobalMessage:J},data:function(){return{before_user_id:"",user_id:"",name:"",introduction:"",iconimage:null,homeimage:null,beforeHomeImage:null,beforeIconImage:null}},methods:{imageSelect:function(t,e){var s=e.target.files[0],n=new FileReader;t?(this.iconimage=e.target.files[0],n.onload=function(t){var e=document.getElementById("iconimage");e.src=t.target.result},n.readAsDataURL(s)):(this.homeimage=e.target.files[0],n.onload=function(t){var e=document.getElementById("homeimage");e.src=t.target.result},n.readAsDataURL(s))},updateUser:function(){var t=this,e=new FormData;this.user_id&&e.append("user_id",this.user_id),this.name&&e.append("name",this.name),this.introduction&&e.append("introduction",this.introduction),this.iconimage&&e.append("iconimage",this.iconimage),this.homeimage&&e.append("homeimage",this.homeimage),q.patch("/api/v1/users/"+this.before_user_id,e).then((function(e){200===e.status&&(t.$store.dispatch("message/setInfoMessage",{message:"更新完了"}),t.$router.replace("/mypage"))}))}},created:function(){var t=this;this.before_user_id=C.getters["auth/username"],this.user_id=this.before_user_id,q.get("/api/v1/users/"+this.before_user_id).then((function(e){t.name=e.data.name,t.introduction=e.data.introduction,t.beforeHomeImage=e.data.homeimage,t.beforeIconImage=e.data.iconimage}))}}),bt=wt,yt=(s("e7b7"),Object(r["a"])(bt,vt,_t,!1,null,null,null)),Ct=yt.exports,xt=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"home-page"}},[s("GlobalHeader",{attrs:{pageName:t.pageName}}),s("GlobalMessage"),s("main",{staticClass:"container"},[s("b-form",{on:{submit:function(e){return e.preventDefault(),t.createSampleUser(e)}}},[s("div",{staticClass:"row text-center mt-5"},[s("div",{staticClass:"col-sm-12"},[s("b-button",{attrs:{type:"submit",variant:"primary"}},[t._v("ユーザー新規作成")])],1)])]),s("b-form",{on:{submit:function(e){return e.preventDefault(),t.createSamplePosts(e)}}},[s("div",{staticClass:"row text-center mt-5"},[s("div",{staticClass:"col-sm-12"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.postNum,expression:"postNum"}],staticClass:"form-control",attrs:{type:"num"},domProps:{value:t.postNum},on:{input:function(e){e.target.composing||(t.postNum=e.target.value)}}})]),s("div",{staticClass:"col-sm-12"},[s("b-button",{attrs:{type:"submit",variant:"primary"}},[t._v("新規投稿作成")])],1),s("div",{staticClass:"col-sm-12"},[s("b-button",{attrs:{variant:"success"}},[s("router-link",{staticStyle:{color:"white"},attrs:{to:"/"}},[t._v("投稿一覧へ")])],1)],1)])])],1)],1)},qt=[],Pt={data:function(){return{pageName:"Adminページ",postNum:0,count:2,options:[]}},components:{GlobalHeader:pt,GlobalMessage:J},methods:{createSampleUser:function(){alert("createSampleUser")},createSamplePosts:function(){for(var t=0;t<this.postNum;t++){for(var e=Math.floor(100*Math.random(t))%8+2,s=0;s<e;s++)this.options[s]={select_num:s,answer:"answer_"+s};q.post("/api/v1/posts/",{unique_id:this.unique_id,question:"question_"+t,options:this.options}).then((function(t){})),this.question="",this.count=2,this.options=[]}}},created:function(){this.unique_id=this.$store.state.auth.unique_id,this.user_id=this.$store.state.auth.username}},It=Pt,Tt=Object(r["a"])(It,xt,qt,!1,null,null,null);Tt.exports;n["default"].use(l["a"]);var St=[{path:"/login",component:gt},{path:"/",component:K,meta:{requiresAuth:!0}},{path:"/New",component:U,meta:{requiresAuth:!0}},{path:"/MyPage",component:it,meta:{requiresAuth:!0}},{path:"/settings",component:Ct,meta:{requiresAuth:!0}},{path:"*",redirect:"/",meta:{requiresAuth:!0}}];var Et=new l["a"]({mode:"history",base:"./",routes:St});function Nt(t,e,s){s({path:"/login",query:{next:t.fullPath}})}Et.beforeEach((function(t,e,s){var n=C.getters["auth/isLoggedIn"],i=localStorage.getItem("access");t.matched.some((function(t){return t.meta.requiresAuth}))?n?s():null!=i?C.dispatch("auth/reload").then((function(){s()})).catch((function(){Nt(t,e,s)})):Nt(t,e,s):s()}));var kt=Et,Mt=s("a7fe"),$t=s.n(Mt),Ot=s("5f5b"),jt=(s("f9e3"),s("2dd8"),s("ad3d")),Lt=s("ecee"),Bt=s("c074");Lt["c"].add(Bt["m"],Bt["r"],Bt["i"],Bt["h"],Bt["j"],Bt["q"],Bt["g"],Bt["s"],Bt["o"],Bt["n"],Bt["f"],Bt["b"],Bt["k"],Bt["p"],Bt["d"],Bt["t"],Bt["c"],Bt["e"],Bt["l"],Bt["a"]),n["default"].component("font-awesome-icon",jt["a"]),n["default"].use(Ot["a"]),n["default"].use($t.a,v.a),n["default"].config.productionTip=!1,new n["default"]({router:kt,store:C,render:function(t){return t(c)}}).$mount("#app")},"5c0b":function(t,e,s){"use strict";var n=s("9c0c"),i=s.n(n);i.a},"66fb":function(t,e,s){},"77e6":function(t,e,s){},"9c0c":function(t,e,s){},"9d03":function(t,e,s){},a3a5:function(t,e,s){"use strict";var n=s("1c76"),i=s.n(n);i.a},e589:function(t,e,s){"use strict";var n=s("4365"),i=s.n(n);i.a},e7b7:function(t,e,s){"use strict";var n=s("f86a"),i=s.n(n);i.a},e9d3:function(t,e,s){"use strict";var n=s("9d03"),i=s.n(n);i.a},f288:function(t,e,s){"use strict";var n=s("51a3"),i=s.n(n);i.a},f86a:function(t,e,s){}});
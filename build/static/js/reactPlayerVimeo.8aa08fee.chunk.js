(self.webpackChunkpowerhour=self.webpackChunkpowerhour||[]).push([[173],{2458:(e,t,r)=>{var s,o=r(2897).default,a=Object.create,l=Object.defineProperty,i=Object.getOwnPropertyDescriptor,n=Object.getOwnPropertyNames,p=Object.getPrototypeOf,h=Object.prototype.hasOwnProperty,u=(e,t,r,s)=>{if(t&&"object"===typeof t||"function"===typeof t)for(let o of n(t))h.call(e,o)||o===r||l(e,o,{get:()=>t[o],enumerable:!(s=i(t,o))||s.enumerable});return e},c=(e,t,r)=>(((e,t,r)=>{t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r})(e,"symbol"!==typeof t?t+"":t,r),r),y={};((e,t)=>{for(var r in t)l(e,r,{get:t[r],enumerable:!0})})(y,{default:()=>P}),e.exports=(s=y,u(l({},"__esModule",{value:!0}),s));var d=((e,t,r)=>(r=null!=e?a(p(e)):{},u(!t&&e&&e.__esModule?r:l(r,"default",{value:e,enumerable:!0}),e)))(r(5043)),f=r(2206),m=r(1520);const b=e=>e.replace("/manage/videos","");class P extends d.Component{constructor(){super(...arguments),c(this,"callPlayer",f.callPlayer),c(this,"duration",null),c(this,"currentTime",null),c(this,"secondsLoaded",null),c(this,"mute",(()=>{this.setMuted(!0)})),c(this,"unmute",(()=>{this.setMuted(!1)})),c(this,"ref",(e=>{this.container=e}))}componentDidMount(){this.props.onMount&&this.props.onMount(this)}load(e){this.duration=null,(0,f.getSDK)("https://player.vimeo.com/api/player.js","Vimeo").then((t=>{if(!this.container)return;const{playerOptions:r,title:s}=this.props.config;this.player=new t.Player(this.container,o({url:b(e),autoplay:this.props.playing,muted:this.props.muted,loop:this.props.loop,playsinline:this.props.playsinline,controls:this.props.controls},r)),this.player.ready().then((()=>{const e=this.container.querySelector("iframe");e.style.width="100%",e.style.height="100%",s&&(e.title=s)})).catch(this.props.onError),this.player.on("loaded",(()=>{this.props.onReady(),this.refreshDuration()})),this.player.on("play",(()=>{this.props.onPlay(),this.refreshDuration()})),this.player.on("pause",this.props.onPause),this.player.on("seeked",(e=>this.props.onSeek(e.seconds))),this.player.on("ended",this.props.onEnded),this.player.on("error",this.props.onError),this.player.on("timeupdate",(e=>{let{seconds:t}=e;this.currentTime=t})),this.player.on("progress",(e=>{let{seconds:t}=e;this.secondsLoaded=t})),this.player.on("bufferstart",this.props.onBuffer),this.player.on("bufferend",this.props.onBufferEnd),this.player.on("playbackratechange",(e=>this.props.onPlaybackRateChange(e.playbackRate)))}),this.props.onError)}refreshDuration(){this.player.getDuration().then((e=>{this.duration=e}))}play(){const e=this.callPlayer("play");e&&e.catch(this.props.onError)}pause(){this.callPlayer("pause")}stop(){this.callPlayer("unload")}seekTo(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.callPlayer("setCurrentTime",e),t||this.pause()}setVolume(e){this.callPlayer("setVolume",e)}setMuted(e){this.callPlayer("setMuted",e)}setLoop(e){this.callPlayer("setLoop",e)}setPlaybackRate(e){this.callPlayer("setPlaybackRate",e)}getDuration(){return this.duration}getCurrentTime(){return this.currentTime}getSecondsLoaded(){return this.secondsLoaded}render(){const{display:e}=this.props,t={width:"100%",height:"100%",overflow:"hidden",display:e};return d.default.createElement("div",{key:this.props.url,ref:this.ref,style:t})}}c(P,"displayName","Vimeo"),c(P,"canPlay",m.canPlay.vimeo),c(P,"forceLoad",!0)}}]);
//# sourceMappingURL=reactPlayerVimeo.8aa08fee.chunk.js.map
(function(window){var WORKER_PATH=window.staticpath+"/js/libs/recorderWorker.js";var Recorder=function(source,cfg){var config=cfg||{};var bufferLen=config.bufferLen||4096;this.context=source.context;this.node=this.context.createScriptProcessor(bufferLen,1,1);var worker=new Worker(config.workerPath||WORKER_PATH);worker.postMessage({command:'init',config:{sampleRate:this.context.sampleRate}});var recording=!1,currCallback;this.node.onaudioprocess=function(e){if(!recording)return;worker.postMessage({command:'record',buffer:[e.inputBuffer.getChannelData(0)]})}
this.configure=function(cfg){for(var prop in cfg){if(cfg.hasOwnProperty(prop)){config[prop]=cfg[prop]}}}
this.record=function(){recording=!0}
this.stop=function(){recording=!1}
this.clear=function(){worker.postMessage({command:'clear'})}
this.getBuffer=function(cb){currCallback=cb||config.callback;worker.postMessage({command:'getBuffer'})}
this.exportWAV=function(cb,type){currCallback=cb||config.callback;type=type||config.type||'audio/wav';if(!currCallback)throw new Error('Callback not set');worker.postMessage({command:'exportWAV',type:type})}
this.exportRAW=function(cb,type){currCallback=cb||config.callback;type=type||config.type||'audio/raw';if(!currCallback)throw new Error('Callback not set');worker.postMessage({command:'exportRAW',type:type})}
this.export16kMono=function(cb,type){currCallback=cb||config.callback;type=type||config.type||'audio/raw';if(!currCallback)throw new Error('Callback not set');worker.postMessage({command:'export16kMono',type:type})}
this.exportSpeex=function(cb,type){currCallback=cb||config.callback;type=type||config.type||'audio/speex';if(!currCallback)throw new Error('Callback not set');worker.postMessage({command:'exportSpeex',type:type})}
worker.onmessage=function(e){var blob=e.data;currCallback(blob)}
source.connect(this.node);this.node.connect(this.context.destination)};Recorder.forceDownload=function(blob,filename){var url=(window.URL||window.webkitURL).createObjectURL(blob);var link=window.document.createElement('a');link.href=url;link.download=filename||'output.wav';var click=document.createEvent("Event");click.initEvent("click",!0,!0);link.dispatchEvent(click)}
window.Recorder=Recorder})(window)
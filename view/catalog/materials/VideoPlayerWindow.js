Ext.define("App.view.catalog.materials.VideoPlayerWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.CatalogMaterialVideoPlayerWindow",
    id : 'CatalogMaterialVideoPlayerWindow',
    
    title : 'Видео',
    
    width : 800,
    height : 600,
    
    config : {
        videoId : null
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.on('hide', this.onHideWindow, this);
    },
    
    buildItems : function(){
        return [
            {
                itemId : 'player',
                layout : 'fit',
                tpl : [
                    '<video id="{id}-video" class="video-js vjs-default-skin vjs-big-play-centered"' +
                        'controls preload="auto" autoPlay="{auto_play}" style="width:100%;height:100%"' +
                        '<source src="{src}" type="video/mp4"/>' +
                        '<source src="{src}" type="video/webm" />' + 
                        '<source src="{src}" type="video/ogg" />' + 
                        '<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>' +
                    '</video>'
                ]       
            }
        ];
    },
    
    setVideoParams : function(params){
        this.setVideoId(params.id);
        this.down('#player').update(params);
    },
    
    onHideWindow : function(){
        var video = this.body.getById(this.getVideoId() + "-video");
        if (video && video.dom.pause) {
            video.dom.pause();
            video.remove();   
        }
    }
});
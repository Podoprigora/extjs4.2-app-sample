Ext.define('App.ux.BodyPreloader', {
    statics : {
        hide : function() {
            var loadingMask = Ext.get('loading');
            loadingMask.fadeOut({ opacity: 0, duration: 1000, remove: true });
        },
        
        show : function(title) {
            /* */   
        }
    }
});

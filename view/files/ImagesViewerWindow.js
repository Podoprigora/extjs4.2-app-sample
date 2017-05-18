Ext.define('App.view.files.ImagesViewerWindow', {
    extend : 'App.ux.window.Window',
    alias : 'widget.ImagesViewerWindow',
    id : 'ImagesViewerWindow',
    
    title : 'Обзор изображения',
    layout : 'fit',
    
    width : 800,
    height : 600,
    
    config : {
        viewer : null
    },
    
    initComponent : function(){
        
        this.setViewer(Ext.create('App.ux.image.Viewer'));
        
        this.items = [this.getViewer()];

        this.callParent(arguments);
    }
});
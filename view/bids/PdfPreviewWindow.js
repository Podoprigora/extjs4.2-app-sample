Ext.define("App.view.bids.PdfPreviewWindow", {
    extend : "Ext.window.Window",
    alias : "widget.BidPdfPreviewWindow",
    id : 'BidPdfPreviewWindow',
    
    title : 'Документы',
    
    shadow : 'frame',
    shadowOffset : 25,
    modal : true,
    resizable : true,
    maximizable : true,
    layout : 'fit',
    
    width : 800,
    height : 600,
    
    bodyCls : 'x-container-body',
    bodyPadding : 2,
    
    initComponent : function(){
        
        this.items = [];
        
        this.callParent(arguments);
    }
});
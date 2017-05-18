Ext.define("App.view.bids.BorderPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.BidsBorderPanel",
    
    layout : 'border',
    bodyPadding : 5,
    
    defaults : {
        flex : 1
    },
    
    initComponent : function(){
        
        var bodyWidth = Ext.getBody().getViewSize().width;
        
        this.items = [
            {
                xtype : 'BidsGridPanel',
                region : (bodyWidth <= 1200) ? 'north' : 'west',
                minWidth : (bodyWidth <= 1200) ? false : 650,
                minHeight : (bodyWidth <= 1200) ? 350 : false,
                split : true
            },
            {
                xtype : 'tabpanel',
                itemId : 'previewPanel',
                region : 'center',
                disabled : true,
                minTabWidth : 90,
                activeTab : 0,
                
                items : [
                    {
                        title : 'Заявка',
                        xtype : 'BidPreviewFormPanel'
                    },
                    {
                        title : 'Карта',
                        xtype : 'BidLocationPreviewPanel'
                    },
                    {
                        title : 'Сообщения',
                        xtype : 'BidCommentsContentPanel',
                        listeners : {
                            scope : this,
                            show : function(panel){
                                panel.down('form').getForm().clearInvalid();
                            }
                        }
                    },
                    {
                        title : 'История изменений',
                        xtype : 'BidUpdatesLogGridPanel'
                    }
                ]
            }
        ];
        
        this.callParent(arguments);
    }
});
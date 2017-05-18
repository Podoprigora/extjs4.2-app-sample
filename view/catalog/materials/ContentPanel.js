Ext.define("App.view.catalog.materials.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.CatalogMaterialsContentPanel",
    itemId : 'contentPanel',
    
    layout : 'border',
    bodyPadding : 5,
    
    defaults : {
        border : false
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
    },
    
    buildItems : function() {
        
        var bodyWidth = Ext.getBody().getViewSize().width;
        
        return [
            {
                region : 'west',
                itemId : 'filtersForm',
                xtype : 'CatalogMaterialsFilterFormPanel',
                width : 220,
                split : true,
                hidden : false,
                bodyCls : 'x-container-body'
            },
            {
                region : 'center',
                layout : 'border',
                items : [
                    {
                        
                        region : 'center',
                        itemId : 'materialsGrid',
                        xtype : 'CatalogMaterialsGridPanel'
                    },
                    {
                        xtype : 'tabpanel',
                        region : 'east',
                        itemId : 'previewPanel',
                        split : true,
                        width : bodyWidth/2-140,
                        minTabWidth : 90,
                        disabled : true,
                        items : [
                            {
                                xtype : 'CatalogMaterialViewPanel',
                                title : 'Обзор'
                            },
                            {
                                xtype : 'CatalogMaterialCodesGridPanel',
                                itemId : 'codesGrid',
                                title : 'Складские позиции'
                            }
                        ]
                    }
                ]
            }
        ];
    }
    
});
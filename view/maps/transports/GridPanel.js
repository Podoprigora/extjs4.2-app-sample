Ext.define("App.view.maps.transports.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MapsTransportsGridPanel",
    
    selModel: {
        selType: "checkboxmodel",
        mode: "MULTI"
    },
    
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.maps.TransportsStore', {
            filters : [
                {
                    property : 'given_the_area_code',
                    value : true
                }
            ]
        });
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                flex : 1,
                renderer : function(v, metaData, record){
                    metaData.style = "white-space: normal;";
                    return Ext.String.format("{0} | {1}", record.get('name'), record.get('driver'));
                }
            }
        ];
    },
    
    buildTbar: function () {
        return [
            {
                text: "Обновить",
                iconCls: "icon-refresh",
                scope: this,
                handler: this.onRefresh
            },
            "->",
            {
                xtype: "component",
                itemId: "Totals",
                cls: "x-component-grid-text-item",
                tpl: "Всего: <b>{count}</b>"
            }, 
            {
                xtype: "tbspacer"
            }
        ];
    }
});
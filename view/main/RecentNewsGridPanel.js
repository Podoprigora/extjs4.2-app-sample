Ext.define("App.view.main.RecentNewsGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MainRecentNewsGridPanel",
    
    hideHeaders : true,
    disableSelection : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.main.RecentNewsLocalStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        
        this.callParent(arguments);
    },
    
     buildFeatures : function(){
        return [
            {
                ftype : 'rowbody',
                getAdditionalData : function(data, rowIndex, record){
                    var colspan = this.view.headerCt.getColumnCount();
                    return {
                        rowBody : record.get('preview'),
                        rowBodyCls : 'x-grid-rowbody-message',
                        rowBodyColspan : colspan
                    };
                }
            },
            {
                ftype : 'rowwrap'
            }
        ];
    },
    
    buildColumns : function(){
        return [
            {
                dataIndex : 'title',
                tdCls : 'x-cell-title',
                flex : 1
            },
            {
                dataIndex : 'date',
                align : 'center',
                tdCls : 'x-cell-date',
                width : 80,
                renderer : Ext.util.Format.dateRenderer('d.m.Y')
            }
            
        ];
    }
});
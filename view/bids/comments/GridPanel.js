Ext.define("App.view.bids.comments.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidCommentsGridPanel",
    
    hideHeaders : true,
    cls : 'hidden-actions-icon',
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.BidCommentsStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        
        this.callParent(arguments);
        
        this.addEvents('loadrecords', 'deletebtnclick');
        
        this.getStore().on('load', function(){ this.fireEvent('loadrecords', this); }, this);
    },
    
    buildColumns : function() {
        return [
            {
                dataIndex : 'user',
                flex : 1,
                renderer : this.userRenderer
            },
            {
                dataIndex : 'created',
                width : 140,
                renderer : Ext.util.Format.dateRenderer('d.m.Y H:i:s')
            },
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                items : [
                    {
                        getClass : function(v, metaData, record) {
                            if (record.get('user_id') == App.Identity.get('id')) {
                                metaData.tdAttr = "data-qtip = 'Удалить'";
                                return 'icon-delete';
                            }
                        },
                        scope : this,
                        handler : Ext.bind(this.onActionHandler, this, ['deletebtnclick', true], 0)
                    }
                ]
            }
        ]
    },
    
    buildFeatures : function() {
        return [
            {
                ftype : 'rowbody',
                getAdditionalData : function(data, rowIndex, record){
                    var colspan = this.view.headerCt.getColumnCount(),
                        body = record.get('message').replace(/[\n\t]/g, "<br />");
                    return {
                        rowBody : body,
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
    
    userRenderer : function(v, metaData, record) {
        return Ext.String.format("<span style='color:#666; font-weight:bold; padding-left: 4px;'>{0} </span> [{1}]", v, record.get('user_role'));
    }
});
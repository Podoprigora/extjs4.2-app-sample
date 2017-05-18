Ext.define("App.view.bids.AgreementRouteGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidAgreementRouteGridPanel",
    
    hideHeaders : true,
    disableSelection : true,
    
    viewConfig : {
        trackOver : false,
        stripeRows : false
    },
    
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.BidAgreementRouteLocalStore');
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : [
                    '<tpl if="state == 1">' +
                        '<div class="col-icon icon-checkmark" data-qtip="Принято">&nbsp;</div>' +
                    '<tpl elseif="state == 2">' +
                        '<div class="col-icon icon-no" data-qtip="Отклонено">&nbsp;</div>' +
                    '<tpl elseif="state == 10">' +
                        '<div class="col-icon icon-schedule" data-qtip="Ожидает подтверждения">&nbsp;</div>' +
                    '</tpl>'
                ]
            },
            {
                dataIndex : 'status_name',
                flex : 1,
                minWidth : 160,
                renderer : function(v, metaData, record) {
                    if (record.get('state') == 10){
                        metaData.style="color:#f37a23;";
                        metaData.tdAttr = 'data-qtip="Ожидает подтверждения"';
                    }
                    return v;
                }
            },
            {
                dataIndex : 'user',
                flex : 1,
                minWidth : 160
            },
            {
                dataIndex : 'updated',
                align : 'center',
                flex : 1,
                minWidth : 140,
                renderer : Ext.util.Format.dateRenderer('d.m.Y H:i:s')
            }
        ];
    }
    
});
Ext.define('App.view.messages.HistoryViewPanel', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.MessagesHistoryViewPanel',
    
    autoScroll : true,
    
    config : {
        store : null
    },
    
    initComponent : function() {
        
        this.store = Ext.create('App.store.messages.HistoryLocalStore');
        
        this.items = {
            overflowY : 'auto',
            xtype : 'dataview',
            store : this.store,
            tpl : this.buildTpl(),
            trackOver : true,
            disableSelection : true,
            itemSelector : 'div.x-view-row',
            autoScroll : false
        };
        
        this.cls = 'custom-grid-view ' + this.cls;
        
        this.callParent(arguments);
    },
    
    buildTpl : function() {
        return Ext.create('Ext.XTemplate', 
            '<tpl for=".">',
                '<div class="x-view-row ' + '<tpl if="is_author == 1">x-row-recipient<tpl else> x-row-sender</tpl>">',
                    
                    '<div class="x-view-row-body">',
                    '<div class="x-view-tbar">',
                        
                        '<div class="label"><b>{sender}</b></div>',
                        '<div class="datetime">{[ Ext.util.Format.date(values.created, "d.m.Y, H:i") ]}</div>',
                    '</div>',
                
                    '<p>{[ this.formatMessage(values.message) ]}</p>',
                   '</div>',
                '</div>',
            '</tpl>',
            {
                formatMessage : function(text){
                    
                    var exp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
                    text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
                    
                    return text.replace(/\r|\n/g, "<br />");
                }
            }
        );
    }
    
});
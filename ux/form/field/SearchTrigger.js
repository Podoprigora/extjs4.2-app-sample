Ext.define('App.ux.form.field.SearchTrigger', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.uxSearchTrigger',
    
    trigger1Cls: 'x-form-clear-trigger',
    trigger2Cls: 'x-form-search-trigger',
    
    emptyText : 'Search',
    
    hasSearch : false,
    
    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        me.on('specialkey', function(f, e){
            if (e.getKey() == e.ENTER) {
                me.onTrigger2Click();
            }
        });
        
        this.addEvents('search');
    },
    
    afterRender: function(){
        this.callParent();
        this.triggerCell.item(0).setDisplayed(false);
    },
    
    onTrigger1Click : function(){
        var me = this;
            
        if (me.hasSearch) {
            me.setValue('');
            me.hasSearch = false;
            me.triggerCell.item(0).setDisplayed(false);
            me.updateLayout();
        }
        
        this.fireEvent('search', '');
    },

    onTrigger2Click : function(){
        var me = this,
            value = me.getValue();
            
        if (value.length > 0) {
            me.hasSearch = true;
            me.triggerCell.item(0).setDisplayed(true);
            me.updateLayout();
        }
        
        this.fireEvent('search', value);
    }
});
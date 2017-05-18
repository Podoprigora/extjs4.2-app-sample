Ext.define("App.view.main.FixedHelpArticlesGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MainFixedHelpArticlesGridPanel",
    
    hideHeaders : true,
    disableSelection : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.main.HelpArticlesLocalStore');
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns : function(){
        return [
            {
                flex : 1,
                renderer : function(v, metaData, record){
                    return Ext.String.format('<span class="x-grid-group-title">{0} <span class="x-text-separator">&rarr;</span></span> {1}', record.get('group_name'), record.get('title'));
                }
            }            
        ];
    }
});
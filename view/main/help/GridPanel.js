Ext.define("App.view.main.help.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MainHelpGridPanel",
    
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.main.directories.HelpArticlesStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
    },
    
    buildColumns : function(){
        return [
            {
                flex : 1,
                renderer : function(v, metaData, record){
                    metaData.style = "white-space: normal";
                    return Ext.String.format('<span class="x-grid-group-title">{0} <span class="x-text-separator">&rarr;</span></span> {1}', record.get('group_name'), record.get('title'));
                }
            }            
        ];
    },
    
    buildTbar : function(){
        return [
            {
                xtype : "uxFilterField",
                fieldLabel : "Поиск&nbsp;",
                labelAlign : "right",
                labelWidth : 45,
                width : 300,
                emptyText : "Введите ваш вопрос",
                editable : true,
                listeners : {
                    scope : this,
                    search : this.onChangeFilter
                }
            },
            '->',
            { 
                tooltip : 'Обновить',
                iconCls : 'icon-refresh',
                scope : this,
                handler : this.onRefresh
            },
            {
                xtype : 'tbspacer'
            },
            { 
                xtype : 'component',
                itemId : 'Totals',
                cls : 'x-component-grid-text-item',
                tpl : 'Всего: <b>{count}</b>'
            }, 
            {
                xtype : 'tbspacer'
            }
        ];
    },

    onChangeFilter : function(value) {
        this.getStore().addFilter("query", (value) ? {
            "$like" : value
        } : null);
    }
    
});
Ext.define("App.view.main.news.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MainNewsGridPanel",
    
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.main.directories.NewsStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
    },
    
    buildColumns : function(){
        return [
            {
                header : 'Заголовок',
                dataIndex : 'title',
                tdCls : 'x-cell-title',
                flex : 1
            },
            {
                header : 'Дата',
                dataIndex : 'date',
                align : 'center',
                tdCls : 'x-cell-date',
                width : 80,
                renderer : Ext.util.Format.dateRenderer('d.m.Y')
            }
        ];
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
    
    buildTbar : function(){
        return [
            {
                xtype : "uxFilterField",
                fieldLabel : "Поиск&nbsp;",
                labelAlign : "right",
                labelWidth : 45,
                width : 300,
                emptyText : "Введите заголовок или анонс",
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
Ext.define("App.view.plan.scripts.RulesGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.PlanScriptRulesGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.plan.ScriptRulesLocalStore');
        this.viewConfig = this.buildViewConfig();
        this.columns = this.buildColumns();
        this.cls += " x-no-dirty";

        this.callParent(arguments);
        
        this.addEvents('deleteitemclick', 'edititemclick');
        
        this.getView().on('drop', function(){
            this.getView().refresh();
        }, this);
    },
    
    buildViewConfig : function() {
        return {
            emptyText : '<p>Нет записей</p>',
            stripeRows : false,
            plugins: {
                ptype: 'gridviewdragdrop',
                pluginId : 'gridViewDragDrop',
                dragField : 'trigger'
            }
        }    
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                items : [
                    {
                        iconCls : 'icon-delete',
                        scope : this,
                        handler : function(view, rowIndex, colIndex, item, e, record) {
                            this.fireEvent('deleteitemclick', this, record);
                        }
                    }
                ]
            },
            {
                xtype : 'rownumberer',
                header : '№'
            },
            {
                header : 'Триггер',
                dataIndex : 'trigger',
                flex : 1
            },
            {
                header : 'Значение',
                dataIndex : 'trigger_value',
                align : 'center',
                width : 70
            },
            {
                header : 'Задержка',
                dataIndex : 'trigger_delay',
                align : 'center',
                width : 70
            },
            {
                header : 'Действие',
                dataIndex : 'action',
                flex : 1
            },
            {
                header : 'Значение',
                dataIndex : 'action_value',
                align : 'center',
                width : 70
            },
            {
                header : 'Длительность',
                dataIndex : 'action_duration',
                align : 'center',
                width : 100
            },
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                items : [
                    {
                        iconCls : 'icon-edit',
                        scope : this,
                        handler : function(view, rowIndex, colIndex, item, e, record) {
                            this.fireEvent('edititemclick', this, record);
                        }
                    }
                ]
            },
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : '<div class="col-icon icon-h-move" title="Изменить порядок (нажмите и перемещайте)">&nbsp;</div>'
            }
        ];
    }
});
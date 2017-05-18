Ext.define("App.view.bids.directories.shops.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectoryShopsGridPanel",
    
    cls : 'x-no-dirty',
    
    selModel : {
        selType : 'checkboxmodel',
        mode : 'MULTI'
    },
    
    plugins : [
        {
            ptype : 'cellediting',
            clicksToEdit : 1
        }
    ],
    
    config : {
        salesChannelsStore : null
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.ShopsStore');
        this.salesChannelsStore = Ext.create('App.store.bids.directories.SalesChannelsStore', { autoLoad : true });
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents('importbtnclick', 'deletebtnclick');
        
        this.on('selectionchange', this.onToggleBtns, this);
        
        this.salesChannelsStore.on('load', function(){
            this.getView().refresh();
        }, this);
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Код',
                dataIndex : 'code',
                width : 120,
                align : 'center'
            },
            {
                header : 'Код территории',
                dataIndex : 'area_code',
                width : 120,
                align : 'center',
                editor : {
                    xtype : 'numberfield',
                    allowBlank : false,
                    hideTrigger : true,
                    minValue : 1
                }
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                minWidth : 120,
                flex : 1,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
            {
                header : 'Юр. лицо',
                dataIndex : 'legal_name',
                minWidth : 120,
                flex : 1,
                editor : {
                    xtype : 'textfield'
                }
            },
            {
                header : 'Город',
                dataIndex : 'city',
                minWidth : 120,
                flex : 1,
                editor : {
                    xtype : 'textfield'
                }
            },
            {
                header : 'Адрес',
                dataIndex : 'address1',
                minWidth : 120,
                flex : 1,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
            {
                header : 'Адрес 2',
                dataIndex : 'address2',
                minWidth : 120,
                flex : 1,
                editor : {
                    xtype : 'textfield'
                }
            },
            {
                header : 'Канал сбыта',
                dataIndex : 'rka',
                minWidth : 120,
                flex : 1,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                },
                renderer : this.channelRenderer
            },
            {
                header : 'GPS',
                dataIndex : 'gps',
                minWidth : 120,
                flex : 1,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            },
            {
                header : 'Дата изменения',
                dataIndex : 'updated',
                width : 140,
                align : 'center',
                renderer : Ext.util.Format.dateRenderer('d.m.Y H:i:s')
            }
        ];
    },
    
    buildTbar: function () {
        return [
            {
                text: "Импорт",
                iconCls : 'icon-table-import',
                scope: this,
                handler: function () {
                    this.fireEvent("importbtnclick", this);
                }
            },
            {
                tooltip: "Удалить",
                iconCls : 'icon-delete',
                itemId : 'btnDelete',
                disabled : true,
                scope: this,
                handler: function () {
                    this.fireEvent("deletebtnclick", this);
                }
            }, 
            {
                xtype: "uxFilterField",
                fieldLabel: "Найти",
                labelAlign: "right",
                labelWidth: 60,
                width: 280,
                emptyText: "поиск по основным полям",
                editable: true,
                listeners: {
                    scope: this,
                    search: this.onChangeFilter
                }
            }, 
            "->", 
            {
                tooltip: "Обновить",
                iconCls: "icon-refresh",
                scope: this,
                handler: this.onRefresh
            }, 
            {
                xtype: "tbspacer"
            }, 
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
    },
    
    channelRenderer : function(v) {
        if (this.getSalesChannelsStore().getCount()) {
            var channelRecord = this.getSalesChannelsStore().findRecord('code', v);
            return (channelRecord) ? channelRecord.get('name') : v;
        }
        return v;
    },
    
    onChangeFilter: function (value) {
        this.getStore().addFilter("query", (value) ? {
            "$like": value
        } : null);
    },
    
    onToggleBtns : function() {
        var selCount = this.getSelectionModel().getCount();
        this.down('#btnDelete').setDisabled(selCount == 0);
    }
    
});
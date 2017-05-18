Ext.define("App.view.bids.directories.trustees.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectoryTrusteesGridPanel",
    
    selModel: {
        selType: "checkboxmodel",
        mode: "MULTI"
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.TrusteesStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents("createbtnclick", "editbtnclick", "deletebtnclick");
        
        this.on("selectionchange", this.onToggleBtns, this);
    },
    
    buildColumns : function() {
        return [
            {
                header : 'ФИО именительный падеж',
                dataIndex : 'fio1',
                minWidth : 220,
                flex : 1
            },
            {
                header : 'ФИО родительный падеж',
                dataIndex : 'fio2',
                minWidth : 220,
                flex : 1
            },
            {
                header : 'Должность',
                dataIndex : 'position',
                minWidth : 220,
                flex : 1
            },
            {
                header : 'Основание',
                dataIndex : 'basis',
                minWidth : 220,
                flex : 1
            },
            {
                header : 'Скрыто',
                dataIndex : 'is_hidden',
                width : 60,
                align : 'center',
                renderer : function(v, metaData, record){
                    return (v == 1) ? 'Да' : '';
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
                text: "Добавить лицо",
                iconCls: "icon-create",
                scope: this,
                handler: function () {
                    this.fireEvent("createbtnclick", this);
                }
            }, 
            {
                tooltip: "Редактировать",
                itemId: "btnEdit",
                disabled: true,
                iconCls: "icon-edit",
                scope: this,
                handler: function () {
                    this.fireEvent("editbtnclick", this);
                }
            },
            {
                tooltip: "Удалить",
                itemId: "btnDelete",
                disabled: true,
                iconCls: "icon-delete",
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
                width: 260,
                emptyText: "поиск по основным полям",
                editable: true,
                listeners: {
                    scope: this,
                    search: this.onChangeFilter
                }
            },
            {
                xtype : 'AreaCodesListField',
                emptyText : 'Выберите код территории',
                width : 190,
                margin : '0 0 0 5',
                listeners : {
                    scope : this,
                    select : function(field, record) {
                        field.setValue(record.get('code'));
                        this.getStore().addFilter('area_code', record.get('code'));
                    },
                    clearfield : function() {
                        this.getStore().addFilter('area_code', null);   
                    }
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
    
    onToggleBtns: function () {
        var selCount = this.getView().getSelectionModel().getCount();
        this.down("#btnDelete").setDisabled(selCount < 1);
        this.down("#btnEdit").setDisabled(selCount != 1);
    },
    
    onChangeFilter: function (value) {
        this.getStore().addFilter("query", (value) ? {
            "$like": value
        } : null);
    }
    
});
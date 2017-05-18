Ext.define("App.view.plan.shops.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.PlanShopsGridPanel",
    
    selModel : {
        selType : 'checkboxmodel',
        mode : 'MULTI'
    },
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.ShopsStore");
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents("createbtnclick", "deletebtnclick");
        this.on("selectionchange", this.onToggleBtns, this);
    },
    
    buildFeatures : function() {
        return [
            {
                ftype  : 'rowbody',
                getAdditionalData : function(data, rowIndex, record) {
                    var colspan = this.view.headerCt.getColumnCount();
                    
                    if (Ext.isEmpty(record.get('report_comment'))) {
                        return {
                            rowBody : '',
                            rowBodyCls : 'x-grid-rowbody',
                            rowBodyColspan : colspan
                        };
                    }
                    
                    var tpl = new Ext.XTemplate(
                        '<div class="x-template-column-hbox">' +
                        '<div class="column-field">' +
                            '<div class="column-field-label">Последний отчет:</div>' +
                            '{[this.getDate(values.report_date)]}' +
                        '</div>' +
                        '<div class="column-text">' +
                            '{[this.getComment(values.report_comment)]}' +
                        '</div>' +
                    '</div>',
                    {
                        getDate : function(date) {
                            return Ext.Date.format(new Date(date), 'd.m.Y');
                        },
                        getComment : function(comment) {
                            var comments = comment.split(".");
                            if (comments.length > 2 && comment.length > 120) {
                                return comments.join(".<br />");
                            }
                            return comment;
                        }
                    });
                    
                    
                    return {
                        rowBody : tpl.apply(record.getData()),
                        rowBodyCls : 'x-grid-rowbody-template',
                        rowBodyColspan : colspan
                    };
                
                }
            },
            {
                ftype  :'rowwrap'
            }
        ];
    },
    
    buildColumns: function () {
        return [
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : [
                    '<tpl if="is_disabled == 1">',
                        '<div class="icon-offline" data-qtip="Отключено">&nbsp;</div>',
                    '<tpl elseif="is_last_equipment_response_alert == 1">',
                        '<div class="icon-error-outline" data-qtip="Нет связи с устройством более 25 часов">&nbsp;</div>',
                    '<tpl elseif="this.isActivated(activated) == false">',
                        '<div class="icon-warning" data-qtip="Устройство не активировано!">&nbsp;</div>',
                    '<tpl else>',
                        '<div class="icon-checkmark-green" data-qtip="Включено">&nbsp;</div>',   
                    '</tpl>',
                    {
                        isActivated : function(activated) {
                            return (Ext.isEmpty(activated) == false && activated.getTime());
                        }
                    }
                ]
            },
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : [
                    '<tpl if="is_low_balance &gt; 0">',
                        '<div class="icon-attach-money" data-qtip="Низкий баланс SIM карты">&nbsp;</div>',
                    '</tpl>'
                ]
            },
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : [
                    '<tpl if="is_power_off &gt; 0">',
                        '<div class="icon-power-cord" data-qtip="Отключение электричества">&nbsp;</div>',
                    '</tpl>'
                ]
            },
            {
                header: "Логин",
                dataIndex: "phone",
                width: 100,
                align: "center"
            },
            {
                header: "Код терр.",
                dataIndex: "area_code",
                width: 80,
                align: "center"
            },
            {
                header: "Код точки",
                dataIndex: "code",
                width: 120,
                align: "center"
            },
            {
                header: "Наименование",
                dataIndex: "name",
                minWidth: 120,
                flex: 1,
                renderer: this.wraptextRenderer
            }, 
            {
                header: "Выкладка",
                dataIndex: "planogram_name",
                minWidth: 120,
                flex: 1,
                renderer: Ext.Function.createSequence(this.linkRenderer, this.wraptextRenderer, this)
            }, 
            {
                header: "Адрес",
                dataIndex: "address",
                minWidth: 160,
                flex: 1,
                renderer : function(v, meta){
                    meta.tdAttr = Ext.String.format("data-qtip='{0}'", v);
                    //meta.style = "white-space: normal;";
                    return Ext.String.ellipsis(v, 40);
                }
            }, 
            {
                header: "Часы работы",
                dataIndex: "work_time",
                width: 100,
                align: "center",
                sortable: false
            },
            {
                header : 'Дата активации',
                dataIndex  : 'activated',
                width : 140,
                align : 'center',
                renderer : Ext.util.Format.dateRenderer('d.m.Y H:i:s')
            },
            {
                header: "Дата изменения",
                dataIndex: "updated",
                width: 140,
                align: "center",
                renderer: Ext.util.Format.dateRenderer("d.m.Y H:i:s")
            }
        ];
    },
    
    buildTbar: function () {
        return [
            {
                text : "Добавить торговую точку",
                iconCls: "icon-create",
                scope: this,
                handler: function () {
                    this.fireEvent("createbtnclick", this);
                }
            }, 
            {
                tooltip : "Редактировать",
                itemId: "btnEdit",
                disabled: true,
                iconCls: "icon-edit",
                scope: this,
                handler: function () {
                    this.fireEvent("editbtnclick", this)
                }
            }, 
            {
                tooltip : "Удалить",
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
                width: 250,
                emptyText: "поиск по основным полям",
                editable: true,
                listeners: {
                    scope: this,
                    search: this.onChangeFilter
                }
            }, "->", {
                tooltip: "Обновить",
                iconCls: "icon-refresh",
                scope: this,
                handler: this.onRefresh
            }, {
                xtype: "tbspacer"
            }, {
                xtype: "component",
                itemId: "Totals",
                cls: "x-component-grid-text-item",
                tpl: "Всего: <b>{count}</b>"
            }, {
                xtype: "tbspacer"
            }
        ];
    },
    
    commentRenderer: function (v, metaData) {
        if (v.length) {
            metaData.tdAttr = Ext.String.format('data-qtip="{0}"', v);
        }
        return v;
    },
    
    onToggleBtns: function () {
        var selCount = this.getSelectionModel().getCount();
        this.down("#btnEdit").setDisabled(selCount != 1);
        this.down("#btnDelete").setDisabled(selCount == 0);
    },
    
    onChangeFilter: function (value) {
        this.getStore().addFilter("query", (value) ? {
            "$like": value
        } : null);
    }
});
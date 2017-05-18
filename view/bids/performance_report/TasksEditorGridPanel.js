Ext.define("App.view.bids.performance_report.TasksEditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidPerformanceReportTasksEditorGridPanel",
    
    revertSpecialKey : false,
    
    config : {
        readOnly : false
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.PerformanceReportTasksLocalStore');
        this.columns = [];
        this.plugins = this.buildPlugins();
        this.dockedItems = this.buildDockedItems();

        this.cls += " x-no-dirty";
        this.disableSelection = this.readOnly;
        
        this.callParent(arguments);
        
        this.on('edit', this.onEditCell, this);
        this.on('canceledit', this.onEditCell, this);
        this.getView().on('refresh', this.onUpdateTotalLabel, this);
        this.getStore().on('update', this.onUpdateTotalLabel, this);
    },
    
    buildPlugins : function(){
        return [{
            ptype : 'cellediting',
            pluginId : 'cellEditing',
            clicksToEdit : 1
        }];
    },
    
    buildDockedItems : function() {
        return [
            {
                xtype : 'toolbar',
                dock : 'top',
                hidden : this.readOnly,
                items : [
                    {
                        xtype: "uxTreeGridPicker",
                        store: Ext.create("App.store.bids.directories.TasksTreeStore", {
                            root: {
                                id: 0,
                                expanded: false
                            },
                            filters : [{
                                property : 'visible',
                                value : 'performance'
                            }]
                        }),
                        loadAllNodes : false,
                        emptyText : 'Добавить задачу',
                        width : 200,
                        listeners : {
                            scope : this,
                            select : this.onSelectTaskFromDirectory
                        }
                    }
                ] 
            }
        ];   
    },
    
    getColumns : function(isVisibleMinutes, isVisiblePrice) {
        var me = this,
            columns = [];
        
        if (this.readOnly) {
            columns.push({
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                hidden : ! this.readOnly,
                tpl : [
                    '<tpl if="completed == 1">' +
                        '<div class="col-icon icon-checkmark" data-qtip="Выполнено">&nbsp;</div>' +
                    '<tpl else>' +
                        '<div class="col-icon icon-reject" data-qtip="Не выполнено">&nbsp;</div>' +
                    '</tpl>'
                ]
            });   
        } else {
            columns.push({
                xtype : 'actioncolumn',
                width : 25,
                hidden : this.readOnly,
                items : [
                    {
                        getClass : function(v, metaData, record){
                            if (record.get('user_id') == App.Identity.get('id')) {
                                metaData.tdAttr = "data-qtip='Удалить'";
                                return 'icon-delete';
                            }
                        },
                        scope : this,
                        handler : this.onDeleteItem
                    }
                ]
            
            });
        }
            
        columns.push(
            {
                dataIndex : 'task',
                header : 'Задача',
                minWidth : 80,
                flex : 1,
                renderer : this.wraptextRenderer
            },
            {
                header : 'Материал',
                minWidth : 80,
                flex : 1,
                renderer : function(v, metaData, record){
                    var materials = record.getMaterials().getRange();
                    if (materials.length) {
                        metaData.style = "white-space: normal;";
                        return Ext.Array.map(materials, function(item){ return Ext.String.format("{0} (x{1})", item.get('name'), record.get("qty")); }).join("<br />");
                    }
                }
            },
            {
                header : 'Добавлено',
                minWidth : 100,
                flex : 1,
                renderer : function(v, metaData, record) {
                    metaData.style = "white-space: normal;";
                    return Ext.String.format("{0} ({1})", record.get('user'), record.get('user_role'));
                }
            },
            {
                header : 'Кол-во',
                dataIndex : 'qty',
                width : 70,
                align : 'center',
                getEditor : function(record){
                    if (record.get('countable_task') > 0 && me.readOnly == false) {
                        return {
                            xtype : 'numberfield',
                            minValue : 1,
                            selectOnFocus : true
                        };
                    }
                },
                renderer : function(v, metaData, record) {
                    if (record.get('countable_task') > 0 && me.readOnly == false) {
                        metaData.tdCls += "x-cell-editing";
                    }
                    return v;
                }
            }
        );
        
        if (isVisibleMinutes) {
            columns.push({
                header : 'Время, мин.',
                dataIndex : 'minutes',
                width : 90,
                align : 'center',
                getEditor : function(record){
                    if (record.get('culc_type') == 'minutes' && me.readOnly == false) {
                        return {
                            xtype : 'numberfield',
                            minValue : 0,
                            selectOnFocus : true
                        };
                    }
                },
                renderer : function(v, metaData, record) {
                    if (record.get('culc_type') == 'minutes' && me.readOnly == false) {
                        metaData.tdCls += "x-cell-editing";
                    }
                    
                    if (record.get('culc_type') == 'minutes') {
                        return v;
                    }
                    
                    return '-';
                }
            });
        }
        
        if (isVisiblePrice) {
            columns.push({
                header : 'Оплата',
                dataIndex : 'price',
                width : 100,
                align : 'right',
                renderer : function(v, metaData, record) {
                    if (record.get('culc_type') == 'price') {
                        v = v*record.get('qty');
                        return Ext.util.Format.number(v, "0,0.00");
                    }
                    
                    return '-';
                }
            });
        }
        
        columns.push({
            xtype : 'checkcolumn',
            dataIndex : 'completed',
            header : 'Выполнено',
            width : 80,
            hidden : this.readOnly,
            listeners : {
                scope : this,
                beforecheckchange : function(chColumn, rowIndex, checked){                    
                    if (!checked) {
                        Ext.defer(function(){
                            var record = this.getStore().getAt(rowIndex);
                            record.set('minutes', 0);
                        }, 200, this);  
                    }
                }
            }
        });

        return columns;
    },
    
    buildFbar : function(isVisibleMinutes, isVisiblePrice) {
        return {
            xtype : 'form',
            itemId : 'totalsForm',
            dock : 'bottom',
            layout : 'hbox',
            bodyPadding : '10 5 5 5',
            border : false,
            bodyCls : 'x-container-body',
            items : [
                {
                    xtype : 'container',
                    flex : 1
                },
                {
                    xtype : 'container',
                    layout : 'anchor',
                    width : 250,    
                    defaults : {
                        labelAlign : 'right',
                        readOnly : true,
                        labelWidth : 130,
                        cls : 'x-field-bold x-field-align-right'
                    },
                    items : [
                        {
                            xtype : 'textfield',
                            name : 'total_minutes',
                            hidden : (Ext.isEmpty(isVisibleMinutes) || isVisibleMinutes === false),
                            fieldLabel : 'Общее время (мин.)'
                        },
                        {
                            xtype : 'textfield',
                            name : 'total_price',
                            hidden : (Ext.isEmpty(isVisiblePrice) || isVisiblePrice === false),
                            fieldLabel : 'Всего стоимость'
                        }
                    ]
                }
            ]
        };    
    },
    
    onSelectTaskFromDirectory : function(field, record) {
        
        if (Ext.isEmpty(this.getStore().findRecord('task_id', record.get('id')))) {
            var newRecords = this.getStore().add({
                task_id : record.get('id'),
                task : record.get('name'),
                countable_task : record.get('countable'),
                culc_type : (record.get('minutes_qty') > 0 ? 'minutes' : 'price'),
                qty : 1,
                price : (record.get('minutes_qty') > 0 ? 0 : record.get('performer_price')),
                user_id : App.Identity.getRecord().get('id'),
                user : [App.Identity.getRecord().get('last_name'),App.Identity.getRecord().get('first_name'),App.Identity.getRecord().get('patronymic')].join(" "),
                user_role : App.Identity.getRecord().get('role')
            }); 
            
            if (newRecords[0].get('culc_type') == 'minutes') {
                this.getPlugin('cellEditing').startEdit(newRecords[0], this.getColumnIndex('minutes'));
            } else if(record.get('countable')) {
                this.getPlugin('cellEditing').startEdit(newRecords[0], this.getColumnIndex('qty'));
            }
        }
        
    },
    
    onEditCell : function(editor, e){
        if (e.field == 'minutes') {
            if (e.value == 0) {
                e.record.set('completed', 0);
            } else {
                e.record.set('completed', 1);    
            }
        }
    },
    
    onDeleteItem : function(view, rowIndex, colIndex, item, e, record) {
        if (String(e.target.className).indexOf('icon-delete') >= 0) {
            App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
                if (btn == 'yes') {
                    record.set('removed', 1);
                    view.getStore().remove(record);
                    view.refresh();
                }
            });
        }
    },
    
    onUpdateTotalLabel : function() {
        var totalForm = this.down('#totalsForm'),
            totalPrice = 0,
            totalMinutes = 0;
        
        if (Ext.isEmpty(totalForm) == false) {
            this.getStore().each(function(item){
                totalPrice += item.get('price')*item.get('qty');
                totalMinutes += item.get('minutes');
            }, this);
            
            totalForm.getForm().setValues({
                total_minutes : totalMinutes,
                total_price : Ext.util.Format.number(totalPrice, "0,0.00")
            });  
        }  
    },

    loadRecords : function(records) {
        if (records.length) {
            var priceRecordsQty = 0;
            Ext.Array.forEach(records, function(item){
                item.setDirty();
                if (item.get('culc_type') == 'price') {
                    priceRecordsQty ++;
                }
            });
            
            var isVisibleMinutes = (priceRecordsQty == 0 || priceRecordsQty != records.length),
                isVisiblePrice = (priceRecordsQty > 0);
            
            this.reconfigure(this.getStore(), this.getColumns(isVisibleMinutes, isVisiblePrice));
            Ext.defer(function(){
                this.getStore().loadRecords(records);
                this.addDocked(this.buildFbar(isVisibleMinutes, isVisiblePrice));
            }, 50, this);
        }   
    }
});
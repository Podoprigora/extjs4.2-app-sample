Ext.define("App.view.operations.profile.BasicContentPanel", {
    extend : "Ext.panel.Panel",
    
    config : {
       operationId : null
    },
    
    readOnly : false,
    
    overflowX : 'hidden',
    overflowY : 'scroll',
    bodyCls : 'x-container-body',
    
    layout : {
        type : 'hbox'
    },
    defaults : {
        flex : 1,
        border : false,
        bodyCls : 'x-container-body'
    },
    
    initComponent : function() {
        
        this.items = this.buildItems();
        this.plugins = {ptype : 'preservescroll'};
        this.dockedItems = [this.buildTbar()];
        
        this.callParent(arguments);
        
        this.addEvents('savebtnclick', 'cancelbtnclick', 'deletebtnclick', 'changeslogsbtnclick');
    },
    
    buildItems: function() {
        return [
            {
                xtype : 'container'  
            },
            {
                layout : 'anchor',
                defaults : {
                    anchor : '100%'
                },
                minWidth : App.Properties.get('minViewWidth'),
                bodyPadding: '15 5 0 5',
                items : [
                    this.buildFormPanel(),
                    this.buildMaterialsGrid(),
                    this.buildFilesGrid()
                ]   
            },
            {
                xtype : 'container'   
            }
        ]; 
    },
    
    buildFormPanel : function(){
        return {
            xtype : 'form',
            layout : {
                type : 'hbox',
                align : 'stretch'
            },
            defaults : {
                flex : 1
            },
            border : false,
            height : 60,
            bodyCls : 'x-container-body',
            items : [
                {
                    xtype : 'container',
                    layout : 'anchor',
                    defaults : {
                        anchor : '100%',
                        readOnly : this.readOnly
                    },
                    items : [
                        {
                            xtype : 'hidden',
                            name : 'id'
                        },
                        {
                            xtype : 'hidden',
                            name : 'confirm_invalid_remain'
                        },
                        {
                            xtype : 'hidden',
                            name : 'type'
                        },
                        {
                            xtype : 'fieldcontainer',
                            layout : 'hbox',
                            defaults : {
                                readOnly : this.readOnly
                            },
                            items : [
                                {
                                    xtype : 'datefield',
                                    fieldLabel : 'Дата',
                                    name : 'date',
                                    //startDay: 1,
                                    allowBlank : false,
                                    width : 210,
                                    tabIndex : 10
                                },
                                {
                                    xtype : 'timefield',
                                    name : 'time',
                                    width : 70,
                                    margin : '0 0 0 5',
                                    format : 'H:i',
                                    tabIndex : 11
                                },
                                {
                                    xtype : 'textfield',
                                    readOnly : true,
                                    name : 'code',
                                    fieldLabel : 'Код',
                                    labelAlign : 'right',
                                    emptyText : 'авт.',
                                    labelWidth : 50,
                                    flex : 1,
                                    tabIndex : 12
                                }
                            ]
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel : 'Документ',
                            name : 'document',
                            tabIndex : 13
                        }
                    ]
                },
                {
                    xtype : 'container',
                    margin : '0 0 0 25',
                    layout : 'anchor',
                    defaults : {
                        anchor : '100%',
                        readOnly : this.readOnly
                    },
                    items : this.buildWarehouseField()
                }
            ]
        }; 
    },
    
    buildMaterialsGrid : function() {
        return {
            title : 'Материалы',
            xtype : 'OperationMaterialsEditorGridPanel',
            itemId : 'materialsGrid',
            ui : 'in-form',
            autoHeight : true,
            minHeight : 150,
            readOnly : this.readOnly
        };
    },
    
    buildFilesGrid : function() {        
        return {
            xtype : 'FilesEditorGridPanel',
            uploadUrl : Settings.urls.getUrl('operations.files.upload'),
            downloadUrl : Settings.urls.getUrl('operations.files.download'),
            itemId : 'filesGrid',
            title : 'Файлы',
            border : false,
            ui : 'in-form',
            autoHeight : true,
            minHeight : 120,
            anchor : '100%',
            margin: "10 0 25 0",
            readOnly : this.readOnly
        };
    },
    
    buildWarehouseField : function() {
        return [
            {
                xtype : 'hidden',
                name : 'warehouse_id'
            },
            {
                xtype : 'WarehousesListField',
                store : Ext.create('App.store.operations.directories.WarehousesStore', {
                    filters : [
                        {property : 'dependent_access', value : true}
                    ]
                }),
                name : 'warehouse_full_name',
                fieldLabel : 'Склад',
                emptyText : 'Выберите склад',
                editable : true,
                allowBlank : false,
                tabIndex : 14,
                listeners : {
                    scope : this,
                    change : function(field, value) {
                        var availableMaterialsListField = field.up('form').up('panel').down('AvailableMaterialsListField');
                        if (Ext.isEmpty(availableMaterialsListField) == false) {
                            availableMaterialsListField.setDisabled(Ext.isEmpty(value));
                        }    
                    },
                    select : function(field, record) {
                        field.setValue(record.get('full_name'));

                        var basicForm = field.up('form').getForm();
                        basicForm.findField('warehouse_id').setValue(record.get('id'));
                        basicForm.findField('warehouse_user_full_name').setValue(record.get('user_full_name'));
                        
                        var availableMaterialsListField = field.up('form').up('panel').down('AvailableMaterialsListField');
                        if (Ext.isEmpty(availableMaterialsListField) == false) {
                            //availableMaterialsListField.setDisabled(false);
                            availableMaterialsListField.getStore().setFilter('warehouse_id', record.get('id'));
                            
                            var grid = field.up('form').up('panel').down('grid');
                            grid.getStore().removeAll();
                        }
                    },
                    clearfield : function(field) {
                        var basicForm = field.up('form').getForm();
                        basicForm.findField('warehouse_id').reset();
                        basicForm.findField('warehouse_user_full_name').reset();
                        
                        var grid = field.up('form').up('panel').down('grid');
                        grid.getStore().removeAll();
                    }
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : 'Кладовщик',
                name : 'warehouse_user_full_name',
                readOnly : true
            }
        ];

    },
    
    buildTbar : function() {
        return {
            xtype : 'toolbar',
            dock : 'top',
            layout : 'hbox',
            defaults : {
                flex : 1
            },
            items : [
                {
                    xtype : 'container'
                },
                {
                    xtype : 'buttongroup',
                    layout : 'hbox',
                    minWidth : App.Properties.get('minViewWidth'),
                    items : [
                        {
                            text : 'Сохранить',
                            iconCls : 'icon-save',
                            scope : this,
                            hidden : this.readOnly,
                            handler : function(){
                                this.fireEvent('savebtnclick', this);
                            }
                        },
                        {
                            xtype : 'tbspacer',
                            width : 5
                        },
                        {
                            text : 'Отмена',
                            scope : this,
                            handler : function() {
                                this.fireEvent('cancelbtnclick', this);
                            }
                        },
                        {
                            xtype : 'tbspacer',
                            width : 5
                        },
                        {
                            text : 'Удалить',
                            itemId : 'btnDelete',
                            iconCls : 'icon-delete',
                            hidden : true,
                            scope : this,
                            handler : function() {
                                this.fireEvent('deletebtnclick', this);
                            }
                        },
                        {
                            xtype : 'tbspacer',
                            width : 5
                        },
                        {
                            text : 'История изменений',
                            itemId : 'btnHistory',
                            iconCls : 'icon-history',
                            hidden : true,
                            scope : this,
                            handler : function() {
                                this.fireEvent('changeslogsbtnclick', this);    
                            }
                        }
                    ]
                },
                {   
                    xtype : 'container'
                }
            ]
        };
    }
});
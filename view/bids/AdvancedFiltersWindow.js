Ext.define("App.view.bids.AdvancedFiltersWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidsAdvancedFiltersWindow",
    id : 'BidsAdvancedFiltersWindow',
    
    title : 'Расширенный фильтр',
    width : 350,
    height : 650,
    
    config : {
        ownerGrid : null
    },

    initComponent : function(){
        
        this.items = this.buildForm();
        
        this.callParent(arguments);
    },
    
    buildForm : function() {
        return {
            xtype : 'form',
            bodyPadding : '5 15 10 15',
            bodyCls : 'x-container-body',
            autoScroll : true,
            defaults : {
                anchor : '100%',
                labelAlign : 'top'
            },
            items : [
                {
                    xtype : 'uxCombo',
                    store : Ext.create('App.store.bids.TypesLocalStore'),
                    fieldLabel : 'Тип',
                    emptyText : 'Выберите тип заявки',
                    enableReset : true,
                    editable : false,
                    listeners : {
                        scope : this,
                        change : function(field, value) {
                            this.getOwnerGrid().getStore().addFilter('type', (value) ? value : null);  
                            this.down('form').getForm().findField('status_id').setDisabled((value == 'completed'));
                            this.down('form').getForm().findField('date').labelEl.update((value == 'completed') ? 'Дата выполнения:' : 'Дата:');
                        }
                    }
                },
                {
                    xtype : 'uxCombo',
                    name : 'status_id',
                    store : Ext.create('App.store.bids.directories.StatusesStore'),
                    fieldLabel : 'Статус',
                    emptyText : 'Выберите статус заявки',
                    enableReset : true,
                    editable : false,
                    listeners : {
                        scope : this,
                        change : function(field, value) {
                            this.getOwnerGrid().getStore().addFilter('status_id', (value) ? value : null);     
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    name : 'date',
                    menuCls : 'App.ux.grid.header_filters.DateMenu',
                    fieldLabel : 'Дата',
                    emptyText : 'Выберите дату',
                    listeners : {
                        scope : this,
                        setfilter : function(field, value) {
                            this.getOwnerGrid().getStore().addFilter('date', (value) ? value : null);  
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : '№ заявки',
                    emptyText : 'Введите номер заявки',
                    editable : true,
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.getOwnerGrid().getStore().addFilter('id', (value) ? {'$like' : value} : null);       
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : '№ договора',
                    emptyText : 'Введите номер договора',
                    editable : true,
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.getOwnerGrid().getStore().addFilter('contract_code', (value) ? {'$like' : value} : null);       
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : 'Название торговой точки',
                    emptyText : 'Введите назнание торговой точки',
                    editable : true,
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.getOwnerGrid().getStore().addFilter('shop_name', (value) ? {'$like' : value} : null);       
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : 'Юрлицо торговой точки',
                    emptyText : 'Введите юрлицо торговой точки',
                    editable : true,
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.getOwnerGrid().getStore().addFilter('shop_legal_name', (value) ? {'$like' : value} : null);       
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : 'Адрес точки',
                    emptyText : 'Введите адрес торговой точки',
                    editable : true,
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.getOwnerGrid().getStore().addFilter('shop_address', (value) ? {'$like' : value} : null);       
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : 'Город',
                    emptyText : 'Введите город торговой точки',
                    editable : true,
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.getOwnerGrid().getStore().addFilter('shop_city', (value) ? {'$like' : value} : null);       
                        }
                    }
                },
                {
                    xtype  :'uxCombo',
                    store : Ext.create("App.store.bids.directories.SalesChannelsStore"),
                    valueField : 'code',
                    displayField : 'name',
                    fieldLabel : 'Канал сбыта',
                    emptyText : 'Введите канал сбыта торговой точки',
                    editable : false,
                    enableReset : true,
                    listeners : {
                        scope : this,
                        change : function(field, value) {
                            this.getOwnerGrid().getStore().addFilter('shop_rka', (value) ? value : null);     
                        }
                    }
                },
                {
                    xtype : 'AreaCodesListField',
                    store : Ext.create('App.store.settings.users.AreaCodesStore'),
                    fieldLabel : 'Код территории',
                    emptyText : 'Выберите код територии проведения работы',
                    listeners : {
                        scope : this,
                        select : function(field, record) {
                            field.setValue(record.get('code'));
                            this.getOwnerGrid().getStore().addFilter('area_code', record.get('code'));  
                        },
                        clearfield : function(field) {
                            this.getOwnerGrid().getStore().addFilter('area_code', null); 
                        }
                    }
                },
                {
                    xtype : 'UsersListField',
                    store : Ext.create("App.store.settings.users.UsersStore", {
                        filters : {property : 'has_group', value : 1}
                    }),
                    fieldLabel : 'Автор',
                    emptyText : 'Выберите автора заявки',
                    listeners : {
                        scope : this,
                        select : function(field, record) {
                            field.setValue(record.get('fio'));
                            this.getOwnerGrid().getStore().addFilter('author_user_id', record.get('id'));  
                        },
                        clearfield : function(field) {
                            this.getOwnerGrid().getStore().addFilter('author_user_id', null); 
                        }
                    }
                },
                {
                    xtype : 'UsersListField',
                    store : Ext.create("App.store.settings.users.UsersStore", {
                        filters : {property : 'has_group', value : 1}
                    }),
                    fieldLabel : 'Утверждающий',
                    emptyText : 'Выберите утверждающего',
                    listeners : {
                        scope : this,
                        select : function(field, record) {
                            field.setValue(record.get('fio'));
                            this.getOwnerGrid().getStore().addFilter('agreement_user_id', record.get('id'));  
                        },
                        clearfield : function(field) {
                            this.getOwnerGrid().getStore().addFilter('agreement_user_id', null); 
                        }
                    }
                },
                {
                    xtype : 'UsersListField',
                    store : Ext.create("App.store.settings.users.UsersStore", {
                        filters : {property : 'has_group', value : 1}
                    }),
                    fieldLabel : 'Исполнитель',
                    emptyText : 'Выберите ответственного исполнителя',
                    listeners : {
                        scope : this,
                        select : function(field, record) {
                            field.setValue(record.get('fio'));
                            this.getOwnerGrid().getStore().addFilter('performer_user_id', record.get('id'));  
                        },
                        clearfield : function(field) {
                            this.getOwnerGrid().getStore().addFilter('performer_user_id', null); 
                        }
                    }
                },
                {
                    xtype : 'UserAvailableWarehousesListField',
                    name : 'warehouse',
                    fieldLabel : 'Склад',
                    emptyText : 'Выберите операционный склад',
                    listeners : {
                        scope : this,
                        select : function(field, record) {
                            field.setValue(record.get('code'));
                            this.getOwnerGrid().getStore().addFilter('warehouse_id', record.get('id'));  
                        },
                        clearfield : function(field) {
                            this.getOwnerGrid().getStore().addFilter('warehouse_id', null); 
                        }
                    }
                },
                {
                    xtype: "uxTreeGridPicker",
                    store: Ext.create("App.store.bids.directories.TasksTreeStore", {
                        root: {
                            id: 0,
                            expanded: false
                        }
                    }),
                    loadAllNodes : false,
                    selectOnlyLeaf : false,
                    fieldLabel : 'Задача',
                    emptyText : 'Выберите задачу включенную в заявку',
                    listeners : {
                        scope : this,
                        select : function(field, record) {
                            field.setValue(record.get('name'));
                            this.getOwnerGrid().getStore().addFilter('task_id', record.get('id'));  
                        },
                        clearfield : function(field) {
                            this.getOwnerGrid().getStore().addFilter('task_id', null); 
                        }
                    }
                },
                {
                    xtype : 'CatalogMaterialsListField',
                    store : Ext.create('App.store.catalog.MaterialsStore'),
                    fieldLabel : 'Материал',
                    emptyText : 'Выберите материал включенный в заявку',
                    listeners : {
                        scope : this,
                        select : function(field, record) {
                            field.setValue(record.get('name'));
                            this.getOwnerGrid().getStore().addFilter('material_id', record.get('id'));  
                        },
                        clearfield : function(field) {
                            this.getOwnerGrid().getStore().addFilter('material_id', null); 
                        }
                    }
                }
            ],
            buttons : [
                {
                    text : 'Закрыть',
                    scope : this,
                    handler : this.onCloseWindow
                }
            ]
            
        };
    },
    
    onCloseWindow : function() {
        this.hide();
    }
});
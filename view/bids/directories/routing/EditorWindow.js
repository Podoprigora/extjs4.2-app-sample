Ext.define("App.view.bids.directories.routing.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidsDirectoryRouteEditorWindow",
    id : 'BidsDirectoryRouteEditorWindow',
    
    title : 'Добавить правило',
    width : 800,
    height : 595,
    
    initComponent : function(){
        
        this.items = this.buildForm();
        
        this.callParent(arguments);
    },
    
    buildForm : function() {
        return {
            xtype : 'form',
            bodyPadding : '10 15 15 15',
            bodyCls : 'x-container-body',
            items : [
                {
                    xtype : 'hidden',
                    name : 'id'
                },
                {
                    xtype : 'container',
                    height : 410,
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    defaults : {
                        flex : 1
                    },
                    items : [
                        {
                            xtype : 'container',
                            margin : '0 15 0 0',
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            defaults : {
                                ui : 'in-form',
                                flex : 1
                            
                            },
                            items : [
                                {
                                    xtype : 'BidsDirectoryStatusesEditorGridPanel',
                                    itemId : 'statusesGrid',
                                    title : 'Статусы'
                                },
                                {
                                    xtype : 'BidsDirectoryTasksEditorGridPanel',
                                    itemId : 'tasksGrid',
                                    title : 'Задачи'
                                }
                            ]
                        },
                        {
                            xtype : 'container',
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            defaults : {
                                flex : 1,
                                ui : 'in-form'
                            },
                            items : [
                                {
                                    xtype : 'BidsDirectoryAreaCodesEditorGridPanel',
                                    itemId : 'areaCodesGrid',
                                    title : 'Территории'
                                    
                                },
                                {
                                    xtype : 'BidsDirectoryRolesEditorGridPanel',
                                    itemId : 'rolesGrid',
                                    title : 'Роли'
                                },
                                {
                                    xtype : 'BidsDirectorySalesChannelsEditorGridPanel',
                                    itemId : 'channelsGrid',
                                    title : 'Каналы сбыта'   
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'radiogroup',
                    padding : '15 0 10 0',
                    layout : 'hbox',
                    
                    defaults : {
                        margin : '0 25 0 0'
                    },
                    items : [
                        {
                            boxLabel : 'Все материалы',
                            name : 'materials_allowed',
                            inputValue : 0, 
                            checked : true
                        },
                        {
                            boxLabel : 'Требующие бухгалтерского оформления',   
                            name : 'materials_allowed',
                            inputValue : 1 
                        },
                        {
                            boxLabel : 'Не требующие бухгалтерского оформления',   
                            name : 'materials_allowed',
                            inputValue : 2 
                        }
                        /*{
                            xtype : 'numberfield',
                            name : 'total_mprice_from',
                            fieldLabel : 'Общая цена материалов от'
                        },
                        {
                            xtype : 'numberfield',
                            name : 'mprice_from',
                            fieldLabel : 'Цена единицы материалов от',
                            labelAlign : 'right'
                        }*/
                    ]
                },
                {
                    xtype : 'numberfield',
                    name : 'priority',
                    fieldLabel : 'Приоритет',
                    minValue : 0,
                    width : 200
                }
            ],
            buttons : [
                {
                    text : 'Сохранить и создать',
                    iconCls : 'icon-save',
                    scope : this,
                    handler : function() {
                        this.fireEvent('savebtnclick', this);
                    }
                },
                {
                    text : 'Сохранить и закрыть',
                    iconCls : 'icon-save-close',
                    scope : this,
                    handler : function() {
                        this.fireEvent('savebtnclick', this, 'close');
                    }
                },
                {
                    text : 'Отмена',
                    scope : this,
                    handler : this.onCancelBtnClick
                }
            ]
        };
    },
    
    onCancelBtnClick : function() {
        this.hide();   
    }
    
});
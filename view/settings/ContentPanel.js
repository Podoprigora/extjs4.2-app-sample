Ext.define("App.view.settings.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.SettingsContentPanel",
    
    layout : 'fit',
    bodyCls : 'x-container-body',
    bodyPadding : 5,
    border : false,
    
    initComponent : function(){
        
        this.items = this.buildItems();
        this.lbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents('menubtnclick');
    },
    
    buildItems : function() {
        return [
            {
                xtype : 'uxTabPanel'
            }
        ];
    },
    
    buildTbar : function() {
        return {
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            width : 145,
            cls : 'vertical-menu-large',
            defaults : {
                scale : 'large',
                iconAlign : 'left',
                iconCls : 'icon24-gray-settings'
            },
            items : [
                {
                    text : 'Пользователи',
                    cls : 'x-btn-font-size-11-5',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'UsersContentPanel', btn.text, 'icon-app-table');
                    }
                },
                {
                    text : 'Роли',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'RolesContentPanel', btn.text, 'icon-app-table');
                    }
                },
                {
                    text : 'Территории',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'AreaCodesTreePanel', 'Территории', 'icon-app-table');
                    }
                },
                {
                    text : 'Регионы',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'DirectoryRegionsContentPanel', btn.text, 'icon-app-table');
                    }
                },
                {
                    text : 'Автотранспорт',
                    cls : 'x-btn-font-size-11-5',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'MapsTransportsDirectoryGridPanel', btn.text, 'icon-app-table');
                    }
                },
                {
                    text : 'Склад',
                    menuAlign : 'tr',
                    menu : [
                        {
                            text : 'Материалы',
                            scope : this,
                            handler : function(item) {
                                this.fireEvent('menubtnclick', this, 'DirectoryMaterialsGridPanel', item.text, 'icon-app-table');
                            }
                        },
                        {
                            text : 'Склады',
                            scope : this,
                            handler : function(item) {
                                this.fireEvent('menubtnclick', this, 'DirectoryWarehousesGridPanel', item.text, 'icon-app-table');
                            }
                        },
                        {
                            text : 'Коды партий',
                            scope : this,
                            handler : function(item) {
                                this.fireEvent('menubtnclick', this, 'DirectoryCodesGridPanel', item.text, 'icon-app-table');
                            }
                        },
                        {
                            text : 'Кладовщики',
                            scope : this,
                            handler : function(item) {
                                this.fireEvent('menubtnclick', this, 'DirectoryStorekeepersGridPanel',  item.text, 'icon-app-table');
                            }
                        },
                        '-',
                        {
                            text : 'Импорт',
                            scope : this,
                            handler : function(item) {
                                this.fireEvent('menubtnclick', this, 'ExcelImportLogGridPanel', item.text, 'icon-database-import', true, false);
                            }
                        }
                    ]
                },
                {
                    text : 'Заявки',
                    menuAlign : 'tr',
                    menu : [
                        {
                            text : 'Задачи',
                            scope : this,
                            handler : function(btn) {
                                this.fireEvent('menubtnclick', this, 'BidsDirectoryTasksTreePanel', btn.text, 'icon-app-table');
                            }
                        },
                        {
                            text : 'Типы задач',
                            scope : this,
                            handler : function(btn) {
                                this.fireEvent('menubtnclick', this, 'BidsDirectoryTasksTypesGridPanel', btn.text, 'icon-app-table');
                            }
                        },
                        {
                            text : 'Торговые точки',
                            scope : this,
                            handler : function(btn) {
                                this.fireEvent('menubtnclick', this, 'BidsDirectoryShopsGridPanel', 'Торговые точки', 'icon-app-table');
                            }
                        },
                        {
                            text : 'Каналы сбыта',
                            scope : this,
                            handler : function(btn) {
                                this.fireEvent('menubtnclick', this, 'BidsDirectorySalesChannelsGridPanel', 'Каналы сбыта', 'icon-app-table');
                            }
                        },
                        {
                            text : 'Подписывающие лица',
                            scope : this,
                            handler : function(btn) {
                                this.fireEvent('menubtnclick', this, 'BidsDirectoryTrusteesGridPanel', 'Подписывающие лица', 'icon-app-table');
                            }
                        },
                        {
                            text : 'Статусы',
                            scope : this,
                            handler : function(btn) {
                                this.fireEvent('menubtnclick', this, 'BidsDirectoryStatusesGridPanel', 'Статусы заявок', 'icon-app-table');
                            }
                        },
                        {
                            text : 'Порядок обработки',
                            scope : this,
                            handler : function(btn) {
                                this.fireEvent('menubtnclick', this, 'BidsDirectoryRoutesGridPanel', 'Порядок обработки', 'icon-app-table');
                            }
                        }
                    ]
                },
                {
                    text : 'Главная',
                    menuAlign : 'tr',
                    menu : [
                        {
                            text : 'Слайдер',
                            scope : this,
                            handler : function(item) {
                                this.fireEvent('menubtnclick', this, 'MainDirectorySlidersGridPanel', item.text, 'icon-app-table');
                            }
                        },
                        {
                            text : 'Новости',
                            scope : this,
                            handler : function(item) {
                                this.fireEvent('menubtnclick', this, 'MainDirectoryNewsGridPanel', item.text, 'icon-app-table');
                            }
                        },
                        {
                            text : 'Помощь',
                            scope : this,
                            handler : function(item){
                                this.fireEvent('menubtnclick', this, 'MainDirectoryHelpArticlesGridPanel', 'Помощь :: Статьи', 'icon-app-table');    
                            }
                        }
                    ]
                }
            ]
        };
    }
    
    
});
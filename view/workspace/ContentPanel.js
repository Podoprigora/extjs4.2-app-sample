Ext.define("App.view.workspace.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.WorkspaceContentPanel",
    id : 'WorkspaceContentPanel',
    
    layout : 'fit',
    border : false,
    
    initComponent : function(){
        
        this.items = [
            this.buildModulesContentPanel()
        ];
        
        this.dockedItems = [this.buildHeaderPanel()];
        
        this.callParent(arguments);
        
        this.addEvents('mainmenubtnclick', 'logoutbtnclick');
    },

    buildHeaderPanel : function() {
        return {
            docked  :'top',
            height : 43,
            cls : 'app-header',
            border : false,
            layout : {
                type : 'hbox',
                align : 'stretch'
            },
            items : [
                {
                    width : 145,
                    bodyPadding : 6,
                    html : "<div class='company-logo'>&nbsp;</div>"
                },
                {
                    itemId : 'mainMenu',
                    flex : 1,
                    bodyPadding : '6 0 0 0',
                    cls : 'app-main-menu',
                    layout : {
                        type : 'hbox',
                        align : 'stretch',
                        pack : 'left'
                    },
                    defaults : {
                        xtype : 'button',
                        scale : 'medium',
                        enableToggle : true,
                        toggleGroup : 'workspaceButtons',
                        padding : 2,
                        minWidth : 80,
                        listeners : {
                            scope : this,
                            click : this.onClickMainMenu
                        }
                    },
                    items : [
                        {
                            text : 'Главная',
                            moduleXType : 'MainContentPanel',
                            minWidth : 90,
                            hidden : App.Identity.getRecord().isDeny('main'),
                            pressed : App.Identity.getRecord().isActiveMenu('main')
                        },
                        {
                            text : 'Заявки',
                            moduleXType : 'BidsContentPanel',
                            itemId : 'btnBids',
                            minWidth : 90,
                            hidden : App.Identity.getRecord().isDeny('bids'),
                            pressed : App.Identity.getRecord().isActiveMenu('bids')
                        },
                        {
                            text : 'Склад',
                            minWidth : 90,
                            moduleXType : 'OperationsContentPanel',
                            hidden : App.Identity.getRecord().isDeny('operations'),
                            pressed : App.Identity.getRecord().isActiveMenu('operations')
                        },
                        {
                            text : 'OOS',
                            moduleXType : 'PlanContentPanel',
                            hidden : App.Identity.getRecord().isDeny('oos'),
                            pressed : App.Identity.getRecord().isActiveMenu('oos')
                        },
                        {
                            text : 'Каталог',
                            moduleXType : 'CatalogContentPanel',
                            hidden : App.Identity.getRecord().isDeny('catalog'),
                            pressed : App.Identity.getRecord().isActiveMenu('catalog')
                        },
                        {
                            text : 'Карты',
                            moduleXType : 'MapsContentPanel',
                            hidden : App.Identity.getRecord().isDeny('maps_transports'),
                            pressed : App.Identity.getRecord().isActiveMenu('maps')
                        },
                        { 
                            xtype : 'container', 
                            flex : 1 
                        },
                        {
                            iconCls : 'icon19-gear',
                            cls : 'icon-19',
                            moduleXType : 'SettingsContentPanel',
                            hidden : App.Identity.getRecord().isDeny('settings'),
                            pressed : App.Identity.getRecord().isActiveMenu('settings'),
                            minWidth : 50
                        },
                        {
                            itemId : 'btnMessages',
                            moduleXType : 'MessagesContentPanel',
                            iconCls : 'icon19-messages',
                            cls : 'icon-19',
                            minWidth : 50,
                            unreadCounter : 0,
                            hidden : App.Identity.getRecord().isDeny('messages'),
                            pressed : App.Identity.getRecord().isActiveMenu('messages')
                            
                        },
                        {
                            xtype : 'label',
                            cls : 'user-label',
                            padding : null,
                            margin : null,
                            text : Ext.String.ellipsis(App.Identity.get('fio'), 20)
                        },
                        {
                            tooltip : 'Выйти из системы',
                            iconCls : 'icon16-logout',
                            cls : 'icon-16',
                            enableToggle : false,
                            minWidth : 45,
                            margin : {
                                right : 5
                            },
                            scope : this,
                            handler : function() {
                                this.fireEvent('logoutbtnclick', this);
                            }
                        }
                    ]
                }
            ]
        };
    },

    buildModulesContentPanel : function() {
        
        var modules = [
            {
                xtype : 'panel',
                bodyCls : 'x-container-body',
                border : false
            }
        ];
        
        if (App.Identity.getRecord().isAllowed('main')) {
            modules.push({xtype : 'MainContentPanel'}); 
        }
        if (App.Identity.getRecord().isAllowed('bids')) {
            modules.push({xtype : 'BidsContentPanel'}); 
        }
        if (App.Identity.getRecord().isAllowed('oos')) {
            modules.push({xtype : 'PlanContentPanel'});     
        }
        if (App.Identity.getRecord().isAllowed('catalog')) {
            modules.push({xtype : 'CatalogContentPanel'});     
        }
        if (App.Identity.getRecord().isAllowed('maps_transports')) {
            modules.push({xtype : 'MapsContentPanel'});     
        }
        if (App.Identity.getRecord().isAllowed('operations')) {
            modules.push({xtype : 'OperationsContentPanel'});     
        }
        if (App.Identity.getRecord().isAllowed('messages')) {
            modules.push({xtype : 'MessagesContentPanel'});     
        }
        if (App.Identity.getRecord().isAllowed('settings')) {
            modules.push({xtype : 'SettingsContentPanel'});     
        }
        
        return {
            flex : 1,
            xtype : 'uxCardPanel',
            itemId : 'mainCardPanel',
            bodyCls : 'x-container-body',
            border : false,
            bodyBorder : false,
            activeItem : 0,
            items : modules
        };
    },
    
    onClickMainMenu : function(btn) {
        this.fireEvent('mainmenubtnclick', this, btn);
        
        if(! btn.pressed){
            btn.toggle(true);
            return;
        }
        
        this.down('uxCardPanel').onSwitchPanel(btn.moduleXType);
    }
});
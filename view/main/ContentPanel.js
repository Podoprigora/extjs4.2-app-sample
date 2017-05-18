Ext.define("App.view.main.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MainContentPanel",
    
    layout : 'fit',
    bodyCls : 'x-container-body',
    bodyPadding : 5,
    border : false,
    
    initComponent : function(){
        
        this.items = this.buildItems();
        this.lbar = this.buildLbar();
        
        this.callParent(arguments);
        
        this.on('menubtnclick', this.onMenuBtnClick, this);
    },
    
    buildItems : function(){
        return [
            {
                xtype : 'uxCardPanel',
                //bodyCls : 'x-container-body',
                border : false,
                activeItem : 0,
                items : [
                    {
                        xtype : 'panel',
                        bodyCls : 'x-container-body',
                        border : false
                    },
                    {
                        xtype : 'MainDashboardContentPanel'
                    },
                    {
                        xtype : 'MainNewsContentPanel'
                    },
                    {
                        xtype : 'MainHelpContentPanel'
                    }
                ]
            }
        ];
    },
    
    buildLbar : function(){
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
                enableToggle : true,
                toggleGroup : 'dashboardMenu'
            },
            items : [
                {
                    text : 'Рабочий стол',
                    iconCls : 'icon24-gray-dashboard',
                    pressed : true,
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'MainDashboardContentPanel');
                    }
                },
                {
                    text : 'Все новости',
                    iconCls : 'icon24-gray-files',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'MainNewsContentPanel');
                    }
                },
                {
                    text : 'Помощь',
                    iconCls : 'icon24-gray-help',
                    scope : this,
                    handler : function(btn) {
                        this.fireEvent('menubtnclick', this, 'MainHelpContentPanel');
                    }
                }
            ]
        };   
    },
    
    onMenuBtnClick : function(panel, moduleXtype){
        var cardPanel = panel.down('uxCardPanel');
        cardPanel.onSwitchPanel(moduleXtype);
    }
});
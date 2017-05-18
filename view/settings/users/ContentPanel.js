Ext.define("App.view.settings.users.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.UsersContentPanel",
    
    layout: "border",
    bodyPadding: 5,
    
    initComponent: function () {
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents("initpanel");
    },
    
    buildItems: function () {
        return [
            {
                region: "west",
                xtype: "UsersFiltersFormPanel",
                hidden: true,
                width: 220,
                listeners: {
                    scope: this,
                    setfilter: function (form, filter) {
                        var grid = this.down("UsersGridPanel");
                        grid.fireEvent("setfilter", grid, filter);
                    }
                }
            }, 
            {
                region: "center",
                layout: "border",
                border: false,
                items: [
                    {
                        xtype: "UsersGridPanel",
                        region: "center",
                        listeners: {
                            scope: this,
                            filtersbtnclick: function (btn) {
                                var filterForm = this.down("UsersFiltersFormPanel");
                                filterForm.setVisible(btn.pressed)
                            }
                        }
                    },
                    {
                        region : 'east',
                        layout : 'border',
                        split : true,
                        collapsible : true,
                        animCollapse : false,
                        title : 'Параметры доступа',
                        collapsed : true,
                        width : 400,
                        defaults : {
                            flex : 1,
                            border : false
                        },
                        items : [
                            {
                                region : 'center',
                                title: "Зона ответственности",
                                xtype: "UserAccessAreasGridPanel",
                                itemId : 'accessAreasGrid',
                                disabled: true
                            },
                            {
                                region : 'south',
                                title: "Региональный коды",
                                xtype : 'UserAreaCodesGridPanel',
                                itemId : 'areaCodesGrid',
                                split : true,
                                disabled: true
                            }
                        ]
                    }
                ]
            }
        ];
    },
    
    onInitPanel: function () {
        this.fireEvent("initpanel", this);
    }
    
});
Ext.define("App.view.settings.users.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.UsersListField",
    
    listHeight: 250,
    listWidth : 450,
    
    config: {
        rolesStore: null
    },
    
    constructor : function() {
        this.store = Ext.create("App.store.settings.users.UsersStore");
        this.callParent(arguments);
    },
    
    initComponent: function () {
        
        this.rolesStore = Ext.create("App.store.settings.roles.RolesStore");
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
        
        this.rolesStore.on('load', function(){
            this.picker.getView().refresh();
        }, this);
    },
    
    buildColumns: function () {
        return [
            {
                header: "ФИО",
                dataIndex: "fio",
                flex: 1,
                renderer : function(v, meta){
                    meta.style = "white-space: normal;";
                    return v;
                }
            }, 
            {
                header: "Роль",
                dataIndex: "role",
                width: 140,
                align: "center"
            },
            {
                header : 'Регион',
                dataIndex : 'region',
                flex : 1
            }
        ];
    }
    
});
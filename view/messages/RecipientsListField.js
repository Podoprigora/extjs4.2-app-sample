Ext.define("App.view.messages.RecipientsListField", {
    extend : "App.ux.picker.List",
    alias : "widget.RecipientsListField",
    
    listHeight: 250,
    
    initComponent: function () {
        this.store = Ext.create("App.store.messages.RecipientsStore");
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
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
                header: "Регион",
                dataIndex: "region",
                width: 160
            }
        ];
    },
    
    onRefreshGridView : function() {
        this.picker.getView().refresh();
    }
});
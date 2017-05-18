Ext.define("App.view.plan.shops.PlanogramsEditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.ShopPlanogramsEditorGridPanel",
    
    readOnly : false,
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.ShopPlanogramsLocalStore");
        this.columns = this.buildColumns();
        
        if (this.readOnly == false) {
            this.tbar = this.buildTbar();
            this.cls += " x-no-dirty";
        }
        
        
        this.callParent(arguments);
        
        this.addEvents("addbtnclick", "deleteitembtnclick")
    },
    
    buildColumns: function () {
        return [{
            xtype: "actioncolumn",
            width: 30,
            align: "center",
            hidden : this.readOnly,
            items: [{
                iconCls: "icon-delete",
                tooltip: "Удалить",
                scope: this,
                handler: this.onDeleteItemBtnClick
            }]
        }, {
            header: "Наименование",
            dataIndex: "planogram_name",
            width: 400,
            renderer: this.readOnly ? Ext.emptyFn() : Ext.Function.createSequence(this.linkRenderer, this.wraptextRenderer, this)
        }, {
            header: "Дата начала",
            dataIndex: "start_date",
            align: "center",
            width: 140,
            renderer: Ext.util.Format.dateRenderer("d.m.Y")
        }, {
            header: "Дата окончания",
            dataIndex: "end_date",
            align: "center",
            width: 140,
            renderer: Ext.util.Format.dateRenderer("d.m.Y")
        }, {
            flex: 1
        }];
    },
    
    buildTbar: function () {
        return [{
            text: "Добавить выкладку",
            iconCls: "icon-create",
            scope: this,
            handler: function () {
                this.fireEvent("addbtnclick", this);
            }
        }];
    },
    
    onDeleteItemBtnClick: function (view, rowIndex, colIndex, item, e, record) {
        this.fireEvent("deleteitembtnclick", this, record);
    }
});
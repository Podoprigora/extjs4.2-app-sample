Ext.define("App.view.catalog.materials.FiltersFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.CatalogMaterialsFilterFormPanel",
    
    bodyPadding: 5,
    defaults: {
        anchor: "100%",
        labelAlign: "top"
    },
    
    initComponent: function () {
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents("setfilter");
    },
    
    buildItems: function () {
        return [{
            xtype: "uxTreePicker",
            store: Ext.create("App.store.catalog.GroupsTreeStore", {
                root: {
                    id: 0,
                    expanded: false
                }
            }),
            fieldLabel: "Категория",
            emptyText: "Выберите категорию",
            displayField: "name",
            minPickerWidth: 300,
            minPickerHeight: 450,
            selectOnlyLeaf: false,
            listeners: {
                scope: this,
                select: function (field, record) {
                    this.fireEvent("setfilter", this, {
                        property: "group_id",
                        value: record.get("id")
                    });
                },
                clean: function () {
                    this.fireEvent("setfilter", this, {
                        property: "group_id",
                        value: null
                    });
                }
            }
        }, {
            xtype: "uxFilterField",
            fieldLabel: "Наименование",
            emptyText: "Введите наименование, описание",
            editable: true,
            listeners: {
                scope: this,
                search: function (value) {
                    this.fireEvent("setfilter", this, {
                        property: "query",
                        value: ((value) ? {
                            "$like": value
                        } : null)
                    });
                }
            }
        }, {
            xtype: "uxFilterField",
            fieldLabel: "Складская позиция",
            emptyText: "Введите код",
            editable: true,
            listeners: {
                scope: this,
                search: function (value) {
                    this.fireEvent("setfilter", this, {
                        property: "code",
                        value: ((value) ? {
                            "$like": value
                        } : null)
                    });
                }
            }
        }];
    }
    
});
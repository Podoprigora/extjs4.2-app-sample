Ext.define('App.controller.catalog.GroupsController', {
    extend : 'Ext.app.Controller',
    
    models: [
        "catalog.GroupModel"
    ],
    stores: [
        "catalog.GroupsTreeStore"
    ],
    views: [
        "catalog.groups.EditorTreePanel"
    ],
    
    init: function () {
        this.control({
            CatalogGroupsEditorTreePanel: {
                createitemclick: this.onCreateItemClick,
                edititemclick: this.onEditItemClick,
                deleteitemclick: this.onDeleteItemClick,
                canceledit: this.onCancelItemEdit,
                edit: this.onSaveNode
            }
        })
    },
    
    onCreateItemClick: function (view, rowIndex, colIndex, item, e, record) {
        var tree = view.ownerCt,
            cellEditor = tree.cellEditor,
            node = record,
            childNode = Ext.create("App.model.catalog.GroupModel", {
                loaded: true
            });
        node.expand(false, function () {
            node.insertBefore(childNode, node.firstChild);
            Ext.defer(function () {
                cellEditor.startEdit(childNode, 3);
            }, 50);
        });
    },
    
    onEditItemClick: function (view, rowIndex, colIndex, item, e, record) {
        var tree = view.ownerCt,
            cellEditor = tree.cellEditor,
            node = record;
        cellEditor.startEdit(node, 3);
    },
    
    onDeleteItemClick: function (view, rowIndex, colIndex, item, e, record) {
        var tree = view.ownerCt,
            node = record;
        App.ux.Msg.confirm(Ext.String.format("Вы действительно хотите удалить <b>{0}</b>?", node.get("name")), function (btn) {
            if (btn == "yes") {
                tree.el.mask("Удаление ...");
                node.destroy({
                    success: function () {},
                    failure: function () {
                        node.reject();
                    },
                    callback: function () {
                        tree.el.unmask();
                    }
                })
            }
        });
    },
    
    onCancelItemEdit: function (editor, e) {
        var node = e.record;
        if (!node.isValid()) {
            if (node.getId() == 0) {
                node.remove(false);
            } else {
                node.reject();
            }
            e.grid.getView().refresh();
        }
    },
    
    onSaveNode: function (editor, e) {
        var node = e.record,
            tree = e.grid;
        if (Ext.Object.getSize(node.getChanges())) {
            tree.el.mask("Сохранение ...");
            node.save({
                success: function (record) {
                    tree.cellEditor.cancelEdit();
                    tree.getStore().load({
                        callback: function () {
                            tree.getStore().getRootNode().expand();
                            tree.getSelectionModel().select(node);
                        }
                    })
                },
                failure: function () {
                    node.reject();
                },
                callback: function () {
                    tree.el.unmask();
                }
            });
        }
    }
    
});
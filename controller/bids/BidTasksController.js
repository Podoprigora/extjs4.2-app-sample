Ext.define('App.controller.bids.BidTasksController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'bids.BidTaskModel',
        'bids.BidMaterialModel'
    ],
    
    stores : [
        'bids.BidTasksLocalStore',
        'bids.BidMaterialsLocalStore'
    ],
    
    views : [
        'bids.materials.DirectoryGridPanel',
        'bids.materials.DirectoryWindow', 
        'bids.materials.EditorGridPanel',
        'bids.tasks.DirectoryTreeGridPanel',
        'bids.tasks.DirectoryWindow',
        'bids.tasks.EditorGridPanel'
    ],
    
    init : function() {
        
        this.control({
            'BidEditorFormPanel BidTasksEditorGridPanel' : {
                addtaskbtnclick : this.onShowTasksDirectoryWindow,
                addmaterialitemclick : this.onShowMaterialsDirectoryWindow,
                deleteitemclick : this.onDeleteTaskItem
            },
            'BidEditorFormPanel BidMaterialsEditorGridPanel' : {
                deleteitemclick : this.onDeleteMaterialItem ,
                storeupdate : this.onCulcTasksQty
            },
            'BidTasksDirectoryTreeGridPanel' : {
                selectitemclick : this.onAddTask,
                itemdblclick : this.onAddTask
            },
            'BidMaterialsDirectoryGridPanel' : {
                selectitemclick : this.onAddMaterial,
                itemdblclick : this.onAddMaterial
            }
        });
        
    },
    
    onShowTasksDirectoryWindow : function(grid) {
        var bidForm = grid.up('BidEditorFormPanel'),
            areaCode = bidForm.down('AreaCodesListField').getValue();
            
        if (Ext.isEmpty(areaCode)) {
            App.ux.Msg.alert("Выберите код территории!");
            return false;
        } 
        
        var win = App.ux.window.Manager.create('BidTasksDirectoryWindow'),
            treePanel = win.down('#treePanel');
        
        win.setMasterGrid(grid);
        win.show();
        
        win.snapRight(null, true);
        
        var oldFilter = treePanel.getStore().getFilterByKey('area_code');
        if (Ext.isEmpty(oldFilter) == false && oldFilter.value == areaCode) {
            return false;
        }
        
        treePanel.getStore().addFilter('area_code', areaCode); 
    },
    
    onShowMaterialsDirectoryWindow : function(tasksGrid, taskRecord) {
        var win = App.ux.window.Manager.create('BidMaterialsDirectoryWindow'),
            grid = win.down('grid');
        
        win.setMasterGrid(tasksGrid.nextSibling('grid'));
        win.setMaterialTaskRecord(taskRecord);
        
        win.show();
        win.snapRight(null, true);
        
        if(grid.getStore().getCount() == 0) {
            grid.getStore().load();   
        }
    },
    
    onAddTask : function(view, node) {
        if (! node.isLeaf()) {
            return false;
        }
        
        var directoryTree = view.ownerCt,
            directoryWindow = directoryTree.up('window'),
            editorGrid = directoryWindow.getMasterGrid(),
            existRecord = editorGrid.getStore().findRecord('task_id', node.get('id'));
        
        directoryTree.getSelectionModel().select(node);
        editorGrid.getSelectionModel().deselectAll();
        
        if (Ext.isEmpty(existRecord)) {
            var addRecord = editorGrid.getStore().add({
                task_id : node.get('id'),
                name : node.get('name'),
                type : node.get('type'),
                need_equipment : node.get('need_equipment'),
                countable : node.get('countable'),
                qty : 1
            });
            editorGrid.getSelectionModel().select(addRecord[0]);
        } else if(node.get('countable') == 1) {
            existRecord.set('qty', existRecord.get('qty')+1);
            editorGrid.getSelectionModel().select(existRecord);
        }
    },
    
    onAddMaterial : function(view, record){
        var directoryGrid = view.ownerCt,
            directoryWindow = directoryGrid.up('window'),
            editorGrid = directoryWindow.getMasterGrid(),
            bidEditorForm = editorGrid.up('BidEditorFormPanel'),
            taskRecord = directoryWindow.getMaterialTaskRecord();
            existIndex = editorGrid.getStore().findBy(function(eRecord){
                if (eRecord.get('material_id') == record.get('id') && eRecord.get('task_id') == taskRecord.get('task_id')) {
                    return true;
                }
                return false;
            });            
    
        var existRecord = editorGrid.getStore().getAt(existIndex);
        
        directoryGrid.getSelectionModel().select(record);
        editorGrid.getSelectionModel().deselectAll();
        
        if (Ext.isEmpty(existRecord) == false) {
            existRecord.set('qty', existRecord.get('qty')+1);
            editorGrid.getSelectionModel().select(existRecord);
        } else {
            var addRecord = editorGrid.getStore().add({
                material_id : record.get('id'),
                name : record.get('name'),
                task_id : taskRecord.get('task_id'),
                task_name : taskRecord.get('name'),
                qty : 1
            });
            editorGrid.getSelectionModel().select(addRecord[0]);
        }
    },
    
    onDeleteTaskItem: function (grid, record) {
        var materialsGrid = grid.up('form').down('#materialsGrid'),
            editorForm = grid.up('BidEditorFormPanel'),
            scrollTop = editorForm.body.dom.scrollTop;
        
        grid.getSelectionModel().select(record);
        
        App.ux.Msg.confirm("Вы действительно хатите выполнить удаление?", function (btn) {
            if (btn == "yes") {
                record.set("removed", 1);
                if (materialsGrid.getStore().getCount()) {
                    var removedMaterials = [];
                    materialsGrid.getStore().each(function(item){
                        if (Ext.isEmpty(item) == false && item.get('task_id') == record.get('task_id')) {
                            item.set('removed', 1);
                            removedMaterials.push(item);
                        }
                    });
                    materialsGrid.getStore().remove(removedMaterials);
                    materialsGrid.getView().refresh();
                }
                
                grid.getStore().remove(record);
                grid.getView().refresh();
                
                //editorForm.body.scroll('top', scrollTop);
            }
        });
    },
    
    onDeleteMaterialItem: function (grid, record) {
        var editorForm = grid.up('BidEditorFormPanel'),
            scrollTop = editorForm.body.dom.scrollTop;
        
        grid.getSelectionModel().select(record);
        App.ux.Msg.confirm("Вы действительно хатите выполнить удаление?", function (btn) {
            if (btn == "yes") {
                record.set("removed", 1);
                grid.getStore().remove(record);
                grid.getView().refresh();
                
                //editorForm.body.scroll('top', scrollTop);
            }
        });
    },
    
    onCulcTasksQty : function(materialsGrid) {
        var mStore =  materialsGrid.getStore(),
            tData = new Array(),
            tRow = null;
            
        mStore.each(function(record, index){
            if (Ext.isEmpty(tRow)) {
                tRow = new Object({task_id : record.get('task_id'), qty : record.get('qty')});
            } else if(tRow.task_id != record.get('task_id')) {
                tData.push(tRow);
                tRow = new Object({task_id : record.get('task_id'), qty : record.get('qty')});  
            } else if(tRow.task_id == record.get('task_id')) {
                tRow.qty = tRow.qty + record.get('qty');   
            }
            
            if (index == mStore.getCount()-1) {
                tData.push(tRow);
            }
        });
        
        if (tData.length) {
            var tasksGrid = materialsGrid.up('BidEditorFormPanel').down('#tasksGrid');
            tasksGrid.getStore().each(function(record){
                if (record.get('countable') == 1 && record.get('need_equipment') == 1) {
                    var findItem = Ext.Array.findBy(tData, function(item){
                        if (item.task_id == record.get('task_id')) {
                            return true;
                        }
                        return false;
                    });
                    if (Ext.isEmpty(findItem) == false) {
                        record.set('qty', findItem.qty);
                    } else {
                        record.set('qty', 1);    
                    }
                }
            });
        }
    }
    
});
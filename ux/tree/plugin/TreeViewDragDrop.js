
Ext.define('App.ux.tree.plugin.TreeViewDragDrop', {
    extend: 'Ext.AbstractPlugin',

    uses: [
        'Ext.tree.ViewDragZone',
        'Ext.tree.ViewDropZone'
    ],
    
    dragText : '{0} selected node{1}',

    allowParentInserts: false,

    allowContainerDrops: false,

    appendOnly: false,

    ddGroup : "TreeDD",

    expandDelay : 1000,

    enableDrop: true,

    enableDrag: true,

    nodeHighlightColor: 'c3daf9',

    nodeHighlightOnDrop: Ext.enableFx,

    nodeHighlightOnRepair: Ext.enableFx,

    init : function(view) {
        view.on('render', this.onViewRender, this, {single: true});
    },

    destroy: function() {
        Ext.destroy(this.dragZone, this.dropZone);
    },

    onViewRender : function(view) {
        var me = this;

        if (me.enableDrag) {
            me.dragZone = new Ext.tree.ViewDragZone({
                view: view,
                ddGroup: me.dragGroup || me.ddGroup,
                dragText: me.dragText,
                repairHighlightColor: me.nodeHighlightColor,
                repairHighlight: me.nodeHighlightOnRepair,
                
                getDragText: function() {
                    var record = this.dragData.records[0];
                    if (me.categoryField) {
                        nodeCategory = record.get(me.categoryField).toLowerCase();
                        if (Ext.Array.contains(me.enableDragCategories, nodeCategory) && record.isLeaf()) {
                            this.valid = true;
                            return Ext.String.format(this.dragText, record.get(me.dragCellField));       
                        } else {
                            this.valid = false;
                            return Ext.String.format('Not drag!');   
                        }
                    }
                    return Ext.String.format(this.dragText, record.get(me.dragCellField));
                }
            });
        }

        if (me.enableDrop) {
            me.dropZone = new Ext.tree.ViewDropZone({
                view: view,
                ddGroup: me.dropGroup || me.ddGroup,
                allowContainerDrops: me.allowContainerDrops,
                appendOnly: me.appendOnly,
                allowParentInserts: me.allowParentInserts,
                expandDelay: me.expandDelay,
                dropHighlightColor: me.nodeHighlightColor,
                dropHighlight: me.nodeHighlightOnDrop,

                isValidDropPoint : function(node, position, dragZone, e, data) {
                    var self = this;

                    if (!node || !data.item) {
                        return false;
                    }
            
                    var view = this.view,
                        targetNode = view.getRecord(node),
                        draggedRecords = data.records,
                        dragRecord = draggedRecords[0],
                        dataLength = draggedRecords.length,
                        ln = draggedRecords.length,
                        i, record;
                        
                    // No drop position, or dragged records: invalid drop point
                    if (!(targetNode && position && dataLength)) {
                        return false;
                    }
            
                    // If the targetNode is within the folder we are dragging
                    for (i = 0; i < ln; i++) {
                        record = draggedRecords[i];
                        if (record.isNode && record.contains(targetNode)) {
                            return false;
                        }
                    }
                    
                    // Respect the allowDrop field on Tree nodes
                    if (position === 'append' && targetNode.get('allowDrop') === false) {
                        return false;
                    }
                    else if (position != 'append' && targetNode.parentNode.get('allowDrop') === false) {
                        return false;
                    }
            
                    // If the target record is in the dragged dataset, then invalid drop
                    if (Ext.Array.contains(draggedRecords, targetNode)) {
                         return false;
                    }

                    if (me.enableDropCategories 
                        && me.enableDragCategories 
                        && me.categoryField) {
                            
                        targetCategory = targetNode.get(me.categoryField).toLowerCase();
                        nodeCategory = dragRecord.get(me.categoryField).toLowerCase();
                        
                        if (dragRecord.isLeaf() 
                            && targetCategory 
                            && nodeCategory 
                            && Ext.Array.contains(me.enableDropCategories, targetCategory)
                            && Ext.Array.contains(me.enableDragCategories, nodeCategory)) {  
  
                            return true;
                        }   
                    }
                    
                    return false;
                },
                
                onNodeOver : function(node, dragZone, e, data) {
                    var position = this.getPosition(e, node),
                        returnCls = this.dropNotAllowed,
                        view = this.view,
                        targetNode = view.getRecord(node),
                        indicator = this.getIndicator(),
                        indicatorX = 0,
                        indicatorY = 0;
                    
                    
                    // auto node expand check
                    this.cancelExpand();
                    if (position == 'append' && !this.expandProcId && !Ext.Array.contains(data.records, targetNode) && !targetNode.isLeaf() && !targetNode.isExpanded()) {
                        this.queueExpand(targetNode);
                    }
                         
                    if (this.isValidDropPoint(node, position, dragZone, e, data)) {
                        this.valid = true;
                        returnCls = Ext.baseCSSPrefix + 'tree-drop-ok';
                        
                        this.currentPosition = position;
                        this.overRecord = targetNode;
            
                        indicator.setWidth(Ext.fly(node).getWidth());
                        indicatorY = Ext.fly(node).getY() - Ext.fly(view.el).getY() - 1;
   
                    } else {
                        this.valid = false;
                        returnCls = this.dropNotAllowed;
                        
                    }
                    this.currentCls = returnCls;
                    return returnCls;
                }
                
            });
        }
    }
});
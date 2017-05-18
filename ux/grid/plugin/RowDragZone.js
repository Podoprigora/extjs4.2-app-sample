Ext.define('App.ux.grid.plugin.RowDragZone', {
    extend : 'Ext.AbstractPlugin',
    
    uses : [
        'Ext.view.DragZone'
    ],
    
    ddGroup : 'GridDD',
    dragCellField : 'name',
    dragText: '<b>{0}</b> selected',
    
    containerScroll: false,
    
    init : function(view) {
        view.on('render', this.onViewRender, this, { single : true });
    },
    
    destroy : function() {
        Ext.destroy(this.dragZone);
    },
    
    enable : function() {
        if (this.dragZone) {
            this.dragZone.unlock();
        }
        this.callParent();
    },
    
    disable : function() {
        if (this.dragZone) {
            this.dragZone.lock();
        }
        this.callParent();    
    },
    
    onViewRender : function(view) {
        var me = this;
        
        if (me.containerScroll) {
            scrollEl = view.getEl();
        }
        
        me.dragZone = new Ext.view.DragZone({
            view : view,
            ddGroup : me.ddGroup,
            dragText: me.dragText,
            containerScroll : me.containerScroll,
            scrollEl: view.getEl(),
            
            getDragData : function(e) {
                var view = this.view,
                    item = e.getTarget(view.getItemSelector()),
                    record = view.getRecord(item),
                    dragEl;
                
                if (item) {
                    
                    e.stopEvent();
                    
                    dragEl = document.createElement('div');
                    dragEl.className = 'x-form-text';
                    dragText = new Ext.XTemplate(me.dragText).apply([record.get(me.dragCellField)]);
                    dragEl.appendChild(document.createTextNode(dragText));

                    return {
                        event: new Ext.EventObjectImpl(e),
                        ddel: dragEl,
                        item: e.target,
                        record: record
                    };
                }
            },
            
            onInitDrag : function(x, y) {
                var self = this,
                    data = self.dragData,
                    view = self.view,
                    selectionModel = view.getSelectionModel(),
                    record = data.record,
                    el = data.ddel;

                // Update the selection to match what would have been selected if the user had
                // done a full click on the target node rather than starting a drag from it.
                if (!selectionModel.isSelected(record)) {
                    selectionModel.select(record, true);
                }

                self.ddel.update(el.textContent || el.innerText);
                self.proxy.update(self.ddel.dom);
                self.onStartDrag(x, y);
                return true;
            }
        });   
    }
    
});
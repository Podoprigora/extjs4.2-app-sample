
Ext.define('App.ux.grid.plugin.CellDropZone', {
    extend : 'Ext.AbstractPlugin',
    
    mixins : {
        observable : 'Ext.util.Observable'
    },
    
    ddGroup : 'GridDD',
    
    dropBgColor : '#D3E8A3',
    noDropBgColor : '#FDD0D0',
    
    dropColumnName : null,
    
    containerScroll: false,
    
    constructor : function(config) {
        var me = this;
        Ext.apply(me, config);
        
        me.addEvents('celldrop');
        
        me.mixins.observable.constructor.call(me);
    },
    
    init : function(view) {
        view.on('render', this.onViewRender, this, { single : true });
    },
    
    destroy : function() {
        Ext.destroy(this.dropZone);
    },
    
    enable : function() {
        if (this.dropZone) {
            this.dropZone.unlock();
        }
        this.callParent();
    },
    
    disable : function() {
        if (this.dropZone) {
            this.dropZone.lock();
        }
        this.callParent();    
    },
    
    onViewRender : function(view) {
        var me = this;
        
        me.dropZone = new Ext.dd.DropZone(view.el, {
            view : view,
            ddGroup : me.ddGroup,
            containerScroll : true,
            
            getTargetFromEvent : function(e) {
                var self = this,
                    view = self.view,
                    cell = e.getTarget(view.cellSelector);
  
                if (cell) {
                    var row = view.findItemByChild(cell),
                        columnIndex = cell.cellIndex;
                    if (row && Ext.isDefined(columnIndex)) {
                        return {
                            node : cell,
                            record : view.getRecord(row),
                            fieldName : self.view.up('grid').columns[columnIndex].dataIndex
                        };
                    }
                }
            },
            
            onNodeEnter : function(target, dd, e, dragData) {
                var self = this;
                
                delete self.deleteOK;

                if (Ext.isEmpty(me.dropColumnName) == false 
                    && target.fieldName != me.dropColumnName) {
                    
                    self.dropOK = false;
                    Ext.fly(target.node).applyStyles({
                        backgroundColor : me.noDropBgColor,
                        border : '1px dotted red'
                    });
                    return;
                }
                
                self.dropOK = true;
                Ext.fly(target.node).applyStyles({
                    backgroundColor : me.dropBgColor,
                    border : '1px dotted green'
                });
            },
            
            onNodeOver : function(target, dd, e, dragData) {
                return this.dropOK ? this.dropAllowed : this.dropNotAllowed;    
            },
            
            onNodeOut : function(target, dd, e, dragData) {
                Ext.fly(target.node).applyStyles({
                    backgroundColor : '',
                    border : ''
                });
            },
            
            onNodeDrop : function(target, dd, e, dragData) {
                if (this.dropOK) {
                    //me.onCellDrop(target, dd, e, dragData);
                    me.fireEvent('celldrop', target.record, dragData.record);
                    return true;
                }
            }
        });
    }
    
});

Ext.define('App.ux.dd.CellFieldDropZone', {
    extend: 'Ext.dd.DropZone',

    constructor: function(cfg){
        cfg = cfg || {};
        if (cfg.onCellDrop) {
            this.onCellDrop = cfg.onCellDrop;
        }
    },

//  Call the DropZone constructor using the View's scrolling element
//  only after the grid has been rendered.
    init: function(grid) {
        var me = this;
        console.log('init');
        if (grid.rendered) {
            me.grid = grid;
            grid.getView().on({
                render: function(v) {
                    me.view = v;
                    App.ux.dd.CellFieldDropZone.superclass.constructor.call(me, me.view.el);
                },
                single: true
            });
        } else {
            grid.on('render', me.init, me, {single: true});
        }
    },

//  Scroll the main configured Element when we drag close to the edge
    containerScroll: true,

    getTargetFromEvent: function(e) {
        var me = this,
            v = me.view;

//      Ascertain whether the mousemove is within a grid cell
        var cell = e.getTarget(v.cellSelector);
        if (cell) {

//          We *are* within a grid cell, so ask the View exactly which one,
//          Extract data from the Model to create a target object for
//          processing in subsequent onNodeXXXX methods. Note that the target does
//          not have to be a DOM element. It can be whatever the noNodeXXX methods are
//          programmed to expect.
            var row = v.findItemByChild(cell),
                columnIndex = cell.cellIndex;

            if (row && Ext.isDefined(columnIndex)) {
                return {
                    node: cell,
                    record: v.getRecord(row),
                    fieldName: me.grid.columns[columnIndex].dataIndex
                };
            }
        }
    },

//  On Node enter, see if it is valid for us to drop the field on that type of column.
    onNodeEnter: function(target, dd, e, dragData) {
        console.log('enter');
        delete this.dropOK;
        if (!target) {
            return;
        }

//      Check that a field is being dragged.
        var f = dragData.field;
        if (!f) {
            return;
        }

//      Check whether the data type of the column being dropped on accepts the
//      dragged field type. If so, set dropOK flag, and highlight the target node.
        var type = target.record.fields.get(target.fieldName).type,
            types = Ext.data.Types;
        switch(type){
            case types.FLOAT:
            case types.INT:
                if (!f.isXType('numberfield')) {
                    return;
                }
                break;
            case types.DATE:
                if (!f.isXType('datefield')) {
                    return;
                }
                break;
            case types.BOOL:
                if (!f.isXType('checkbox')) {
                    return;
                }
        }
        this.dropOK = true;
        Ext.fly(target.node).addCls('x-drop-target-active');
    },

//  Return the class name to add to the drag proxy. This provides a visual indication
//  of drop allowed or not allowed.
    onNodeOver: function(target, dd, e, dragData) {
        console.log('over');
        return this.dropOK ? this.dropAllowed : this.dropNotAllowed;
    },

//  highlight the target node.
    onNodeOut: function(target, dd, e, dragData) {
        console.log('out');
        Ext.fly(target.node).removeCls('x-drop-target-active');
    },

//  Process the drop event if we have previously ascertained that a drop is OK.
    onNodeDrop: function(target, dd, e, dragData) {
        console.log('drop');
        if (this.dropOK) {
            var value = dragData.field.getValue();
            target.record.set(target.fieldName, value);
            this.onCellDrop(target.fieldName, value);
            return true;
        }
    },
    
    onCellDrop: Ext.emptyFn
});
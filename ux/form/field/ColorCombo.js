
Ext.define('App.ux.form.field.ColorCombo', {
    extend : 'Ext.form.field.ComboBox',
    alias : 'widget.uxColorCombo',
    
    valueField : 'type',
    displayField : 'color',
    mode : 'local',
    queryMode : 'local',
    editable : false,
    triggerAction : 'all',
    typeAhead : false,
    selectOnFocus : true,
    listConfig: {
        maxHeight : 250,
        getInnerTpl : function() {
            return '<div class="x-row-status{type}">&nbsp;</div>';
        }
    },
    
    initComponent : function() {
        
        this.store = Ext.create('Ext.data.ArrayStore', {
            fields : ['type', 'color'],
            data : [
                ['1', ''],
                ['2', ''],
                ['3', ''],
                ['4', ''],
                ['5', ''],
                ['6', ''],
                ['7', ''],
                ['8', ''],
                ['9', ''],
                ['10', ''],
                ['11', ''],
                ['12', ''],
                ['13', '']
            ] 
        });
        
        this.callParent(arguments);
        
        this.on('change', function(field, newValue, oldValue){
            field.removeCls("x-field-status" + oldValue);
            field.addCls("x-field-status" + newValue);
        });
    }
});
Ext.define("App.ux.form.field.GroupingCombo", {
    extend : "App.ux.form.field.Combo",
    alias : "widget.uxGroupingCombo",
    
    editable : false,
    groupField : 'group',
    listConfig: {
        cls: 'grouped-list'
    },
    
    initComponent : function() {
        this.tpl = this.buildTpl();
        this.callParent(arguments);
    },
    
    buildTpl : function() {
        return Ext.create('Ext.XTemplate',
            '{[this.currentGroup = null]}' +
            '<tpl for=".">',
            '<tpl if="this.shouldShowHeader(' + this.groupField + ')">' +
                '<div class="group-header">{[this.showHeader(values["' + this.groupField + '"])]}</div>' +
            '</tpl>' +
            '<div class="x-boundlist-item">{name}</div>',
            '</tpl>',
            {
                shouldShowHeader: function(group){
                    return this.currentGroup != group;
                },
                showHeader: function(group){
                    this.currentGroup = group;
                    return group;
                }
        }); 
    }
});
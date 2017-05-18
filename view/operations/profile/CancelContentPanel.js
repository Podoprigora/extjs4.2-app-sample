Ext.define("App.view.operations.profile.CancelContentPanel", {
    extend : "App.view.operations.profile.BasicContentPanel",
    alias : "widget.OperationCancelProfileContentPanel",
    
    initComponent: function () {
        this.callParent(arguments)
    },
    
    buildItems: function() {
        return [
            {
                xtype : 'container'  
            },
            {
                layout : 'anchor',
                defaults : {
                    anchor : '100%'
                },
                minWidth : App.Properties.get('minViewWidth'),
                bodyPadding: '15 5 0 5',
                items : [
                    this.buildFormPanel(),
                    this.buildMaterialsGrid(),
                    this.buildCommentField(),
                    this.buildFilesGrid()
                ]   
            },
            {
                xtype : 'container'   
            }
        ]; 
    },
    
    buildMaterialsGrid: function () {
        return {
            title: "Материалы",
            xtype: "OperationIssueMaterialsEditorGridPanel",
            itemId: "materialsGrid",
            ui: "in-form",
            autoHeight: true,
            minHeight: 150,
            readOnly: this.readOnly
        }
    },
    
    buildCommentField : function() {
        return {
            title: "Причина списания",
            ui: "in-form",
            bodyCls : 'x-container-body',
            layout : 'anchor',
            margin: "10 0 -8 0",
            border : false,
            autoHeight : true,
            items : [
                {
                    xtype : 'textarea',
                    name : 'comments',
                    emptyText : 'Введите причину списания материалов',
                    anchor : '100%',
                    height : 60
                }
            ]
        }    
    }
    
});
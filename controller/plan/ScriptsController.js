Ext.define('App.controller.plan.ScriptsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'plan.ScriptModel'
    ],
    
    stores : [
        'plan.ScriptRuleTriggersLocalStore',
        'plan.ScriptRuleActionsLocalStore',
        'plan.ScriptRulesLocalStore',
        'plan.ScriptsStore'
    ],
    
    views : [
        'plan.scripts.RulesGridPanel',
        'plan.scripts.EditorWindow',
        'plan.scripts.ListField',
        'plan.scripts.GridPanel'   
    ],
    
    init : function() {
        
        this.control({
            'PlanScriptsGridPanel' : {
                createbtnclick: this.onShowEditorWindow,
                editbtnclick : this.onLoadItem,
                copybtnclick : this.onCopyItem,
                itemdblclick : function(view){
                    this.onLoadItem(view.ownerCt);
                },
                deletebtnclick: Ext.bind(App.ux.controller.BaseMethods.onDelete, this)
            },
            'PlanScriptEditorWindow' : {
                applyrulebtnclick : this.onApplyRuleBtnClick,
                cleanrulebtnclick : this.onCleanRuleBtnClick,
                savebtnclick : this.onSaveBtnClick
            },
            'PlanScriptRulesGridPanel' : {
                edititemclick : this.onEditRuleItemClick,
                deleteitemclick : this.onDeleteRuleItemClick
            }
        });
    },
    
    onShowEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create("PlanScriptEditorWindow");
        win.show();
        win.setTitle('Добавить скрипт');
        win.setMasterGrid(grid);
        return win;
    },
    
    onApplyRuleBtnClick : function(win){
        var ruleForm = win.down('#ruleForm'),
            ruleGrid = win.down('#rulesList'),
            record = Ext.create('App.model.plan.ScriptRuleModel');
        
        if (ruleForm.getForm().isValid()) {
            
            var editRecord = ruleForm.getRecord();
            if (Ext.isEmpty(editRecord) == false) {
                editRecord.set(ruleForm.getForm().getFieldValues());        
            } else {
                record.set(ruleForm.getForm().getFieldValues());
                ruleGrid.getStore().add(record);
            }
            ruleForm.getForm().reset(); 
        }
    },
    
    onCleanRuleBtnClick : function(win){
        var ruleForm = win.down('#ruleForm');
        
        ruleForm.getForm().reset();
    },
    
    onEditRuleItemClick : function(grid, record) {
        var ruleForm = grid.up('form').down('#ruleForm');
        grid.getSelectionModel().select(record);
        
        ruleForm.getForm().loadRecord(record);
    },
    
    onDeleteRuleItemClick : function(grid, record) {
        grid.getSelectionModel().select(record);
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes'){
                record.destroy();
                grid.getView().refresh();
            }
        });    
    },
    
    onLoadItem : function(grid) {
        var selRecord = grid.getSelectionModel().getSelection()[0];
        if (Ext.isEmpty(selRecord) == false) {
            
            var win = this.onShowEditorWindow(grid),
                form = win.down('form'),
                basicForm = form.getForm(),
                rulesGrid = form.down('#rulesList');
                
            win.setTitle('Изменить параметры скрипта');
            form.el.mask('Загрузка ...');
            
            this.getModel('plan.ScriptModel').load(selRecord.get('id'), {
                success : function(record, operation){
                    form.el.unmask();
                    basicForm.loadRecord(record);
                    rulesGrid.getStore().add(record.get('rules'));
                },
                failure : function() {
                    form.el.unmask();
                    win.hide();
                }
            });
        }
    
    },
    
    onCopyItem : function(grid) {
        var selRecord = grid.getSelectionModel().getSelection()[0];
        if (Ext.isEmpty(selRecord) == false) {
            
            var win = this.onShowEditorWindow(grid),
                form = win.down('form'),
                basicForm = form.getForm(),
                rulesGrid = form.down('#rulesList');

            form.el.mask('Загрузка ...');
            
            this.getModel('plan.ScriptModel').load(selRecord.get('id'), {
                success : function(record, operation){
                    form.el.unmask();
                    rulesGrid.getStore().add(record.get('rules'));
                },
                failure : function() {
                    form.el.unmask();
                    win.hide();
                }
            });
        }
    },
    
    onSaveBtnClick : function(win, mode){
        var form = win.down('form'),
            rulesGrid = win.down('#rulesList'),
            model = Ext.create('App.model.plan.ScriptModel');
            
        model.set(form.getForm().getFieldValues());
        model.setAssociationData('rules', rulesGrid.getStore().getRawData());
        
        if (Ext.isEmpty(model.get('rules'))) {
            App.ux.Msg.alert("Необходимо добавить правила!");
            return false;
        }
        
        if (model.isValid()) {
            
            form.el.mask('Сохранение ...');
            
            model.save({
                success : function(record, operation){
                    if (Ext.isEmpty(mode) == false && mode == "close") {
                        win.hide()
                    } else {
                        form.getForm().reset();
                        form.down('#rulesList').getStore().removeAll();
                        form.getForm().findField("name").focus(false, 50)
                    }
                    win.getMasterGrid().onRefresh();      
                },
                failure : function(record, operation){
                    form.getForm().markInvalid(operation.request.scope.reader.jsonData.errors);
                },
                callback : function() {
                    form.el.unmask();   
                }
            });
        } else {
            form.getForm().markInvalid(model.validate());
        }
    }
});
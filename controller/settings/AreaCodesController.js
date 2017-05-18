Ext.define('App.controller.settings.AreaCodesController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'settings.area_codes.CodeModel',
        'settings.area_codes.CodeUserModel'
    ],
    
    stores : [
        'settings.area_codes.CodesStore',
        'settings.area_codes.CodesTreeStore',
        'settings.area_codes.CodeUsersStore'
    ],
    
    views : [
        'settings.area_codes.ListField',
        'settings.area_codes.EditorWindow',
        'settings.area_codes.TreePanel',
        'settings.area_codes.UsersEditorGrid',
        'settings.area_codes.UsersEditorWindow'
    ],
    
    init : function() {

        this.control({
            'AreaCodesTreePanel' : {
                createbtnclick : this.onShowCodeEditorWindow,
                createitemclick : this.onClickCreateCodeItem,
                useritemclick : this.onClickUserItem,
                deletebtnclick : this.onDeleteCode,
                usereditoritemclick : this.onShowUserEditorWindow
            },
            'AreaCodeEditorWindow' : {
                savebtnclick : this.onSaveCode
            },
            'AreaCodeUserEditorWindow' : {
                savebtnclick : this.onSaveCodeUsers,
                adduser : this.onAddCodeUser
            },
            'AreaCodeUsersEditorGrid' : {
                deleteitemclick : this.onDeleteCodeUser
            }
        });
        
    },
    
    onShowUserEditorWindow : function(view, rowIndex, colIndex, item, e, record) {
        var win = App.ux.window.Manager.create('AreaCodeUserEditorWindow');
        win.setMasterTree(view.ownerCt);
        win.show();
        win.setTitle(Ext.String.format("Код: {0}, привязка пользователей", record.get('code')));
        win.down('form').getForm().loadRecord(record);
        win.down('#usersGrid').getStore().loadRecords(record.getUsers().getRange());
    },
    
    onSaveCodeUsers : function(win) {
        var grid = win.down('#usersGrid'),
            records = grid.getStore().getModifiedData();
        
        if (records.length) {
            grid.el.mask('Сохранение ...');
            Ext.Ajax.request({
                url : Settings.urls.getUrl('settings.area_codes.users.save'),
                params : {records : Ext.encode(records)},
                success : function() {
                    var form = win.down('form'),
                        selectedNode = form.getForm().getRecord(),
                        masterTree = win.getMasterTree();
                    masterTree.getStore().load({
                        node : selectedNode.parentNode
                    });
                    win.hide();
                },
                callback : function() {
                    grid.el.unmask();
                }
            });
        }
    },
    
    onAddCodeUser : function(win, record) {
        var grid = win.down('#usersGrid'),
            form = win.down('form'),
            codeUserRecord = Ext.create('App.model.settings.area_codes.CodeUserModel', record.getData());
        
        
        if (Ext.isEmpty(grid.getStore().findRecord('user_id', record.get('id')))) {
            codeUserRecord.set('id', 0);
            codeUserRecord.set('user_id', record.get('id'));
            codeUserRecord.set('code_id', form.getForm().getRecord().get('id'));
            codeUserRecord.setDirty();
        
            grid.getStore().add(codeUserRecord);
        }
    },
    
    onDeleteCodeUser : function(view, rowIndex, colIndex, item, e, record){
        App.ux.Msg.confirm('Вы действительно хотите выполнить удаление?', function(btn){
            if (btn == 'yes') {
                record.set('removed', 1);
                view.getStore().remove(record);
            }
        });
    },
    
    onClickCreateCodeItem : function(view, rowIndex, colIndex, item, e, node) {
        var me = this,
            showEditor = function() {
                var win = me.onShowCodeEditorWindow(view.ownerCt, node);
                var basicForm = win.down('form').getForm();
                basicForm.findField('parent_code').setValue(node.get('code'));
                basicForm.findField('parent_id').setValue(node.get('id'));
            };
        
        if(! node.isLoaded()) {
            node.expand(false, function(){
                Ext.defer(showEditor, 200);   
            });
        } else {
            showEditor();
        }
    },
    
    onShowCodeEditorWindow : function(tree, node) {
        var win = App.ux.window.Manager.create('AreaCodeEditorWindow');
        win.setMasterGrid(tree);
        win.show();
        return win;
    },
    
    onSaveCode : function(win, mode) {
        var form = win.down('form'),
            basicForm = form.getForm(),
            model = Ext.create('App.model.settings.area_codes.CodeModel');
            
        if (basicForm.isValid()) {
            model.set(basicForm.getFieldValues());
            
            form.el.mask('Сохранение ...');
            
            model.save({
                success : function(record, operation){
                    var tree = win.getMasterGrid(),
                        selNode = tree.getSelectionModel().getSelection()[0];
                    if (Ext.isEmpty(selNode) == false) {
                        selNode.set('leaf', false);
                        tree.getStore().load({
                            node : selNode, 
                            callback : function(){ 
                                selNode.expand(); 
                            }
                        });    
                    } else {
                        tree.getStore().load();    
                    }
                    
                    if (mode && mode == 'close') {
                        win.hide();
                    } else {
                        basicForm.findField('code').reset();
                        basicForm.findField('code').focus(false, 200);
                    }
                },
                failure : function(record, operation) {
                    basicForm.markInvalid(operation.request.scope.reader.jsonData.errors);
                },
                callback : function() {
                    form.el.unmask();
                }
            });
        }
    },
    
    onDeleteCode : function(tree) {
        var node = tree.getSelectionModel().getSelection()[0],
            parentNode = node.parentNode;
            
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                tree.el.mask('Удаление ...');
                
                Ext.Ajax.request({
                    url : node.getProxy().api.destroy,
                    params : {records : Ext.encode([{id : node.get('id')}])},
                    success : function(response) {
                        if ((response = App.ux.util.Response.isValidStatus(response))) {
                            tree.getSelectionModel().deselectAll();
                            tree.getStore().load({node : parentNode});  
                        }
                    },
                    callback : function() {
                        tree.el.unmask();      
                    }
                });
            } 
        });
    },
    
    onClickUserItem : function(grid, record, userId) {
        var codeUserRecord = record.getUsers().findRecord('user_id', userId);
        if (Ext.isEmpty(codeUserRecord) == false) {
            this.getController('settings.UsersController').onCreateEditorUserTab(grid, Ext.create('App.model.settings.users.UserModel', {
                id : codeUserRecord.get('user_id'),
                first_name : codeUserRecord.get('first_name'),
                last_name : codeUserRecord.get('last_name'),
                patronymic : codeUserRecord.get('patronymic')
            }));
        }
    }
    
    /*
    onCreateCodeItemClick : function(view, rowIndex, colIndex, item, e, node) {
        var win = App.ux.window.Manager.create('AreaCodeEditorWindow');
        win.setMasterTree(view.ownerCt);
        win.show();
        
        var form = win.down('form'),
            basicForm = form.getForm(),
            parentCode = node.get('code');
        
        if (parentCode%100 > 0) {
            win.hide();
            return false;
        }
        
        basicForm.findField('parent_id').setValue(node.get('id'));
        if (node.isRoot()) {
            form.down('#codeContainer').add(
                {
                    xtype : 'textfield',
                    name : 'r_code',
                    hidden : true
                },
                {
                    xtype : 'textfield',
                    name : 'b_code',
                    allowBlank : false,
                    maxLength : 7,
                    minLength : 7,
                    width : 100
                }
            );
        } else {
            var rValue = String(parentCode).replace(/0+$/, ""),
                bValue = String(parentCode).match(/0+$/)[0];
            
            form.down('#codeContainer').add(
                {
                    xtype : 'textfield',
                    name : 'r_code',
                    grow : true,
                    growMin : 20,
                    minWidth : 20,
                    readOnly : true,
                    value : rValue
                },
                {
                    xtype : 'textfield',
                    name : 'b_code',
                    allowBlank : false,
                    width : 100,
                    maxLength : bValue.length,
                    minLength : bValue.length,
                    value : bValue
                }
            );
        }

        Ext.defer(function(){
            basicForm.findField('b_code').focus(false, 50);    
        }, 200);
    },*/
 
});
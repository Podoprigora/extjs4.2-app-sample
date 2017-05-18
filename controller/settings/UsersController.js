Ext.define('App.controller.settings.UsersController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'settings.users.AvailableWarehouseModel',    
    
        'settings.users.AreaCodeModel',
        'settings.users.AccessAreaModel',
        'settings.users.UserModel'
    ],
    
    stores : [
        'settings.users.AvailableWarehousesStore',    
        'settings.users.StatusesLocalTreeStore',
        'settings.users.StatusesLocalStore',
        'settings.users.AreaCodesLocalStore',
        'settings.users.AreaCodesStore',
        'settings.users.AccessAreasLocalStore',
        'settings.users.AccessAreasStore',
        'settings.users.PerformersStore',
        'settings.users.UsersStore'
    ],
    
    views : [
        'settings.users.AvailableWarehousesListField',
        
        'settings.users.AreaCodesEditorGridPanel',
        'settings.users.AccessAreasEditorGridPanel',
        'settings.users.EditorFormPanel',
        'settings.users.ListField',
        'settings.users.AccessAreasGridPanel',
        'settings.users.AreaCodesGridPanel',
        'settings.users.FiltersFormPanel',
        'settings.users.GridPanel',
        'settings.users.ContentPanel'     
    ],
    
    refs : [
        {
            ref : 'GridPanel',
            selector : 'UsersGridPanel'
        }
    ],
    
    init : function() {
        
        this.control({
            'UsersContentPanel' : {
                initpanel : this.onLoadUsers,
                afterrender : this.onLoadUsers,
                show : this.onRefreshUsersGrid
            },
            'UserAccessAreasEditorGridPanel' : {
                createbtnclick : this.onCreateAccessAreaItem,
                deletebtnclick : this.onDeleteAccessAreaItem
            },
            'UserAreaCodesEditorGridPanel' : {
                selectfromdirectory : this.onAddAreaCode,
                deletebtnclick : this.onDeleteAreaCodeItem    
            },
            'UserEditorFormPanel' : {
                changerolefield : this.onChangeUserRoleField,
                savebtnclick : this.onSaveUser,
                cancelbtnclick : this.onCloseEditorUserTab
            },
            'UsersGridPanel' : {
                createbtnclick : this.onCreateNewUserTab,
                editbtnclick : this.onCreateEditorUserTab,
                itemdblclick : function(view) {
                    this.onCreateEditorUserTab(view.ownerCt);
                },
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                lockbtnclick : Ext.bind(this.setActiveUserState, this, ["lock"], 1),
                restorebtnclick : Ext.bind(this.setActiveUserState, this, ["restore"], 1),
                selectionchange : this.onSelectionChangeUsers,
                setfilter : this.onFiltersUsers
            }
        });
        
    },
    
    onLoadUsers : function(panel) {
        panel.down('UsersGridPanel').getStore().load();
    },
    
    onRefreshUsersGrid : function(panel) {
        panel.down('UsersGridPanel').getView().refresh();
    },
    
    onChangeUserRoleField : function(form, value) {
        if (value) {
            var areaCodesGrid = form.down('#areaCodesGrid');
            areaCodesGrid.down('form').setDisabled(false);
            areaCodesGrid.down('form').getForm().findField('user_role').setValue(value);
        }
    },
    
    onAddAreaCode : function(grid, record) {
        var userCodeModel = Ext.create('App.model.settings.users.AreaCodeModel'),
            existRecord = grid.getStore().findRecord('code', record.get('code'));
            
        if (Ext.isEmpty(existRecord) == false) {
            return false;
        }
        
        userCodeModel.set('code_id', record.get('id'));
        userCodeModel.set('code', record.get('code'));
        
        grid.getStore().add(userCodeModel);
    },
    
    onDeleteAreaCodeItem : function(grid, rowIndex, colIndex, item, e, record) {
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                record.set('removed', 1);
                grid.getStore().remove(record);
                grid.getView().refresh();
            }
        });    
    },
    
    onCreateAccessAreaItem : function(grid) {
        var form = grid.down("form"),
            basicForm = form.getForm(),
            model = Ext.create('App.model.settings.users.AccessAreaModel'),
            existRecord = false;
            
        if (form.getForm().isValid()) {
                    
            model.set(basicForm.getFieldValues());
            
            model.set('region', basicForm.findField('region_id').getRawValue());
            model.set('city', basicForm.findField('city_id').getRawValue());
            model.set('warehouse', basicForm.findField('warehouse_id').getRawValue());
            model.set('warehouse_id', basicForm.findField('warehouse_id').getValue());
            
            grid.getStore().each(function(item, index){
                if (item.get('region_id') == model.get('region_id') 
                    && item.get('city_id') == model.get('city_id')
                    && item.get('warehouse_id') == model.get('warehouse_id')) {
                    
                    existRecord = true;
                }
            });
            
            if (existRecord) {
                App.ux.Msg.alert("Запись уже существует!");
                return false;
            }
            
            grid.getStore().add(model);
            
            basicForm.reset();
            basicForm.findField('city_id').setDisabled(true);
            basicForm.findField('warehouse_id').setDisabled(true);
            
            grid.getView().refresh();
        } 
    },
    
    onDeleteAccessAreaItem : function(grid, rowIndex, colIndex, item, e, record) {
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                record.set('removed', 1);
                grid.getStore().remove(record);
                grid.getView().refresh();
            }
        });       
    },
    
    onSaveUser : function(panel, mode) {
        var basicForm = panel.down('#userForm').getForm(),
            accessAreasGrid = panel.down('#accessAreasGrid'),
            areaCodesGrid = panel.down('#areaCodesGrid'),
            tabPanel = panel.up('uxTabPanel'),
            record = Ext.create('App.model.settings.users.UserModel'),
            me = this;
        
        if (basicForm.isValid()) {
            record.set(basicForm.getFieldValues());
            record.setAssociationData('access_areas', accessAreasGrid.getStore().getModifiedData());
            record.setAssociationData('area_codes', areaCodesGrid.getStore().getModifiedData());
            
            panel.el.mask('Сохранение ...');
            
            record.save({
                success : function(record) {
                    var usersGrid = tabPanel.down('UsersGridPanel'),
                        areaCodesGrid = tabPanel.down('AreaCodesGridPanel');

                    tabPanel.remove(panel);
                    if (usersGrid) {
                        usersGrid.onRefresh();
                    } 
                    if (areaCodesGrid) {
                        areaCodesGrid.onRefresh();
                    }
                    
                    if (Ext.isEmpty(mode)) {
                        me.onCreateNewUserTab(usersGrid);
                    }
                },
                failure : function(record, operation) {
                    panel.el.unmask(); 
                    basicForm.markInvalid(operation.request.scope.reader.jsonData.errors);                
                }
            });
        }
    },
    
    onCreateNewUserTab : function(grid) {
        var tabPanel = grid.up('uxTabPanel'),
            form = tabPanel.down('#newUserForm');
        
        if (Ext.isEmpty(form)) {
            form = tabPanel.add({
                xtype : 'UserEditorFormPanel',
                itemId : 'newUserForm',
                title : 'Новый пользователь',
                iconCls : 'icon-create-gray'
            });
        }
        tabPanel.setActiveTab(form);
        form.down('#userForm').getForm().findField('last_name').focus(false, 200);
        return form;
    },
    
    onCreateEditorUserTab : function(grid, record) {
        var tabPanel = grid.up('uxTabPanel'),
            record = record || grid.getSelectionModel().getSelection()[0],
            form = tabPanel.down(Ext.String.format("panel[userId={0}]", record.get('id')));
        
        if (Ext.isEmpty(form)) {
            form = tabPanel.add({
                xtype : 'UserEditorFormPanel',
                userId : record.get('id'),
                title  : Ext.String.ellipsis(record.get('fio'), 25),
                tooltip : record.get('fio'),
                iconCls : 'icon-edit'
            });
        }
        tabPanel.setActiveTab(form);
        
        form.el.mask('Загрузка ...');
        this.getModel('settings.users.UserModel').load(record.get('id'), {
            success : function(record) {
                form.down('#userForm').getForm().loadRecord(record);
                form.down('#accessAreasGrid').getStore().loadRecords(record.getAccessAreas().getRange());
                form.down('#areaCodesGrid').getStore().loadRecords(record.getAreaCodes().getRange());
            },
            failure : function() {
                tabPanel.remove(form);
            },
            callback : function() {
                form.el.unmask();
            }
        });
    },
    
    onCloseEditorUserTab : function(form) {
        form.up('uxTabPanel').remove(form); 
    },
    
    setActiveUserState : function(grid, type) {
        var selModel = grid.getSelectionModel();
        if (selModel.getCount()) {
            var msg = Ext.String.format("Вы действительно хотите {0} выбранных пользователей?", ((type == 'lock' ? 'заблокировать' : 'активировать')));
            App.ux.Msg.confirm(msg, function(btn){
                if (btn == 'yes') {
                    grid.up('panel').el.mask("Пожалуйста подождите ...");
                    Ext.Ajax.request({
                        url : Settings.urls.getUrl('settings.users.change_state'),
                        method : 'POST',
                        params : {
                            records : Ext.encode({
                                type : type, 
                                ids : App.ux.util.Format.convertRecordsToIdsArray(selModel.getSelection()) 
                            })
                        },
                        success : function(response, operation) {
                            grid.up('panel').el.unmask(); 
                            if (App.ux.util.Response.isValidStatus(response)) {
                                grid.onRefresh();
                            }
                        },
                        failure : function() {
                            grid.up('panel').el.unmask(); 
                        }
                    });       
                }
            });
        }
    },
    
    onSelectionChangeUsers : function(selModel, records) {
        var grid = selModel.view.ownerCt,
            accessGrid = grid.up('UsersContentPanel').down("#accessAreasGrid"),
            codesGrid = grid.up('UsersContentPanel').down("#areaCodesGrid"),
            record = records[0];

        accessGrid.setDisabled(records.length != 1);
        codesGrid.setDisabled(records.length != 1);
        if (record) {
            accessGrid.getStore().addFilter('user_id', record.get('id'));
            codesGrid.getStore().addFilter('user_id', record.get('id'));
        } else {
            accessGrid.getStore().removeAll();
            codesGrid.getStore().removeAll();
        }
        
    },
    
    onFiltersUsers : function(grid, filter) {
        if (Ext.isEmpty(filter) == false) {
            if (Ext.isArray(filter)) {
                Ext.Array.forEach(filter, function(item){
                    grid.getStore().setFilter(item.property, item.value);
                });
                grid.getStore().loadPage(1);
            } else if(Ext.isObject(filter)) {
                grid.getStore().addFilter(filter.property, filter.value);
            }
        }
    }
    
});
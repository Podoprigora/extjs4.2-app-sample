Ext.define('App.controller.MessagesController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'messages.RecipientModel',
        'messages.MessageModel'
    ],
    
    stores : [
        'messages.TypesLocalStore',
        'messages.RecipientsStore',
        'messages.HistoryLocalStore',
        'messages.MessagesStore'
    ],
    
    views : [
        'messages.RecipientsListField',
        'messages.HistoryViewPanel',
        'messages.EditorPanel',
        'messages.EditorWindow',
        'messages.GridPanel',
        'messages.ContentPanel'   
    ],
    
    refs : [
        {
            ref : 'GridPanel',
            selector : 'MessagesGridPanel'
        }
    ],
    
    init : function() {
        
        this.control({
            'MessagesContentPanel' : {
                panelready : this.onInitContentPanel,
                afterrender : this.onRunTaskUpdateUnreadCounter
            },
            'MessagesGridPanel' : {
                createbtnclick : this.onShowEditorWindow,
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                itemclick : this.onGridItemClick,
                selectionchange : this.onGridSelectionChange,
                setfilter : this.onFilters
            },
            'MessageEditorWindow' : {
                savebtnclick : this.onCreateBranchMessage
            },
            'MessageEditorPanel' : {
                savebtnclick : this.onUpdateMessage
            }
        });
    },
    
    onRunTaskUpdateUnreadCounter : function(panel) {
        var me = this;
        
        Ext.TaskManager.start({
            scope : this,
            run : this.updateUnreadCounter,
            interval : 120000
        });
    },
    
    updateUnreadCounter : function() {
       var workspacePanel = Ext.getCmp('WorkspaceContentPanel'),
            messageMenuBtn = workspacePanel.down("#btnMessages"),
            messagesGrid = this.getGridPanel();
        
        if (messageMenuBtn.isVisible() == false) {
            return false;
        }
            
        Ext.Ajax.request({
            url : Settings.urls.getUrl('messages.get_unread_couner'),
            success : function(response) {
                var response = Ext.decode(response.responseText);
                if (Ext.isEmpty(response) == false && Ext.isEmpty(response.count) == false) {
                    if (parseInt(response.count) > 0) {
                        var selected = messagesGrid.getSelectionModel().getSelection();
                        if (messageMenuBtn.unreadCounter != response.count) {
                            if (Ext.isEmpty(selected)) {
                                messagesGrid.getSelectionModel().deselectAll();    
                            }
                            messagesGrid.getStore().load();
                        }
                        messageMenuBtn.setText(Ext.String.format('<span class="number">{0}</span>', response.count));
                        messageMenuBtn.unreadCounter = response.count;
                    } else {
                        messageMenuBtn.setText('');
                        messageMenuBtn.unreadCounter = 0;
                    }
                    
                }
            }
        });  
    },
    
    onInitContentPanel : function(panel) {
        panel.down('MessagesGridPanel').getStore().load();
    },
    
    onGridSelectionChange : function(selModel, records) {
        var editorPanel = selModel.view.up('MessagesContentPanel').down('MessageEditorPanel');
        if (records.length == 0) {
            editorPanel.setInactive(true);   
        }  
    },
    
    onGridItemClick : function(view, record) {
        var grid = view.ownerCt,
            editorPanel = grid.up('MessagesContentPanel').down('MessageEditorPanel');
        
        if (Ext.isEmpty(record) == false) {
            this.loadMessage(editorPanel, record);

            if (record.get('unread_count') > 0) {
                record.set('unread_count', 0);
                grid.getView().refresh();
                this.updateUnreadCounter();
            }
        }   
    },
    
    loadMessage : function(panel, record) {
        panel.setInactive(true);
        App.model.messages.MessageModel.load(record.get('parent_id'), {
            success : function(record) {
                panel.setInactive(false);
                
                var basicForm = panel.down('#newMessageForm').getForm(); 
                basicForm.loadRecord(record);
                
                panel.down('MessagesHistoryViewPanel').getStore().loadRecords(record.getHistory().getRange());
                panel.down('FilesEditorGridPanel').getStore().loadRecords(record.getFiles().getRange());
                panel.scrollBy(0, panel.getHeight()*10);
                basicForm.findField('message').focus(false, 200);
            }
        });
    },
    
    onShowEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create('MessageEditorWindow');
        win.setMasterGrid(grid);
        win.show();   
    },
    
    onCreateBranchMessage : function(win) {
        var basicForm = win.down('form').getForm(),
            filesGrid = win.down('FilesEditorGridPanel'),
            dataModel = Ext.create('App.model.messages.MessageModel');
        
        if (basicForm.isValid()) {
            dataModel.set(basicForm.getFieldValues());
            dataModel.setAssociationData('files', filesGrid.getStore().getModifiedData());
            
            win.el.mask('Сохранение ...');
            dataModel.save({
                success : function(response){
                    win.hide();
                    win.getMasterGrid().onRefresh()
                },
                callback : function() {
                    win.el.unmask();
                }
            });
        }
    },
    
    onUpdateMessage : function(panel) {
        var basicForm = panel.down('#newMessageForm').getForm(),
            filesGrid = panel.down('FilesEditorGridPanel'),
            me = this;
        
        if (basicForm.isValid()) {
            basicForm.updateRecord();
            var record = basicForm.getRecord();
            record.setAssociationData('files', filesGrid.getStore().getModifiedData());
            
            panel.setInactive(true);
            record.save({
                success : function(response) {
                    var grid = me.getGridPanel();
                    grid.getSelectionModel().deselectAll();
                    grid.getStore().load();                   
                }   
            });
        }
    },
    
    onFilters : function(grid, filter) {
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
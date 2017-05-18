
Ext.define('App.controller.settings.RegionsController', {
    extend : 'Ext.app.Controller',
    
    models : [
        'settings.regions.RegionModel',
        'settings.regions.CityModel',
        'settings.regions.TimeZoneModel'
    ],
    
    stores : [
        'settings.regions.RegionsStore',
        'settings.regions.CitiesStore',
        'settings.regions.TimeZonesStore'
    ],
    
    views : [
        'settings.regions.cities.EditorWindow',
        'settings.regions.cities.GridPanel',
        'settings.regions.EditorWindow',
        'settings.regions.GridPanel',
        'settings.regions.ContentPanel',
        'settings.regions.LocationsFilterPanel'
    ],
    
    init : function() {
        
        this.control({
            'DirectoryRegionsContentPanel' : {
                initpanel : this.onInitContentPanel,
                panelready : this.onInitContentPanel
            },
            'DirectoryRegionsGridPanel' : {
                createbtnclick : this.onShowRegionEditorWindow,
                selectionchange : this.onSelectionChangeRegions,
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                editbtnclick : this.onEditRegion,
                itemdblclick : function(view){
                    this.onEditRegion(view.ownerCt);    
                }
                //edit : this.onUpdateRegionRecord
            },
            'DirectoryRegionEditorWindow' : {
                savebtnclick : this.onSubmitRegionForm
            },
            'DirectoryCityEditorWindow' : {
                savebtnclick : this.onSubmitCityForm
            },
            'DirectoryRegionCitiesGridPanel' : {
                createbtnclick : this.onCreateCityBtnClick,
                deletebtnclick : Ext.bind(App.ux.controller.BaseMethods.onDelete, this),
                edit : this.onUpdateCityRecord
            }
        });
        
    },
    
    onInitContentPanel : function(panel) {
        if (! panel.down('DirectoryRegionsGridPanel').getStore().getCount()) {
            panel.down('DirectoryRegionsGridPanel').getStore().load();     
        }
        if (! panel.down('DirectoryRegionCitiesGridPanel').getStore().getCount()) {
            panel.down('DirectoryRegionCitiesGridPanel').getStore().load();     
        }   
    },
    
    onShowRegionEditorWindow : function(grid) {
        var win = App.ux.window.Manager.create('DirectoryRegionEditorWindow');
        win.setMasterGrid(grid);
        win.show();
         win.setTitle('Добавить регион');
        return win;
    },
    
    onEditRegion : function(grid){
        var win = this.onShowRegionEditorWindow(grid);
        
        if (grid.getSelectionModel().getCount() == 0) {
            return;
        }
        
        var record = grid.getSelectionModel().getSelection()[0];
        win.setTitle('Редактирование региона');
        win.down('form').getForm().loadRecord(record);
        
        var imagesGrid = win.down('#imagesPanel');
        imagesGrid.getStore().removeAll();
        if (record.get('cover_image')) {
            imagesGrid.getStore().add({image : record.get('cover_image')});
        }
    },
    
    onSelectionChangeRegions : function(selModel, records) {
        var regionsGrid = selModel.view.ownerCt,
            citiesGrid = regionsGrid.nextSibling('DirectoryRegionCitiesGridPanel');
        
        citiesGrid.getStore().addFilter("region_id", (records.length) ? {"$in" : App.ux.util.Format.convertRecordsToIdsArray(records)} : null);
        citiesGrid.down('#btnCreate').setDisabled(records.length == 0);
    },
    
    onUpdateRegionRecord : function(editor, e) {
        if(e.record.hasChanges()) {
            e.record.save({
                success : function(record, operation) {
                    e.grid.getView().refresh();
                }
            });   
        }
    },
    
    onUpdateCityRecord : function(editor, e) {
        if(e.record.hasChanges()) {
            e.record.save({
                success : function(record, operation) {
                    e.grid.getView().refresh();
                }
            });   
        }
    },
    
    onSubmitRegionForm : function(win, mode) {
        var form = win.down('form'),
            imagesGrid = form.down('#imagesPanel'),
            model = Ext.create('App.model.settings.regions.RegionModel');
        
        if (form.getForm().isValid()) {
            
            var imageRecord = imagesGrid.getStore().getAt(0);
            if (imageRecord) {
                model.set('cover_image', imageRecord.get('image'));
            }

            form.el.mask('Сохранение ...');
            
            model.set(form.getForm().getValues());
            model.save({
                success : function() {
                    if (Ext.isEmpty(mode) == false && mode == 'close') {
                        win.hide();
                    } else {
                        win.setTitle('Добавить регион');
                        form.getForm().reset();
                        form.getForm().findField('name').focus(false, 200);
                    }
                    win.getMasterGrid().onRefresh();
                },
                callback : function() {
                    form.el.unmask();   
                }
            });
        } 
    },
    
    onSubmitCityForm : function(win, mode) {
        var form = win.down('form'),
            model = Ext.create('App.model.settings.regions.CityModel');
        
        if (form.getForm().isValid()) {
            form.el.mask('Сохранение ...');
            
            model.set(form.getForm().getFieldValues());
            model.save({
                success : function() {
                    if (Ext.isEmpty(mode) == false && mode == 'close') {
                        win.hide();
                    } else {
                        var nameField = form.getForm().findField('name'),
                            codeField = form.getForm().findField('code');
                        codeField.reset();
                        nameField.reset();
                        codeField.focus(false, 200);
                    }
                    win.getMasterGrid().getStore().load();
                },
                callback : function() {
                    form.el.unmask();   
                }
            });
        } 
    },
    
    onCreateCityBtnClick : function(grid) {
        var win = App.ux.window.Manager.create('DirectoryCityEditorWindow');
        win.setMasterGrid(grid);
        win.show();
        
        var basicForm = win.down('form').getForm(),
            regionsGrid = grid.previousSibling('DirectoryRegionsGridPanel');
        
        if (regionsGrid.getSelectionModel().hasSelection()) {
            basicForm.findField('region_id').setValue(regionsGrid.getSelectionModel().getSelection()[0].get('id'));
            if (! basicForm.findField('region_id').getStore().getCount()) {
                basicForm.findField('region_id').getStore().load();    
            }
        }
    }
    
});
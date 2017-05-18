// Set paths
Ext.Loader.setConfig({
    enabled:true,
    disableCaching: false,
    paths : {
        'App.ux' : 'app/ux',
        'App.overrides' : 'overrides'
    }
});

Ext.define('App.Application', {
    extend: 'Ext.app.Application',
    name: 'App',
    appFolder : 'app',
    
    models : [
        'IdentityModel'
    ],

    controllers: [
        'settings.RolesController',
        'settings.AreaCodesController',
        'settings.RegionsController',
        'settings.UsersController',
        'SettingsController', 
        
        //Главная
        'MainController',
        'main.NewsController',
        'main.SlidersController',
        'main.HelpGroupsController',
        'main.HelpArticlesController',
        
        //Склад
        'operations.ExcelImportController',
        'operations.WarehousesController',
        'operations.MaterialsController',
        'operations.CodesController',   
        'operations.StorekeepersController',
        'operations.TransitController',
        'operations.ReturnController',
        'operations.IssueController',
        'operations.CancelController',
        'OperationsController',
        
        'FilesController',
        'MessagesController',
        
        'catalog.GroupsController',
        'catalog.MaterialsController',
        'CatalogController',
        
        // OOS
        'plan.SmsLogController',
        'plan.ReportsController',
        'plan.ShopsController',
        'plan.PlanogramsController',
        'plan.EquipmentsController',
        'plan.GoodsController',
        'plan.ScriptsController',
        'PlanController',
        
        //Заявки
        'bids.TasksAssociationController',
        'bids.StatusesAssociationController',
        'bids.SalesChannelsAssociationController',
        'bids.AreaCodesController',
        'bids.RolesController',
        'bids.TasksController',
        'bids.TasksTypesController',
        'bids.TrusteesController',
        'bids.ShopsController',
        'bids.SalesChannelsController',
        'bids.StatusesController',
        'bids.RoutingController',
        
        'bids.BidTasksController',
        'bids.PerformanceReportController',
        'BidsController',
        
        //Карты
        'maps.TransportsDirectoryController',
        'maps.TransportsController',
        'MapsController',
        
        'WorkspaceController',
        'AuthController'
    ],
    
    requires : [
        'Ext.chart.*',
        'Ext.util.Cookies',
        'Ext.data.SequentialIdGenerator',
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.plugin.RowEditing',
        'Ext.ux.BoxReorderer',
        
        
        'App.overrides.selection.Model',
        'App.overrides.selection.RowModel',
        'App.overrides.data.Model',
        'App.overrides.data.validations',
        'App.overrides.data.proxy.Ajax',
        'App.overrides.data.proxy.Rest',
        'App.overrides.data.writer.Json',
        'App.overrides.data.reader.Json',
        'App.overrides.data.Store',
        'App.overrides.data.TreeStore',
        'App.overrides.form.Basic',
        'App.ux.form.field.ComboForceReload',
        'App.overrides.form.field.ComboBox',
        'App.overrides.form.field.Trigger',
        'App.overrides.form.field.Base',
        'App.overrides.grid.RowEditor',
        'App.overrides.grid.plugin.CellEditing',
        'App.overrides.grid.Panel',
        'App.overrides.toolbar.Paging',
        'App.overrides.view.DragZone',
        'App.overrides.grid.plugin.DragDrop',
        
        'App.ux.image.Viewer',
        
        'App.ux.controller.BaseMethods',
        'App.ux.BodyPreloader',
        'App.ux.container.Card',
        'App.ux.window.Notification',
        'App.ux.window.Manager',
        'App.ux.window.MessageBox',
        'App.ux.form.plugins.InputTextMask',
        'App.ux.form.plugins.PreserveScrollPosition',
        'App.ux.form.field.Combo',
        'App.ux.form.field.GroupingCombo',
        'App.ux.form.field.TinyMCETextArea',
        'App.overrides.form.FieldContainer',
        'App.ux.form.field.TinyMCETextArea',
        'App.ux.Util',
        'App.ux.util.WorkspaceHistory',
        'App.ux.util.Response',
        'App.ux.util.Form',
        'App.ux.util.Format',
        'App.ux.util.DateDiff',
        'App.ux.grid.plugin.RowDragZone',
        'App.ux.grid.plugin.CellDropZone',
        'App.ux.grid.plugin.HeaderFilters',
        'App.ux.tree.FilterPanel',
        'App.ux.picker.Picker',
        'App.ux.picker.Tree',
        'App.ux.picker.List',
        'App.ux.picker.TreeGrid',
        'App.ux.tab.Reorderer',
        'App.ux.tab.CloseMenu',
        'App.ux.tab.Panel',
        'App.ux.Identity',
        'App.ux.Properties'
    ],
    
    launch : function() {
        this.loadIdentity();   
    },
    
    loadIdentity : function(){
        var me = this;
        
        App.model.IdentityModel.load(null, {
            success : function(record, operation) {
                App.ux.BodyPreloader.hide();
                me.initWorkspace(record);
            },
            failure : function(rec, operation) {
                App.ux.BodyPreloader.hide();
                me.initAuth();    
            } 
        });   
    },
    
    initWorkspace : function(identityRecord) {
        
        App.Identity.setRecord(identityRecord);
        
        Ext.Ajax.on('requestcomplete', App.ux.util.Response.validateStatus);
        
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
           expires: new Date(new Date().getTime()+(1000*60*60*24*360))
        }));

        Ext.defer(function(){
            Ext.create('Ext.container.Viewport', {
                layout : 'fit',
                items : [
                    {
                        xtype : 'WorkspaceContentPanel'
                    }
                ]
            });   
        }, 600);
    },
    
    initAuth : function() {                
        Ext.create('Ext.container.Viewport', {
            layout : 'fit',
            items : [
                {
                    xtype : 'AuthContentPanel'
                }
            ]
        });    
    }
});

Ext.define('App.controller.operations.StorekeepersController', {
    extend : 'Ext.app.Controller',
    
    models: [
        "operations.directories.StorekeeperModel"
    ],
    
    stores: [
        "operations.directories.StorekeepersStore"
    ],
    
    views: [
        "operations.directories.storekeepers.GridPanel"
    ],
    
    init: function () {
        this.control({
            'DirectoryStorekeepersGridPanel' : {
                setfilter: this.onSetFilter
            }
        });
    },
    
    onSetFilter: function (grid, filters) {
        if (Ext.isEmpty(filters) == false) {
            if (Ext.isArray(filters)) {
                Ext.Array.forEach(filters, function (filter) {
                    grid.getStore().setFilter(filter.property, filter.value);
                });
                grid.getStore().loadPage(1);
            } else {
                if (Ext.isObject(filters)) {
                    grid.getStore().addFilter(filters.property, filters.value);
                }
            }
        }
    }
});
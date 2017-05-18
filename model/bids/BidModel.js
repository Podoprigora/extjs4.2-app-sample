Ext.define('App.model.bids.BidModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'area_code', type : 'string'},
        {name : 'area_code_id', type : 'int'},
        {name : 'warehouse', type : 'auto', persist : false},
        {name : 'warehouse_id', type : 'int'},
        {name : 'comments', type : 'string'},
        {name : 'needtime', type : 'string'},

        {name : 'shop_code', type : 'string'},
        {name : 'shop_city', type : 'string'},
        {name : 'shop_name', type : 'string'},
        {name : 'shop_address', type : 'string'},
        {name : 'shop_geo', type : 'string'},
        {name : 'shop_legal_name', type : 'string'},
        {name : 'shop_rka', type : 'string'},
        {name : 'shop_contact', type : 'string'},
        
        {name : 'contract_code', type : 'string'},
        {name : 'contract_date', type : 'date', dateFormat : 'Y-m-d'},
        {name : 'contract_city', type : 'string'},
        {name : 'contract_company_person', type : 'string'},
        {name : 'contract_company_person_fio', type : 'string'},
        {name : 'contract_company_basis', type : 'string'},
        {name : 'contract_client_person', type : 'string'},
        {name : 'contract_client_basis', type : 'string'},
        
        {name : 'agreement_route', type : 'auto'},
        {name : 'tasks', type : 'auto'},
        {name : 'materials', type : 'auto'},
        {name : 'files', type : 'auto'},
        {name : 'access_rights', type : 'auto', persist : false},
        {name : 'completed', type : 'int', persist : false},
        
        {name : 'status_name', type : 'string', persist : false},
        {name : 'next_status_name', type : 'string', persist : false},
        {name : 'status_state', type : 'int', persist : false},
        {name : 'priority', type : 'int', persist : false},
        {name : 'status_update_by_user', type : 'string', persist : false},
        {name : 'user', type : 'string', persist : false},
        {name : 'user_id', type : 'int', persist : false},
        {name : 'created', type : 'date', dateFormat : 'Y-m-d H:i:s', persist : false, convert : function(v){
            v = Ext.Date.parse(v, 'Y-m-d H:i:s');
            return Ext.util.Format.date(v, 'd.m.Y H:i:s');
        }},
        {name : 'status_updated', type : 'date', dateFormat : 'Y-m-d H:i:s', persist : false, convert : function(v){
            v = Ext.Date.parse(v, 'Y-m-d H:i:s');
            return Ext.util.Format.date(v, 'd.m.Y H:i:s');
        }}
    ],
    
    hasMany : [
        {
            model : 'App.model.bids.BidAgreementRouteModel',
            associationKey : 'agreement_route',
            name : 'getAgreementRoute'
        },
        {
            model : 'App.model.bids.BidTaskModel',
            associationKey : 'tasks',
            name : 'getTasks'
        },
        {
            model : 'App.model.bids.BidMaterialModel',
            associationKey : 'materials',
            name : 'getMaterials'
        },
        {
            model : 'App.model.files.FileModel',
            associationKey : 'files',
            name : 'getFiles'
        },
        {
            model : 'App.model.bids.directories.StatusAccessRightModel',
            name : 'getAccessRights',
            associationKey : 'access_rights'
        }
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('bids.read'),
            create : Settings.urls.getUrl('bids.save'),
            update : Settings.urls.getUrl('bids.save'),
            destroy : Settings.urls.getUrl('bids.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});
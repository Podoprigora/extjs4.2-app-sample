Ext.define('App.controller.operations.CancelController', {
    extend : 'Ext.app.Controller',
    
    views : [
        'operations.profile.CancelContentPanel'
    ],
    
    init : function() {
        
        this.control({
            'OperationCancelProfileContentPanel' : {
                savebtnclick: Ext.bind(this.getController("operations.IssueController").onSaveBtnClick, this),
                cancelbtnclick : Ext.bind(this.getController('OperationsController').onCancelBtnClick, this),
                deletebtnclick : Ext.bind(this.getController('OperationsController').onDeleteBtnClick, this),
                changeslogsbtnclick : Ext.bind(this.getController('OperationsController').onChangesLogsBtnClick, this) 
            }   
        });
        
    }
    
});
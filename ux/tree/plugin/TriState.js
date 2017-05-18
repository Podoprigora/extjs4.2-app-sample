
Ext.define("App.ux.tree.plugin.TriState", {
    extend : "Ext.AbstractPlugin",
    
    disabledCls: 'x-tree-checkbox-checked-disabled',
    ALL_ID: 0,
    returnLeafsOnly: true,
    tree : null,
    
    init : function(tree){
        this.tree = tree;
        tree.on('checkchange', this.onCheckChange, this);
        
        tree.getStore().on('load', function(st){
            var me = this;
            tree.getRootNode().cascadeBy(function(node){
                if (node.isLeaf()){
                    me.updateParentCheckedStatus(node);    
                }
            });
        }, this);
        
    },
            
    onCheckChange : function (node, checked) {

        var me = this,
            tree = this.tree;
            
        node.set('cls', '');
        
        if (node.isLeaf()) {
            me.updateParentCheckedStatus(node);
            tree.fireEvent('nodecheckchange', this, node, checked);
        }
        
        if (node.hasChildNodes()) {
            node.eachChild(this.setChildrenCheckedStatus);
        }

        if (node.get('id') == this.ALL_ID) {
            //debug('[root checked]');

            //unsetThirdState for all
            tree.getRootNode().cascadeBy(function () {

                me.unsetThirdState(this);
            });
        }
    },
    
    setChildrenCheckedStatus: function (current) {

        // if not root checked
        if (current.parentNode) {
            var parent = current.parentNode,
                checked = parent.get('checked');
            
            if (checked) {                
                if (current.get('checked') == false) {
                    current.set('created', true);
                } 
            } else {
                if (current.get('checked') == true) {
                    current.set('removed', true); 
                }
            }
            
            current.set('cls', '');
            current.set('checked', checked);
        }


        if (current.hasChildNodes()) {
            current.eachChild(arguments.callee);
        }
    },

    // Propagate change upwards (if all siblings are the same, update parent).
    updateParentCheckedStatus: function (current) {
        var me = this,
            tree = this.tree,
            currentChecked = current.get('checked'),
            currentId = current.get('id');

        if (current.parentNode) {

            var parent = current.parentNode;
            var checkedCount = 0;
            var checkedCountChildren = 0;
            parent.eachChild(function (n) {
                // debug( n.get('text'))
                checkedCount += (n.get('checked') ? 1 : 0);
            });

            current.eachChild(function (n) {
                // debug( n.get('text'))
                checkedCountChildren += (n.get('checked') ? 1 : 0);
            });

            // Children have same value if all of them are checked or none is checked.
            var allMySiblingsHaveSameValue = (checkedCount == parent.childNodes.length) || (checkedCount == 0);
            var allMyChildrenHaveSameValue = (checkedCountChildren == current.childNodes.length) || (checkedCountChildren == 0);


//            debug('[current] ' + current.get('text'));
//            debug('[currentChecked] ' + currentChecked);
//            debug('[parent ] ' + parent.get('text'));
//            debug('[allMySiblingsHaveSameValue] ' + allMySiblingsHaveSameValue);
//            debug('[allMyChildrenHaveSameValue] ' + allMyChildrenHaveSameValue);
//            debug('--------------');

            var setParentVoid = true;


            // check if current node has any visible state.
            if (me.isThirdState(current) || currentChecked) {
                setParentVoid = false;
            }

            // if not - clear parent`s class
            if (setParentVoid) {
                me.unsetThirdState(parent);
            }

            if (allMySiblingsHaveSameValue) {

                // All  the Siblings  are same, so apply value to the parent.
                var checkedValue = (checkedCount == parent.childNodes.length);
                parent.set('checked', checkedValue);

                me.unsetThirdState(parent);
                // modify  Root based on it`s Children Have Same Value

                if (parent == tree.getRootNode()) {
                    if (allMyChildrenHaveSameValue) {
                        me.unsetThirdState(tree.getRootNode());
                    } else {
                        me.setThirdState(tree.getRootNode());
                    }
                }


            } else {

                // Not all  the children are same, so set root node to third state.

                me.setThirdState(tree.getRootNode());

                if (checkedCount) {
                    // At least one sibling is checked, so set parent node to third state.
                    me.setThirdState(parent);

                } else {

                    parent.set('checked', false);
                }


            }
            
            me.updateParentCheckedStatus(parent);
        }
    },

    isThirdState: function (node) {
        return  node.get('cls') == this.disabledCls;

    },

    setThirdState: function (node) {
        node.set('cls', this.disabledCls);
        node.set('checked', false);
    },

    unsetThirdState: function (node) {
        node.set('cls', '');
    },

    getSelections: function (id_only) {
        var me = this.tree;

        //debug('[accessPanel getSelections]');

        try {
            var grid_selections = tree.getView().getChecked(),
                allFound = false,
                result = [];


            Ext.Array.each(grid_selections, function (rec) {

                var pushdata = false;

                //  find all checked items
                if (rec.get('id') ) {

                    if (me.returnLeafsOnly ){
                        if (rec.get('leaf') === true){
                            pushdata = true;
                        }
                    }   else{
                        pushdata = true;
                    }
                    if (pushdata){
                        result.push(id_only == true ?  rec.get('id') : {id: rec.get('id')});
                    }

                }

                //  if NODE 'ALL' checked  - no children required
                if (rec.get('id') == me.ALL_ID) {
                    allFound = true;
                }
            });


            if (allFound) {
                result = id_only ? [  me.ALL_ID ] : [ {id: me.ALL_ID} ];
            }

            //debug(result);
            return result;
        } catch (e) {

            debug('[error in accessPanel getSelections]');
            debug(e);
        }
    },

    setSelections: function (ids) {

        var me = this,
            tree = this.tree;
        //  me.stopListener = true;

        //debug('[accessPanel setSelections]');
        // debug(ids);


        if (ids[0] && ids[0]['id']){

            ids = Ext.Array.pluck(ids, 'id');
        }

        // check RootNode or do cascade checking

        if (ids.indexOf(me.ALL_ID) > -1) {
            tree.getRootNode().set('checked', true);
            tree.getRootNode().eachChild(me.setChildrenCheckedStatus);
        } else {


            tree.getRootNode().cascadeBy(function () {

                var currNode = this;

                if (currNode.get('leaf')) {
                    currNode.set('checked', ids.indexOf(currNode.get('id')) > -1);
                    me.updateParentCheckedStatus(currNode);
                }
            });
        }
    }
});
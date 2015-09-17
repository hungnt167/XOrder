Validation.add('validate-number-2','Please enter a valid number in this field.', function(v) {
    return Validation.get('IsEmpty').test(v) || (!isNaN(parseNumber(v)) && /^[0-9]+([\.|\,][0-9]+)?$/.test(v));
});
var xAdminOrder = Class.create(AdminOrder,{
    products : [],
    productConfigureSubmit : function(listType, area, fieldsPrepare, itemsFilter) {
        // prepare loading areas and build url
        area = this.prepareArea(area);
        this.loadingAreas = area;
        var url = this.loadBaseUrl + 'block/' + area + '?isAjax=true';

        // prepare additional fields
        fieldsPrepare = this.prepareParams(fieldsPrepare);
        //fieldsPrepare.reset_shipping = 1; -- Disable Reset Shipping
        fieldsPrepare.json = 1;

        // create fields
        var fields = [];
        for (var name in fieldsPrepare) {
            fields.push(new Element('input', {type: 'hidden', name: name, value: fieldsPrepare[name]}));
        }
        productConfigure.addFields(fields);

        // filter items
        if (itemsFilter) {
            productConfigure.addItemsFilter(listType, itemsFilter);
        }

        // prepare and do submit
        productConfigure.addListType(listType, {urlSubmit: url});
        productConfigure.setOnLoadIFrameCallback(listType, function(response){
            this.loadAreaResponseHandler(response);
        }.bind(this));
        productConfigure.submit(listType);
        // clean
        this.productConfigureAddFields = {};
    },
    save: function(urlAction, messages) {
        if(urlAction =="") return false;
        if(!confirm(messages)) return false;
        else xpos_need_confirm_close = false;
        $('edit_form').action = urlAction;
        $('cash-in').removeClassName('required-entry validate-number-2 validate-zero-or-greater');
        //$('balance').removeClassName('validate-zero-or-greater');
        this.submit();
    },

    applyCoupon : function(code){
        this.loadArea(['items', 'totals', 'billing_method'], true, { 'order[coupon][code]':code });
    },

    cancel: function(urlAction , messages) {
        if(confirm(messages)) {
            xpos_need_confirm_close = false;
            disableElements('save');
            disableElements('b-cancel');
            disableElements('complete');
            setLocation(urlAction);
        } else {
            return false;
        }
    },
    complete: function(urlAction, messages) {
        if(this.orderItemChanged) {
            alert('You have item changes\nPlease click "Update Items and Qty" before process checkout.');
            return false;
        }
        $('edit_form').action = urlAction;
        $('cash-in').addClassName('required-entry validate-number-2 validate-zero-or-greater');
        //$('balance').addClassName('validate-zero-or-greater');
        if($('cash-in').value < orderTotal) {
            if(!$('advice-validate-greater-than-zero-balance'))
                $('balance_hidden').insert({'bottom': '<div style="" id="advice-validate-greater-than-zero-balance" class="validation-advice">Balance must not be negative number.</div>'});
            return false;
            //alert("Balance must be not nagative number");
        } else {
            if($('advice-validate-greater-than-zero-balance')) $('advice-validate-greater-than-zero-balance').remove();
        }
        if(!confirm(messages)) return false;
        else xpos_need_confirm_close = false;
        this.submit();
    },
    selectOrder: function(grid, event){
        var element = Event.findElement(event, 'tr');
        if (element.title){
            setLocation(element.title);
        }
    }
});/**
 * Created by SMART on 9/17/2015.
 */

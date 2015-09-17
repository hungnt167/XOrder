<?php

/**
 * Created by PhpStorm.
 * User: SMART
 * Date: 9/17/2015
 * Time: 11:52 AM
 */
require_once(BP . DS . 'app' . DS . 'code' . DS . 'core' . DS . 'Mage' . DS . 'Adminhtml' . DS . 'controllers' . DS . 'Sales' . DS . 'Order' . DS . 'CreateController.php');

class SM_XOrder_Adminhtml_XOrderController extends  Mage_Adminhtml_Sales_Order_CreateController
{
    public function indexAction()
    {
        $this->loadLayout()->renderLayout();
    }

    public function searchCustomerAction()
    {
        $query = $this->getRequest()->getParam('query');
        $model = Mage::getModel('xorder/search_customer');
        $customer = $model->search($query);
        $jsonData = Mage::helper('core')->jsonEncode($customer);
        $this->getResponse()->clearHeaders()->setHeader('Content-type', 'application/json', true);
        $this->getResponse()->setBody(($jsonData));

    }
    public function searchProductAction()
    {
        $query = $this->getRequest()->getParam('query');
        $limit = 9;
        $storeId = Mage::app()->getStore()->getId();

        $model = Mage::getModel('xorder/search_product');
        $products = $model->search($query, $storeId, $limit);
        $block = $this->getLayout()->createBlock('adminhtml/template')
            ->setTemplate('sm/xorder/order/create/searchproduct/grid.phtml')
            ->assign('products', $products);

        $this->getResponse()->setBody($block->toHtml());

    }
}
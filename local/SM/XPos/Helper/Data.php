<?php

/**
 * Created by PhpStorm.
 * User: SMART
 * Date: 9/11/2015
 * Time: 4:54 PM
 */
class SM_XPos_Helper_Data extends  Mage_Core_Helper_Abstract
{
    public function getAllStore(){
        $allStore=array();
        foreach (Mage::app()->getWebsites() as $website) {
            foreach ($website->getGroups() as $group) {
                $stores = $group->getStores();
                foreach ($stores as $store) {
                    $allStore[]=$store->getData();
                }
            }
        }
        return $allStore;
    }

    public function getAllShippingMethod()
    {
        $methods = Mage::getSingleton('shipping/config')->getActiveCarriers();

        $options = array();

        foreach($methods as $_code => $_method)
        {
            if(!$_title = Mage::getStoreConfig("carriers/$_code/title"))
                $_title = $_code;
            $options[] = array('value' => $_code, 'label' => $_title . " ($_code)");
        }
        return $options;
    }
}
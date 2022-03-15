import {MaterialOrderItem} from "../Models/MaterialOrderItem";

export function MaterialOrderItemFactory(){

    this.create = function (arr){
        let arrRef = [];
        arr.forEach((item)=> {
            arrRef.push(new MaterialOrderItem(
                item.id || null,
                item.type || null,
                item.allocationType || null,
                item.jobItem || null,
                null,
                item.costAllocation || 0,
                item.qtyLines || null,
                item.lastShipmentIn || null,
            ))
        })
        return arrRef
    }
}


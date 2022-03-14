export function MaterialOrderItem(
    id,
    type,
    allocationType,
    jobItem,
    qtyFulfilled,
    costAllocation,
    qtyLines,
    lastShipmentIn,
){
    this.id = id || null;
    this.type = type || null;
    this.allocationType = allocationType || null;
    this.jobItem = jobItem;
    this.qtyFulfilled = qtyFulfilled || 0;
    this.costAllocation = costAllocation || 0;
    this.qtyLines = qtyLines || null;
    this.lastShipmentIn = lastShipmentIn || null;
}

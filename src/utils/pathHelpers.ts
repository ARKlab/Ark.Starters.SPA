
export function buildCustomerProductPath(urlParam: string, productId: string, supplierId?: string | null): string {
    let path = `/${urlParam}/p/${productId}`;

    if(supplierId)
        path = `${path}?sid=${supplierId}`
    
    return path;
  }

  export function buildSupplierProductPath(urlParam: string, productId: string): string {
    let path = `${urlParam}/${productId}`;
    
    return path;
  }
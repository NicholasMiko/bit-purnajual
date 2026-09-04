const endPoint = {
  repair: {
    warranty_registration: {
      list: '/repair/warrantyregistration/v1/get-list',
      view: '/repair/warrantyregistration/v1/get',
      create: '/repair/warrantyregistration/v1/create',
      checkSerial: '/repair/warrantyregistration/v1/check-serial',
      listProduct: '/repair/warrantyregistration/v1/_get-list-product',
    },
    service_ticket: {
      list: '/repair/serviceticket/v1/get-list',
      view: '/repair/serviceticket/v1/get',
      create: '/repair/serviceticket/v1/create',
      update: '/repair/serviceticket/v1/update',
      delete: '/repair/serviceticket/v1/delete',
    },
  },
}

export default endPoint
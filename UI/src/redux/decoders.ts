
import * as io from "io-ts";

//***********************************************************************************************************/
//** COMMON *************************************************************************************************/
//***********************************************************************************************************/

export const warehouseDecoder = io.type({
  companyId: io.union([io.number, io.null]),
  name: io.union([io.string, io.null]),
  description: io.union([io.string, io.null]),
  telephoneNumber: io.union([io.string, io.null]),
  referencePerson: io.union([io.string, io.null]),
  default: io.union([io.boolean, io.null]),
  id: io.number,
  _ETag: io.union([io.string, io.null]),
  revision: io.number,
});

export type Warehouse = io.TypeOf<typeof warehouseDecoder>;

//***********************************************************************************************************/
//******* HOMEPAGE ******************************************************************************************/
//***********************************************************************************************************/

export const homepageItemDecoder = io.intersection([
  io.type({
    size: io.string,
    link: io.string,
    internalLink: io.boolean
  }),
  io.partial({
    image: io.union([io.string, io.null]),
    text: io.union([io.string, io.null]),
  })
])

export type HomepageItem = io.TypeOf<typeof homepageItemDecoder>;
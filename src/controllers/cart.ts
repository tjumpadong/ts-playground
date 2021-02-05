import { NextFunction, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, httpPut, next, requestBody, response } from "inversify-express-utils";
import { SERVICE_IDENTIFIER } from "../constants/identifiers";
import CartService from "../services/cart";

@controller('/carts')
class CartController extends BaseHttpController {
  constructor(
    @inject(SERVICE_IDENTIFIER.CART) protected cartService: CartService
  ) {
    super()
  }

  @httpGet('/')
  async getById(
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      const userId = this.httpContext.user.details._id as string
      const cartItemSummary = await this.cartService.getItemSummary(userId)
      return res.json(cartItemSummary)
    } catch (err) {
      next(err)
    }
  }

  @httpPut('/')
  async addProduct(
    @requestBody() newProduct: { productId: string, quantity: number },
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      const userId = this.httpContext.user.details._id as string
      const { productId, quantity } = newProduct
      const cartItemSummary = await this.cartService.update(userId, productId, quantity)
      return res.json(cartItemSummary)
    } catch (err) {
      next(err)
    }
  }
}

export default CartController
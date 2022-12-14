import cart from '../models/cart.model';
import Book from '../models/book.model';
import { client } from '../config/redis';

//------------------>
//creating cart
export const addCart = async (_id, body) => {
const bookCheck = await Book.findById({_id:_id})
//await client.del('getAllData');
console.log(bookCheck);
if (bookCheck) {
    let book = {
      'bookName': bookCheck.bookName,
      'description': bookCheck.description,
      'author': bookCheck.author,
      'price': bookCheck.price,
      'bookImage': bookCheck.bookImage,
      'productId': bookCheck._id,
      
    
    }
    const cartCheck = await cart.findOne({userId:body.userId})
    if(cartCheck){
        cartCheck.books.push(book)
        const addBooks = await cart.findOneAndUpdate({userId: body.userId}, { books: cartCheck.books}, { new: true });
        return addBooks;
    }else{
        const createCart = await cart.create({userId: body.userId, books:[book] })
        return createCart;
    }
}
else {
    throw new Error("Book does not exists");
}
}
//----------->
//get all books from cart
export const cartBooks = async (_id,body) => {
    const getBooks = await cart.findOne({ userId:body.userId  })
    await client.set('getAllData',JSON.stringify(data));
    if (getBooks) {
        return getBooks;
    } 
  }
///-------------------------------->
//update book quantity
export const updateQty = async (_id, body) => {
const cartCheck = await cart.findOne({userId:body.userId})
if(cartCheck){
    const bookCheck = await Book.findById({_id:_id})
    if (bookCheck) {
        cartCheck.books.forEach(data => {
        if (data.productId == _id) {
            data.quantity = data.quantity + 1;
            console.log("quantity added");
            }
        });
        const updatebook = cart.findOneAndUpdate({userId: body.userId}, { books: cartCheck.books}, { new: true });
         return updatebook;
    }
    else{
        throw new Error("Book does not exist")
    }
}
else {
        throw new Error("cart does not exists");
    }

}
//--------->
//Delete book from cart
export const deleteBook = async (_id, body) => {
    const cartCheck = await cart.findOne({ userId: body.userId })
    await client.del('getAllData');
    if (cartCheck) {
        cartCheck.books.forEach(data => {
         //console.log("cart books------>",data);
          //console.log ("is it array???????",Array.isArray(data));
        if (data.productId == _id) {
          let indexval = cartCheck.books.indexOf(data)
          //console.log("indexvalue is---------->",indexval);
          cartCheck.books.splice(indexval, 1)
        }
      });
      const updatebook = cart.findOneAndUpdate({userId: body.userId}, { books: cartCheck.books}, { new: true });
          return updatebook;
    }
    else{
        throw new Error("Cart does not exist")
    }
    
}

//---------->
export const purchased = async(_id) =>{
    const data = await cart.findByIdAndUpdate(
      {
       _id:_id
      },
      {
        isPurchased: true
      },
      {
        new: true
      }
    );
    return data;
   
  }
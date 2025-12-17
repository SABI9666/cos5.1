import
 
React
,
 
{
 useState
,
 useEffect 
}
 
from
 
'react'
;

import
 
{
 
BrowserRouter
 
as
 
Router
,
 
Routes
,
 
Route
 
}
 
from
 
'react-router-dom'
;

import
 
HomePage
 
from
 
'./pages/homepage.jsx'
;

import
 
ProductsPage
 
from
 
'./pages/productspage.jsx'
;

import
 
ProductDetail
 
from
 
'./pages/productdetail.jsx'
;

import
 
AdminPanel
 
from
 
'./pages/adminpanel.jsx'
;

import
 
Cart
 
from
 
'./components/cart.jsx'
;

import
 
'./app.css'
;

function
 
App
(
)
 
{

  
// Initialize cart from localStorage

  
const
 
[
cartItems
,
 setCartItems
]
 
=
 
useState
(
(
)
 
=>
 
{

    
const
 savedCart 
=
 
localStorage
.
getItem
(
'luxeled-cart'
)
;

    
return
 savedCart 
?
 
JSON
.
parse
(
savedCart
)
 
:
 
[
]
;

  
}
)
;

  
const
 
[
isCartOpen
,
 setIsCartOpen
]
 
=
 
useState
(
false
)
;

  
const
 
[
cartNotification
,
 setCartNotification
]
 
=
 
useState
(
''
)
;

  
// Save cart to localStorage whenever it changes

  
useEffect
(
(
)
 
=>
 
{

    
localStorage
.
setItem
(
'luxeled-cart'
,
 
JSON
.
stringify
(
cartItems
)
)
;

  
}
,
 
[
cartItems
]
)
;

  
// Prevent body scroll when cart is open

  
useEffect
(
(
)
 
=>
 
{

    
if
 
(
isCartOpen
)
 
{

      
document
.
body
.
style
.
overflow
 
=
 
'hidden'
;

    
}
 
else
 
{

      
document
.
body
.
style
.
overflow
 
=
 
'unset'
;

    
}

    
return
 
(
)
 
=>
 
{

      
document
.
body
.
style
.
overflow
 
=
 
'unset'
;

    
}
;

  
}
,
 
[
isCartOpen
]
)
;

  
const
 
addToCart
 
=
 
(
product
)
 
=>
 
{

    
// Extract only the necessary properties for cart

    
const
 cartProduct 
=
 
{

      
id
:
 product
.
id
,

      
name
:
 product
.
name
,

      
price
:
 product
.
price
,

      
imageUrl
:
 product
.
imageUrl
 
||
 
'https://via.placeholder.com/100'
,

      
category
:
 product
.
category
,

    
}
;

    
setCartItems
(
prevItems
 
=>
 
{

      
const
 existingItem 
=
 prevItems
.
find
(
item
 
=>
 item
.
id
 
===
 cartProduct
.
id
)
;

      
if
 
(
existingItem
)
 
{

        
return
 prevItems
.
map
(
item
 
=>

          item
.
id
 
===
 cartProduct
.
id

            
?
 
{
 
...
item
,
 
quantity
:
 item
.
quantity
 
+
 
1
 
}

            
:
 item
        
)
;

      
}
 
else
 
{

        
return
 
[
...
prevItems
,
 
{
 
...
cartProduct
,
 
quantity
:
 
1
 
}
]
;

      
}

    
}
)
;

    
// Show notification

    
setCartNotification
(
`
${
product
.
name
}
 added to cart!
`
)
;

    
setTimeout
(
(
)
 
=>
 
setCartNotification
(
''
)
,
 
2000
)
;

    
// Open cart panel

    
setIsCartOpen
(
true
)
;

  
}
;

  
const
 
removeFromCart
 
=
 
(
productId
)
 
=>
 
{

    
setCartItems
(
prevItems
 
=>
 prevItems
.
filter
(
item
 
=>
 item
.
id
 
!==
 productId
)
)
;

  
}
;

  
const
 
updateQuantity
 
=
 
(
productId
,
 quantity
)
 
=>
 
{

    
if
 
(
quantity 
===
 
0
)
 
{

      
removeFromCart
(
productId
)
;

    
}
 
else
 
{

      
setCartItems
(
prevItems
 
=>

        prevItems
.
map
(
item
 
=>

          item
.
id
 
===
 productId 
?
 
{
 
...
item
,
 quantity 
}
 
:
 item
        
)

      
)
;

    
}

  
}
;

  
const
 
clearCart
 
=
 
(
)
 
=>
 
{

    
setCartItems
(
[
]
)
;

  
}
;

  
const
 cartCount 
=
 cartItems
.
reduce
(
(
total
,
 item
)
 
=>
 total 
+
 item
.
quantity
,
 
0
)
;

  
return
 
(

    
<
Router
>

      
<
div
 
className
=
"
App
"
>

        
{
/* Cart Notification */
}

        
{
cartNotification 
&&
 
(

          
<
div
 
className
=
"
cart-notification
"
>

            
<
svg
 
width
=
"
20
"
 
height
=
"
20
"
 
viewBox
=
"
0 0 24 24
"
 
fill
=
"
none
"
 
stroke
=
"
currentColor
"
 
strokeWidth
=
"
2
"
>

              
<
path
 
d
=
"
M20 6L9 17l-5-5
"
 
strokeLinecap
=
"
round
"
 
strokeLinejoin
=
"
round
"
/>

            
</
svg
>

            
{
cartNotification
}

          
</
div
>

        
)
}

        
<
Cart

          
items
=
{
cartItems
}

          
isOpen
=
{
isCartOpen
}

          
onClose
=
{
(
)
 
=>
 
setIsCartOpen
(
false
)
}

          
updateQuantity
=
{
updateQuantity
}

          
removeFromCart
=
{
removeFromCart
}

          
clearCart
=
{
clearCart
}

        
/>

        
<
Routes
>

          
<
Route
 
            
path
=
"
/
"
 
            
element
=
{

              
<
HomePage
 
                
onCartClick
=
{
(
)
 
=>
 
setIsCartOpen
(
true
)
}
 
                
cartCount
=
{
cartCount
}

                
addToCart
=
{
addToCart
}

              
/>

            
}
 
          
/>

          
<
Route
 
            
path
=
"
/products
"
 
            
element
=
{

              
<
ProductsPage
 
                
addToCart
=
{
addToCart
}
 
                
onCartClick
=
{
(
)
 
=>
 
setIsCartOpen
(
true
)
}
 
                
cartCount
=
{
cartCount
}
 
              
/>

            
}
 
          
/>

          
<
Route
 
            
path
=
"
/product/:id
"
 
            
element
=
{

              
<
ProductDetail
 
                
addToCart
=
{
addToCart
}
 
                
onCartClick
=
{
(
)
 
=>
 
setIsCartOpen
(
true
)
}
 
                
cartCount
=
{
cartCount
}
 
              
/>

            
}
 
          
/>

          
<
Route
 
path
=
"
/admin
"
 
element
=
{
<
AdminPanel
 
/>
}
 
/>

        
</
Routes
>

      
</
div
>

    
</
Router
>

  
)
;

}

export
 
default
 
App
;

